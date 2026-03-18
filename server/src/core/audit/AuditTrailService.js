import crypto from 'node:crypto';
import { db } from '../database.js';
export class AuditTrailService {
    /**
     * Generates a tamper-proof log for every major state change.
     * DIER-Standard 2026.
     */
    static async logEvent(type, metadata) {
        const salt = process.env.DIER_SALT || 'default-aura-salt-2026';
        const timestamp = new Date();
        const signature = crypto
            .createHmac('sha256', salt)
            .update(`${type}-${JSON.stringify(metadata)}-${timestamp.toISOString()}`)
            .digest('hex');
        await db.auditLog.create({
            data: {
                eventType: type,
                details: JSON.stringify(metadata),
                signature: signature,
                timestamp: timestamp
            }
        });
        console.log(`[AURA_AUDIT] Event Logged: ${type} | Signature: ${signature.substring(0, 12)}...`);
    }
}
//# sourceMappingURL=AuditTrailService.js.map