import crypto from 'crypto';

/**
 * Anonymizes a candidate's profile for non-pro employers.
 * @param {any} candidate - The candidate profile object
 * @param {boolean} isPro - Whether the employer has a pro subscription
 * @param {string} employerId - The ID of the employer viewing the profile
 */
export const anonymizeCandidate = (candidate: any, isPro: boolean, employerId: string) => {
  if (isPro) return candidate;

  const salt = process.env.ANONYMIZATION_SALT || 'AURA_DEFAULT_SALT_2026';
  
  // Deterministic but non-reversible ID generation
  const hash = crypto
    .createHash('sha256')
    .update(candidate.id + employerId + salt)
    .digest('hex')
    .slice(0, 8)
    .toUpperCase();

  return {
    ...candidate,
    id: `aura_${hash}`, // Obfuscated ID prevents cross-referencing
    full_name: `Aura Candidate ${hash}`,
    email: null,
    phone: null,
    // Provide a snippet only
    resume_text: candidate.resume_text ? candidate.resume_text.slice(0, 200) + "..." : "Unlock Pro to view verified resume history.",
    // Compliance status remains visible as a value signal
    compliance_status: candidate.tcn_status,
    _metadata: {
      blurred: true,
      upgrade_prompt: "PIONEER_OFFER: Subscribe to Pulse Pro for €29/mo (was €49) to unlock direct contact",
      match_quality: candidate.match_score 
    }
  };
};
