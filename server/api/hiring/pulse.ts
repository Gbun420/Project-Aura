import { db } from "../../src/core/database.js";
import { PulseAggregator } from "../../src/services/auraOS/PulseAggregator.js";
import { requireUser } from "../_lib/auth.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const auth = await requireUser(req);
  if ("error" in auth) {
    return res.status(auth.error.status).json({ error: auth.error.message });
  }

  try {
    const pulseData = await PulseAggregator.getEmployerPulse(db, auth.user.id);
    return res.status(200).json({ success: true, pulseData });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
