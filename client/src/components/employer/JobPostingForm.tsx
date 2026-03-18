import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldCheck } from 'lucide-react';

type ComplianceAnalysis = {
  score: number;
  flags: string[];
};

const scoreTone = (score: number) => {
  if (score >= 85) return 'text-emerald-300';
  if (score >= 70) return 'text-amber-300';
  return 'text-rose-300';
};

export default function JobPostingForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Compliance State
  const [requiresTCN, setRequiresTCN] = useState(false);
  const [labourMarketTest, setLabourMarketTest] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [regulatoryAck, setRegulatoryAck] = useState(false);

  const [analysis, setAnalysis] = useState<ComplianceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const runComplianceCheck = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    setNotice(null);
    try {
      const response = await fetch('/api/ai/neural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ANALYZE_COMPLIANCE',
          type: 'JOB_DESCRIPTION',
          content: { title, description },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Compliance check failed');
      }

      const score = Number(data?.score ?? 0);
      const flags = Array.isArray(data?.flags) ? data.flags : [];
      setAnalysis({ score, flags });
    } catch (error) {
      setAnalysis(null);
      setNotice(error instanceof Error ? error.message : 'Compliance check failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const publishVacancy = async () => {
    setNotice(null);
    
    // Compliance Validation
    if (!gdprConsent || !regulatoryAck) {
      setNotice('Compliance declarations must be accepted before publishing.');
      return;
    }
    if (requiresTCN && !labourMarketTest) {
      setNotice('Maltese Labour Market Test is required for TCN vacancies.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/hiring/hub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'CREATE_VACANCY',
          title,
          description,
          complianceScore: analysis?.score ?? 0,
          requiresTCN,
          complianceMeta: {
            labourMarketTest,
            gdprConsent,
            regulatoryAck
          }
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to publish vacancy');
      }

      setTitle('');
      setDescription('');
      setAnalysis(null);
      setRequiresTCN(false);
      setLabourMarketTest(false);
      setGdprConsent(false);
      setRegulatoryAck(false);
      setNotice('Vacancy published to Aura Network.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to publish vacancy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Aura Hiring Suite</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">New Vacancy</h3>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0B0D11]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Detailed Description</label>
          <textarea
            rows={8}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#0B0D11]/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/40"
            placeholder="Describe the role, requirements, and benefits..."
          />
        </div>

        {/* Compliance Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-[#2563EB]" size={18} />
            <span className="text-xs font-bold uppercase tracking-widest text-white">Regulatory Compliance (Malta 2026)</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-black/20 cursor-pointer hover:bg-black/40 transition">
              <input 
                type="checkbox" 
                checked={requiresTCN}
                onChange={(e) => setRequiresTCN(e.target.checked)}
                className="mt-1 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/40"
              />
              <div>
                <span className="block text-sm font-semibold text-white">Open to Third Country Nationals (TCN)?</span>
                <span className="text-xs text-slate-400">Triggers Identità Skills Pass verification workflow.</span>
              </div>
            </label>

            {requiresTCN && (
              <label className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={labourMarketTest}
                  onChange={(e) => setLabourMarketTest(e.target.checked)}
                  className="mt-1 rounded border-amber-600 bg-slate-800 text-amber-500 focus:ring-amber-500/40"
                />
                <div>
                  <span className="block text-sm font-semibold text-amber-100">Confirm Labour Market Test</span>
                  <span className="text-xs text-amber-200/80">I certify that no suitable EU/EEA candidate was found for this role (Jobsplus requirement).</span>
                </div>
              </label>
            )}

            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800"
                />
                I confirm this posting complies with GDPR Article 13/14 transparency requirements.
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={regulatoryAck}
                  onChange={(e) => setRegulatoryAck(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800"
                />
                I acknowledge compliance with Employment Agencies Regulations 2023.
              </label>
            </div>
          </div>
        </div>

        {notice && (
          <div className={`rounded-2xl border ${notice.includes('published') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/30 bg-rose-500/10 text-rose-200'} px-4 py-3 text-sm`}>
            {notice}
          </div>
        )}

        <button
          onClick={publishVacancy}
          disabled={isSubmitting || !title.trim() || !description.trim()}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Verifying & Publishing…' : 'Publish Vacancy'}
        </button>
      </div>

      <div className="rounded-3xl bg-[#0F1114] border border-white/10 p-6 text-white h-fit sticky top-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B72CB]">
            Compliance_Guard_v1
          </h4>
          <div className={`h-2 w-2 rounded-full ${isAnalyzing ? 'bg-[#9B72CB] animate-ping' : 'bg-emerald-400'}`} />
        </div>

        <button
          onClick={runComplianceCheck}
          disabled={!description.trim() || isAnalyzing}
          className="w-full mb-6 py-3 border border-white/10 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase hover:bg-white/5 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing Core…' : 'Run Compliance Check'}
        </button>

        {analysis && (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Safety Score</p>
              <div className={`text-3xl font-semibold bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent`}>
                {analysis.score}%
              </div>
              <p className={`mt-2 text-xs ${scoreTone(analysis.score)}`}>
                {analysis.score >= 85 ? 'Ready to publish.' : analysis.score >= 70 ? 'Review flagged language.' : 'High risk content detected.'}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {analysis.flags.length === 0 ? (
                <li className="text-emerald-300">No compliance risks detected.</li>
              ) : (
                analysis.flags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#D96570]">⚠</span>
                    <span>{flag}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
