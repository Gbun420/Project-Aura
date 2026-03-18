/**
 * AURA_OS: GOLDEN MANIFEST GENERATOR v1.0
 * Compiles encrypted structured data packets for employer-paid releases.
 */
export declare class ManifestGenerator {
    /**
     * Compiles the "Golden Manifest" only after the Bounty Guardian
     * has successfully logged the introduction.
     */
    static generate(db: any, candidateId: string, employerId: string): Promise<{
        manifestId: string;
        timestamp: string;
        payload: {
            personalInfo: any;
            pdcCompliance: {
                ref: any;
                expiry: any;
                status: string;
            };
        };
        handshakeHash: any;
    }>;
}
//# sourceMappingURL=ManifestGenerator.d.ts.map