import React from 'react';
import { Shield, Globe, AlertCircle } from 'lucide-react';

const ComplianceVerification: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-[#2563EB]" size={24} />
            <h2 className="text-xl font-semibold text-slate-900">Employment License Verification</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">License Status</p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">Active / Valid</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Competent Person</p>
              <p className="text-sm font-semibold text-slate-900">Designated Officer (DIER Approved)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Guarantee</p>
              <p className="text-sm font-semibold text-slate-900">€20,000 (Segregated Fund)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Jurisdiction</p>
              <p className="text-sm font-semibold text-slate-900">Malta (EU)</p>
            </div>
          </div>

          <div className="text-sm text-slate-500 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <AlertCircle size={16} className="inline mr-2 text-blue-600" />
            Regulated by the Department of Industrial and Employment Relations (DIER).
          </div>
        </div>

        <div className="w-full md:w-80 bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between min-h-[240px]">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Official Register</p>
            <p className="text-2xl font-mono font-bold tracking-tight mb-2">EA-2026-AURA</p>
            <p className="text-xs text-slate-400">Class A Employment Agency</p>
          </div>
          <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition flex items-center justify-center gap-2">
            Verify on DIER Portal <Globe size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceVerification;
