import { 
  getMessaging, 
  getToken, 
  onMessage,
  isSupported
} from 'firebase/messaging';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';

export interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  type: 'order' | 'offer' | 'alert' | 'promotion';
  link?: string;
  read: boolean;
  createdAt: any;
}

export const requestNotificationPermission = async () => {
  try {
    const supported = await isSupported();
    if (!supported) return null;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging();
      const token = await getToken(messaging, {
        vapidKey: 'BPr7C-o9_7B3mGZ-uBqVz_uX_uX_uX_uX_uX_uX_uX_uX_uX' // This should be the real VAPID key
      });
      
      if (token && auth.currentUser) {
        // Store token in Firestore for this user
        const tokenRef = collection(db, `users/${auth.currentUser.uid}/tokens`);
        const q = query(tokenRef, where('token', '==', token));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          await addDoc(tokenRef, {
            token,
            deviceType: navigator.userAgent,
            lastUsed: serverTimestamp()
          });
        } else {
          await updateDoc(snapshot.docs[0].ref, {
            lastUsed: serverTimestamp()
          });
        }
      }
      return token;
    }
  } catch (error) {
    console.error('Push notification permission error:', error);
  }
  return null;
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    collection(db, `users/${userId}/notifications`),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
    callback(notifications);
  });
};

export const markAsRead = async (userId: string, notificationId: string) => {
  const ref = doc(db, `users/${userId}/notifications`, notificationId);
  await updateDoc(ref, { read: true });
};

export const markAllAsRead = async (userId: string, notifications: Notification[]) => {
  const batch = writeBatch(db);
  notifications.forEach(n => {
    if (!n.read) {
      const ref = doc(db, `users/${userId}/notifications`, n.id);
      batch.update(ref, { read: true });
    }
  });
  await batch.commit();
};

export const deleteNotification = async (userId: string, notificationId: string) => {
  await deleteDoc(doc(db, `users/${userId}/notifications`, notificationId));
};

export const createNotification = async (userId: string, data: Partial<Notification>) => {
  await addDoc(collection(db, `users/${userId}/notifications`), {
    ...data,
    read: false,
    createdAt: serverTimestamp()
  });
};

export const setupMessagingListener = () => {
  if (typeof window === 'undefined') return;
  
  isSupported().then(supported => {
    if (supported) {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        // This will be handled by a global UI toast in the app
        if (auth.currentUser) {
           createNotification(auth.currentUser.uid, {
             title: payload.notification?.title || 'Notification',
             body: payload.notification?.body || '',
             type: (payload.data?.type as any) || 'alert',
             icon: payload.notification?.icon
           });
        }
      });
    }
  });
};
