import React from 'react';
import { ShieldCheck } from 'lucide-react';

type ComplianceBadgeProps = {
  type?: 'identita' | 'gdpr' | 'dier';
  size?: 'sm' | 'md';
};

const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ type = 'identita', size = 'sm' }) => {
  const content = {
    identita: { label: 'Identità Ready', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    gdpr: { label: 'GDPR Secured', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    dier: { label: 'DIER Compliant', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  };

  const selected = content[type];
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${selected.color} ${sizeClasses} font-bold uppercase tracking-wider`}>
      <ShieldCheck size={size === 'sm' ? 12 : 14} />
      <span>{selected.label}</span>
    </div>
  );
};

export default ComplianceBadge;
