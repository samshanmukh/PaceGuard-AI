import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { athleteId?: string; channel?: "email" | "sms" };
  if (!body.athleteId) return NextResponse.json({ error: "Athlete is required." }, { status: 400 });
  const origin = new URL(request.url).origin;
  return NextResponse.json({
    invitationId: `invite-${body.athleteId}`,
    channel: body.channel ?? "email",
    status: "ready",
    expiresIn: "48 hours",
    link: `${origin}/login?role=athlete&invite=${encodeURIComponent(body.athleteId)}`,
    delivery: process.env.RESEND_API_KEY ? "provider-ready" : "demo-copy-link",
  });
}
