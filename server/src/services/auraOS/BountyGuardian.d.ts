/**
 * AURA_OS: BOUNTY GUARDIAN v1.0
 * Legally-binding Proof of Introduction for the Maltese Industrial Tribunal.
 */
export declare class BountyGuardian {
    /**
     * Generates a legally-binding 'Proof of Introduction'
     * Triggered when an employer views a full profile.
     */
    static issueIntroductionCertificate(candidateId: string, employerId: string): Promise<{
        hash: string;
        candidateId: string;
        employerId: string;
        notifiedAt: Date;
        expiryDate: Date;
    }>;
    /**
     * Production-Ready: The "Backdoor" Detector
     * Cross-references candidates with active introductions.
     */
    static runShadowAudit(activeIntroductions: any[]): Promise<void>;
}
//# sourceMappingURL=BountyGuardian.d.ts.map