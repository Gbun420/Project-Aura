export declare class AuditTrailService {
    /**
     * Generates a tamper-proof log for every major state change.
     * DIER-Standard 2026.
     */
    static logEvent(type: 'HANDSHAKE' | 'RELEASE' | 'EXPORT', metadata: any): Promise<void>;
}
//# sourceMappingURL=AuditTrailService.d.ts.map