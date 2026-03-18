/**
 * AURA_OS: COMPETENT PERSON SERVICE v1.0
 * Automated verification for DIER License Compliance (Legal Notice 270 of 2023).
 */
export class CompetentPersonService {
    /**
     * Verifies if a profile meets the 'Competent Person' criteria
     * defined by the Department for Industrial and Employment Relations (DIER).
     */
    static verifyEligibility(profile) {
        const violations = [];
        // 1. Academic Qualification Gate (MQF Level 6 = Bachelor's Degree)
        if (profile.mqfLevel < 6) {
            violations.push("MQF_LEVEL_INSUFFICIENT: Minimum Level 6 (Degree) required.");
        }
        // 2. Professional Experience Gate (3 Years in HR/Recruitment)
        if (profile.yearsExperience < 3) {
            violations.push("EXPERIENCE_INSUFFICIENT: Minimum 3 years documented HR experience required.");
        }
        // 3. Police Conduct Gate (Real-time Malta Police API Simulation)
        if (!profile.hasCleanConduct) {
            violations.push("CONDUCT_REFUSED: Clean Police Conduct (Form A) is mandatory.");
        }
        const isEligible = violations.length === 0;
        return {
            isEligible,
            violations,
            licensePath: isEligible ? 'STANDARD' : 'DENIED'
        };
    }
    /**
     * Generates the DIER Manifest for license submission.
     */
    static generateDIERManifest(profile) {
        const eligibility = this.verifyEligibility(profile);
        if (!eligibility.isEligible) {
            throw new Error(`MANIFEST_FAILED: ${eligibility.violations.join(', ')}`);
        }
        return {
            documentType: 'DIER_COMPETENT_PERSON_DECLARATION',
            timestamp: new Date().toISOString(),
            authorizedSignatory: profile.fullName,
            status: 'READY_FOR_SUBMISSION',
            bankGuaranteeRef: 'AURA-BSTART-20K-PENDING'
        };
    }
}
//# sourceMappingURL=CompetentPersonService.js.map