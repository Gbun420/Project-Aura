import ContactCompliance from '../../components/ContactCompliance';
import ComplianceInquiryForm from '../../components/ComplianceInquiryForm';
import ComplianceDashboard from '../../components/admin/ComplianceDashboard';

export default function AdminAudit() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-400">Nova Command</p>
        <h2 className="text-2xl font-semibold text-white">Compliance Audit</h2>
      </div>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-8">
          <ComplianceDashboard />
          <ContactCompliance />
        </div>

        <div className="space-y-8">
          <ComplianceInquiryForm />

          <div className="rounded-3xl nova-glass-card p-6 glow-uv">
            <h4 className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-[0.2em] mb-4">Quick Links</h4>
            <ul className="space-y-4 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer flex justify-between group">
                <span>Identità Portal</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </li>
              <li className="hover:text-white cursor-pointer flex justify-between group">
                <span>DIER Regulation Guide</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </li>
              <li className="hover:text-white cursor-pointer flex justify-between group">
                <span>GDPR Framework 2026</span>
                <span className="group-hover:translate-x-1 transition-transform">↗</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
