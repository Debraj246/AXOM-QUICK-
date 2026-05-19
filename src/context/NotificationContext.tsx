import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Notification, 
  subscribeToNotifications, 
  setupMessagingListener,
  requestNotificationPermission,
  markAllAsRead,
  markAsRead,
  deleteNotification
} from '../services/notificationService';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { createNotification } from '../services/notificationService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  requestPermission: () => Promise<void>;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  useEffect(() => {
    let unsubscribeNotifs: () => void;
    let unsubscribeOrders: () => void;
    let unsubscribeBroadcasts: () => void;
    let lastStatuses: Record<string, string> = {};
    let lastBroadcastId: string | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setupMessagingListener();
        
        // Listen to notifications
        unsubscribeNotifs = subscribeToNotifications(user.uid, (newNotifications) => {
          const prevIds = new Set(notifications.map(n => n.id));
          const newUnread = newNotifications.find(n => !n.read && !prevIds.has(n.id));
          
          if (newUnread) {
            setActiveToast(newUnread);
            setTimeout(() => setActiveToast(null), 5000);
          }
          
          setNotifications(newNotifications);
        });

        // Listen to orders for status changes
        const ordersQ = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );

        unsubscribeOrders = onSnapshot(ordersQ, (snapshot) => {
          snapshot.docs.forEach(doc => {
            const order = doc.data();
            const prevStatus = lastStatuses[doc.id];
            
            if (prevStatus && prevStatus !== order.status) {
              // Status changed! Create a notification
              createNotification(user.uid, {
                title: `Order Status: ${order.status.toUpperCase()}`,
                body: getStatusBody(order.status),
                type: 'order',
                link: `/tracking/${doc.id}`
              });
            }
            lastStatuses[doc.id] = order.status;
          });
        });

        // Listen for global broadcasts
        const broadcastsQ = query(
          collection(db, 'broadcasts'),
          orderBy('createdAt', 'desc'),
          where('target', 'in', ['all', 'verified']) // Simplified for demo
        );

        unsubscribeBroadcasts = onSnapshot(broadcastsQ, (snapshot) => {
          if (!snapshot.empty) {
            const latest = snapshot.docs[0];
            if (lastBroadcastId && lastBroadcastId !== latest.id) {
               createNotification(user.uid, {
                 title: latest.data().title,
                 body: latest.data().body,
                 type: latest.data().type as any || 'alert'
               });
            }
            lastBroadcastId = latest.id;
          }
        });

      } else {
        setNotifications([]);
        lastStatuses = {};
      }
    });

    return () => {
      authUnsubscribe();
      if (unsubscribeNotifs) unsubscribeNotifs();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeBroadcasts) unsubscribeBroadcasts();
    };
  }, []);

  const getStatusBody = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'Your order has been confirmed by Axis Nexus.';
      case 'preparing': return 'The merchant is preparing your items.';
      case 'rider_assigned': return 'A Runner has been assigned to your sector.';
      case 'out_for_delivery': return 'Your Runner is out for delivery! Track live.';
      case 'delivered': return 'Mission Accomplished! Your order has been delivered.';
      default: return `Order status updated to ${status}.`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const requestPermission = async () => {
    await requestNotificationPermission();
  };

  const markAllRead = async () => {
    if (auth.currentUser) {
      await markAllAsRead(auth.currentUser.uid, notifications);
    }
  };

  const markRead = async (id: string) => {
    if (auth.currentUser) {
      await markAsRead(auth.currentUser.uid, id);
    }
  };

  const remove = async (id: string) => {
    if (auth.currentUser) {
      await deleteNotification(auth.currentUser.uid, id);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      requestPermission, 
      markAllRead,
      markRead,
      remove 
    }}>
      {children}
      
      {/* Global In-App Toast */}
      <AnimatePresence shadow-none>
        {activeToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 24, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4"
          >
            <div className="glass p-4 rounded-3xl border-emerald-500/20 bg-emerald-500/10 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
               
               <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                 {activeToast.type === 'order' && <CheckCircle size={20} />}
                 {activeToast.type === 'alert' && <AlertTriangle size={20} />}
                 {activeToast.type === 'offer' && <Bell size={20} />}
                 {activeToast.type === 'promotion' && <Info size={20} />}
               </div>
               
               <div className="flex-1 min-w-0">
                 <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider mb-0.5">{activeToast.title}</h4>
                 <p className="text-xs text-white/70 line-clamp-2">{activeToast.body}</p>
               </div>
               
               <button 
                 onClick={() => setActiveToast(null)}
                 className="p-1 hover:bg-white/10 rounded-full transition-colors self-start"
               >
                 <X size={16} className="opacity-40" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
