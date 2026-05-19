import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { Bike, X, Navigation, ShieldCheck, Map as MapIcon, Zap, Clock, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Coordinates for Barpeta and surrounding areas
const REGION_BOUNDS: [[number, number], [number, number]] = [[26.25, 90.9], [26.6, 91.1]];
const BARPETA_TOWN: [number, number] = [26.3267, 91.0044];
const BARPETA_ROAD: [number, number] = [26.4950, 90.9660];
const HOWLY: [number, number] = [26.4333, 90.9667];

// Simulated delivery path
const ROUTE_POINTS: [number, number][] = [
  [26.3280, 91.0060], // Store
  [26.3275, 91.0055],
  [26.3268, 91.0050],
  [26.3260, 91.0040],
  [26.3250, 91.0030],
  [26.3240, 91.0020], // Home
];

export default function RiderMap({ onClose }: { onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStatus(true), 500);
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const riderPos = useMemo(() => {
    const total = ROUTE_POINTS.length - 1;
    const step = 100 / total;
    const index = Math.floor(progress / step);
    const localProg = (progress % step) / step;

    if (index >= total) return ROUTE_POINTS[total];
    
    const p1 = ROUTE_POINTS[index];
    const p2 = ROUTE_POINTS[index + 1];
    
    return [
      p1[0] + (p2[0] - p1[0]) * localProg,
      p1[1] + (p2[1] - p1[1]) * localProg
    ] as [number, number];
  }, [progress]);

  // Marker Icons
  const RiderIcon = L.divIcon({
    className: 'rider-icon',
    html: `
      <div class="relative w-12 h-12 flex items-center justify-center">
        <div class="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <div class="w-10 h-10 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center text-black shadow-[0_0_20px_#10b981] marker-3d transform-gpu">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  const StoreIcon = L.divIcon({
    className: 'store-icon',
    html: `
      <div class="w-8 h-8 glass-emerald rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const HomeIcon = L.divIcon({
    className: 'home-icon',
    html: `
      <div class="w-8 h-8 bg-assamese-red text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col"
    >
      {/* Top Navigation */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[110] flex items-center justify-between pointer-events-none">
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="glass p-4 rounded-[24px] pointer-events-auto border-emerald-500/20 flex items-center gap-6"
        >
          <div className="flex items-center gap-3 pr-6 border-r border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
               <MapIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Region</p>
              <h3 className="text-sm font-bold truncate">Barpeta Corridor</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold">Flood Alert Live</span>
          </div>
        </motion.div>

        <button 
          onClick={onClose}
          className="w-14 h-14 rounded-2xl glass border border-white/20 flex items-center justify-center pointer-events-auto active:scale-95 transition-transform hover:bg-white/10"
        >
          <X size={24} />
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full bg-black relative">
        <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        
        <MapContainer 
          center={BARPETA_TOWN} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          className="map-dark-overlay"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          <ZoomControl position="bottomright" />

          {/* Route Glow */}
          <Polyline 
            positions={ROUTE_POINTS} 
            pathOptions={{ color: '#10b981', weight: 8, opacity: 0.1, lineCap: 'round' }}
            className="neon-line"
          />
          <Polyline 
            positions={ROUTE_POINTS} 
            pathOptions={{ color: '#10b981', weight: 2, opacity: 0.8, lineCap: 'round', dashArray: '5, 10' }}
          />

          <Marker position={ROUTE_POINTS[0]} icon={StoreIcon} />
          <Marker position={riderPos} icon={RiderIcon} />
          <Marker position={ROUTE_POINTS[ROUTE_POINTS.length - 1]} icon={HomeIcon} />
        </MapContainer>

        {/* Futuristic Scanner Effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/30 animate-scan pointer-events-none z-20" />
      </div>

      {/* Bottom Floating Stats */}
      <AnimatePresence>
        {showStatus && (
          <motion.div 
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-xl z-[110] glass p-6 rounded-[32px] border-emerald-500/20 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/10 rounded-full mt-2" />
            
            <div className="flex justify-between items-start mb-6 mt-2">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hiten" className="w-full h-full object-cover" alt="Rider" />
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    Hiten Das
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      <Star size={10} fill="currentColor" /> 4.9
                    </span>
                  </h4>
                  <p className="text-xs text-white/40">Electric Hero Eco-S1</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-emerald-400 font-black">
                  <Zap size={14} fill="currentColor" />
                  <span className="text-xs tracking-widest">LIVE</span>
                </div>
                <h3 className="text-2xl font-black font-display text-emerald-400">08:12</h3>
                <p className="text-[10px] text-white/30 uppercase font-black">Estimated Mins</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                 <span className="flex items-center gap-2 text-white/60"><Clock size={14} /> Shop Received</span>
                 <span className="text-emerald-500">Completed</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-white/40 uppercase">
                <span>Rider at Store</span>
                <span className={progress > 50 ? 'text-emerald-400' : ''}>Out for Delivery</span>
                <span>Destination</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 active:scale-95 transition-all">
                Contact Rider
              </button>
              <button className="py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] neon-glow active:scale-95 transition-all">
                Panic Button
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
