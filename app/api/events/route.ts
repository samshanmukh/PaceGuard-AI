import { NextResponse } from "next/server";
import { createPaceGuardEvent, getLatestPaceGuardEvents, isInsForgeConfigured, type PaceGuardEvent } from "@/lib/insforge";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isInsForgeConfigured()) return NextResponse.json({ configured: false, events: [] });
  const url = new URL(request.url);
  try {
    const events = await getLatestPaceGuardEvents(url.searchParams.get("teamId") ?? "bay-striders", url.searchParams.get("athleteId") ?? undefined);
    return NextResponse.json({ configured: true, events });
  } catch (error) {
    return NextResponse.json({ configured: true, error: error instanceof Error ? error.message : "InsForge query failed." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as PaceGuardEvent | null;
  if (!body || !body.athlete_id || !body.event_type || !body.actor_role) {
    return NextResponse.json({ error: "A valid PaceGuard event is required." }, { status: 400 });
  }
  if (!isInsForgeConfigured()) return NextResponse.json({ configured: false, event: { ...body, id: crypto.randomUUID(), created_at: new Date().toISOString() } });
  try {
    const event = await createPaceGuardEvent({ ...body, team_id: body.team_id || "bay-striders", consent_scope: body.consent_scope || "coach:read" });
    return NextResponse.json({ configured: true, event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ configured: true, error: error instanceof Error ? error.message : "InsForge insert failed." }, { status: 502 });
  }
}
