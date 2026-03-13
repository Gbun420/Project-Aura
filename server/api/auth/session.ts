import { requireUser } from "../_lib/auth.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  const auth = await requireUser(req);
  if ("error" in auth) {
    return res.status(auth.error.status).json({ error: auth.error.message });
  }

  return res.status(200).json({
    status: "AUTHORIZED",
    userId: auth.user.id,
  });
}
