import { NextResponse } from "next/server";
import { encodeSession, SESSION_COOKIE, type AppRole, type DemoSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { role?: AppRole };
  const role = body.role === "athlete" ? "athlete" : "coach";
  const session: DemoSession = role === "athlete"
    ? { role, userId: "athlete-maya", athleteId: "maya-chen", name: "Maya Chen" }
    : { role, userId: "coach-alex", name: "Alex Morgan" };
  const response = NextResponse.json({ session, redirectTo: role === "athlete" ? "/athlete/maya-chen" : "/?workspace=coach" });
  response.cookies.set(SESSION_COOKIE, encodeSession(session), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ signedOut: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
