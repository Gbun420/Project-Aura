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

    return activeIntroductions.map((intro: any) => {
      // Mocking candidate data for prototype as per original
      const mockCandidateName = intro.candidateId === 'CAND-MARCO-ROSSI' ? 'Marco Rossi' : 'Sarah Zammit';
      const mockPdcExpiry = intro.candidateId === 'CAND-MARCO-ROSSI' ? intro.expiryDate : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const daysRemaining = this.calculateRemainingDays(mockPdcExpiry);
      return {
        candidateId: intro.candidateId,
        candidateName: mockCandidateName,
        status: intro.feeStatus,
        pdcClock: daysRemaining,
        riskLevel: daysRemaining < 7 ? 'CRITICAL' : 'STABLE',
        revenuePotential: intro.feeStatus === 'RELEASED' ? 0 : 5000 // Standard 2026 Success Fee
      };
    });
  }

  private static calculateRemainingDays(expiry: Date | string): number {
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
