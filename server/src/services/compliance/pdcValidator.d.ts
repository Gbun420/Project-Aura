/**
 * AURA_OS: PDC GATE VALIDATOR v1.0
 * Mandatory 42-day validation logic for March 2026 Identità standards.
 */
export declare const PDC_CONFIG: {
    VALIDITY_DAYS: number;
    MANDATORY_AS_OF: string;
};
export declare class PDCValidator {
    static checkCompliance(certificateDate: string): {
        status: 'VALID' | 'EXPIRED' | 'CRITICAL';
        daysLeft: number;
    };
}
//# sourceMappingURL=pdcValidator.d.ts.map