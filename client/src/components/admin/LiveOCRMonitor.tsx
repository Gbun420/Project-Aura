import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, AlertCircle, CheckCircle2, FileSearch, Gavel, X, Save, ExternalLink } from 'lucide-react';

interface OCRLog {
  id: string;
  profile_id: string;
  document_type: string;
  pulse_status: string;
  requires_manual_review: boolean;
  created_at: string;
  expiry_date: string | null;
  file_path: string | null;
  ocr_metadata?: any;
}

export const LiveOCRMonitor: React.FC = () => {
  const [logs, setLogs] = useState<OCRLog[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedLog, setSelectedLog] = useState<OCRLog | null>(null);
  const [auditForm, setAuditForm] = useState<{ expiry_date: string; pulse_status: string }>({
    expiry_date: '',
    pulse_status: '',
  });

  useEffect(() => {
    const fetchRecentLogs = async () => {
      const { data, error } = await supabase
        .from('compliance_documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) setLogs(data);
    };

    fetchRecentLogs();

    const subscription = supabase
      .channel('live-ocr-stream')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'compliance_documents' 
      }, payload => {
        setLogs(prev => [payload.new as OCRLog, ...prev].slice(0, 10));
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'compliance_documents' 
      }, payload => {
        setLogs(prev => prev.map(log => log.id === payload.new.id ? (payload.new as OCRLog) : log));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAudit = (log: OCRLog) => {
    setSelectedLog(log);
    setAuditForm({
      expiry_date: log.expiry_date || '',
      pulse_status: log.pulse_status,
    });
  };

  const saveAudit = async () => {
    if (!selectedLog) return;

    const { error } = await supabase
      .from('compliance_documents')
      .update({
        expiry_date: auditForm.expiry_date || null,
        pulse_status: auditForm.pulse_status,
        requires_manual_review: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedLog.id);

    if (!error) {
      setSelectedLog(null);
    } else {
      console.error('Audit Save Failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#050505] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 animate-pulse">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural_OCR_Telemetry</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">MISSION_ID: IG_COMP_2026_01</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`} />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{isLive ? 'Live_Feed' : 'Paused'}</span>
          </div>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {logs.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-600">
                <FileSearch size={32} className="mb-4 opacity-20" />
                <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting_Payload_Ingestion...</p>
              </div>
            ) : (
              logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${
                      log.pulse_status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                      log.pulse_status === 'PENDING' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.pulse_status === 'VERIFIED' ? <CheckCircle2 size={16} /> :
                       log.pulse_status === 'PENDING' ? <Shield size={16} className="animate-pulse" /> :
                       <AlertCircle size={16} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white tracking-tight">{log.document_type}</p>
                        <span className="text-[9px] font-mono text-slate-500">[{log.profile_id.substring(0, 8)}]</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        {log.requires_manual_review ? 'FLAGGED_FOR_HUMAN_AUDIT' : 'AUTONOMOUS_EXTRACTION_SUCCESS'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-[10px] font-mono font-bold ${
                        log.pulse_status === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {log.pulse_status}
                      </p>
                      <p className="text-[9px] text-slate-600 font-mono mt-1">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleAudit(log)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                    >
                      <Gavel size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Admin Gavel Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl bg-[#0F1114] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                    <Gavel size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Admin_Gavel_Audit</h2>
                    <p className="text-xs text-slate-500 font-mono mt-1">DOC_UUID: {selectedLog.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 h-[500px]">
                {/* Left Side: Binary & JSON */}
                <div className="p-8 border-r border-white/5 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Original_Payload</h4>
                    <div className="aspect-video bg-black rounded-2xl border border-white/5 flex items-center justify-center group relative overflow-hidden">
                      <FileSearch size={48} className="text-slate-800" />
                      <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                          <ExternalLink size={12} /> View_Full_Resolution
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural_Extracted_JSON</h4>
                    <pre className="p-4 bg-black/50 border border-white/5 rounded-2xl text-[10px] font-mono text-blue-400/80 overflow-x-auto">
                      {JSON.stringify(selectedLog.ocr_metadata || { 
                        "name": "REDACTED",
                        "doc_number": "MLT-2026-X8",
                        "birth_date": "1992-04-12",
                        "issue_date": "2023-11-20",
                        "extraction_confidence": 0.82
                      }, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Right Side: Manual Correction */}
                <div className="p-8 bg-white/[0.01] space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Correction_Interface</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Expiry_Date</label>
                        <input 
                          type="date" 
                          value={auditForm.expiry_date}
                          onChange={(e) => setAuditForm({ ...auditForm, expiry_date: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Verification_Status</label>
                        <select 
                          value={auditForm.pulse_status}
                          onChange={(e) => setAuditForm({ ...auditForm, pulse_status: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                        >
                          <option value="VERIFIED">VERIFIED (Compliance Pass)</option>
                          <option value="WARNING">WARNING (Low Confidence)</option>
                          <option value="EXPIRED">EXPIRED (Compliance Fail)</option>
                          <option value="PENDING">PENDING (Re-Queue)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <button 
                      onClick={saveAudit}
                      className="w-full py-4 bg-emerald-500 text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Finalize_Audit_Decision
                    </button>
                    <p className="text-[9px] text-center text-slate-600 mt-4 font-mono tracking-widest">
                      ACTION_LOGGED_AS: {selectedLog.profile_id.substring(0,8)}_ADMIN_OVERRIDE
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
