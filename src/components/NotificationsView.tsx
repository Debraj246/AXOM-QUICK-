import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../context/NotificationContext';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Trash2, 
  CheckCheck,
  ShoppingBag,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationsView() {
  const { notifications, markRead, markAllRead, remove, requestPermission } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} className="text-emerald-400" />;
      case 'alert': return <AlertTriangle size={20} className="text-red-400" />;
      case 'offer': return <Zap size={20} className="text-assamese-gold" />;
      default: return <Info size={20} className="text-blue-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="p-6 pb-2 flex items-center justify-between z-10">
        <div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tighter">Notifications</h2>
          <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Nexus Alerts & Intel</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => requestPermission()}
            className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2 border border-emerald-500/20"
          >
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase">Enable Push</span>
          </button>
          <button 
            onClick={markAllRead}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-emerald-400 flex items-center gap-2"
            title="Mark all as read"
          >
            <CheckCheck size={20} />
            <span className="text-[10px] font-black uppercase">Clear All</span>
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/10 mb-6 border border-white/5">
            <Bell size={48} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-bold mb-2">Ghost Feed</h3>
          <p className="text-sm text-white/40 max-w-xs">No active nexus transmissions at the moment. All systems normal.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-4 custom-scrollbar">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                className={`group relative p-5 rounded-[32px] border transition-all cursor-pointer ${
                  notification.read 
                    ? 'bg-white/[0.01] border-white/5' 
                    : 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]'
                }`}
                onClick={() => {
                  if (!notification.read) markRead(notification.id);
                  if (notification.link) navigate(notification.link);
                }}
              >
                {!notification.read && (
                  <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    notification.read ? 'bg-white/5' : 'bg-emerald-500/10'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-black uppercase tracking-wider ${
                        notification.read ? 'text-white/60' : 'text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <span className="text-[8px] font-black opacity-30 whitespace-nowrap ml-2">
                        {new Date(notification.createdAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      notification.read ? 'text-white/40' : 'text-white/70'
                    }`}>
                      {notification.body}
                    </p>
                  </div>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(notification.id);
                    }}
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-6 text-center">
        <p className="text-[8px] font-black opacity-10 uppercase tracking-[0.6em]">
          End of Nexus Feed • Secured by AQ-Sync
        </p>
      </div>
    </div>
  );
}
