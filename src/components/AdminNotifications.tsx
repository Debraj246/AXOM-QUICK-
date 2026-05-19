import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Users, 
  AlertTriangle, 
  Zap, 
  Megaphone,
  CheckCircle,
  Layout
} from 'lucide-react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<'order' | 'offer' | 'alert' | 'promotion'>('alert');
  const [target, setTarget] = useState<'all' | 'verified' | 'premium'>('all');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // For a real broadcast, we'd add to a 'broadcasts' collection
      // and have a cloud function or client listener distribute it.
      // Here we'll simulate by adding to broadcasts.
      await addDoc(collection(db, 'broadcasts'), {
        title,
        body,
        type,
        target,
        createdAt: serverTimestamp(),
        sender: 'AxomQuick Alpha'
      });

      setSuccess(true);
      setTitle('');
      setBody('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 pt-10">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
               <Megaphone size={20} />
            </div>
            <h2 className="text-3xl font-black font-display uppercase tracking-tighter">Nexus Control</h2>
          </div>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Broadcast Terminal • Level Sigma Access</p>
        </header>

        <form onSubmit={handleSend} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Alert Type</label>
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                  {(['alert', 'offer', 'order', 'promotion'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all ${
                        type === t ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'opacity-40 hover:opacity-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Target Sector</label>
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                  {(['all', 'premium'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTarget(t as any)}
                      className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-xl transition-all ${
                        target === t ? 'bg-assamese-gold text-black shadow-lg shadow-assamese-gold/20' : 'opacity-40 hover:opacity-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-white/5 relative overflow-hidden bg-white/[0.02]">
             <div className="space-y-4">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Broadcast Headline..."
                    className="w-full bg-transparent border-none text-2xl font-bold placeholder-white/20 focus:ring-0 px-0"
                    required
                  />
                </div>
                <div className="h-px bg-white/5 w-full" />
                <div className="space-y-2">
                  <textarea 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Warp details to citizens..."
                    className="w-full bg-transparent border-none text-sm leading-relaxed placeholder-white/20 focus:ring-0 min-h-[120px] px-0"
                    required
                  />
                </div>
             </div>
          </div>

          <button 
            type="submit"
            disabled={isSending}
            className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${
              success 
                ? 'bg-emerald-500 text-black shadow-[0_0_40px_rgba(16,185,129,0.3)]' 
                : 'bg-white text-black hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : success ? (
              <>
                <CheckCircle size={20} />
                Transmission Successful
              </>
            ) : (
              <>
                <Send size={20} />
                Initiate Broadcast
              </>
            )}
          </button>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { label: 'Network Health', val: '99.9%', icon: Zap, color: 'text-emerald-400' },
             { label: 'Active Runners', val: '142', icon: Layout, color: 'text-blue-400' },
             { label: 'Citizen Reach', val: '12.4k', icon: Users, color: 'text-assamese-gold' },
           ].map(stat => (
             <div key={stat.label} className="glass p-5 rounded-3xl border-white/5 flex flex-col items-center text-center">
                <stat.icon size={20} className={`mb-3 ${stat.color}`} />
                <p className="text-[8px] font-black opacity-30 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold">{stat.val}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
