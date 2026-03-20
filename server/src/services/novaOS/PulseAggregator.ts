import admin from 'firebase-admin';

/**
 * NOVA_OS: PULSE AGGREGATOR v1.0
 * Aggregates real-time compliance metrics and revenue risk for the Employer Dashboard.
 */

export class PulseAggregator {
  /**
   * Aggregates real-time compliance metrics for the Employer Dashboard.
   */
  static async getEmployerPulse(db: any, employerId: string) {
    const firestore = admin.firestore();

    const introSnap = await firestore.collection('introduction_ledger')
      .where('employerId', '==', employerId)
      .where('feeStatus', 'in', ['PENDING', 'RELEASED'])
      .get();

    const results = await Promise.all(introSnap.docs.map(async (doc) => {
      const intro = doc.data();
      // Fetching real candidate data 
      const candidateSnap = await firestore.collection('candidate_profiles').doc(intro.candidateId).get();
      const candidate = candidateSnap.exists ? candidateSnap.data() : null;
      
      const candidateName = candidate ? `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() : 'Unknown Candidate';
      const pdcExpiry = candidate?.pdcExpiryDate || intro.expiryDate;

      const daysRemaining = this.calculateRemainingDays(pdcExpiry);
      return {
        candidateId: intro.candidateId,
        candidateName: candidateName || 'Unknown Candidate',
        status: intro.feeStatus,
        pdcClock: daysRemaining,
        riskLevel: daysRemaining < 7 ? 'CRITICAL' : 'STABLE',
        revenuePotential: intro.feeStatus === 'RELEASED' ? 0 : 5000 // Standard 2026 Success Fee
      };
    }));

    return results;
  }

  private static calculateRemainingDays(expiry: Date | string): number {
    if (!expiry) return 0;
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
