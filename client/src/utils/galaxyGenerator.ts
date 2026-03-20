import type { Sector } from '../types/nova.js';

interface GalaxyNode {
  id: string;
  label: string;
  group: string;
  x: number;
  y: number;
}

export const generateGeneralNodes = (userSector: Sector): GalaxyNode[] => {
  const baseNodes: GalaxyNode[] = [
    { id: 'eng', label: 'English Proficiency', group: 'Core', x: 15, y: 40 },
    { id: 'pdc', label: 'Identità Pre-Departure', group: 'Compliance', x: 25, y: 20 }
  ];
  
  const sectorNodes: Record<string, GalaxyNode[]> = {
    Healthcare: [
      { id: 'h1', label: 'Maltese Health Standards', group: 'Medical', x: 50, y: 30 },
      { id: 'h2', label: 'Patient Diagnostics', group: 'Medical', x: 70, y: 50 },
      { id: 'h3', label: 'Emergency Protocol', group: 'Compliance', x: 80, y: 20 }
    ],
    Fintech: [
      { id: 'f1', label: 'MFSA Regulatory', group: 'Legal', x: 50, y: 30 },
      { id: 'f2', label: 'Real-time Wallet Sync', group: 'Tech', x: 70, y: 50 },
      { id: 'f3', label: 'Crypto-AML 2026', group: 'Compliance', x: 80, y: 20 }
    ],
    iGaming: [
      { id: 'i1', label: 'MGA Regulatory', group: 'Legal', x: 50, y: 30 },
      { id: 'i2', label: 'PAM Systems', group: 'Tech', x: 70, y: 50 },
      { id: 'i3', label: 'Responsible Gaming', group: 'Compliance', x: 80, y: 20 }
    ]
  };

  return [...baseNodes, ...(sectorNodes[userSector] || [])];
};
