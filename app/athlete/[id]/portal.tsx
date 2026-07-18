"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Activity, Bell, CalendarDays, Check, CheckCircle2, Clock3, HeartPulse, LogOut, MessageCircle, ShieldCheck, Target, UserRound, Watch } from "lucide-react";
import type { PaceGuardEvent } from "@/lib/insforge";
import { publishPaceGuardEvent, usePaceGuardRealtime } from "@/lib/use-paceguard-realtime";

type CheckIn = { pain: number; note: string; createdAt: string };

export default function AthletePortal({ athleteId, name }: { athleteId: string; name: string }) {
  const key = `paceguard:${athleteId}:checkin`;
  const [pain, setPain] = useState(2);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<CheckIn | null>(() => { if (typeof window === "undefined") return null; const local = localStorage.getItem(key); return local ? JSON.parse(local) as CheckIn : null; });
  const [submitting, setSubmitting] = useState(false);
  const [live, setLive] = useState(false);
  const onRealtimeEvent = useCallback((event: PaceGuardEvent) => { if (event.athlete_id === athleteId) setLive(true); }, [athleteId]);
  usePaceGuardRealtime("bay-striders", onRealtimeEvent);

  useEffect(() => {
    void fetch(`/api/events?teamId=bay-striders&athleteId=${athleteId}`)
      .then(response => response.json())
      .then(data => {
        const event = data.events?.find((item: PaceGuardEvent) => item.event_type === "checkin.created") as PaceGuardEvent | undefined;
        if (!event) return;
        const payload = event.payload as { pain?: number; note?: string };
        setSaved({ pain: payload.pain ?? 0, note: payload.note ?? "", createdAt: event.created_at ?? new Date().toISOString() });
        setLive(Boolean(data.configured));
      })
      .catch(() => undefined);
  }, [athleteId, key]);

  const submit = async () => {
    setSubmitting(true);
    const value = { pain, note, createdAt: new Date().toISOString() };
    const event: PaceGuardEvent = { team_id: "bay-striders", athlete_id: athleteId, event_type: "checkin.created", actor_role: "athlete", payload: { pain, note }, consent_scope: "coach:read", created_at: value.createdAt };
    try {
      const response = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Check-in could not be persisted.");
      setLive(Boolean(result.configured));
      await publishPaceGuardEvent("bay-striders", result.event ?? event);
    } catch {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(`paceguard:audit:${Date.now()}`, JSON.stringify({ actor: athleteId, action: "checkin.created", consentScope: "coach:read", at: value.createdAt }));
    } finally {
      setSaved(value);
      setSubmitting(false);
    }
  };
  const signOut = async () => { await fetch("/api/auth/demo", { method: "DELETE" }); window.location.assign("/login?role=athlete"); };

  return <main className="athlete-portal"><header className="athlete-portal-nav"><Link href="/" className="access-brand"><span>PG</span><b>PaceGuard AI</b></Link><div><span><i/> {live ? "InsForge live" : "Demo sync ready"}</span><button aria-label="Notifications"><Bell size={17}/><i>1</i></button><button onClick={signOut}><LogOut size={15}/> Sign out</button></div></header><section className="athlete-portal-shell"><div className="athlete-portal-greeting"><div><span className="eyebrow">Athlete workspace · Private</span><h1>Good morning, {name.split(" ")[0]}.</h1><p>Your coach-approved plan and the context you need—nothing more.</p></div><div className="race-window"><Target size={18}/><span><small>Pacific Classic 10K</small><b>18 days</b></span></div></div><div className="athlete-portal-grid"><section className="today-plan"><div className="portal-card-head"><span>Today · 4:00 PM</span><i><Check size={12}/> Coach approved</i></div><h2>Easy aerobic + mobility</h2><p>A lighter session gives your body space to absorb the strong work you’ve already done.</p><div className="portal-stats"><div><Clock3/><span><b>35 min</b><small>Duration</small></span></div><div><Activity/><span><b>Easy</b><small>RPE 3–4</small></span></div><div><HeartPulse/><span><b>Conversational</b><small>Effort</small></span></div></div><div className="portal-explainer"><ShieldCheck size={18}/><span><b>Why the change?</b>Your training load rose while sleep and recovery dipped. This is coaching guidance, not a diagnosis.</span></div></section><aside className="portal-side"><div><Watch size={18}/><span><small>Connected sources</small><b>Strava + Fitbit</b></span><i>Healthy</i></div><div><ShieldCheck size={18}/><span><small>Sharing permission</small><b>Coach Alex · training data</b></span><Link href="/?workspace=coach">Manage</Link></div><div><MessageCircle size={18}/><span><small>Coach message</small><b>Keep today genuinely easy.</b></span></div></aside><section className="portal-checkin"><span className="eyebrow">Quick check-in · Shared with Coach Alex</span><h2>How does your calf feel right now?</h2>{saved ? <div className="portal-saved"><CheckCircle2 size={26}/><div><b>Check-in sent</b><span>Pain level {saved.pain}/5 · {live ? "InsForge synced live" : "saved in demo mode"}</span></div><button onClick={() => setSaved(null)}>Update</button></div> : <><div className="portal-pain">{[0,1,2,3,4,5].map(value => <button key={value} className={pain === value ? "active" : ""} onClick={() => setPain(value)}><b>{value}</b><small>{value === 0 ? "None" : value === 2 ? "Mild" : value === 5 ? "High" : ""}</small></button>)}</div><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Anything else your coach should know? (optional)"/><button className="primary-button large" onClick={submit} disabled={submitting}>{submitting ? "Syncing securely…" : "Send securely"} <MessageCircle size={16}/></button></>}</section><section className="portal-week"><div className="portal-card-head"><span>This week</span><i>Updated today</i></div><div>{["Easy aerobic + mobility","Rest / optional walk","Controlled progression","Coach review"].map((item,index)=><article key={item}><span>{index === 0 ? "Today" : ["Sat","Sun","Mon"][index-1]}</span><i className={index === 0 ? "active" : ""}/><b>{item}</b><small>{index === 0 ? "35 min · approved" : index === 1 ? "Recovery" : index === 2 ? "45 min" : "Before intervals"}</small></article>)}</div></section></div></section><nav className="athlete-portal-mobile-nav"><button className="active"><Activity size={18}/>Today</button><button><CalendarDays size={18}/>Plan</button><button><MessageCircle size={18}/>Coach</button><button><UserRound size={18}/>Profile</button></nav></main>;
}
