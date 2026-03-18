import { db } from "../../src/core/database.js";
import { ManifestGenerator } from "../../src/services/auraOS/ManifestGenerator.js";
import { SovereignVault } from "../../src/core/security/Vault.js";
import { AuditTrailService } from "../../src/core/audit/AuditTrailService.js";
import { requireUser } from "../_lib/auth.js";
import { getJsonBody } from "../_lib/body.js";
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }
    const auth = await requireUser(req);
    if ("error" in auth) {
        return res.status(auth.error.status).json({ error: auth.error.message });
    }
    const body = getJsonBody(req);
    const candidateId = body?.candidateId;
    if (!candidateId) {
        return res.status(400).json({ success: false, error: "MISSING_CANDIDATE" });
    }
    try {
        const update = await db.introductionLedger.updateMany({
            where: {
                candidateId: candidateId,
                employerId: auth.user.id,
                feeStatus: "LOCKED",
            },
            data: {
                feeStatus: "RELEASED",
            },
        });
        if (update.count === 0) {
            throw new Error("LEDGER_UPDATE_FAILED: No active introduction found.");
        }
        const rawManifest = await ManifestGenerator.generate(db, candidateId, auth.user.id);
        const sealedPayload = SovereignVault.sealManifest(rawManifest.payload);
        await AuditTrailService.logEvent("RELEASE", {
            candidateId,
            employerId: auth.user.id,
            manifestId: rawManifest.manifestId,
        });
        return res.status(200).json({
            success: true,
            manifest: { ...rawManifest, payload: sealedPayload },
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=finalize.js.map