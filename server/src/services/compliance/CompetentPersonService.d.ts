/**
 * AURA_OS: COMPETENT PERSON SERVICE v1.0
 * Automated verification for DIER License Compliance (Legal Notice 270 of 2023).
 */
export interface CompetentPersonProfile {
    fullName: string;
    mqfLevel: number;
    yearsExperience: number;
    hasCleanConduct: boolean;
    conductExpiry?: string;
}
export declare class CompetentPersonService {
    /**
     * Verifies if a profile meets the 'Competent Person' criteria
     * defined by the Department for Industrial and Employment Relations (DIER).
     */
    static verifyEligibility(profile: CompetentPersonProfile): {
        isEligible: boolean;
        violations: string[];
        licensePath: 'STANDARD' | 'PROVISIONAL' | 'DENIED';
    };
    /**
     * Generates the DIER Manifest for license submission.
     */
    static generateDIERManifest(profile: CompetentPersonProfile): {
        documentType: string;
        timestamp: string;
        authorizedSignatory: string;
        status: string;
        bankGuaranteeRef: string;
    };
}
//# sourceMappingURL=CompetentPersonService.d.ts.map