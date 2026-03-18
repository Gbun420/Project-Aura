/**
 * AURA_OS: COMPLIANCE ENGINE v1.0
 * Hard-coded regulatory gates for 2026 DIER/Identità standards.
 */
export interface CandidateRecord {
    pdcExpiryDate: string;
    hasMQFLevel6: boolean;
}
export declare class ComplianceEngine {
    /**
     * Validates transaction against mandatory 2026 timelines.
     */
    static validateTransaction(candidate: CandidateRecord): boolean;
}
//# sourceMappingURL=ComplianceEngine.d.ts.map