import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';

export default function AnythingService() {
  const navigate = useNavigate();
  const [request, setRequest] = useState('');

  const handleSubmit = () => {
    if (!request) return;
    // Simulate adding to cart or starting a special order
    alert('Special Request Received! Redirecting to checkout...');
    navigate('/checkout');
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold font-display">Bring Anything</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="glass p-8 rounded-[32px] border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Forget something?</h3>
          <p className="text-sm text-white/60 mb-8">We'll fetch anything from the market. Medicine, keys, groceries - just name it.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">What do you need?</label>
              <textarea 
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Ex: Please buy 2kg sugar from Barpeta Town Market and deliver to Howly..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-emerald-500/50 outline-none transition-colors resize-none"
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!request}
              className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:scale-100"
            >
              <Send size={18} fill="currentColor" />
              Send Runner
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="glass p-4 rounded-2xl text-center opacity-40">
             <p className="text-[10px] font-bold">Base Fare</p>
             <p className="text-lg font-bold">₹49</p>
          </div>
          <div className="glass p-4 rounded-2xl text-center opacity-40">
             <p className="text-[10px] font-bold">Est. Time</p>
             <p className="text-lg font-bold">30m</p>
          </div>
          <div className="glass p-4 rounded-2xl text-center opacity-40">
             <p className="text-[10px] font-bold">Area</p>
             <p className="text-lg font-bold">Barpeta</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
