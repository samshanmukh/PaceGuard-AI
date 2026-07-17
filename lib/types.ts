export type RiskState = "optimal" | "watch" | "elevated" | "recovering" | "unknown";

export interface Athlete {
  id: string;
  name: string;
  initials: string;
  age: number;
  sport: string;
  event: string;
  goal: string;
  coach: string;
  readiness: number | null;
  status: string;
  state: RiskState;
  workload: string;
  raceDays: number | null;
  completeness: number;
  adherence: number;
  sleep: string;
  recovery: number | null;
  soreness: number | null;
  note: string;
  nextSession: string;
  accent: string;
}

export interface TimelinePoint {
  day: string;
  date: string;
  load: number;
  recovery: number;
  sleep: number;
  risk?: "watch" | "elevated";
  event?: string;
}

export interface ComparableCase {
  id: string;
  athlete: string;
  profile: string;
  similarity: number;
  matchedOn: string[];
  intervention: string;
  outcome: string;
  season: string;
  tags: string[];
}

export interface DecisionPlan {
  title: string;
  original: string;
  replacement: string;
  duration: string;
  intensity: string;
  weeklyAdjustment: string;
  reassessment: string;
  confidence: number;
  rationale: string;
  guardrail: string;
}

export interface AgentStep {
  id: string;
  name: string;
  role: string;
  finding: string;
  durationMs: number;
}
