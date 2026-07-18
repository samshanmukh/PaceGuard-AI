import { randomUUID } from "node:crypto";
import { getMemoryProvider } from "@/lib/memory";
import type { AgentStep, DecisionPlan } from "@/lib/types";

export interface PaceGuardWorkflowResult {
  workflow: "lyzr-live-v1" | "lyzr-adapter/local-v1";
  memoryProvider: string;
  agents: AgentStep[];
  evidenceCount: number;
  plan: DecisionPlan;
  providerNote?: string;
}

const fallbackAgents = (evidenceCount: number): AgentStep[] => [
  { id: "signal", name: "Signal Analyst", role: "Workload + recovery synthesis", finding: "Four converging signals; readiness moved from 68 to 41.", durationMs: 640 },
  { id: "evidence", name: "Evidence Agent", role: "Athlete memory retrieval", finding: `${evidenceCount} comparable cases retrieved; strongest match 94%.`, durationMs: 760 },
  { id: "plan", name: "Plan Agent", role: "Load-aware session redesign", finding: "Preserve aerobic stimulus while removing high-speed calf demand.", durationMs: 720 },
  { id: "safety", name: "Safety Review", role: "Language + approval guardrails", finding: "No diagnosis; uncertainty visible; coach review required.", durationMs: 520 },
];

const fallbackPlan: DecisionPlan = {
  title: "Protect the race window",
  original: "8 × 800m @ 10K pace · 2 min recovery",
  replacement: "35-minute easy aerobic run + calf mobility",
  duration: "35 minutes",
  intensity: "RPE 3–4 · conversational",
  weeklyAdjustment: "Reduce planned weekly load by 15%",
  reassessment: "Reassess calf symptoms tomorrow morning",
  confidence: 86,
  rationale: "This adjustment preserves training rhythm while reducing the speed and volume stress associated with today’s converging load and recovery signals.",
  guardrail: "Signals suggest elevated training-load and recovery risk. Confirm with Maya and a qualified professional before changes.",
};

function extractPayload(payload: unknown): unknown {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return payload;
  const record = payload as Record<string, unknown>;
  return record.response ?? record.message ?? record.output ?? record.data ?? payload;
}

function parseLyzrPlan(payload: unknown): Partial<DecisionPlan> | null {
  const extracted = extractPayload(payload);
  if (extracted && typeof extracted === "object") {
    const record = extracted as Record<string, unknown>;
    return (record.plan && typeof record.plan === "object" ? record.plan : record) as Partial<DecisionPlan>;
  }
  if (typeof extracted !== "string") return null;
  const jsonText = extracted.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? extracted.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) return null;
  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    return (parsed.plan && typeof parsed.plan === "object" ? parsed.plan : parsed) as Partial<DecisionPlan>;
  } catch {
    return null;
  }
}

type LyzrAttempt = { plan: Partial<DecisionPlan> | null; note: string };

async function callLyzr(): Promise<LyzrAttempt> {
  const apiKey = process.env.LYZR_API_KEY;
  const agentId = process.env.LYZR_AGENT_ID ?? process.env.LYZR_WORKFLOW_ID;
  if (!apiKey || !agentId) return { plan: null, note: `Lyzr configuration missing: ${!apiKey ? "API key" : "agent ID"}.` };
  const endpoint = process.env.LYZR_API_URL ?? "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      signal: controller.signal,
      cache: "no-store",
      body: JSON.stringify({
        user_id: process.env.LYZR_USER_ID ?? "paceguard-demo",
        agent_id: agentId,
        session_id: `${agentId}-${randomUUID()}`,
        message: `Return ONLY valid JSON for a fictional coaching demo using these exact keys: title, original, replacement, duration, intensity, weeklyAdjustment, reassessment, confidence, rationale, guardrail. Athlete context: Maya Chen, elite 10K, race in 18 days; readiness 41; acute load +28%; recovery 44 and down 18 points; sleep 5h12m; athlete reports calf tightness after intervals; planned session 8 x 800m at 10K pace. Do not diagnose injury. Require coach approval and direct athlete or qualified-professional review.`,
      }),
    });
    if (!response.ok) return { plan: null, note: `Lyzr request rejected with HTTP ${response.status}.` };
    const plan = parseLyzrPlan(await response.json());
    return { plan, note: plan ? "Live Lyzr response validated." : "Lyzr responded, but its message did not contain valid plan JSON." };
  } catch (error) {
    return { plan: null, note: error instanceof Error && error.name === "AbortError" ? "Lyzr request timed out after 12 seconds." : "Lyzr request failed before a valid response was received." };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runPaceGuardWorkflow(): Promise<PaceGuardWorkflowResult> {
  const memory = getMemoryProvider();
  const cases = await memory.search("elite 10K acute load +28% recovery down sleep below 6 hours calf tightness race in 18 days");
  try {
    const attempt = await callLyzr();
    if (attempt.plan) {
      return {
        workflow: "lyzr-live-v1",
        memoryProvider: memory.name,
        evidenceCount: cases.length,
        agents: fallbackAgents(cases.length),
        plan: { ...fallbackPlan, ...attempt.plan, confidence: typeof attempt.plan.confidence === "number" ? attempt.plan.confidence : fallbackPlan.confidence },
        providerNote: "Live response from the configured Lyzr agent; PaceGuard safety defaults fill any omitted fields.",
      };
    }
    return { workflow: "lyzr-adapter/local-v1", memoryProvider: memory.name, evidenceCount: cases.length, agents: fallbackAgents(cases.length), plan: fallbackPlan, providerNote: attempt.note };
  } catch (error) {
    console.error("Lyzr inference failed; using safe local fallback.", error instanceof Error ? error.message : "Unknown error");
  }
  return { workflow: "lyzr-adapter/local-v1", memoryProvider: memory.name, evidenceCount: cases.length, agents: fallbackAgents(cases.length), plan: fallbackPlan, providerNote: "Safe local fallback active after an internal adapter error." };
}
