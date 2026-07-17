import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/session";

export async function GET() {
  const store = await cookies();
  return NextResponse.json({ session: decodeSession(store.get(SESSION_COOKIE)?.value) });
}
