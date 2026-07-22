import { createHash } from "node:crypto";
import { getChatGPTUser } from "../../chatgpt-auth";
export async function GET() { const user = await getChatGPTUser(); if (!user) return Response.json({ authenticated: false, role: "participant" }, { status: 401 }); return Response.json({ authenticated: true, displayName: user.displayName, subjectId: createHash("sha256").update(user.email.toLowerCase()).digest("hex"), role: "product-owner", authoritySource: "Sites custom owner-only access policy" }, { headers: { "Cache-Control": "no-store" } }); }
