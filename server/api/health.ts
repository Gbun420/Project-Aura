export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  return res.status(200).json({
    status: "NOVA_CORE_ONLINE",
    timestamp: new Date().toISOString(),
  });
}
