export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    }
    return res.status(200).json({
        status: "AURA_CORE_ONLINE",
        timestamp: new Date().toISOString(),
    });
}
//# sourceMappingURL=health.js.map