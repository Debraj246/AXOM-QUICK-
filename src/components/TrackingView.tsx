import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bike, 
  Navigation, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Star, 
  ChevronLeft, 
  Phone, 
  MessageSquare,
  Package,
  CheckCircle2,
  MapPin,
  Share2,
  RotateCcw,
  ThumbsUp
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { orderService, Order } from '../services/orderService.ts';
import confetti from 'canvas-confetti';

const TRACKING_STAGES = [
  'Order Confirmed',
  'Preparing',
  'Packed',
  'Rider Assigned',
  'Picked Up',
  'On The Way',
  'Near You',
  'Delivered'
];

export default function TrackingView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [showRating, setShowRating] = useState(false);
  
  // Simulated route from store to customer
  const routePoints = useMemo(() => {
    const store: [number, number] = [26.3280, 91.0060];
    const customer: [number, number] = order ? [order.lat, order.lng] : [26.3240, 91.0020];
    
    // Generate some midpoints for a more realistic route
    const mid1: [number, number] = [
      store[0] + (customer[0] - store[0]) * 0.3,
      store[1] + (customer[1] - store[1]) * 0.4
    ];
    const mid2: [number, number] = [
      store[0] + (customer[0] - store[0]) * 0.7,
      store[1] + (customer[1] - store[1]) * 0.6
    ];
    
    return [store, mid1, mid2, customer] as [number, number][];
  }, [order]);

  useEffect(() => {
    if (orderId) {
      orderService.getOrder(orderId).then(data => {
        if (data) setOrder(data);
      });
    }
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.15;
        if (next >= 100) {
          clearInterval(interval);
          handleDeliveryComplete();
          return 100;
        }
        
        // Update status based on progress
        const sIndex = Math.min(
          TRACKING_STAGES.length - 1, 
          Math.floor((next / 100) * (TRACKING_STAGES.length - 1))
        );
        setStatusIndex(sIndex);
        
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleDeliveryComplete = () => {
    setIsDelivered(true);
    setStatusIndex(TRACKING_STAGES.length - 1);
    
    // Delivery Celebration
    const scalar = 2;
    const triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' });

    confetti({
      shapes: [triangle],
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#ffffff']
    });

    setTimeout(() => {
      setShowRating(true);
    }, 2000);
  };

  const riderPos = useMemo(() => {
    const totalSegments = routePoints.length - 1;
    const segmentProgress = 100 / totalSegments;
    const segmentIndex = Math.floor(progress / segmentProgress);
    const localProg = (progress % segmentProgress) / segmentProgress;
    
    if (segmentIndex >= totalSegments) return routePoints[totalSegments];
    
    const p1 = routePoints[segmentIndex];
    const p2 = routePoints[segmentIndex + 1];
    
    return [
      p1[0] + (p2[0] - p1[0]) * localProg,
      p1[1] + (p2[1] - p1[1]) * localProg
    ] as [number, number];
  }, [progress, routePoints]);

  const RiderIcon = L.divIcon({
    className: 'rider-icon',
    html: `<div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping scale-150"></div>
        <div class="absolute inset-4 bg-emerald-500/40 rounded-full animate-pulse"></div>
        <div class="w-12 h-12 bg-emerald-500 rounded-2xl border-2 border-black flex items-center justify-center text-black shadow-[0_0_30px_#10b981] transform -rotate-12">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="3" fill="none"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        </div>
      </div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  });

  const DestinationIcon = L.divIcon({
    className: 'dest-icon',
    html: `<div class="w-8 h-8 bg-black border-2 border-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <div className="h-full flex flex-col overflow-hidden relative bg-[#050505]">
      {/* Immersive Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 z-[1000] flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all pointer-events-auto"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center pointer-events-auto">
           <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em] mb-1">Nexus Tracking</p>
           <h2 className="text-sm font-bold font-mono text-emerald-400">#{orderId || 'AQ-PROTOCOL-7'}</h2>
        </div>
        <button className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all pointer-events-auto">
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex-1 relative">
        <MapContainer 
          center={routePoints[1]} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          className="map-dark-overlay"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          <Polyline 
            positions={routePoints} 
            pathOptions={{ color: '#10b981', weight: 6, opacity: 0.1 }} 
          />
          <Polyline 
            positions={routePoints.slice(0, Math.floor((progress/100)*routePoints.length) + 1)} 
            pathOptions={{ color: '#10B981', weight: 6, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }} 
          />
          <Marker position={riderPos} icon={RiderIcon} />
          <Marker position={routePoints[routePoints.length - 1]} icon={DestinationIcon} />
        </MapContainer>
        
        {/* Futuristic Floating Dashboard */}
        <AnimatePresence>
          {!isDelivered ? (
            <motion.div 
              key="tracking-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-0 left-0 right-0 z-[1001]"
            >
              <div className="glass p-8 pt-10 rounded-t-[48px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
                {/* Grab handle */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </span>
                       <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">{TRACKING_STAGES[statusIndex]}</span>
                    </div>
                    <h3 className="text-3xl font-bold font-display tracking-tight">Arrive in {Math.max(1, Math.ceil((100 - progress) / 5))} mins</h3>
                    <p className="text-xs opacity-40 mt-1 uppercase font-black tracking-widest">To: {order?.address.substring(0, 30)}...</p>
                  </div>
                  <div className="text-right">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex flex-col items-center justify-center text-emerald-400 border border-emerald-500/20">
                       <Clock size={20} className="mb-0.5" />
                       <span className="text-[8px] font-black uppercase">LIVE</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-5 bg-white/[0.03] rounded-3xl border border-white/5 mb-8 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10" alt="Rider" />
                     <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-black shadow-lg">
                        <Star size={12} fill="currentColor" />
                     </div>
                   </div>
                   <div className="flex-1">
                     <p className="text-lg font-bold">Rohan Bezbaruah</p>
                     <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-3">Electric Hero S1 • Premium Runner</p>
                     <div className="flex gap-2">
                        <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all">
                           <MessageSquare size={14} className="text-emerald-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Message</span>
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center hover:scale-105 transition-transform">
                           <Phone size={18} />
                        </button>
                     </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"
                      />
                   </div>
                   <div className="flex justify-between items-center px-2">
                      {['Packed', 'Picked Up', 'Delivered'].map((label, i) => (
                        <div key={label} className="flex flex-col items-center gap-2">
                           <div className={`w-3 h-3 rounded-full border-2 ${progress >= (i+1)*33 ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_#10b981]' : 'border-white/20'}`} />
                           <span className={`text-[8px] font-black uppercase tracking-widest ${progress >= (i+1)*33 ? 'text-emerald-400' : 'opacity-20'}`}>{label}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="delivery-success"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute inset-0 z-[1005] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            >
              <div className="w-full max-w-sm glass p-10 rounded-[56px] border-emerald-500/20 text-center relative overflow-hidden">
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: 'spring', damping: 10 }}
                   className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                 >
                   <CheckCircle2 size={56} strokeWidth={3} />
                 </motion.div>
                 
                 <h2 className="text-4xl font-black font-display uppercase tracking-tighter mb-4">DELIVERED!</h2>
                 <p className="text-sm opacity-60 mb-10">Enjoy your AxomQuick feast. Hope we made your day faster!</p>
                 
                 <AnimatePresence>
                   {showRating && (
                     <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="space-y-8"
                     >
                        <div className="flex justify-center gap-3">
                           {[1,2,3,4,5].map(star => (
                             <motion.button 
                               whileHover={{ scale: 1.2 }}
                               key={star} 
                               className="text-assamese-gold"
                             >
                               <Star size={32} fill={star <= 4 ? "currentColor" : "none"} strokeWidth={2} />
                             </motion.button>
                           ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                           <button 
                             onClick={() => navigate('/')}
                             className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                           >
                              Back Home
                           </button>
                           <button className="py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                              Tip Rider
                           </button>
                        </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

