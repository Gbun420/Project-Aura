import { db } from "../../src/core/database.js";
import { AuditExportService } from "../../src/services/auraOS/AuditExportService.js";
import { requireUser } from "../_lib/auth.js";
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }
    const auth = await requireUser(req);
    if ("error" in auth) {
        return res.status(auth.error.status).json({ error: auth.error.message });
    }
    try {
        const auditLog = await AuditExportService.generateAuditLog(db, auth.user.id);
        return res.status(200).json({ success: true, auditLog });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
//# sourceMappingURL=audit.js.map