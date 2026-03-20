import { adminAuth } from "./firebase-admin.js";
import type { VercelRequest } from "@vercel/node";

export async function requireUser(req: VercelRequest) {
  const authHeader = (req.headers.authorization as string) || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token) {
    return {
      error: {
        status: 401,
        message: "UNAUTHORIZED_ACCESS: Credentials Required.",
      },
    };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { user: { id: decodedToken.uid } };
  } catch (error: any) {
    console.error("AUTH_VERIFICATION_FAILED:", error.message);
    return {
      error: {
        status: 401,
        message: "UNAUTHORIZED_ACCESS: Invalid or Expired Token.",
        detail: error.message
      },
    };
  }
}

