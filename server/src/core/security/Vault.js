import * as crypto from 'crypto';
/**
 * AURA_OS: SOVEREIGN DATA VAULT v2.0
 * Zero-Trust AES-256-GCM encryption for candidate career DNA.
 *
 * SECURITY CHANGELOG (v2.0):
 * - Removed hardcoded fallback master key (fails explicitly if env var missing)
 * - Uses unique random salt per encryption instead of static 'salt'
 * - Salt is stored alongside ciphertext for decryption
 */
export class SovereignVault {
    static algorithm = 'aes-256-gcm';
    static getMasterKey() {
        const key = process.env.AURA_MASTER_KEY;
        if (!key) {
            throw new Error('VAULT_FATAL: AURA_MASTER_KEY environment variable is not set. Cannot proceed with encryption.');
        }
        return key;
    }
    /**
     * Encrypts candidate payload before it touches the database.
     * Format: salt:iv:authTag:encrypted
     */
    static sealManifest(candidateData) {
        const masterKey = this.getMasterKey();
        const salt = crypto.randomBytes(16); // Unique salt per encryption
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(masterKey, salt, 32);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(JSON.stringify(candidateData), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        // Returns compound string: salt:iv:authTag:encrypted
        return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`;
    }
    /**
     * Decrypts the manifest locally for the authorized employer.
     */
    static unsealManifest(sealedData) {
        const masterKey = this.getMasterKey();
        const [saltHex, ivHex, authTagHex, encryptedHex] = sealedData.split(':');
        if (!saltHex || !ivHex || !authTagHex || !encryptedHex) {
            throw new Error('INVALID_SEALED_DATA');
        }
        const salt = Buffer.from(saltHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const key = crypto.scryptSync(masterKey, salt, 32);
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
}
//# sourceMappingURL=Vault.js.map