import { NextResponse } from "next/server";
import { getProviderAuthorizationUrl, integrationProviders, normalizedDemoEvents, type IntegrationProviderId } from "@/lib/integrations";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ providers: integrationProviders, events: normalizedDemoEvents, mode: "fictional-demo" });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { action?: string; provider?: IntegrationProviderId };
  if (body.action === "sync") {
    return NextResponse.json({ synced: normalizedDemoEvents.length, deduplicated: 1, events: normalizedDemoEvents, completedAt: new Date().toISOString(), mode: "fictional-demo" });
  }
  if (body.action === "connect" && body.provider) {
    const origin = new URL(request.url).origin;
    const authorizationUrl = getProviderAuthorizationUrl(body.provider, origin);
    return NextResponse.json({ provider: body.provider, authorizationUrl, mode: authorizationUrl ? "oauth-ready" : "fictional-demo", requiresNativeBridge: body.provider === "apple-health" || body.provider === "health-connect" });
  }
  if (body.action === "disconnect" && body.provider) {
    return NextResponse.json({ provider: body.provider, disconnected: true, importedDataRetained: false, mode: "fictional-demo" });
  }
  return NextResponse.json({ error: "Unsupported integration action." }, { status: 400 });
}
