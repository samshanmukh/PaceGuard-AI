import { getMemoryProvider } from "@/lib/memory";
import type { AgentStep, DecisionPlan } from "@/lib/types";

export interface PaceGuardWorkflowResult {
  workflow: "lyzr-adapter/local-v1";
  memoryProvider: string;
  agents: AgentStep[];
  evidenceCount: number;
  plan: DecisionPlan;
}

export async function runPaceGuardWorkflow(): Promise<PaceGuardWorkflowResult> {
  const memory = getMemoryProvider();
  const cases = await memory.search(
    "elite 10K acute load +28% recovery down sleep below 6 hours calf tightness race in 18 days",
  );

  return {
    workflow: "lyzr-adapter/local-v1",
    memoryProvider: memory.name,
    evidenceCount: cases.length,
    agents: [
      {
        id: "signal",
        name: "Signal Analyst",
        role: "Workload + recovery synthesis",
        finding: "Four converging signals; readiness moved from 68 to 41.",
        durationMs: 640,
      },
      {
        id: "evidence",
        name: "Evidence Agent",
        role: "Athlete memory retrieval",
        finding: `${cases.length} comparable cases retrieved; strongest match 94%.`,
        durationMs: 760,
      },
      {
        id: "plan",
        name: "Plan Agent",
        role: "Load-aware session redesign",
        finding: "Preserve aerobic stimulus while removing high-speed calf demand.",
        durationMs: 720,
      },
      {
        id: "safety",
        name: "Safety Review",
        role: "Language + approval guardrails",
        finding: "No diagnosis; uncertainty visible; coach review required.",
        durationMs: 520,
      },
    ],
    plan: {
      title: "Protect the race window",
      original: "8 × 800m @ 10K pace · 2 min recovery",
      replacement: "35-minute easy aerobic run + calf mobility",
      duration: "35 minutes",
      intensity: "RPE 3–4 · conversational",
      weeklyAdjustment: "Reduce planned weekly load by 15%",
      reassessment: "Reassess calf symptoms tomorrow morning",
      confidence: 86,
      rationale:
        "This adjustment preserves training rhythm while reducing the speed and volume stress associated with today’s converging load and recovery signals.",
      guardrail:
        "Signals suggest elevated training-load and recovery risk. Confirm with Maya and a qualified professional before changes.",
    },
  };
}
