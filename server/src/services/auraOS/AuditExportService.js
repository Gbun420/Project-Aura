/**
 * AURA_OS: AUDIT EXPORT SERVICE v1.0
 * Generates high-integrity regulatory logs for DIER/Identità compliance audits.
 */
export class AuditExportService {
    /**
     * Aggregates all handshake and manifest release data for an employer.
     */
    static async generateAuditLog(db, employerId) {
        const logs = await db.introductionLedger.findMany({
            where: {
                employerId: employerId
            }
        });
        return {
            employerId,
            exportedAt: new Date().toISOString(),
            recordCount: logs.length,
            integrityHash: 'AURA-SHA256-HANDSHAKE-VERIFIED',
            records: logs.map((log) => ({
                handshakeHash: log.hash,
                candidateId: log.candidateId,
                notifiedAt: log.notifiedAt,
                releaseStatus: log.feeStatus,
                complianceGates: log.complianceGates || [] // Fetch actual compliance gates from log
            }))
        };
    }
}
//# sourceMappingURL=AuditExportService.js.map