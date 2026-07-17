"use client";

import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleDashed,
  CirclePlay,
  Clock3,
  Command,
  Database,
  Eye,
  Gauge,
  HeartPulse,
  Info,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  Minus,
  Network,
  Radio,
  RefreshCcw,
  Route,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TimerReset,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserRound,
  UsersRound,
  Watch,
  Waves,
  X,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activities,
  athletes,
  chatResponses,
  comparableCases,
  mayaTimeline,
  safetyGuardrails,
} from "@/data/seed";
import type { PaceGuardWorkflowResult } from "@/lib/lyzr";
import type { Athlete, RiskState } from "@/lib/types";

type Screen = "landing" | "dashboard" | "profile" | "radar" | "athlete";
type RadarRiskFilter = "all" | "attention" | "optimal" | "unknown";

const stateLabels: Record<RiskState, string> = {
  optimal: "Ready",
  watch: "Monitor",
  elevated: "Elevated",
  recovering: "Rebuilding",
  unknown: "Incomplete",
};

const compactNumber = (value: number | null) => (value == null ? "—" : value);

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-lockup" aria-label="PaceGuard AI">
      <span className="brand-mark"><Waves size={19} strokeWidth={2.2} /></span>
      {!compact && <span><b>PaceGuard</b><i>AI</i></span>}
    </div>
  );
}

function StatusDot({ state }: { state: RiskState }) {
  return <span className={`status-dot ${state}`} aria-hidden="true" />;
}

function Avatar({ athlete, large = false }: { athlete: Athlete; large?: boolean }) {
  return (
    <div
      className={`avatar ${large ? "large" : ""}`}
      style={{ "--avatar-accent": athlete.accent } as React.CSSProperties}
      aria-label={`${athlete.name} avatar`}
    >
      <span>{athlete.initials}</span>
      <i />
    </div>
  );
}

function ReadinessRing({ value, approved = false }: { value: number; approved?: boolean }) {
  const displayed = approved ? 48 : value;
  return (
    <div
      className={`readiness-ring ${approved ? "approved" : ""}`}
      style={{ "--score": displayed } as React.CSSProperties}
      aria-label={`Readiness score ${displayed} out of 100`}
    >
      <div className="ring-inner">
        <span>{displayed}</span>
        <small>/ 100</small>
      </div>
    </div>
  );
}

function MiniSparkline({ values, tone = "lime" }: { values: number[]; tone?: "lime" | "amber" | "coral" | "blue" }) {
  const max = Math.max(...values);
  return (
    <div className={`mini-spark ${tone}`} aria-hidden="true">
      {values.map((value, index) => (
        <i key={`${value}-${index}`} style={{ height: `${Math.max(18, (value / max) * 100)}%` }} />
      ))}
    </div>
  );
}

function Landing({ onEnter, onGuide }: { onEnter: () => void; onGuide: () => void }) {
  const reduceMotion = useReducedMotion();
  const bars = [31, 45, 39, 54, 62, 48, 71, 57, 68, 74, 66, 82, 76, 91, 69, 63, 78, 88, 94, 71, 84, 96, 78, 89, 74, 92, 86, 68, 79, 88, 73, 90];
  return (
    <main className="landing-screen">
      <div className="landing-grid" />
      <header className="landing-nav">
        <Logo />
        <div className="landing-meta"><span>Sports World Cup</span><i /> <span>Bay Striders Demo</span></div>
        <button className="text-button" onClick={onEnter}>Coach sign in <ArrowRight size={15} /></button>
      </header>

      <section className="landing-hero">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow live"
        >
          <Radio size={13} /> Adaptive athlete intelligence
        </motion.div>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          Every training decision<br /><em>has consequences.</em>
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          PaceGuard turns training load, recovery, sleep, and athlete feedback into one clear, explainable decision—before today’s session becomes tomorrow’s setback.
        </motion.p>
        <motion.div
          className="landing-actions"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
        >
          <button className="primary-button large" data-testid="open-command-center" onClick={onEnter}>
            Open Coach Command Center <ArrowUpRight size={18} />
          </button>
          <button className="tour-button" data-testid="start-guided-demo" onClick={onGuide}><CirclePlay size={17} /> Take the 2-minute tour</button>
          <span><ShieldCheck size={16} /> Coach-controlled. Safety-first.</span>
        </motion.div>
      </section>

      <motion.section
        className="telemetry-stage"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="telemetry-topline">
          <span><i className="pulse-dot" /> Live team load</span>
          <div><b>12</b> athletes monitored</div>
        </div>
        <div className="telemetry-bars">
          {bars.map((height, index) => (
            <motion.i
              key={index}
              style={{ height: `${height}%` }}
              initial={reduceMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: [0.85, 1, 0.92] }}
              transition={{ delay: index * 0.018, duration: 2.4, repeat: Infinity, repeatType: "mirror" }}
            />
          ))}
          <div className="threshold"><span>adaptive threshold</span></div>
          <div className="telemetry-alert">
            <span>08:42</span>
            <b>Maya Chen</b>
            <small>Load +28% · readiness 41</small>
          </div>
        </div>
        <div className="telemetry-footer">
          <span>06:00</span><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span>
        </div>
      </motion.section>

      <footer className="landing-footer">
        <span>Decision intelligence for endurance performance.</span>
        <span>Fictional demo data · No medical diagnosis</span>
      </footer>
    </main>
  );
}

interface SidebarProps {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  approved: boolean;
}

function Sidebar({ screen, onNavigate, approved }: SidebarProps) {
  const nav = [
    { id: "dashboard" as Screen, label: "Command", icon: LayoutDashboard },
    { id: "radar" as Screen, label: "Risk radar", icon: Gauge },
    { id: "profile" as Screen, label: "Intelligence", icon: BarChart3 },
    { id: "athlete" as Screen, label: "Athlete view", icon: UserRound },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><Logo /></div>
      <button className="team-switcher" aria-label="Switch team">
        <span className="team-monogram">BS</span>
        <span><b>Bay Striders</b><small>Elite squad · 12</small></span>
        <ChevronDown size={14} />
      </button>
      <nav className="main-nav" aria-label="Main navigation">
        <span className="nav-label">Workspace</span>
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} className={screen === id ? "active" : ""} onClick={() => onNavigate(id)}>
            <Icon size={17} /><span>{label}</span>
            {id === "dashboard" && !approved && <i>2</i>}
          </button>
        ))}
      </nav>
      <div className="athlete-rail">
        <div className="rail-head"><span>Athletes</span><Search size={14} /></div>
        {athletes.slice(0, 6).map((athlete) => (
          <button key={athlete.id} onClick={() => onNavigate(athlete.id === "maya-chen" ? "profile" : "radar")}>
            <Avatar athlete={athlete} />
            <span><b>{athlete.name}</b><small>{athlete.event}</small></span>
            <StatusDot state={athlete.state} />
          </button>
        ))}
        <button className="all-athletes" onClick={() => onNavigate("radar")}><UsersRound size={15} /> View all 12 <ChevronRight size={14} /></button>
      </div>
      <div className="sidebar-bottom">
        <button><Settings2 size={16} /> Settings</button>
        <div className="coach-chip"><span>AM</span><div><b>Alex Morgan</b><small>Head coach</small></div><ChevronRight size={14} /></div>
      </div>
    </aside>
  );
}

function AppHeader({ title, onArchitecture, onGuidedDemo }: { title: string; onArchitecture: () => void; onGuidedDemo: () => void }) {
  return (
    <header className="app-header">
      <div className="mobile-logo"><Logo compact /><b>{title}</b></div>
      <div className="breadcrumbs"><span>Bay Striders</span><ChevronRight size={13} /><b>{title}</b></div>
      <div className="header-actions">
        <button className="guided-demo-trigger" onClick={onGuidedDemo}><CirclePlay size={15} /> Guided demo</button>
        <button className="architecture-trigger" onClick={onArchitecture}><Network size={15} /> How it works</button>
        <button className="icon-button" aria-label="Notifications"><Bell size={17} /><i /></button>
        <span className="sync-chip"><i /> All systems synced</span>
      </div>
    </header>
  );
}

function Dashboard({ approved, onMaya, onGenerate }: { approved: boolean; onMaya: () => void; onGenerate: () => void }) {
  const maya = athletes[0];
  return (
    <div className="screen-shell dashboard-screen">
      <section className="page-intro">
        <div>
          <span className="eyebrow">Friday · July 17</span>
          <h2>Good morning, Coach Alex.</h2>
          <p>{approved ? "Maya’s session is protected. Your team plan is up to date." : "Two athletes need your attention before today’s sessions."}</p>
        </div>
        <button className="date-button"><CalendarDays size={16} /> Today <ChevronDown size={14} /></button>
      </section>

      <section className="summary-grid">
        <article><span><UsersRound size={16} /> Coverage</span><strong>12</strong><p>athletes monitored</p><i className="good">100% roster</i></article>
        <article><span><CircleAlert size={16} /> Attention</span><strong>{approved ? 1 : 2}</strong><p>need a coach review</p><i className="alert">Maya is priority</i></article>
        <article><span><TimerReset size={16} /> Decisions</span><strong>{approved ? 0 : 1}</strong><p>plan awaiting approval</p><i className={approved ? "good" : "amber"}>{approved ? "All clear" : "8 min overdue"}</i></article>
        <article><span><Target size={16} /> Execution</span><strong>86%</strong><p>training adherence</p><i className="good"><TrendingUp size={12} /> +4% this week</i></article>
      </section>

      <div className="section-heading">
        <div><span className="eyebrow">Coach queue</span><h3>Today’s decisions</h3></div>
        <button className="text-button">View decision history <ArrowRight size={14} /></button>
      </div>

      <section className={`decision-hero ${approved ? "is-approved" : ""}`} data-testid="maya-decision-card">
        <div className="hero-scanline" />
        <div className="decision-profile" onClick={onMaya} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onMaya()}>
          <div className="priority-label">{approved ? <><CheckCircle2 size={13} /> Plan protected</> : <><Zap size={13} /> Priority 01</>}</div>
          <div className="athlete-identity">
            <Avatar athlete={maya} large />
            <div><h3>Maya Chen</h3><p>10K · Pacific Classic in <b>18 days</b></p><span className={`risk-badge ${approved ? "approved" : ""}`}><StatusDot state={approved ? "recovering" : "elevated"} /> {approved ? "Adjusted plan approved" : "Elevated Load Risk"}</span></div>
          </div>
          <div className="readiness-block"><ReadinessRing value={41} approved={approved} /><small>{approved ? "Protected trajectory" : "−27 pts in 72h"}</small></div>
        </div>

        <div className="decision-evidence">
          <div className="evidence-heading"><span>Why PaceGuard flagged this</span><small>4 converging signals</small></div>
          <div className="hero-signals">
            <div><i className="signal-icon coral"><TrendingUp size={15} /></i><span><small>Acute load</small><b>+28%</b></span><MiniSparkline values={[44, 51, 47, 55, 62, 89]} tone="coral" /></div>
            <div><i className="signal-icon blue"><Clock3 size={15} /></i><span><small>Last sleep</small><b>5h 12m</b></span><small className="delta">−1h 48m target</small></div>
            <div><i className="signal-icon amber"><HeartPulse size={15} /></i><span><small>Recovery</small><b>44</b></span><small className="delta">−18 pts · 3d</small></div>
            <div><i className="signal-icon neutral"><MessageCircle size={15} /></i><span><small>Athlete note</small><b>“Calf tightness”</b></span><small className="delta">after intervals</small></div>
          </div>
          <div className="decision-caution"><ShieldCheck size={15} /><span><b>Training-load and recovery signal—not a diagnosis.</b> Confirm with athlete / qualified professional before changes.</span></div>
        </div>

        <div className="decision-action">
          <div><small>{approved ? "Updated session" : "Today’s planned session"}</small><b>{approved ? "35 min easy + mobility" : "8 × 800m @ 10K pace"}</b><span>{approved ? "RPE 3–4 · athlete notified" : "High-speed load · starts 16:00"}</span></div>
          {approved ? (
            <button className="secondary-button" onClick={onMaya}>Review decision <ChevronRight size={16} /></button>
          ) : (
            <button className="primary-button" data-testid="generate-plan-dashboard" onClick={onGenerate}><Sparkles size={16} /> Generate safer plan <ChevronRight size={16} /></button>
          )}
        </div>
      </section>

      <div className="dashboard-lower">
        <section className="panel readiness-panel">
          <div className="panel-heading"><div><span className="eyebrow">Squad state</span><h3>Team readiness</h3></div><button className="icon-button"><SlidersHorizontal size={15} /></button></div>
          <div className="readiness-legend"><span><i className="ready" /> Ready</span><span><i className="monitor" /> Monitor</span><span><i className="elevated" /> Elevated</span><span><i className="unknown" /> Incomplete</span></div>
          <div className="heatmap">
            {athletes.map((athlete) => (
              <button key={athlete.id} className={`heat-cell ${athlete.state}`} onClick={athlete.id === "maya-chen" ? onMaya : undefined} aria-label={`${athlete.name}, readiness ${compactNumber(athlete.readiness)}`}>
                <span>{athlete.initials}</span><b>{compactNumber(athlete.readiness)}</b><small>{athlete.event}</small>
              </button>
            ))}
          </div>
          <button className="panel-link">Open risk radar <ArrowRight size={14} /></button>
        </section>

        <section className="panel race-panel">
          <div className="race-visual"><span>Next target</span><strong>18</strong><small>days</small></div>
          <div className="race-copy"><span className="eyebrow">Pacific Classic 10K</span><h3>Race window</h3><p>Maya enters taper protection in 4 days. Today’s decision has high downstream impact.</p><div className="race-progress"><i /><span>Build</span><span>Protect</span><span>Race</span></div></div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-heading"><div><span className="eyebrow">Live system</span><h3>AI activity</h3></div><span className="live-chip"><i /> Running</span></div>
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={activity.time}><span>{activity.time}</span><i className={activity.tone} /><p><b>{activity.label}</b><small>{activity.detail}</small></p></div>
            ))}
          </div>
          <div className="sponsor-note"><Bot size={14} /> Powered by Lyzr workflow + Qdrant athlete memory</div>
        </section>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip"><b>{label}</b>{payload.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}<strong>{entry.name === "Sleep" ? `${entry.value}h` : entry.value}</strong></span>)}</div>
  );
}

function SignalCard({ icon: Icon, label, value, delta, tone, children }: { icon: typeof Activity; label: string; value: string; delta: string; tone: string; children?: React.ReactNode }) {
  return (
    <article className={`signal-card ${tone}`}>
      <div className="signal-top"><span><Icon size={16} /></span><small>{label}</small></div>
      <strong>{value}</strong><p>{delta}</p>{children}
    </article>
  );
}

function AthleteProfile({ approved, onGenerate, onBack }: { approved: boolean; onGenerate: () => void; onBack: () => void }) {
  const maya = athletes[0];
  const [chatAnswer, setChatAnswer] = useState<string>(chatResponses["Why is Maya flagged today?"]);
  const [chatQuestion, setChatQuestion] = useState("Why is Maya flagged today?");
  const ask = (question: string) => {
    setChatQuestion(question);
    setChatAnswer(chatResponses[question] ?? "I can summarize the seeded training and recovery evidence, but I do not have enough context to answer that safely. Ask Maya or the coach for additional detail.");
  };
  return (
    <div className="screen-shell profile-screen">
      <button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Command center</button>
      <section className="athlete-header">
        <div className="athlete-head-left"><Avatar athlete={maya} large /><div><div className="title-row"><h2>Maya Chen</h2><span className={`risk-badge ${approved ? "approved" : ""}`}><StatusDot state={approved ? "recovering" : "elevated"} /> {approved ? "Protected Plan" : "Elevated Load Risk"}</span></div><p>24 · Elite 10K runner · Bay Striders</p><div className="athlete-tags"><span><Target size={13} /> Sub-33:30</span><span><CalendarDays size={13} /> Pacific Classic · 18 days</span><span><UserCheck size={13} /> Coach Alex</span></div></div></div>
        <div className="athlete-head-right"><div className="profile-ring-copy"><ReadinessRing value={41} approved={approved} /><span>Readiness<small>{approved ? "Plan response pending" : "Down 27 points in 72h"}</small></span></div><button className="secondary-button"><MessageCircle size={15} /> Request check-in</button>{approved ? <button className="primary-button approved"><CheckCircle2 size={16} /> Plan approved</button> : <button className="primary-button" data-testid="generate-plan-profile" onClick={onGenerate}><Sparkles size={16} /> Generate safer plan</button>}</div>
      </section>

      <section className="why-panel">
        <div className="why-header"><div><span className="eyebrow"><Eye size={13} /> Decision evidence · updated 08:42</span><h3>Why this changed</h3><p>Readiness dropped because workload accelerated while recovery capacity declined.</p></div><div className="confidence-badge"><span>Signal confidence</span><b>86%</b><small>4 of 4 sources current</small></div></div>
        <div className="signal-grid">
          <SignalCard icon={TrendingUp} label="Acute workload" value="+28%" delta="vs. 14-day baseline" tone="coral"><MiniSparkline values={[37, 44, 42, 51, 62, 83]} tone="coral" /></SignalCard>
          <SignalCard icon={Clock3} label="Sleep last night" value="5h 12m" delta="1h 48m below target" tone="blue"><div className="mini-range"><i style={{ width: "65%" }} /><span>Target 7h+</span></div></SignalCard>
          <SignalCard icon={HeartPulse} label="Recovery trend" value="−18 pts" delta="over the last 3 days" tone="amber"><MiniSparkline values={[82, 78, 72, 64, 56, 44]} tone="amber" /></SignalCard>
          <SignalCard icon={MessageCircle} label="Athlete note" value="Calf tightness" delta="reported after intervals" tone="neutral"><span className="note-source">“Tight, not painful. Noticed on last two reps.”</span></SignalCard>
        </div>
        <div className="evidence-summary"><ShieldCheck size={17} /><div><b>Responsible interpretation</b><span>Signals suggest elevated training-load and recovery risk. This is not an injury diagnosis. Confirm with Maya / a qualified professional before changes.</span></div><button><Info size={14} /> Method</button></div>
      </section>

      <section className="timeline-panel panel">
        <div className="panel-heading timeline-heading"><div><span className="eyebrow">21-day evidence window</span><h3>Load vs. recovery trajectory</h3><p>High load becomes consequential as recovery and sleep fall together.</p></div><div className="timeline-metrics"><span><i className="load" /> Training load</span><span><i className="recovery" /> Recovery</span><span><i className="sleep" /> Sleep ×10</span></div></div>
        <div className="timeline-chart" data-testid="evidence-timeline">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mayaTimeline} margin={{ top: 20, right: 18, bottom: 4, left: -12 }}>
              <defs>
                <filter id="lineGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <CartesianGrid stroke="#dbe2d9" strokeDasharray="2 5" vertical={false} />
              <ReferenceArea x1="Jul 14" x2="Jul 17" fill="#ff6d64" fillOpacity={0.05} />
              <ReferenceLine x="Jul 17" stroke="#ff8a71" strokeDasharray="4 4" label={{ value: "TODAY", fill: "#ff9d8d", fontSize: 9, position: "insideTopRight" }} />
              {approved && <ReferenceLine x="Jul 18" stroke="#c8ff53" strokeDasharray="4 4" label={{ value: "APPROVED", fill: "#c8ff53", fontSize: 9, position: "insideTopRight" }} />}
              <XAxis dataKey="date" stroke="#9aa79d" tickLine={false} axisLine={false} tick={{ fill: "#68756b", fontSize: 10 }} interval={2} />
              <YAxis domain={[0, 110]} stroke="#9aa79d" tickLine={false} axisLine={false} tick={{ fill: "#68756b", fontSize: 10 }} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#8c9a8f", strokeDasharray: "3 3" }} />
              <Line type="monotone" dataKey="load" name="Training load" stroke="#e85f57" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#e85f57", stroke: "#ffffff", strokeWidth: 3 }} filter="url(#lineGlow)" />
              <Line type="monotone" dataKey="recovery" name="Recovery" stroke="#79a900" strokeWidth={2.3} dot={false} activeDot={{ r: 5, fill: "#79a900", stroke: "#ffffff", strokeWidth: 3 }} />
              <Line type="monotone" dataKey={(point) => point.sleep * 10} name="Sleep" stroke="#65a9ff" strokeWidth={1.8} strokeDasharray="5 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="timeline-events"><div><i className="watch" /><span>Jul 14</span><b>Load spike begins</b><small>Acute:chronic ratio moved above adaptive range</small></div><div><i className="alert" /><span>Jul 16</span><b>Hard intervals</b><small>Recovery fell below 50 next morning</small></div><div><i className="alert" /><span>Today</span><b>Athlete note added</b><small>“Calf tightness after intervals”</small></div>{approved && <div className="approved"><i /><span>Tomorrow</span><b>Protected session</b><small>35 min easy + mobility</small></div>}</div>
      </section>

      <div className="profile-columns">
        <section className="panel ask-panel">
          <div className="ask-heading"><span className="ask-mark"><Command size={16} /></span><div><span className="eyebrow">Coach copilot</span><h3>Ask PaceGuard</h3></div><span className="grounded-chip"><Database size={12} /> Grounded in Maya’s data</span></div>
          <div className="quick-prompts">
            {Object.keys(chatResponses).map((question) => <button key={question} className={chatQuestion === question ? "active" : ""} onClick={() => ask(question)}>{question}<ChevronRight size={13} /></button>)}
          </div>
          <AnimatePresence mode="wait"><motion.div key={chatQuestion} className="chat-answer" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><div className="ai-avatar"><Sparkles size={14} /></div><div><span>PaceGuard analysis <small>· just now</small></span><p>{chatAnswer}</p><div className="answer-sources"><span>4 live signals</span><span>3 memory cases</span><span>Safety checked</span></div></div></motion.div></AnimatePresence>
          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); const input = new FormData(event.currentTarget).get("question")?.toString() || ""; if (input) ask(input); }}><input name="question" aria-label="Ask PaceGuard" placeholder="Ask about Maya’s training decision…" /><button type="submit" aria-label="Send question"><Send size={15} /></button></form>
        </section>

        <section className="panel confidence-panel">
          <div className="panel-heading"><div><span className="eyebrow">Responsible AI</span><h3>Confidence & missing data</h3></div><ShieldCheck size={19} /></div>
          <div className="confidence-meter"><div><span>Decision confidence</span><b>86%</b></div><i><em style={{ width: "86%" }} /></i><small>High signal agreement · not clinical certainty</small></div>
          <div className="data-quality"><div><Check size={13} /><span><b>Current</b> Load, sleep, HRV, athlete note</span></div><div><Minus size={13} /><span><b>Not available</b> Clinical assessment, gait scan</span></div><div><CircleAlert size={13} /><span><b>Confirm</b> Current calf sensation before session</span></div></div>
          <button className="secondary-button full"><LockKeyhole size={14} /> View data provenance</button>
        </section>
      </div>

      <section className="memory-section">
        <div className="section-heading"><div><span className="eyebrow"><Database size={13} /> Qdrant athlete memory</span><h3>Comparable situations</h3><p>Semantically matched on athlete profile, signal pattern, race proximity, and coaching context.</p></div><span className="memory-query">Query · “10K + load spike + low recovery + calf”</span></div>
        <div className="case-grid">
          {comparableCases.slice(0, 3).map((record, index) => (
            <article className="case-card" key={record.id}>
              <div className="case-top"><span className="case-rank">0{index + 1}</span><div><b>{record.athlete}</b><small>{record.profile}</small></div><strong>{record.similarity}%<small>match</small></strong></div>
              <div className="matched-on"><span>Why selected</span><div>{record.matchedOn.map((item) => <i key={item}>{item}</i>)}</div></div>
              <div className="case-outcome"><span>Coach action</span><p>{record.intervention}</p><span>Outcome</span><p className="positive"><CheckCircle2 size={14} /> {record.outcome}</p></div>
              <footer><span>{record.season} · {record.id}</span><button>Open trace <ArrowUpRight size={13} /></button></footer>
            </article>
          ))}
        </div>
        <div className="memory-disclaimer"><Info size={14} /> Similarity supports coaching judgment; it does not predict Maya’s outcome or establish a diagnosis.</div>
      </section>
    </div>
  );
}

function RiskRadar({ onMaya }: { onMaya: () => void }) {
  const [risk, setRisk] = useState<RadarRiskFilter>("all");
  const [sport, setSport] = useState("All sports");
  const filtered = useMemo(() => athletes.filter((athlete) => {
    const sportMatch = sport === "All sports" || athlete.sport === sport;
    const riskMatch = risk === "all" || (risk === "attention" && ["watch", "elevated", "recovering"].includes(athlete.state)) || (risk === "optimal" && athlete.state === "optimal") || (risk === "unknown" && athlete.state === "unknown");
    return sportMatch && riskMatch;
  }), [risk, sport]);
  return (
    <div className="screen-shell radar-screen">
      <section className="page-intro"><div><span className="eyebrow">Squad intelligence</span><h2>Team Risk Radar</h2><p>See who is absorbing load well—and who needs context before the next session.</p></div><div className="radar-updated"><RefreshCcw size={14} /> Updated 42 sec ago</div></section>
      <section className="radar-controls">
        <div className="segmented" role="group" aria-label="Risk filter">{(["all", "attention", "optimal", "unknown"] as RadarRiskFilter[]).map((item) => <button key={item} className={risk === item ? "active" : ""} onClick={() => setRisk(item)}>{item === "all" ? "All athletes" : item === "attention" ? "Needs attention" : item === "optimal" ? "Ready" : "Incomplete"}{item === "attention" && <i>3</i>}</button>)}</div>
        <div className="select-wrap"><select aria-label="Filter by sport" value={sport} onChange={(event) => setSport(event.target.value)}><option>All sports</option><option>Running</option><option>Triathlon</option><option>Cycling</option></select><ChevronDown size={14} /></div>
        <button className="filter-button"><CalendarDays size={14} /> Race date</button><button className="filter-button"><Database size={14} /> Data quality</button>
      </section>
      <section className="radar-field">
        <div className="radar-rings"><i /><i /><i /><span>READY</span><span>MONITOR</span><span>ACT</span></div>
        <div className="radar-grid">
          {filtered.map((athlete) => (
            <motion.button layout key={athlete.id} className={`radar-card ${athlete.state}`} onClick={athlete.id === "maya-chen" ? onMaya : undefined}>
              <div className="radar-card-top"><Avatar athlete={athlete} /><span className={`state-pill ${athlete.state}`}><StatusDot state={athlete.state} /> {stateLabels[athlete.state]}</span></div>
              <div className="radar-card-title"><div><b>{athlete.name}</b><small>{athlete.event} · {athlete.raceDays ? `${athlete.raceDays}d to race` : "No race set"}</small></div><strong>{compactNumber(athlete.readiness)}</strong></div>
              <div className="radar-bar"><i style={{ width: `${athlete.readiness ?? athlete.completeness / 2}%` }} /></div>
              <div className="radar-details"><span><Activity size={12} /> {athlete.workload}</span><span><Clock3 size={12} /> {athlete.sleep}</span></div>
              <div className="radar-reveal"><span>What changed</span><p>{athlete.note}</p><b>{athlete.nextSession}<ChevronRight size={13} /></b></div>
            </motion.button>
          ))}
        </div>
        {!filtered.length && <div className="empty-state"><Search size={24} /><h3>No athletes in this view</h3><p>Try a wider risk or sport filter.</p><button onClick={() => { setRisk("all"); setSport("All sports"); }}>Reset filters</button></div>}
      </section>
      <section className="radar-footer-stats"><div><span>Highest readiness</span><b>Eli Brooks · 92</b></div><div><span>Fastest change</span><b className="alert">Maya Chen · −27</b></div><div><span>Data gap</span><b>Sofia Reyes · 46% missing</b></div><div><span>Next race</span><b>Tessa Hall · 8 days</b></div></section>
    </div>
  );
}

function AthleteView({ approved }: { approved: boolean }) {
  const [pain, setPain] = useState(2);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="athlete-view-wrap">
      <div className="phone-shell">
        <header className="athlete-mobile-header"><Logo compact /><span>Friday, July 17</span><button aria-label="Notifications"><Bell size={17} /></button></header>
        <main className="athlete-mobile-main">
          <div className="athlete-greeting"><Avatar athlete={athletes[0]} /><span>Good morning, Maya</span></div>
          <section className="protect-hero">
            <div className="protect-orbit"><span><ShieldCheck size={25} /></span><i /><i /><i /></div>
            <span className="eyebrow">Today’s focus</span><h2>Today, we’re protecting your race.</h2><p>Your recent training was strong. A lighter session today gives your body space to absorb it.</p>
            <div className="race-count"><span><Target size={14} /> Pacific Classic 10K</span><b>18 days</b></div>
          </section>
          <section className="mobile-workout">
            <div className="mobile-card-head"><span className="eyebrow">Today · 4:00 PM</span><span className={approved ? "approved-chip" : "pending-chip"}>{approved ? <><Check size={12} /> Coach approved</> : <><Clock3 size={12} /> Pending coach</>}</span></div>
            <h3>{approved ? "Easy aerobic + mobility" : "Workout adjustment pending"}</h3>
            <div className="workout-stats"><div><Clock3 size={16} /><span><b>35 min</b><small>Duration</small></span></div><div><Gauge size={16} /><span><b>Easy</b><small>RPE 3–4</small></span></div><div><HeartPulse size={16} /><span><b>Conversational</b><small>Effort</small></span></div></div>
            <div className="workout-note"><Sparkles size={15} /><span><b>Why the change?</b> Your load rose while sleep and recovery dipped. This keeps you moving without adding high-speed stress.</span></div>
          </section>
          <section className="checkin-card">
            {submitted ? <motion.div className="checkin-success" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><span><CheckCircle2 size={24} /></span><h3>Check-in sent</h3><p>Coach Alex can see how you’re feeling before today’s session.</p><button onClick={() => setSubmitted(false)}>Update response</button></motion.div> : <><span className="eyebrow">Quick check-in · 10 sec</span><h3>How does your calf feel?</h3><p>Choose what feels closest right now. This does not replace medical care.</p><div className="pain-scale">{[0, 1, 2, 3, 4, 5].map((value) => <button key={value} className={pain === value ? "active" : ""} onClick={() => setPain(value)}><b>{value}</b><span>{value === 0 ? "None" : value === 2 ? "Mild" : value === 5 ? "High" : ""}</span></button>)}</div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Anything else Coach Alex should know? (optional)" aria-label="Check-in note" /><button className="primary-button full" onClick={() => setSubmitted(true)}>Send check-in <ArrowRight size={16} /></button></>}
          </section>
          <div className="athlete-reassurance"><ShieldCheck size={15} /><span>Report sharp or worsening pain to your coach or a qualified professional.</span></div>
        </main>
        <nav className="mobile-bottom-nav"><button className="active"><LayoutDashboard size={18} /><span>Today</span></button><button><CalendarDays size={18} /><span>Plan</span></button><button><MessageCircle size={18} /><span>Coach</span></button><button><UserRound size={18} /><span>Profile</span></button></nav>
      </div>
      <aside className="athlete-demo-notes"><span className="eyebrow">Athlete experience</span><h2>Clarity without alarm.</h2><p>Maya sees only what she needs: the approved plan, a calm explanation, and an easy way to share how she feels.</p><div><span><CheckCircle2 size={16} /> Plain-language rationale</span><span><CheckCircle2 size={16} /> One-tap symptom check-in</span><span><CheckCircle2 size={16} /> Clear escalation guidance</span></div><small>Responsive preview · 390px athlete viewport</small></aside>
    </div>
  );
}

function ArchitectureModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const stages = [
    { icon: Watch, label: "Signals", detail: "Wearables + check-ins" },
    { icon: Activity, label: "Processing", detail: "Load + recovery features" },
    { icon: Bot, label: "Lyzr agents", detail: "Analyze · retrieve · plan · guard" },
    { icon: Database, label: "Athlete memory", detail: "Qdrant / local fallback" },
    { icon: UserCheck, label: "Coach approval", detail: "Human decision point" },
    { icon: Route, label: "Adjusted plan", detail: "Athlete notified" },
  ];
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="architecture-modal" aria-describedby="architecture-description">
          <div className="modal-kicker"><Network size={14} /> System architecture · offline demo</div>
          <Dialog.Title>From fragmented signals to a human-approved decision.</Dialog.Title>
          <Dialog.Description id="architecture-description">PaceGuard separates signal interpretation, evidence retrieval, planning, and safety review so every recommendation has a visible trace.</Dialog.Description>
          <div className="architecture-flow">
            {stages.map(({ icon: Icon, label, detail }, index) => <div className="architecture-stage" key={label}><span><Icon size={19} /></span><b>{label}</b><small>{detail}</small>{index < stages.length - 1 && <ArrowRight size={15} />}</div>)}
          </div>
          <div className="architecture-detail"><div><ShieldCheck size={17} /><span><b>Safety by design</b> No plan changes without coach approval.</span></div><div><Database size={17} /><span><b>Provider-ready</b> Local seeded memory swaps for Qdrant when credentials exist.</span></div><div><LockKeyhole size={17} /><span><b>Role-scoped</b> Athlete view receives only approved, minimized data.</span></div></div>
          <footer><span><Bot size={13} /> Lyzr workflow adapter</span><i /> <span><Database size={13} /> Qdrant athlete memory</span><i /> <span><Zap size={13} /> Local-first demo</span></footer>
          <Dialog.Close className="modal-close" aria-label="Close architecture"><X size={18} /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function RecommendationDrawer({ open, onOpenChange, onApprove, approved }: { open: boolean; onOpenChange: (open: boolean) => void; onApprove: () => void; approved: boolean }) {
  const [workflow, setWorkflow] = useState<PaceGuardWorkflowResult | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [error, setError] = useState(false);
  const [manual, setManual] = useState(false);
  const [checkInSent, setCheckInSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    window.queueMicrotask(() => {
      if (cancelled) return;
      setWorkflow(null);
      setActiveStep(0);
      setError(false);
      setManual(false);
      setCheckInSent(false);
    });
    fetch("/api/decision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ athleteId: "maya-chen" }) })
      .then(async (response) => {
        if (!response.ok) throw new Error("workflow failed");
        return (await response.json()) as PaceGuardWorkflowResult;
      })
      .then((data) => { if (!cancelled) setWorkflow(data); })
      .catch(() => { if (!cancelled) setError(true); });
    const timer = window.setInterval(() => setActiveStep((current) => current >= 4 ? current : current + 1), 720);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [open]);

  const fallbackSteps = [
    { id: "signal", name: "Signal Analyst", role: "Workload + recovery synthesis", finding: "Four converging signals; readiness moved from 68 to 41." },
    { id: "evidence", name: "Evidence Agent", role: "Athlete memory retrieval", finding: "3 comparable cases retrieved; strongest match 94%." },
    { id: "plan", name: "Plan Agent", role: "Load-aware session redesign", finding: "Preserve aerobic stimulus while removing high-speed calf demand." },
    { id: "safety", name: "Safety Review", role: "Language + approval guardrails", finding: "No diagnosis; uncertainty visible; coach review required." },
  ];
  const steps = workflow?.agents ?? fallbackSteps;
  const complete = activeStep >= 4 && !!workflow;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay drawer-overlay" />
        <Dialog.Content className="decision-drawer" aria-describedby="drawer-description" data-testid="recommendation-drawer">
          <header className="drawer-header"><div><span className="eyebrow"><Sparkles size={13} /> PaceGuard decision workspace</span><Dialog.Title>Protect Maya’s race window</Dialog.Title><Dialog.Description id="drawer-description">Evidence-grounded plan adjustment · coach approval required</Dialog.Description></div><Dialog.Close className="drawer-close" aria-label="Close recommendation"><X size={19} /></Dialog.Close></header>
          <div className="drawer-athlete"><Avatar athlete={athletes[0]} /><div><b>Maya Chen</b><span>Readiness 41 · Pacific Classic in 18 days</span></div><span className="risk-badge"><StatusDot state="elevated" /> Elevated Load Risk</span></div>
          <div className="drawer-body">
            <section className="workflow-trace">
              <div className="drawer-section-heading"><div><span className="eyebrow">Lyzr multi-agent workflow</span><h3>Decision trace</h3></div><span className={`workflow-state ${complete ? "complete" : ""}`}><i /> {error ? "Needs retry" : complete ? "Analysis complete" : "Agents running"}</span></div>
              <div className="agent-steps">
                {steps.map((step, index) => {
                  const status = activeStep > index ? "complete" : activeStep === index ? "active" : "pending";
                  const Icon = index === 0 ? Activity : index === 1 ? Database : index === 2 ? Route : ShieldCheck;
                  return <motion.div className={`agent-step ${status}`} key={step.id} initial={{ opacity: 0.6 }} animate={{ opacity: status === "pending" ? 0.55 : 1 }}><div className="agent-index">{status === "complete" ? <Check size={14} /> : status === "active" ? <CircleDashed size={15} /> : `0${index + 1}`}</div><span className="agent-icon"><Icon size={16} /></span><div><b>{step.name}</b><small>{step.role}</small>{status === "complete" && <motion.p initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}>{step.finding}</motion.p>}</div>{status === "active" && <span className="analyzing">Analyzing<i /><i /><i /></span>}</motion.div>;
                })}
              </div>
              <div className="workflow-source"><Database size={14} /><span><b>Athlete Memory</b>{workflow?.memoryProvider ?? "Local semantic fallback"} · {workflow?.evidenceCount ?? 3} relevant cases</span><strong>94% top match</strong></div>
            </section>

            <section className={`plan-output ${complete ? "visible" : ""}`}>
              {!complete && !error && <div className="plan-loading"><div className="loader-orbit"><Bot size={20} /></div><b>Building the safest useful option…</b><span>Combining current signals, comparable cases, and race context.</span></div>}
              {error && <div className="plan-error"><CircleAlert size={22} /><b>Decision workflow paused</b><span>The local workflow did not respond. Maya’s current plan remains unchanged.</span><button onClick={() => onOpenChange(false)}>Close and retry</button></div>}
              {complete && workflow && <AnimatePresence mode="wait"><motion.div key={manual ? "manual" : "plan"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="drawer-section-heading"><div><span className="eyebrow">Recommended adjustment · 86% confidence</span><h3>{manual ? "Fine-tune the session" : workflow.plan.title}</h3></div><span className="safety-pass"><ShieldCheck size={14} /> Safety check passed</span></div>
                {manual ? <div className="manual-editor"><label>Session type<select defaultValue="Easy aerobic run"><option>Easy aerobic run</option><option>Cross-train</option><option>Rest + mobility</option></select></label><div><label>Duration<input type="number" defaultValue="35" /> <span>min</span></label><label>Target RPE<input type="number" defaultValue="3" /> <span>of 10</span></label></div><label>Coach note<textarea defaultValue="Keep this truly conversational. Stop and message me if the calf changes." /></label><button className="text-button" onClick={() => setManual(false)}><ArrowLeft size={14} /> Back to AI draft</button></div> : <>
                  <div className="plan-comparison"><div className="old-plan"><span><X size={12} /> Original plan</span><b>{workflow.plan.original}</b><small>High-speed calf demand · load +18</small></div><ArrowRight size={20} /><div className="new-plan"><span><Sparkles size={12} /> PaceGuard draft</span><b>{workflow.plan.replacement}</b><small>{workflow.plan.intensity}</small></div></div>
                  <div className="plan-actions-list"><div><span><Clock3 size={15} /></span><p><b>{workflow.plan.duration}</b><small>Easy, conversational effort</small></p></div><div><span><TrendingDown size={15} /></span><p><b>{workflow.plan.weeklyAdjustment}</b><small>Protect race preparation window</small></p></div><div><span><MessageCircle size={15} /></span><p><b>{workflow.plan.reassessment}</b><small>Athlete check-in required</small></p></div></div>
                  <div className="plan-rationale"><span><Bot size={15} /> Why this plan</span><p>{workflow.plan.rationale}</p><div><span>Current signals <b>4</b></span><span>Comparable cases <b>3</b></span><span>Guidance rules <b>2</b></span></div></div>
                </>}
                <div className="safety-panel"><ShieldCheck size={18} /><div><span>Safety Guardrails · passed 4/4</span><p>{workflow.plan.guardrail}</p><div>{safetyGuardrails.map((guardrail) => <i key={guardrail}><Check size={11} /> {guardrail}</i>)}</div></div></div>
              </motion.div></AnimatePresence>}
            </section>
          </div>
          <footer className="drawer-footer"><div className="human-loop"><UserCheck size={17} /><span><b>You make the final call.</b> PaceGuard does not change training without approval.</span></div><div className="drawer-buttons">{checkInSent ? <span className="checkin-sent"><Check size={14} /> Check-in sent</span> : <button className="secondary-button" disabled={!complete} onClick={() => setCheckInSent(true)}><MessageCircle size={15} /> Request athlete check-in</button>}<button className="secondary-button" disabled={!complete} onClick={() => setManual(true)}><SlidersHorizontal size={15} /> Adjust manually</button><button className="primary-button" data-testid="approve-plan" disabled={!complete || approved} onClick={onApprove}>{approved ? <><CheckCircle2 size={16} /> Approved</> : <><BadgeCheck size={16} /> Approve plan</>}</button></div></footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ApprovalToast({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return <AnimatePresence>{visible && <motion.div className="approval-toast" data-testid="approval-success" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}><span><CheckCircle2 size={21} /></span><div><b>Plan approved</b><p>Maya’s timeline updated · athlete notified</p></div><button onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button></motion.div>}</AnimatePresence>;
}

const guidedDemoSteps = [
  { kicker: "01 · Coach command", title: "Start with the decision, not the data", body: "The coach sees two athletes needing attention. Maya is ranked first because four signals converge before a high-speed session." },
  { kicker: "02 · Explainability", title: "Open Maya’s evidence", body: "PaceGuard separates signals from diagnosis: load, sleep, recovery, and Maya’s own note are visible with confidence and missing context." },
  { kicker: "03 · Team awareness", title: "Scan the full squad", body: "Risk Radar lets a coach compare readiness, workload change, race proximity, and incomplete data without losing the individual story." },
  { kicker: "04 · Human-approved AI", title: "Generate the safer option", body: "Four agents analyze signals, retrieve comparable cases, draft an adjustment, and apply safety guardrails. The coach still makes the final call." },
  { kicker: "05 · Athlete experience", title: "Close the communication loop", body: "The athlete gets a calm explanation, the approved workout, and a one-tap check-in—not a frightening risk score or medical claim." },
];

function GuidedDemo({ step, onStep, onClose }: { step: number; onStep: (step: number) => void; onClose: () => void }) {
  const current = guidedDemoSteps[step];
  return (
    <motion.aside className="guided-demo" data-testid="guided-demo" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="guided-demo-top"><span><CirclePlay size={15} /> Guided product tour</span><button onClick={onClose} aria-label="Close guided demo"><X size={16} /></button></div>
      <div className="guided-progress" aria-label={`Step ${step + 1} of ${guidedDemoSteps.length}`}>{guidedDemoSteps.map((_, index) => <i key={index} className={index <= step ? "active" : ""} />)}</div>
      <span className="guided-kicker">{current.kicker}</span>
      <h3>{current.title}</h3>
      <p>{current.body}</p>
      <footer><span>{step + 1} / {guidedDemoSteps.length}</span><div>{step > 0 && <button className="guided-back" onClick={() => onStep(step - 1)}>Back</button>}<button className="guided-next" onClick={() => step === guidedDemoSteps.length - 1 ? onClose() : onStep(step + 1)}>{step === guidedDemoSteps.length - 1 ? "Finish tour" : "Next feature"}<ArrowRight size={14} /></button></div></footer>
    </motion.aside>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [approved, setApproved] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [guidedStep, setGuidedStep] = useState<number | null>(null);

  const navigate = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const approve = () => { setApproved(true); setDrawerOpen(false); setToast(true); window.setTimeout(() => setToast(false), 5200); };

  const setDemoStep = (step: number) => {
    const destinations: Screen[] = ["dashboard", "profile", "radar", "profile", "athlete"];
    setGuidedStep(step);
    setScreen(destinations[step]);
    setDrawerOpen(step === 3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startGuidedDemo = () => setDemoStep(0);

  if (screen === "landing") return <Landing onEnter={() => navigate("dashboard")} onGuide={startGuidedDemo} />;

  const title = screen === "dashboard" ? "Coach Command" : screen === "profile" ? "Athlete Intelligence" : screen === "radar" ? "Risk Radar" : "Athlete View";
  return (
    <main className="app-shell">
      <Sidebar screen={screen} onNavigate={navigate} approved={approved} />
      <section className="app-main">
        <AppHeader title={title} onArchitecture={() => setArchitectureOpen(true)} onGuidedDemo={startGuidedDemo} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={screen} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22 }}>
            {screen === "dashboard" && <Dashboard approved={approved} onMaya={() => navigate("profile")} onGenerate={() => setDrawerOpen(true)} />}
            {screen === "profile" && <AthleteProfile approved={approved} onGenerate={() => setDrawerOpen(true)} onBack={() => navigate("dashboard")} />}
            {screen === "radar" && <RiskRadar onMaya={() => navigate("profile")} />}
            {screen === "athlete" && <AthleteView approved={approved} />}
          </motion.div>
        </AnimatePresence>
      </section>
      <RecommendationDrawer open={drawerOpen} onOpenChange={setDrawerOpen} onApprove={approve} approved={approved} />
      <ArchitectureModal open={architectureOpen} onOpenChange={setArchitectureOpen} />
      <ApprovalToast visible={toast} onClose={() => setToast(false)} />
      {guidedStep != null && <GuidedDemo step={guidedStep} onStep={setDemoStep} onClose={() => { setGuidedStep(null); setDrawerOpen(false); }} />}
      <nav className="mobile-app-nav" aria-label="Mobile navigation"><button className={screen === "dashboard" ? "active" : ""} onClick={() => navigate("dashboard")}><LayoutDashboard size={18} /><span>Command</span></button><button className={screen === "radar" ? "active" : ""} onClick={() => navigate("radar")}><Gauge size={18} /><span>Radar</span></button><button className={screen === "profile" ? "active" : ""} onClick={() => navigate("profile")}><BarChart3 size={18} /><span>Maya</span></button><button className={screen === "athlete" ? "active" : ""} onClick={() => navigate("athlete")}><UserRound size={18} /><span>Athlete</span></button></nav>
    </main>
  );
}
