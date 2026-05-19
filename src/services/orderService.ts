import { collection, doc, setDoc, getDoc, getDocs, query, where, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase.ts';

export interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'out_for_delivery' | 'delivered';
  paymentMethod: string;
  address: string;
  lat: number;
  lng: number;
  createdAt?: any;
  updatedAt?: any;
}

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>) {
    if (!auth.currentUser) throw new Error('User must be logged in');
    
    const orderId = `AQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderRef = doc(db, 'orders', orderId);
    
    console.log('Initiating Firestore Order Write:', orderId);
    
    const newOrder = {
      ...orderData,
      id: orderId,
      userId: auth.currentUser.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(orderRef, newOrder);
      console.log('Main Order Document Written Successfully');
      
      // Add items as subcollection for scalability
      const itemsCollection = collection(db, 'orders', orderId, 'items');
      for (const item of orderData.items) {
        // Clean item object to ensure it's a plain object
        const cleanedItem = JSON.parse(JSON.stringify(item));
        await setDoc(doc(itemsCollection, item.id), cleanedItem);
      }
      
      console.log('Order Items Subcollection Written Successfully');
      return orderId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
      throw error;
    }
  },

  async getOrder(orderId: string) {
    const orderRef = doc(db, 'orders', orderId);
    try {
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        return docSnap.data() as Order;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `orders/${orderId}`);
      throw error;
    }
  },

  async getOrdersByUser() {
    if (!auth.currentUser) return [];
    
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', auth.currentUser.uid));
    
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as Order);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      throw error;
    }
  },

  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log('Firebase connection successful');
    } catch (error: any) {
      if (error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }
};
