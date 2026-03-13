import * as crypto from 'crypto';

/**
 * AURA_OS: SOVEREIGN DATA VAULT v1.0
 * Zero-Trust AES-256-GCM encryption for candidate career DNA.
 */

export class SovereignVault {
  private static algorithm = 'aes-256-gcm';
  private static masterKey = process.env.AURA_MASTER_KEY || 'AURA_MASTER_NEBULA_KEY_2026_CORE';

  /**
   * Encrypts candidate payload before it touches SQLite.
   */
  static sealManifest(candidateData: any): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.masterKey, 'salt', 32);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as crypto.CipherGCM;
    
    let encrypted = cipher.update(JSON.stringify(candidateData), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Returns compound string: useless to attackers without key
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypts the manifest locally for the authorized employer.
   */
  static unsealManifest(sealedData: string): any {
    const [ivHex, authTagHex, encryptedHex] = sealedData.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('INVALID_SEALED_DATA');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = crypto.scryptSync(this.masterKey, 'salt', 32);
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}
