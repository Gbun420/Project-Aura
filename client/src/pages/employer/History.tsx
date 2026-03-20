import { useState, useEffect } from 'react';
import { Clock, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface LedgerEntry {
  hash: string;
  employer_id: string | null;
  candidate_id: string | null;
  notified_at: string;
  expiry_date: string | null;
  fee_status: string | null;
}

export default function EmployerHistory() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const q = query(
          collection(db, 'introduction_ledger'),
          where('employer_id', '==', user.uid),
          orderBy('notified_at', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ ...doc.data() })) as LedgerEntry[];
        
        if (data) {
          setEntries(data);
        }
      } catch (err) {
        console.error('History fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  const getStatusBadge = (status: string | null) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Paid' };
      case 'WAIVED':
        return { icon: CheckCircle2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Waived' };
      default:
        return { icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: status || 'Pending' };
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Clock className="text-blue-400" size={32} />
          Hiring History
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Introduction ledger and fee records
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading history...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
          <Clock className="mx-auto text-slate-600 mb-4" size={32} />
          <h3 className="text-white font-bold mb-2 uppercase tracking-tight">No History Yet</h3>
          <p className="text-slate-500 text-sm font-medium">Your hiring introductions and fee records will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const status = getStatusBadge(entry.fee_status);
            const StatusIcon = status.icon;
            return (
              <div key={entry.hash} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Hash size={14} className="text-slate-500" />
                      <span className="text-xs font-mono text-slate-400">{entry.hash.slice(0, 16)}...</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(entry.notified_at).toLocaleDateString()}
                      </span>
                      {entry.expiry_date && (
                        <span className="flex items-center gap-1">
                          Expires: {new Date(entry.expiry_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
