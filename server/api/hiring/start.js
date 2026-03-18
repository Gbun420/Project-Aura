import { db } from "../../src/core/database.js";
import { BountyGuardian } from "../../src/core/ledger/BountyGuardian.js";
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
        const signature = await BountyGuardian.logHandshake(db, auth.user.id, candidateId);
        return res.status(200).json({ success: true, hash: signature });
    }
    catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=start.js.map