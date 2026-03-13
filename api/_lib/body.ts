import type { VercelRequest } from "@vercel/node";

export function getJsonBody(req: VercelRequest) {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
}

