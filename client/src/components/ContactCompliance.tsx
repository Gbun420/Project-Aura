import React from 'react';
import { Mail, Shield, Clock, FileText } from 'lucide-react';

const ContactCompliance: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <Shield size={24} className="text-[#22D3EE]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Compliance & Regulatory Hub</h2>
            <p className="text-sm text-slate-400">Nova 2026 Sovereign Infrastructure</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Mail size={14} /> Primary Contact
              </h3>
              <p className="text-lg font-semibold text-slate-900">novajobs@proton.me</p>
              <p className="text-sm text-slate-500 mt-1">Dedicated channel for regulatory, legal, and data protection inquiries.</p>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} /> SLA Commitments
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Initial Acknowledgment</span>
                  <span className="font-semibold text-slate-900">12 Hours</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Regulatory Inquiry Response</span>
                  <span className="font-semibold text-slate-900">48 Hours</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Data Subject Request (GDPR)</span>
                  <span className="font-semibold text-slate-900">72 Hours</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={14} /> Regulatory Status
              </h3>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-900 mb-1">Licensed Entity</p>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight">
                  Calibrated under Maltese Employment Agencies Regulations 2023 & Identità 2026 Standards.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Compliance Officer
              </h3>
              <p className="text-sm text-slate-600 italic">
                Nova maintains a designated Compliance Officer for the 2026 permit crisis. 
                All communications via <span className="font-semibold">novajobs@proton.me</span> are routed through the secure legal vault.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
            Audit Trail Protocol Active: MT-2026.1-NOVA
          </p>
          <button className="px-6 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition">
            Download Compliance Brief
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCompliance;
