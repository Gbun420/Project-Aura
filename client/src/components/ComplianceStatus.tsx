import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface ComplianceDocument {
  id: string;
  document_type: string;
  pulse_status: string;
  expiry_date: string | null;
  days_until_expiry: number | null;
  file_url?: string;
}

interface ComplianceStatusProps {
  profileId: string;
}

export function ComplianceStatus({ profileId }: ComplianceStatusProps) {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'compliance_documents'),
          where('profile_id', '==', profileId)
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ComplianceDocument[];
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching compliance docs:', err);
      }
      setLoading(false);
    }

    if (profileId) {
      fetchDocuments();
    }
  }, [profileId]);

  if (loading) {
    return <div className="animate-pulse text-xs font-mono text-slate-500 uppercase">Vault_Syncing...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-4">Regulatory_Shield_Vault</h3>
      {documents.length === 0 ? (
        <div className="text-sm text-slate-400 font-mono italic">NO_DOCUMENTS_FOUND</div>
      ) : (
        documents.map((doc) => {
          const isExpired = doc.pulse_status === 'EXPIRED';
          const isWarning = doc.pulse_status.includes('WARNING');
          
          return (
            <div key={doc.id} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md transition-all hover:bg-white/10">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-tight">{doc.document_type}</span>
                  {doc.file_url && (
                    <a 
                      href={doc.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-nova-accent hover:underline mt-1 font-mono uppercase tracking-widest"
                    >
                      View_Original_Payload ↗
                    </a>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-mono border ${
                  isExpired ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                  isWarning ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {doc.pulse_status}
                </span>
              </div>
              
              {doc.expiry_date && (
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">EXPIRY_DATE: {new Date(doc.expiry_date).toLocaleDateString()}</span>
                  <span className={isWarning || isExpired ? 'text-red-400' : 'text-slate-400'}>
                    [{doc.days_until_expiry}D_REMAINING]
                  </span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
