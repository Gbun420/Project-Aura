/**
 * AURA_OS: SOVEREIGN DATA VAULT v2.0
 * Zero-Trust AES-256-GCM encryption for candidate career DNA.
 *
 * SECURITY CHANGELOG (v2.0):
 * - Removed hardcoded fallback master key (fails explicitly if env var missing)
 * - Uses unique random salt per encryption instead of static 'salt'
 * - Salt is stored alongside ciphertext for decryption
 */
export declare class SovereignVault {
    private static algorithm;
    private static getMasterKey;
    /**
     * Encrypts candidate payload before it touches the database.
     * Format: salt:iv:authTag:encrypted
     */
    static sealManifest(candidateData: any): string;
    /**
     * Decrypts the manifest locally for the authorized employer.
     */
    static unsealManifest(sealedData: string): any;
}
//# sourceMappingURL=Vault.d.ts.map