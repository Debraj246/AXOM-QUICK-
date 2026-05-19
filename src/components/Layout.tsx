import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, Home as HomeIcon, LayoutGrid, Gift, UserRound, Zap, ShoppingCart, ArrowLeft, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useCart } from '../context/CartContext.tsx';
import { useNotifications } from '../context/NotificationContext.tsx';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { unreadCount } = useNotifications();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  return (
    <div className="w-full h-screen bg-black text-white font-sans flex flex-col overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
           style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 20L0 0m40 40L20 20" stroke="%2310b981" stroke-width="1" fill="none"/%3E%3C/svg%3E')` }}>
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />

      <header className="flex items-center justify-between p-6 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!isHomePage ? (
              <motion.button
                key="back-button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-white/10 active:scale-90 transition-all cursor-pointer group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </motion.button>
            ) : (
              <motion.div 
                key="logo"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                onClick={() => navigate('/')}
              >
                <span className="text-xl font-bold text-black uppercase">AQ</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-black tracking-tight text-emerald-400 font-display leading-none">AXOM QUICK</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Futuristic Barpeta</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 w-96">
          <Search size={16} className="text-emerald-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search Borali fish or Local meds..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder-white/40"
          />
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center ml-2 cursor-pointer">
            <Mic size={14} className="text-emerald-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <Bell size={20} className="text-emerald-400" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  key="notification-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <ShoppingCart size={20} className="text-emerald-400" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  key="cart-count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <div className="text-right hidden sm:block">
            <p className="text-xs opacity-50">Current Level</p>
            <p className="text-sm font-semibold text-emerald-400">Flood Safety: High</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 p-1 cursor-pointer" onClick={() => navigate('/profile')}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Assam" className="rounded-full bg-emerald-900" alt="Avatar" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="h-24 px-6 md:px-12 pb-6 z-20 shrink-0">
        <div className="h-full bg-white/5 backdrop-blur-2xl rounded-3xl md:rounded-full border border-white/10 flex items-center justify-around shadow-2xl relative">
          <button 
            onClick={() => navigate('/')}
            className={cn("flex flex-col items-center gap-1 transition-all hover:scale-110", isActive('/') ? "text-emerald-400" : "opacity-40")}
          >
            <HomeIcon size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Home</span>
          </button>
          <button 
            onClick={() => navigate('/explore')}
            className={cn("flex flex-col items-center gap-1 transition-all hover:scale-110", isActive('/explore') ? "text-emerald-400" : "opacity-40")}
          >
            <LayoutGrid size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Explore</span>
          </button>
          
          <button 
            onClick={() => navigate('/tracking')}
            className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center -mt-10 shadow-[0_0_25px_#10b981] text-black transition-transform hover:scale-110 active:scale-95 border-4 border-black"
          >
            <Zap size={28} />
          </button>

          <button 
            onClick={() => navigate('/rewards')}
            className={cn("flex flex-col items-center gap-1 transition-all hover:scale-110", isActive('/rewards') ? "text-emerald-400" : "opacity-40")}
          >
            <Gift size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Rewards</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className={cn("flex flex-col items-center gap-1 transition-all hover:scale-110", isActive('/profile') ? "text-emerald-400" : "opacity-40")}
          >
            <UserRound size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
