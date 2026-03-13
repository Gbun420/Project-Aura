/**
 * AURA_OS: COMPLIANCE ENGINE v1.0
 * Hard-coded regulatory gates for 2026 DIER/Identità standards.
 */

export interface CandidateRecord {
  pdcExpiryDate: string;
  hasMQFLevel6: boolean;
}

export class ComplianceEngine {
  /**
   * Validates transaction against mandatory 2026 timelines.
   */
  static validateTransaction(candidate: CandidateRecord): boolean {
    const now = new Date();
    const pdcExpiry = new Date(candidate.pdcExpiryDate);
    const diff = pdcExpiry.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diff / (1000 * 3600 * 24));

    if (daysRemaining <= 0) {
      throw new Error("DIER_COMPLIANCE_LOCK: Candidate PDC has expired. Introduction invalid.");
    }
    
    // Validates Competent Person status for the agency license
    if (!candidate.hasMQFLevel6) {
       throw new Error("DIER_COMPLIANCE_LOCK: MQF Level 6 verification failed for specialized role.");
    }

    return true;
  }
}
