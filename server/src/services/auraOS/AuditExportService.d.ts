/**
 * AURA_OS: AUDIT EXPORT SERVICE v1.0
 * Generates high-integrity regulatory logs for DIER/Identità compliance audits.
 */
export declare class AuditExportService {
    /**
     * Aggregates all handshake and manifest release data for an employer.
     */
    static generateAuditLog(db: any, employerId: string): Promise<{
        employerId: string;
        exportedAt: string;
        recordCount: any;
        integrityHash: string;
        records: any;
    }>;
}
//# sourceMappingURL=AuditExportService.d.ts.map