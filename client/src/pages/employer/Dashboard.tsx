import JobPostingForm from '../../components/employer/JobPostingForm';

const POSTINGS = [
  { role: 'Senior Compliance Officer', applicants: 18, status: 'Open', updated: 'Today' },
  { role: 'Talent Acquisition Lead', applicants: 9, status: 'Shortlisting', updated: 'Yesterday' },
  { role: 'HR Operations Specialist', applicants: 22, status: 'Interviewing', updated: '3 days ago' },
];

const PIPELINE = [
  { stage: 'Applied', count: 48 },
  { stage: 'Screened', count: 22 },
  { stage: 'Interview', count: 9 },
  { stage: 'Offer', count: 3 },
];

export default function EmployerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-400">Aura Hiring Suite</p>
        <h2 className="text-2xl font-semibold text-white">Employer Dashboard</h2>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Roles', value: '6' },
          { label: 'Active Applicants', value: '72' },
          { label: 'Avg. Time to Hire', value: '11 days' },
          { label: 'Gemini Match Rate', value: '87%' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Job Postings</h3>
          <div className="mt-4 space-y-3">
            {POSTINGS.map(post => (
              <div key={post.role} className="rounded-2xl border border-white/10 bg-[#0B0D11]/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{post.role}</p>
                    <p className="text-xs text-slate-400">{post.applicants} applicants</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{post.status}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Updated {post.updated}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Applicant Flow</h3>
          <div className="mt-4 space-y-3">
            {PIPELINE.map(step => (
              <div key={step.stage} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0B0D11]/80 px-4 py-3">
                <p className="text-sm text-slate-300">{step.stage}</p>
                <span className="text-sm font-semibold text-white">{step.count}</span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] px-4 py-2 text-sm font-semibold text-white">
            Review Pipeline
          </button>
        </div>
      </div>

      <JobPostingForm />
    </div>
  );
}
