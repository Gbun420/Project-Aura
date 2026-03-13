export function getJsonBody<T = unknown>(req: any): T | null {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as T;
    } catch {
      return null;
    }
  }
  return req.body as T;
}
