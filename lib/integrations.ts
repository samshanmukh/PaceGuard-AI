export type IntegrationProviderId = "strava" | "fitbit" | "apple-health" | "health-connect";
export type IntegrationStatus = "connected" | "available" | "bridge-required" | "attention";

export interface IntegrationProvider {
  id: IntegrationProviderId;
  name: string;
  category: string;
  status: IntegrationStatus;
  description: string;
  dataTypes: string[];
  lastSync?: string;
  sourceLabel: string;
}

export interface NormalizedAthleteEvent {
  id: string;
  athleteId: string;
  source: IntegrationProviderId;
  sourceRecordId: string;
  type: "workout" | "sleep" | "recovery" | "heart-rate";
  recordedAt: string;
  value: string;
  confidence: number;
  consentScope: string;
}

export const integrationProviders: IntegrationProvider[] = [
  {
    id: "strava",
    name: "Strava",
    category: "Training",
    status: "connected",
    description: "Activities, distance, pace, heart rate, and perceived effort.",
    dataTypes: ["Activities", "Pace", "Heart rate", "Effort"],
    lastSync: "08:41",
    sourceLabel: "Demo OAuth connection",
  },
  {
    id: "fitbit",
    name: "Fitbit",
    category: "Recovery",
    status: "available",
    description: "Sleep stages, HRV, resting heart rate, and activity summaries.",
    dataTypes: ["Sleep", "HRV", "Resting HR", "Steps"],
    sourceLabel: "OAuth adapter ready",
  },
  {
    id: "apple-health",
    name: "Apple Health",
    category: "Mobile bridge",
    status: "bridge-required",
    description: "HealthKit workouts and recovery signals via an authorized iOS bridge.",
    dataTypes: ["Workouts", "Sleep", "HRV", "Heart rate"],
    sourceLabel: "iOS companion required",
  },
  {
    id: "health-connect",
    name: "Health Connect",
    category: "Mobile bridge",
    status: "bridge-required",
    description: "Android health and fitness records through the Health Connect SDK.",
    dataTypes: ["Exercise", "Sleep", "Vitals", "Distance"],
    sourceLabel: "Android companion required",
  },
];

export const normalizedDemoEvents: NormalizedAthleteEvent[] = [
  { id: "evt-1", athleteId: "maya-chen", source: "strava", sourceRecordId: "strava-98420", type: "workout", recordedAt: "Today · 07:12", value: "8.4 km · 43:08 · RPE 7", confidence: 99, consentScope: "activity:read" },
  { id: "evt-2", athleteId: "maya-chen", source: "fitbit", sourceRecordId: "fitbit-sleep-771", type: "sleep", recordedAt: "Today · 06:38", value: "5h 12m · 71% efficiency", confidence: 97, consentScope: "sleep" },
  { id: "evt-3", athleteId: "maya-chen", source: "fitbit", sourceRecordId: "fitbit-hrv-771", type: "recovery", recordedAt: "Today · 06:40", value: "HRV 44 ms · −18 pts", confidence: 94, consentScope: "heartrate" },
  { id: "evt-4", athleteId: "maya-chen", source: "strava", sourceRecordId: "strava-98420-hr", type: "heart-rate", recordedAt: "Today · 07:12", value: "164 bpm avg · 181 max", confidence: 98, consentScope: "activity:read_all" },
];

export function getProviderAuthorizationUrl(provider: IntegrationProviderId, origin: string) {
  if (provider === "strava" && process.env.STRAVA_CLIENT_ID) {
    const redirect = `${origin}/api/integrations/callback?provider=strava`;
    return `https://www.strava.com/oauth/authorize?client_id=${encodeURIComponent(process.env.STRAVA_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=activity:read_all`;
  }
  if (provider === "fitbit" && process.env.FITBIT_CLIENT_ID) {
    const redirect = `${origin}/api/integrations/callback?provider=fitbit`;
    return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${encodeURIComponent(process.env.FITBIT_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent("activity heartrate sleep profile")}`;
  }
  return null;
}
