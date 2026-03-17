import React from 'react';
import { FileText as PublicComplianceFileText, Lock as PublicComplianceLock, CheckCircle as PublicComplianceCheckCircle } from '@/icons';
import ContactCompliance from '../../components/ContactCompliance';
import ComplianceVerification from '../../components/ComplianceVerification';

const Compliance: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Inter']">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#4285F4] via-[#9B72CB] to-[#D96570]" />
            <span className="font-semibold text-slate-900">Aura Compliance</span>
          </div>
          <a href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            Return to Home
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Header Section */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Regulatory & Compliance Framework
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Project Aura operates under strict adherence to the <span className="font-semibold text-slate-900">Maltese Employment Agencies Regulations 2023 (Legal Notice 270 of 2023)</span> and GDPR standards. Our infrastructure is calibrated for the 2026 Sovereign Talent ecosystem.
          </p>
        </div>

        {/* License Verification */}
        <section>
          <ComplianceVerification />
        </section>

        {/* Data Protection & GDPR */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="text-[#9B72CB]" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Data Protection (GDPR)</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-1" size={16} />
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-900 block mb-1">Article 30 Record Keeping</strong>
                  Maintained logs of processing activities available for IDPC inspection.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-1" size={16} />
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-900 block mb-1">Data Sovereignty</strong>
                  All candidate PII is encrypted (AES-256) and stored within the EU (Frankfurt/Dublin).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-1" size={16} />
                <div className="text-sm text-slate-600">
                  <strong className="text-slate-900 block mb-1">Retention Policy</strong>
                  Candidate data is strictly retained for recruitment purposes only and purged upon request or inactivity (2 years).
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-[#D96570]" size={24} />
              <h2 className="text-xl font-semibold text-slate-900">Identità Compliance</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Aura directly integrates with Identità requirements for Third Country Nationals (TCNs).
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Skills Pass Verification</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Pre-Departure (PDC) Checks</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Health Screening Audit</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Enabled</span>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Component Integration */}
        <section>
          <ContactCompliance />
        </section>

      </main>
    </div>
  );
};

export default Compliance;
