"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { ArrowRight, ShieldCheck, UserRound, UsersRound } from "lucide-react";

function LoginContent() {
  const params = useSearchParams();
  const initialRole = params.get("role") === "athlete" ? "athlete" : "coach";
  const [role, setRole] = useState<"coach" | "athlete">(initialRole);
  const [loading, setLoading] = useState(false);
  const signIn = async () => {
    setLoading(true);
    const response = await fetch("/api/auth/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    const result = await response.json();
    window.location.assign(result.redirectTo);
  };
  return <main className="access-screen"><section className="access-card"><Link href="/" className="access-brand"><span>PG</span><b>PaceGuard AI</b></Link><span className="eyebrow">Secure workspace access</span><h1>Welcome back.</h1><p>Choose the experience you need. Athlete and coach data stay separated by role.</p><div className="role-picker"><button className={role === "coach" ? "active" : ""} onClick={() => setRole("coach")}><UsersRound size={20}/><span><b>Coach</b><small>Team decisions and approvals</small></span></button><button className={role === "athlete" ? "active" : ""} onClick={() => setRole("athlete")}><UserRound size={20}/><span><b>Athlete</b><small>Today’s plan and check-ins</small></span></button></div><button className="primary-button large full" onClick={signIn} disabled={loading}>{loading ? "Opening workspace…" : `Continue as ${role === "coach" ? "Coach Alex" : "Maya"}`} <ArrowRight size={17}/></button><footer><ShieldCheck size={15}/> Demo identity is fictional. Production adapters can replace this session provider.</footer></section></main>;
}

export default function LoginPage() { return <Suspense><LoginContent /></Suspense>; }
