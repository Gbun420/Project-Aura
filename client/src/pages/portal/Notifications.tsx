import React, { useState, useEffect } from 'react';
import { Bell, Zap, Shield, Filter, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: string;
  type: 'neural' | 'compliance' | 'system';
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  unread: boolean;
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('audit_trails')
        .select('*')
        .eq('entity_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching alerts:', error);
      } else if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          type: item.action?.toLowerCase().includes('match') ? 'neural' : 
                item.action?.toLowerCase().includes('compliance') ? 'compliance' : 'system',
          title: item.action || 'SYSTEM_LOG',
          message: item.details ? (typeof item.details === 'string' ? item.details : JSON.stringify(item.details)) : 'Activity registered in core ledger.',
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: item.action?.toLowerCase().includes('match') ? <Zap size={16} className="text-amber-400" /> : 
                item.action?.toLowerCase().includes('compliance') ? <Shield size={16} className="text-emerald-400" /> : <Bell size={16} className="text-blue-400" />,
          unread: false
        }));
        setNotifications(mapped as Notification[]);
      }
      setLoading(false);
    }

    fetchNotifications();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Syncing_Alert_Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Bell className="text-blue-400" size={32} />
            Alert Stream
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Real-time neural and compliance telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/10 transition-all" aria-label="Filter alerts">
            <Filter size={14} />
          </button>
          <button className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/10 transition-all" aria-label="Clear notifications">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className={`group p-6 rounded-[2rem] border transition-all relative overflow-hidden ${
            notif.unread 
              ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10' 
              : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
          }`}>
            {notif.unread && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] -z-10 group-hover:bg-blue-500/20 transition-all"></div>
            )}
            
            <div className="flex gap-6">
              <div className={`mt-1 p-3 rounded-2xl h-fit ${
                notif.unread ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500'
              }`}>
                {notif.icon}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-black uppercase tracking-tight ${
                    notif.unread ? 'text-white' : 'text-slate-300'
                  }`}>
                    {notif.title}
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{notif.time}</span>
                </div>
                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-2xl">
                  {notif.message}
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">Mark_As_Read</button>
                  <button className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">Details_Manifest</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="py-10 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">EndOfLine_Manifest_Reached</p>
        </div>
      </div>
    </div>
  );
}
