import { Shield as ComplianceShield, FileText as ComplianceFileText, CheckCircle2 as ComplianceCheckCircle2, AlertCircle as ComplianceAlertCircle, Clock as ComplianceClock, Upload as ComplianceUpload, Download as ComplianceDownload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ComplianceStatus } from '../../components/ComplianceStatus';
import SEO from '../../components/SEO';

export default function ComplianceCenter() {
  const { user, role } = useAuth();
  const currentRole = role === 'platform_owner' ? 'admin' : (role || 'candidate');

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <SEO title="Compliance Center" noindex />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Shield className="text-emerald-400" size={32} />
            Compliance Center
          </h1>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Automated regulatory compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
            currentRole === 'admin' 
              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {currentRole === 'admin' ? '3_ALERTS_PENDING' : 'SYSTEM_ALL_CLEAR'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* Document Vault Section */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-slate-500" /> Document Vault
              </h2>
              <button 
                title="Export compliance history"
                aria-label="Export all compliance history"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                <Download size={12} /> Export_All_History
              </button>
            </div>
            
            {user && <ComplianceStatus profileId={user.id} />}
          </div>
        </div>

        {/* Status & Actions Column */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Compliance_Matrix</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Identità Malta</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">GDPR_2026</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">COMPLIANT</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Expiry_Window</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">2_WARNINGS</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button 
              aria-label="Upload new compliance document"
              className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Upload_New_Document</span>
              <Upload size={14} className="text-slate-500 group-hover:text-white transition-colors" />
            </button>
            <button 
              aria-label="Generate audit report"
              className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Generate_Audit_Report</span>
              <FileText size={14} className="text-slate-500 group-hover:text-white transition-colors" />
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
