import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { useFirebase } from '../context/FirebaseContext.tsx';
import { orderService } from '../services/orderService.ts';

import LocationPicker from './LocationPicker.tsx';

const ADDRESSES = [
  { id: '1', title: 'Home', address: 'Bhowanipur Road, Ward No. 5, Barpeta, Assam 781301', icon: MapPin, latlng: [26.3267, 91.0044] as [number, number] },
  { id: '2', title: 'Work', address: 'Barpeta Medical College, Gate 2', icon: MapPin, latlng: [26.35, 91.05] as [number, number] },
];

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, desc: 'Pay when items arrive' },
  { id: 'upi', name: 'UPI Payment', icon: Zap, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Secure Futuristic Pay' },
  { id: 'wallet', name: 'Smart Wallet', icon: Wallet, desc: 'Use Bihu Points & Cash' },
];

export default function CheckoutView() {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { user, loginWithGoogle } = useFirebase();
  const [selectedAddr, setSelectedAddr] = useState('1');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLocation, setNewLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Only redirect if cart is empty and we are NOT in the middle of processing or successfully finished
    if (cart.length === 0 && !isProcessing && !isSuccess) {
      navigate('/cart');
    }
  }, [cart.length, navigate, isProcessing, isSuccess]);

  const subtotal = total - discount;
  const finalTotalNum = parseFloat((subtotal + 25 + subtotal * 0.05).toFixed(2));
  const finalTotal = finalTotalNum.toFixed(2);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'BIHU100') {
      setDiscount(100);
      alert('Promo Applied: ₹100 Discount!');
    } else {
      alert('Invalid Promo Code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      loginWithGoogle();
      return;
    }
    
    setIsProcessing(true);
    try {
      const selectedAddrData = isAddingNew 
        ? { address: 'Custom Pin Location', latlng: [newLocation?.lat || 0, newLocation?.lng || 0] } 
        : ADDRESSES.find(a => a.id === selectedAddr);

      const orderId = await orderService.createOrder({
        items: cart,
        total: finalTotalNum,
        paymentMethod: paymentMethod,
        address: selectedAddrData?.address || 'Unknown',
        lat: selectedAddrData?.latlng[0] || 0,
        lng: selectedAddrData?.latlng[1] || 0,
      });

      console.log('Order created successfully, navigating to success page:', orderId);
      setIsSuccess(true);
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold font-display">Checkout</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Delivery Address</h3>
              <button 
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="text-[10px] text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 rounded-full"
              >
                {isAddingNew ? 'Back' : '+ Add New'}
              </button>
            </div>

            {isAddingNew ? (
              <div className="space-y-4">
                <LocationPicker onLocationSelect={setNewLocation} />
                <div className="glass p-5 rounded-[24px] border-emerald-500/20">
                   <p className="text-[10px] font-black text-emerald-400 mb-2 uppercase tracking-widest">Pin Coordinates</p>
                   <p className="text-xs font-mono opacity-60">Lat: {newLocation?.lat.toFixed(6) || '--'} | Lng: {newLocation?.lng.toFixed(6) || '--'}</p>
                   <input 
                     type="text" 
                     placeholder="House No / Landmark" 
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-4 text-sm"
                   />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ADDRESSES.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddr(addr.id)}
                    className={cn(
                      "glass p-5 rounded-[24px] cursor-pointer transition-all border",
                      selectedAddr === addr.id ? "border-emerald-500 bg-emerald-500/5" : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <addr.icon size={18} className={selectedAddr === addr.id ? "text-emerald-400" : "opacity-40"} />
                      <span className="font-bold text-sm">{addr.title}</span>
                      {selectedAddr === addr.id && <CheckCircle2 size={16} className="text-emerald-400 ml-auto" />}
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{addr.address}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payment Selection */}
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "glass p-5 rounded-[24px] cursor-pointer transition-all border flex items-center gap-4",
                    paymentMethod === method.id ? "border-emerald-500 bg-emerald-500/5 neon-glow" : "border-white/10 hover:border-white/20"
                  )}
                >
                   <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", paymentMethod === method.id ? "bg-emerald-500 text-black" : "bg-white/5")}>
                     <method.icon size={24} />
                   </div>
                   <div>
                     <p className="font-bold text-sm">{method.name}</p>
                     <p className="text-[10px] text-white/40">{method.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Input */}
          <section className="glass p-6 rounded-[32px] border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Contact Info</h3>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <Phone size={18} className="text-white/40" />
              <input 
                type="tel" 
                defaultValue="+91 98765-43210" 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
              <span className="text-[10px] font-bold text-emerald-400">VERIFIED</span>
            </div>
          </section>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 shrink-0">
          <div className="glass p-8 rounded-[40px] border-emerald-500/20 sticky top-6">
            <h3 className="text-xl font-bold font-display mb-6">Final Summary</h3>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="opacity-60">{item.name} × {item.quantity}</span>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="PROMO: BIHU100" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-emerald-500 outline-none"
              />
              <button 
                onClick={applyPromo}
                className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest"
              >
                Apply
              </button>
            </div>

            <div className="space-y-3 pb-6 border-b border-white/10 mb-6">
              <div className="flex justify-between text-xs opacity-60">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Promo Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-xs opacity-60">
                <span>Fast Delivery</span>
                <span>₹25</span>
              </div>
              <div className="flex justify-between text-xs opacity-60">
                <span>Tax (GST)</span>
                <span>₹{(subtotal * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-2xl font-display mb-8">
              <span>Total</span>
              <span className="text-emerald-400">₹{finalTotal}</span>
            </div>

            <button 
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className={cn(
                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                isProcessing ? "bg-emerald-500/20 text-emerald-400 cursor-not-allowed" : "bg-emerald-500 text-black neon-glow active:scale-95"
              )}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  INITIATING TRANSAC...
                </div>
              ) : !user ? (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={16} />
                  SIGN IN TO PAY
                </div>
              ) : "AUTHENTICATE & PAY"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500/50">
               <ShieldCheck size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Barpeta Pay Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Scan Overlay for transition */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-64 h-64 flex flex-col items-center justify-center">
              <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping" />
              <div className="absolute inset-0 border border-emerald-500/40 rounded-full animate-pulse-slow scale-110" />
              <Zap size={60} className="text-emerald-400 animate-pulse" fill="currentColor" />
              <p className="mt-8 text-emerald-400 font-black tracking-[0.3em] uppercase text-xs">Securing Block...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
