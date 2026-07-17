export type AppRole = "coach" | "athlete";

export interface DemoSession {
  role: AppRole;
  userId: string;
  name: string;
  athleteId?: string;
}

export const SESSION_COOKIE = "paceguard_session";

export function encodeSession(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function decodeSession(value?: string): DemoSession | null {
  if (!value) return null;
  try {
    const session = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as DemoSession;
    return session.role && session.userId && session.name ? session : null;
  } catch {
    return null;
  }
}
