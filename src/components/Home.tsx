import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search,
  Mic,
  Home as HomeIcon,
  LayoutGrid,
  Gift,
  UserRound,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  CloudRain,
  Trophy
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';
import RiderMap from './RiderMap.tsx';

const services = [
  { id: 'grocery', name: 'Grocery', icon: '🥬', desc: 'Instant Items' },
  { id: 'fish', name: 'Fish & Meat', icon: '🐟', desc: 'Fresh local catch' },
  { id: 'medicine', name: 'Meds', icon: '💊', desc: '24/7 Delivery' },
  { id: 'pickup', name: 'Pick & Drop', icon: '🛵', desc: 'Crockery to Keys' },
  { id: 'parcel', name: 'Parcel', icon: '📦', desc: 'Send anything' },
  { id: 'services', name: 'Services', icon: '⚡', desc: 'Electrician/Plumber' },
  { id: 'tiffin', name: 'Tiffin', icon: '🍱', desc: 'Home-cooked' },
  { id: 'emergency', name: 'Anything', icon: '✨', desc: 'Critical needs' },
];

export default function Home() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="w-full h-screen bg-black text-white font-sans flex flex-col overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
           style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 20L0 0m40 40L20 20" stroke="%2310b981" stroke-width="1" fill="none"/%3E%3C/svg%3E')` }}>
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />

      <AnimatePresence mode="wait">
        {showMap && <RiderMap onClose={() => setShowMap(false)} />}
      </AnimatePresence>

      <header className="flex items-center justify-between p-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <span className="text-xl font-bold text-black">AQ</span>
          </div>
          <div>
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
          <div className="text-right hidden sm:block">
            <p className="text-xs opacity-50">Current Level</p>
            <p className="text-sm font-semibold text-emerald-400">Flood Safety: High</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 p-1">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Assam" className="rounded-full bg-emerald-900" alt="Avatar" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 grid grid-cols-12 gap-6 pb-6 overflow-hidden">
        {/* Left Section */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-900/40 to-black/40 backdrop-blur-2xl border border-emerald-500/20 rounded-[32px] p-8 flex items-center justify-between relative overflow-hidden h-48 sm:h-56 shrink-0"
          >
            <div className="z-10">
              <span className="bg-red-500 text-[10px] font-bold px-2 py-1 rounded-md mb-4 inline-block tracking-tighter">LIVE OFFERS</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-display">Fresh Borali Fish</h2>
              <p className="text-white/60 text-sm md:text-base mb-4">Delivering straight from Brahmaputra in 20 mins.</p>
              <button 
                onClick={() => setShowMap(true)}
                className="bg-emerald-500 text-black font-bold px-6 py-2 rounded-full text-sm hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
              >
                ORDER NOW
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4 scale-150 pointer-events-none">
              <ShoppingBag size={200} className="text-emerald-400" />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', y: -5 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all"
              >
                <div className="w-14 h-14 bg-emerald-900/50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <span className="text-sm font-medium">{s.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Weather & Flood Alert Card */}
          <div className="shrink-0 grid grid-cols-2 gap-4">
            <div className="glass-emerald rounded-3xl p-5 border-emerald-500/20 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-2 text-emerald-400">
                 <CloudRain size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Normal Rain</span>
               </div>
               <h4 className="text-sm font-bold mb-1">Barpeta Weather</h4>
               <p className="text-[10px] text-white/50">Expect light showers in <br/>Howly & Sarthebari.</p>
            </div>
            <div className="bg-red-500/10 rounded-3xl p-5 border border-red-500/20 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-2 text-red-500">
                 <Zap size={16} fill="currentColor" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Safety Alert</span>
               </div>
               <h4 className="text-sm font-bold mb-1">Flood Level: Low</h4>
               <p className="text-[10px] text-white/50">All major roads in Town <br/>are currently clear.</p>
            </div>
          </div>

          <div className="shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold opacity-60 text-[10px] tracking-[0.2em] uppercase">Trending Local Offers</h3>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[
                { name: 'Traditional Fish Thali', price: '₹120', img: 'https://images.unsplash.com/photo-1589187151003-0dd3c841bf45?auto=format&fit=crop&q=80&w=300' },
                { name: 'Khar & Pitika Combo', price: '₹140', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300' },
                { name: 'Boroli Curry', price: '₹210', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=300' },
              ].map((item, id) => (
                <div key={id} className="min-w-[200px] bg-white/5 border border-white/10 rounded-3xl p-4">
                  <img src={item.img} className="w-full h-24 object-cover rounded-2xl mb-3" alt={item.name} />
                  <p className="font-bold text-sm mb-1">{item.name}</p>
                  <p className="text-emerald-400 text-xs font-bold">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden relative">
            <div className="absolute inset-0 bg-emerald-900/10 z-0"></div>
            <div className="relative z-10 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Live Tracking</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">ACTIVE</span>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 relative flex items-center justify-center cursor-pointer"
                  onClick={() => setShowMap(true)}
                >
                  <div className="absolute inset-0 border-4 border-dashed border-emerald-500/20 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#10b981]"></div>
                </motion.div>
                <p className="mt-6 text-sm text-white/60">Rider Hiten is near <br/><span className="text-white font-semibold underline decoration-emerald-500/50">Barpeta Satra</span></p>
                <p className="text-xs text-emerald-400 mt-2 font-bold tracking-widest uppercase">3:42 MINS AWAY</p>
              </div>
              <div className="mt-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex gap-3 items-center group cursor-pointer hover:bg-emerald-500/20 transition-all">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                   <Clock size={20} className="text-emerald-400" />
                </div>
                <div className="flex-1 text-[11px]">
                  <p className="font-bold text-emerald-400">Quick Delivery</p>
                  <p className="opacity-60 italic">"Items at your doorstep in 15 mins"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bihu Rewards Banner */}
          <div className="bg-gradient-to-br from-assamese-gold to-orange-500 rounded-[32px] p-6 h-32 flex flex-col justify-between text-black shadow-lg relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] opacity-20 transform group-hover:scale-110 transition-transform">
               <Trophy size={100} />
            </div>
            <div className="z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Bihu Special</h4>
              <p className="text-sm font-bold">Earn Double Bihu Points <br/>on all local fish orders!</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold z-10">
               <Zap size={12} fill="currentColor" />
               <span>EXPIRES IN 2H</span>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[32px] p-6 h-40 flex flex-col justify-between text-black shadow-xl neon-glow shrink-0"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70">Smart Wallet</h4>
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold block leading-none">₹ 4,280.50</span>
                <span className="text-[8px] font-black opacity-60 tracking-wider">BARPETA FUND</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold block leading-none">1,250</span>
                <span className="text-[8px] font-bold opacity-60">BIHU PTS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <nav className="h-24 px-6 md:px-12 pb-6 z-20 shrink-0">
        <div className="h-full bg-white/5 backdrop-blur-2xl rounded-3xl md:rounded-full border border-white/10 flex items-center justify-around shadow-2xl relative">
          <button className="flex flex-col items-center gap-1 text-emerald-400 transition-all hover:scale-110">
            <HomeIcon size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all hover:scale-110">
            <LayoutGrid size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Explore</span>
          </button>
          
          <button 
            onClick={() => setShowMap(true)}
            className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center -mt-10 shadow-[0_0_25px_#10b981] text-black transition-transform hover:scale-110 active:scale-95 border-4 border-black"
          >
            <Zap size={28} />
          </button>

          <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all hover:scale-110">
            <Gift size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Rewards</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-all hover:scale-110">
            <UserRound size={24} />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] hidden sm:block">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
