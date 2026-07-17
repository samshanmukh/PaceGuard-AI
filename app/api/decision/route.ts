import { NextResponse } from "next/server";
import { runPaceGuardWorkflow } from "@/lib/lyzr";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { athleteId?: string };
  if (body.athleteId && body.athleteId !== "maya-chen") {
    return NextResponse.json(
      { error: "No seeded decision workflow exists for this fictional athlete." },
      { status: 404 },
    );
  }

  return NextResponse.json(await runPaceGuardWorkflow());
}
