export type Sector = 'iGaming' | 'Fintech' | 'Healthcare' | 'GreenEnergy' | 'Aviation';

export type NovaRole = 'admin' | 'employer' | 'candidate' | 'platform_owner';

export interface Job {
  id: string;
  sector: Sector;
  title: string;
  company: string;
  salary_range: string;
  location: string;
  nova_req: string[];
  permit_type: 'KEI' | 'SinglePermit' | 'EUBlueCard';
  velocity_score: number;
  isApplied?: boolean;
  isGoldenManifest?: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: 'COMPLIANCE' | 'TECH' | 'CULTURE';
  text: string;
  expectedKeywords: string[];
}

export interface PermitData {
  permitId: string;
  expiry: string;
  conditions: string;
  issuedDate: string;
}
