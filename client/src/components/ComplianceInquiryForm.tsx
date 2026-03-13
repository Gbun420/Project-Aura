import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const ComplianceInquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    category: 'regulatory',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Sending compliance inquiry to aurajobs@proton.me:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center">
        <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Inquiry Logged Successfully</h3>
        <p className="text-slate-600 mb-6">
          Your regulatory inquiry has been cryptographically signed and routed to 
          <span className="font-semibold ml-1">aurajobs@proton.me</span>. 
          Expect a response within 48 hours.
        </p>
        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
          Reference: AURA-REG-{Math.random().toString(36).substr(2, 6).toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2 font-['Space_Grotesk']">Secure Compliance Inquiry</h3>
      <p className="text-sm text-slate-500 mb-8">
        Official channel for Maltese regulatory authorities and legal representatives. 
        Submissions are logged in the audit trail.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Representative Name</label>
            <input
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organization / Agency</label>
            <input
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Identità Malta"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inquiry Classification</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="regulatory">Regulatory Inquiry (Identità/DIER)</option>
            <option value="gdpr">Data Subject Request (GDPR)</option>
            <option value="legal">Legal/Contractual Matter</option>
            <option value="audit">Audit Log Request</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brief Message / Context</label>
          <textarea
            required
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Please provide details regarding your inquiry..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
        >
          Initialize Secure Transmission
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ComplianceInquiryForm;
