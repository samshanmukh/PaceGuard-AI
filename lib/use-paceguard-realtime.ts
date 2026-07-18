"use client";

import { useEffect } from "react";
import { getInsForgeBrowserClient, paceGuardChannel } from "@/lib/insforge-client";
import type { PaceGuardEvent } from "@/lib/insforge";

export function usePaceGuardRealtime(teamId: string, onEvent: (event: PaceGuardEvent) => void) {
  useEffect(() => {
    const client = getInsForgeBrowserClient();
    if (!client) return;
    const channel = paceGuardChannel(teamId);
    let active = true;
    const handler = (message: PaceGuardEvent) => active && onEvent(message);
    client.realtime.on<PaceGuardEvent>("paceguard_event", handler);
    void client.realtime.connect().then(() => client.realtime.subscribe(channel)).catch(() => undefined);
    return () => {
      active = false;
      client.realtime.off("paceguard_event", handler);
      client.realtime.unsubscribe(channel);
    };
  }, [teamId, onEvent]);
}

export async function publishPaceGuardEvent(teamId: string, event: PaceGuardEvent) {
  const client = getInsForgeBrowserClient();
  if (!client) return false;
  const channel = paceGuardChannel(teamId);
  try {
    await client.realtime.connect();
    const subscription = await client.realtime.subscribe(channel);
    if (!subscription.ok) return false;
    await client.realtime.publish(channel, "paceguard_event", event);
    return true;
  } catch {
    return false;
  }
}
