import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recordVisit } from "~/server/analytics/site-visits";

const VISITOR_COOKIE = "mh_visitor_id";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const existingVisitor = cookieStore.get(VISITOR_COOKIE)?.value;

  const visitorId = existingVisitor ?? randomUUID();
  const payload = (await request.json().catch(() => ({}))) as { path?: string };
  const path = typeof payload.path === "string" && payload.path.length > 0 ? payload.path : "/";

  recordVisit(path, visitorId);

  if (!existingVisitor) {
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return NextResponse.json({ ok: true });
}
