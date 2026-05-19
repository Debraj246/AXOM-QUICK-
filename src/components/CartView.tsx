import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { Trash2, ShoppingBag, ChevronLeft, Zap, CreditCard, Plus, Minus } from 'lucide-react';

export default function CartView() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold font-display">My Cart</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{cart.length} items collected</p>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-4 rounded-[28px] border-white/10 flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                  <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-emerald-400 font-bold text-sm mt-1">₹{item.price * item.quantity}</p>
                  
                  <div className="flex items-center gap-3 mt-2 bg-white/5 w-fit rounded-lg px-2 py-1 border border-white/10">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Minus size={12} className="text-white/60" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Plus size={12} className="text-white/60" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="text-center py-20 opacity-40">
              <ShoppingBag size={48} className="mx-auto mb-4" />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-2 bg-emerald-500 text-black font-bold rounded-full text-sm"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="w-full md:w-80 shrink-0">
          <div className="glass p-6 rounded-[32px] border-emerald-500/20 sticky top-0">
            <h3 className="font-bold text-lg mb-6">Order Summary</h3>
            
            <div className="space-y-3 pb-6 border-b border-white/10">
              <div className="flex justify-between text-sm opacity-60">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm opacity-60">
                <span>Delivery Fee</span>
                <span>₹25</span>
              </div>
              <div className="flex justify-between text-sm opacity-60">
                <span>Tax (GST)</span>
                <span>₹{(total * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg py-6">
              <span>Total</span>
              <span className="text-emerald-400 font-display">₹{(total + 25 + total * 0.05).toFixed(2)}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest neon-glow flex items-center justify-center gap-2 mb-4"
            >
              <CreditCard size={18} />
              Checkout Now
            </button>
            
            <p className="text-[8px] text-center opacity-40 font-bold uppercase tracking-tighter">
              Secure futuristic payment powered by Barpeta Pay
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
