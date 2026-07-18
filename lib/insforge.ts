import { createClient } from "@insforge/sdk";

export type PaceGuardEventType = "plan.approved" | "checkin.created" | "checkin.requested";

export interface PaceGuardEvent {
  id?: string;
  team_id: string;
  athlete_id: string;
  event_type: PaceGuardEventType;
  actor_role: "coach" | "athlete";
  payload: Record<string, unknown>;
  consent_scope: string;
  created_at?: string;
}

const baseUrl = process.env.INSFORGE_BASE_URL ?? process.env.NEXT_PUBLIC_INSFORGE_BASE_URL;
const anonKey = process.env.INSFORGE_ANON_KEY ?? process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

export const isInsForgeConfigured = () => Boolean(baseUrl && anonKey);

function getInsForgeClient() {
  if (!baseUrl || !anonKey) throw new Error("InsForge is not configured.");
  return createClient({ baseUrl, anonKey });
}

export async function createPaceGuardEvent(event: PaceGuardEvent) {
  const client = getInsForgeClient();
  const { data, error } = await client.database.from("paceguard_events").insert(event).select().single();
  if (error) throw error;
  return data as PaceGuardEvent;
}

export async function getLatestPaceGuardEvents(teamId: string, athleteId?: string) {
  const client = getInsForgeClient();
  let query = client.database.from("paceguard_events").select("*").eq("team_id", teamId);
  if (athleteId) query = query.eq("athlete_id", athleteId);
  const { data, error } = await query.order("created_at", { ascending: false }).limit(30);
  if (error) throw error;
  return (data ?? []) as PaceGuardEvent[];
}
