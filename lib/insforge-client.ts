"use client";

import { createClient } from "@insforge/sdk";

let browserClient: ReturnType<typeof createClient> | null = null;

export function getInsForgeBrowserClient() {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;
  if (!baseUrl || !anonKey) return null;
  browserClient ??= createClient({ baseUrl, anonKey });
  return browserClient;
}

export const paceGuardChannel = (teamId: string) => `paceguard:${teamId}`;
