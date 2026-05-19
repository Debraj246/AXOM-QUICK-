import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, ShoppingBag, Star, Clock, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { PRODUCTS, CATEGORIES } from '../constants/products.ts';

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useCart();
  
  const categoryInfo = CATEGORIES.find(c => c.id === id);
  const items = PRODUCTS.filter(p => p.category === id);

  const getCartQty = (itemId: string) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold font-display">{categoryInfo?.name || 'Items'}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => {
          const qty = getCartQty(item.id);
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-4 rounded-[24px] border-white/10 group relative overflow-hidden"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4 ">
                <img src={item.img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
                  <Star size={10} className="text-emerald-400" fill="currentColor" />
                  {item.rating}
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-xs text-white/40">{item.weight}</p>
                </div>
                <p className="text-emerald-400 font-bold font-display">₹{item.price}</p>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-black tracking-widest whitespace-nowrap">
                   <Clock size={12} /> {item.eta} MINS
                </div>
                
                {qty > 0 ? (
                  <div className="flex-1 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-emerald-500/20 rounded-lg transition-colors">
                      <Minus size={14} className="text-emerald-400" />
                    </button>
                    <span className="font-bold text-emerald-400">{qty}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-emerald-500/20 rounded-lg transition-colors">
                      <Plus size={14} className="text-emerald-400" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                  >
                    <Zap size={14} fill="currentColor" />
                    Add to Cart
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-20 opacity-40">
           <ShoppingBag size={48} className="mx-auto mb-4" />
           <p>No items found in this section yet.</p>
        </div>
      )}
    </div>
  );
}
