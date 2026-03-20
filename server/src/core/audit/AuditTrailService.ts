import crypto from 'node:crypto';
import admin from 'firebase-admin';

export class AuditTrailService {
  /**
   * Generates a tamper-proof log for every major state change.
   * DIER-Standard 2026.
   */
  static async logEvent(type: 'HANDSHAKE' | 'RELEASE' | 'EXPORT', metadata: any) {
    const salt = process.env.DIER_SALT || 'default-nova-salt-2026';
    const timestamp = new Date();
    const db = admin.firestore();
    
    const signature = crypto
      .createHmac('sha256', salt)
      .update(`${type}-${JSON.stringify(metadata)}-${timestamp.toISOString()}`)
      .digest('hex');

    await db.collection('audit_trails').add({
      action: type,
      details: metadata, // Store as object, not string, for better Firestore querying
      signature: signature,
      timestamp: timestamp.toISOString(),
      entity_type: 'SYSTEM' // Default for automated logs
    });
    
    console.log(`[NOVA_AUDIT] Event Logged: ${type} | Signature: ${signature.substring(0, 12)}...`);
  }
}
