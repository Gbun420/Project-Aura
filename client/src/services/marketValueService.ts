// AURA_MARKET_VALUE_SERVICE v1.0
// Real-time salary benchmarking for the 2026 Maltese ecosystem

export const calculateMarketValue = (nodes: string[], sector: string) => {
  // 2026 Base Rates (Sample)
  const baseRates: Record<string, number> = {
    'iGaming': 45000,
    'Fintech': 48000,
    'Healthcare': 38000,
    'GreenEnergy': 40000
  };

  // Node Multipliers (The "Aura Burn" value)
  const nodeValues: Record<string, number> = {
    'i1': 8000, // MGA_Compliance
    'f3': 12000, // Crypto-AML
    'h1': 5000, // Maltese_Health_Standards
    'eng': 3000, // English_Proficiency
    'pdc': 2000  // Identità_PDC
  };

  let total = baseRates[sector] || 35000;
  nodes.forEach(node => {
    if (nodeValues[node]) total += nodeValues[node];
  });

  return {
    annual: total,
    monthly: Math.floor(total / 12),
    percentile: 88, // Compared to other local talent
    trend: 'RISING'
  };
};
