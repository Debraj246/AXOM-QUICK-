/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.tsx';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { Sparkles, Zap, ArrowRight, LogIn } from 'lucide-react';
import Home from './components/Home.tsx';
import Layout from './components/Layout.tsx';
import RiderMap from './components/RiderMap.tsx';
import CategoryView from './components/CategoryView.tsx';
import CartView from './components/CartView.tsx';
import CheckoutView from './components/CheckoutView.tsx';
import OrderSuccess from './components/OrderSuccess.tsx';
import TrackingView from './components/TrackingView.tsx';
import AnyoneService from './components/AnythingService.tsx';
import NotificationsView from './components/NotificationsView.tsx';
import AdminNotifications from './components/AdminNotifications.tsx';

// Placeholder Components
const Explore = () => (
  <div className="h-full overflow-y-auto p-8">
    <h2 className="text-3xl font-black font-display mb-6 uppercase tracking-tighter">Explore Barpeta</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[ 'Barpeta Satra', 'Kirtan Ghar', 'Howly Market', 'Barpeta Road' ].map(loc => (
        <div key={loc} className="glass p-6 rounded-[32px] border-white/5 relative overflow-hidden group cursor-pointer">
           <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <h3 className="font-bold text-lg mb-1">{loc}</h3>
           <p className="text-xs text-white/40 italic">Historical & Cultural Hub</p>
        </div>
      ))}
    </div>
  </div>
);

const Rewards = () => (
  <div className="h-full overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-assamese-gold to-orange-500 rounded-full flex items-center justify-center text-black mb-6 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
       <Sparkles size={40} fill="currentColor" />
    </div>
    <h2 className="text-3xl font-black font-display mb-2 uppercase tracking-tighter text-assamese-gold">Bihu Rewards</h2>
    <p className="text-white/60 max-w-xs mb-8 text-sm uppercase font-black tracking-widest">You have 1,250 Points</p>
    <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
       <div className="glass p-4 rounded-2xl border-white/10 flex justify-between items-center">
          <span className="text-xs font-bold uppercase">₹50 OFF COUPON</span>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg">500 PTS</span>
       </div>
       <div className="glass p-4 rounded-2xl border-white/10 flex justify-between items-center">
          <span className="text-xs font-bold uppercase">FREE DELIVERY</span>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg">300 PTS</span>
       </div>
    </div>
  </div>
);

const Profile = () => {
  const { user, loginWithGoogle, logout, loading } = useFirebase();
  const navigate = useNavigate();

  if (loading) return <div className="h-full flex items-center justify-center opacity-40 uppercase font-black text-[10px] tracking-widest">Warping...</div>;

  if (!user) {
    return (
      <div className="h-full overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-6">
          <LogIn size={32} />
        </div>
        <h2 className="text-3xl font-black font-display mb-2 uppercase tracking-tighter">Your Journey Starts Here</h2>
        <p className="text-white/60 mb-8 max-w-xs text-sm">Join the fastest delivery network in Barpeta. Sync your orders across devices.</p>
        <button 
          onClick={loginWithGoogle}
          className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 flex flex-col items-center pt-20">
      <div className="relative mb-8">
         <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-assamese-gold">
           <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
             <img src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Assam"} className="w-full h-full object-cover" alt="Avatar" />
           </div>
         </div>
         <div className="absolute bottom-1 right-1 w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center">
            <Zap size={16} className="text-emerald-500" fill="currentColor" />
         </div>
      </div>
      <h2 className="text-3xl font-black font-display mb-1 uppercase tracking-tighter">{user.displayName || 'Joydeep Das'}</h2>
      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Premium Runner • Level 12</p>
      
      <div className="w-full max-w-sm space-y-3">
         {['Order History', 'Saved Addresses', 'Payment Methods', 'App Settings'].map(item => (
           <div key={item} className="glass p-5 rounded-2xl border-white/5 hover:border-white/20 cursor-pointer flex justify-between items-center group transition-all">
              <span className="text-xs font-bold uppercase tracking-wider">{item}</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-400" />
           </div>
         ))}
         <button 
           onClick={logout}
           className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-8 hover:bg-red-500/20 transition-colors"
         >
           Sign Out
         </button>

         <div className="mt-12 text-center space-y-4">
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Internal Access</p>
            <button 
              onClick={() => navigate('/admin/notifications')}
              className="block w-full text-red-500/50 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              Broadcast Control Center
            </button>
            <a 
              href="https://console.firebase.google.com/project/gen-lang-client-0892953266/firestore/data"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-emerald-500/50 hover:text-emerald-400 text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              View Firestore Database
            </a>
         </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <NotificationProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<NotificationsView />} />
                <Route path="/tracking/:orderId" element={<TrackingView />} />
                <Route path="/tracking" element={<TrackingView />} />
                <Route path="/category/:id" element={<CategoryView />} />
                <Route path="/cart" element={<CartView />} />
                <Route path="/anything-service" element={<AnyoneService />} />
                <Route path="/checkout" element={<CheckoutView />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              </Routes>
            </Layout>
          </CartProvider>
        </NotificationProvider>
      </FirebaseProvider>
    </BrowserRouter>
  );
}
