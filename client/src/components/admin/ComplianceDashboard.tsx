import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Activity, Users, Clock } from '@/icons';
import { LiveOCRMonitor } from './LiveOCRMonitor';

const ComplianceDashboard: React.FC = () => {

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F1114] border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">Compliant</p>
          <p className="text-xs text-emerald-400">All checks passing</p>
        </div>

        <div className="bg-[#0F1114] border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Reviews</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">12</p>
          <p className="text-xs text-amber-400">Requires attention (48h)</p>
        </div>

        <div className="bg-[#0F1114] border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Consents</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">8,450</p>
          <p className="text-xs text-slate-400">+124 this week</p>
        </div>

        <div className="bg-[#0F1114] border border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Activity size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audit Logs</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">1.2M</p>
          <p className="text-xs text-slate-400">Immutable records</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity */}
        <div className="lg:col-span-2 bg-[#0F1114] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-slate-400" /> Recent Audit Trail
            </h3>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Export Log</button>
          </div>
          
          <div className="space-y-4">
            {[
              { action: 'GDPR_CONSENT_UPDATE', user: 'Candidate_8821', time: '2 mins ago', status: 'success' },
              { action: 'TCN_DOC_VERIFICATION', user: 'System_Auto', time: '15 mins ago', status: 'success' },
              { action: 'LICENSE_CHECK_DIER', user: 'Admin_Sys', time: '1 hour ago', status: 'warning' },
              { action: 'JOB_POST_COMPLIANCE', user: 'Employer_TechCorp', time: '2 hours ago', status: 'success' },
              { action: 'DATA_ERASURE_REQUEST', user: 'Candidate_9912', time: '5 hours ago', status: 'pending' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                <div className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${
                    log.status === 'success' ? 'bg-emerald-500' : 
                    log.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-white">{log.action}</p>
                    <p className="text-[10px] text-slate-500">{log.user}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Regulatory Feed & Live OCR */}
        <div className="space-y-6">
          <LiveOCRMonitor />
          
          <div className="bg-[#0F1114] border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText size={16} className="text-slate-400" /> Regulatory Feed
            </h3>
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-blue-500" />
                <p className="text-xs font-bold text-white mb-1">Maltese Budget 2026</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  New tax credits for TCN skills training announced. Verify eligibility criteria in system settings.
                </p>
              </div>
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <p className="text-xs font-bold text-white mb-1">Identità Portal API v2.1</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Connector updated successfully. Skills Pass validation logic synced.
                </p>
              </div>
              <div className="relative pl-6 border-l border-white/10">
                <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-slate-500" />
                <p className="text-xs font-bold text-white mb-1">DIER Audit Schedule</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Upcoming automated report generation for Q1 2026 due in 14 days.
                </p>
              </div>
            </div>
          </div>
          
          <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 transition">
            Generate Compliance Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
