import { Shield, FileText, AlertCircle, Upload, Download, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ComplianceStatus } from '../../components/ComplianceStatus';
import SEO from '../../components/SEO';
import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';

export default function ComplianceCenter() {
  const { user, role } = useAuth();
  const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // 1. Upload to Firebase Storage
      const storageRef = ref(storage, `compliance/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Create document record in Firestore
      await addDoc(collection(db, 'compliance_documents'), {
        profile_id: user.uid,
        document_type: 'Other', // Default, can be refined
        file_url: downloadURL,
        pulse_status: 'PENDING',
        requires_manual_review: true,
        created_at: new Date().toISOString()
      });

      alert('Document uploaded successfully for processing.');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <SEO title="Compliance Center" noindex />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png"
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 font-space uppercase">
            <Shield className="text-emerald-400" size={32} />
            Regulatory_Vault
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Automated regulatory compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
            currentRole === 'admin' 
              ? 'bg-red-500/10 text-red-500 border-red-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {currentRole === 'admin' ? 'SYSTEM_BREACH_DETECTED' : 'INTEGRITY_VERIFIED'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* Document Vault Section */}
        <div className="space-y-8">
          <div className="nova-glass-card p-10 rounded-[3rem] border border-white/5">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <FileText size={18} className="text-nova-pulse" /> Encrypted Vault
              </h2>
              <button 
                title="Export compliance history"
                aria-label="Export all compliance history"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all hover:text-white"
              >
                <Download size={12} /> Sync_History
              </button>
            </div>
            
            {user && <ComplianceStatus profileId={user.uid} />}
          </div>
        </div>

        {/* Status & Actions Column */}
        <div className="space-y-6">
          <div className="nova-glass-card p-10 rounded-[3rem] border border-white/5">
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">Compliance_Matrix</h2>
            <div className="space-y-8">
              <div className="flex items-center justify-between group cursor-help">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Identità Malta</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-black">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between group cursor-help">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-emerald-400 transition-colors">GDPR_Sovereign</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-black">SECURE</span>
              </div>
              <div className="flex items-center justify-between group cursor-help">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-widest group-hover:text-amber-400 transition-colors">Expiry_Window</span>
                </div>
                <span className="text-[10px] font-mono text-amber-500 font-black">WATCH</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button 
              aria-label="Upload new compliance document"
              onClick={handleUploadClick}
              disabled={uploading}
              className="w-full flex items-center justify-between px-7 py-5 bg-white/5 border border-white/5 rounded-[1.5rem] hover:bg-white/10 hover:border-white/10 transition-all group active:scale-[0.98] disabled:opacity-50"
            >
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                {uploading ? 'Processing_Payload...' : 'Upload Document'}
              </span>
              {uploading ? (
                <Loader2 size={14} className="text-nova-accent animate-spin" />
              ) : (
                <Upload size={14} className="text-slate-500 group-hover:text-nova-accent transition-colors" />
              )}
            </button>
            <button 
              aria-label="Generate audit report"
              className="w-full flex items-center justify-between px-7 py-5 bg-white/5 border border-white/5 rounded-[1.5rem] hover:bg-white/10 hover:border-white/10 transition-all group active:scale-[0.98]"
            >
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Audit Report</span>
              <FileText size={14} className="text-slate-500 group-hover:text-nova-accent transition-colors" />
            </button>
            {currentRole === 'admin' && (
              <button 
                aria-label="Triage all pending alerts"
                className="w-full flex items-center justify-between px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all group"
              >
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Triage_All_Alerts</span>
                <AlertCircle size={14} className="text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
