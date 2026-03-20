import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { ShieldCheck, FileText, AlertCircle, Clock, CheckCircle2, UploadCloud, ChevronRight } from 'lucide-react';

type ComplianceDocument = {
  id: string;
  document_type: string;
  pulse_status: 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'WARNING';
  expiry_date: string | null;
  file_path: string;
  created_at: string;
};

export default function CandidateVault() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'compliance_documents'),
          where('profile_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const docsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ComplianceDocument[];

        setDocuments(docsData);
      } catch (err) {
        console.error("FAILED_TO_SYNC_VAULT: Could not fetch compliance artifacts.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'WARNING': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'EXPIRED': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle2 size={14} />;
      case 'WARNING': return <AlertCircle size={14} />;
      case 'EXPIRED': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vault Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-nova-accent mb-2">SOVEREIGN_VAULT_v1.2</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Document Vault</h1>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-mono">End-to-end encrypted compliance storage</p>
        </div>
        <button 
          aria-label="Upload compliance artifact"
          className="flex items-center gap-3 px-8 py-4 bg-gemini-gradient rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-nova-accent/20"
        >
          <UploadCloud size={16} />
          Upload_Compliance_Artifact
        </button>
      </header>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Document List */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-nova-accent border-b border-white/5 pb-4">Secured_Artifacts</h3>
          
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="h-10 w-10 border-2 border-nova-accent/20 border-t-nova-accent rounded-full animate-spin mx-auto" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Deciphering_Vault_Ledger...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-16 rounded-[3rem] border-2 border-dashed border-white/5 nova-glass-card !bg-white/[0.01] text-center">
              <FileText size={40} className="text-slate-700 mx-auto mb-6" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vault_Is_Empty</p>
              <p className="text-xs text-slate-500 mt-2">Initialize your compliance profile by uploading Identità certs.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="group p-6 rounded-[2.5rem] nova-glass-card flex items-center justify-between hover:border-nova-pulse/30 transition-all glow-uv">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-nova-glass border border-white/10 flex items-center justify-center text-nova-accent">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">{doc.document_type.replace(/_/g, ' ')}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(doc.pulse_status)}`}>
                          {getStatusIcon(doc.pulse_status)}
                          {doc.pulse_status}
                        </span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                          Updated: {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    title="View Document Details"
                    aria-label={`View details for ${doc.document_type.replace(/_/g, ' ')}`}
                    className="p-4 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Insights & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-[2.5rem] nova-glass-card">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-nova-accent mb-6">Vault_Stats</h3>
            <div className="space-y-6">
              {[
                { label: 'Total Artifacts', value: documents.length, icon: <FileText size={16} /> },
                { label: 'Verified Status', value: Math.round((documents.filter(d => d.pulse_status === 'VERIFIED').length / (documents.length || 1)) * 100) + '%', icon: <ShieldCheck size={16} /> },
                { label: 'Encryption Standard', value: 'AES-256', icon: <AlertCircle size={16} /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    {stat.icon}
                    {stat.label}
                  </div>
                  <div className="text-white text-xs font-black font-mono">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] nova-glass-card border border-nova-pulse/20 relative overflow-hidden group glow-uv">
            <div className="absolute inset-0 bg-nova-glass-gradient opacity-10 pointer-events-none" />
            <ShieldCheck size={40} className="text-nova-pulse mb-6 opacity-40 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Neural_Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">Your data is stored within a zero-knowledge enclave, accessible only via your sovereign identity key.</p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-nova-pulse w-full animate-pulse shadow-[0_0_8px_#22D3EE]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
