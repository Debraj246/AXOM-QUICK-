import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Bike, 
  ArrowRight, 
  Trophy, 
  Sparkles,
  Navigation,
  Star,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState<'success' | 'rider' | 'redirecting'>('success');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('OrderSuccess: Component mounted with ID:', orderId);
    // Give a small delay to ensure DOM is ready for animations
    const readyTimer = setTimeout(() => setIsReady(true), 100);
    
    // Launch confetti safely
    try {
      const duration = 4 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        if (typeof confetti === 'function') {
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }
      }, 250);

      return () => {
        clearInterval(interval);
        clearTimeout(readyTimer);
      };
    } catch (e) {
      console.warn('Confetti fail', e);
    }
  }, [orderId]);

  useEffect(() => {
    // Cinematic progression of stages
    const riderTimer = setTimeout(() => {
      setStage('rider');
    }, 3500);
    
    const redirectTimer = setTimeout(() => {
      setStage('redirecting');
      setTimeout(() => navigate(`/tracking/${orderId}`), 1500);
    }, 8500);

    return () => {
      clearTimeout(riderTimer);
      clearTimeout(redirectTimer);
    };
  }, [orderId, navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#050505]">
      {/* Immersive Background Atmos */}
      <div className="absolute top-0 inset-x-0 h-64 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-assamese-gold/5 blur-[120px] rounded-full -z-10" />
      
      <AnimatePresence mode="wait">
        {isReady && stage === 'success' && (
          <motion.div
            key="success-hero"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20, filter: 'blur(20px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="flex flex-col items-center z-10"
          >
            {/* Massive Glowing Checkmark */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 12, 
                stiffness: 150,
                delay: 0.2 
              }}
              className="relative mb-10"
            >
              <div className="absolute inset-0 bg-emerald-500/40 blur-[40px] rounded-full animate-pulse" />
              <div className="w-40 h-40 bg-emerald-500 rounded-[48px] flex items-center justify-center text-black shadow-[0_0_80px_rgba(16,185,129,0.6)] relative z-10">
                <CheckCircle size={80} strokeWidth={3} className="drop-shadow-2xl" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 border border-emerald-500/20 rounded-[64px]"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-5xl md:text-6xl font-black font-display uppercase tracking-tighter text-white">
                <span className="block italic text-emerald-400 text-lg tracking-[0.4em] mb-2">Nexus Confirmed</span>
                MISSION <br/>SUCCESS
              </h2>
              
              <div className="flex items-center justify-center gap-3">
                 <div className="h-px w-8 bg-white/20" />
                 <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Sector 7 • Order {orderId}</span>
                 <div className="h-px w-8 bg-white/20" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4 mt-12 w-full max-w-sm"
            >
               <div className="glass p-6 rounded-[32px] border-white/5 bg-white/[0.02]">
                  <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">XP Points</p>
                  <p className="text-2xl font-bold text-assamese-gold">+250</p>
               </div>
               <div className="glass p-6 rounded-[32px] border-white/5 bg-white/[0.02]">
                  <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">Arrival</p>
                  <p className="text-2xl font-bold">18m</p>
               </div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'rider' && (
          <motion.div
            key="rider-intel"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50, filter: 'blur(10px)' }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="glass p-10 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] backdrop-blur-3xl shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden">
               {/* Cyber Pattern */}
               <div className="absolute inset-0 opacity-5 pointer-events-none" 
                    style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)`, backgroundSize: '24px 24px' }} 
               />
               
               <div className="flex flex-col items-center">
                  <div className="relative mb-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-emerald-500 to-assamese-gold p-1 shadow-2xl"
                    >
                      <div className="w-full h-full rounded-[38px] bg-black flex items-center justify-center overflow-hidden">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" className="w-28 h-28 object-cover" alt="Rider" />
                      </div>
                    </motion.div>
                    <motion.div 
                      animate={{ 
                        boxShadow: ["0 0 20px #10b981", "0 0 40px #10b981", "0 0 20px #10b981"],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center text-black border-4 border-black"
                    >
                      <Bike size={28} />
                    </motion.div>
                  </div>
                  
                  <div className="text-center mb-10">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.5em] mb-3">Runner Assigned</p>
                    <h4 className="text-4xl font-bold font-display mb-2">Rohan Bezbaruah</h4>
                    <div className="flex items-center justify-center gap-4">
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-assamese-gold/10 rounded-full border border-assamese-gold/20">
                          <Star size={12} className="text-assamese-gold" fill="currentColor" />
                          <span className="text-xs font-black text-assamese-gold">4.9</span>
                       </div>
                       <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                       <span className="text-xs font-black opacity-40 uppercase tracking-widest text-white">Electric S1 Nexus</span>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4">
                     <div className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                           <ShieldCheck size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] font-black opacity-30 uppercase tracking-widest">Trust Score</p>
                          <p className="text-xs font-bold text-white">Elite Verified</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                           <Trophy size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] font-black opacity-30 uppercase tracking-widest">Experience</p>
                          <p className="text-xs font-bold text-white">1.2k Runs</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {stage === 'redirecting' && (
          <motion.div
            key="portal-loader"
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center z-10"
          >
            <div className="relative">
              <div className="w-24 h-24 border-2 border-emerald-500/10 border-t-emerald-400 rounded-full animate-spin" />
              <div className="absolute inset-2 border border-emerald-400/20 rounded-full animate-spin-reverse" />
              <Zap size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 animate-pulse" />
            </div>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.6em] text-emerald-400 animate-pulse">Syncing Nexus Feed...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-16 flex flex-col items-center gap-6 z-20">
         <motion.button 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1 }}
           onClick={() => navigate(`/tracking/${orderId}`)}
           className="px-10 py-5 bg-emerald-500 text-black rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-95 transition-all"
         >
           <Navigation size={20} fill="currentColor" />
           Track Nexus Live
         </motion.button>
         
         <motion.button
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.4 }}
           transition={{ delay: 1.5 }}
           onClick={() => navigate('/')}
           className="text-[10px] font-black uppercase tracking-[0.4em] hover:opacity-100 transition-opacity"
         >
           Return to Hub
         </motion.button>
      </div>

      <div className="absolute bottom-8 text-[8px] font-bold opacity-10 uppercase tracking-[0.8em] w-full text-center">
        AXOMQUICK PROTOCOL • POWERED BY BIHU ENERGY
      </div>
    </div>
  );
}
