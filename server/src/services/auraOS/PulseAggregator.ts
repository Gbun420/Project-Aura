/**
 * AURA_OS: PULSE AGGREGATOR v1.0
 * Aggregates real-time compliance metrics and revenue risk for the Employer Dashboard.
 */

export class PulseAggregator {
  /**
   * Aggregates real-time compliance metrics for the Employer Dashboard.
   */
  static async getEmployerPulse(db: any, employerId: string) {
    const activeIntroductions = await db.introductionLedger.findMany({
      where: {
        employerId: employerId,
        feeStatus: { in: ['PENDING', 'RELEASED'] }
      }
    });

    const results = await Promise.all(activeIntroductions.map(async (intro: any) => {
      // Fetching real candidate data 
      const candidate = await db.candidateProfile.findUnique({ where: { id: intro.candidateId } });
      const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown Candidate';
      const pdcExpiry = candidate?.pdcExpiryDate || intro.expiryDate;

      const daysRemaining = this.calculateRemainingDays(pdcExpiry);
      return {
        candidateId: intro.candidateId,
        candidateName: candidateName,
        status: intro.feeStatus,
        pdcClock: daysRemaining,
        riskLevel: daysRemaining < 7 ? 'CRITICAL' : 'STABLE',
        revenuePotential: intro.feeStatus === 'RELEASED' ? 0 : 5000 // Standard 2026 Success Fee
      };
    }));

    return results;
  }

  private static calculateRemainingDays(expiry: Date | string): number {
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
