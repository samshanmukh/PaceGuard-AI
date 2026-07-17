# PaceGuard AI

PaceGuard AI is an adaptive coaching command center for endurance teams. It turns fragmented training load, recovery, sleep, and athlete feedback into one clear daily decision: train hard, train easy, recover, or ask a coach to review.

The demo is built around the fictional **Bay Striders** elite running club and its primary athlete, **Maya Chen**. Maya’s training load has risen 28% while recovery and sleep have declined. PaceGuard makes the evidence visible, retrieves comparable athlete situations, drafts a safer workout, checks its language and safety constraints, and waits for a coach to approve the change.

> All athlete records and historical cases are fictional. PaceGuard presents training-load and recovery risk, not injury diagnosis or medical advice.

## Quick start

Requirements: Node.js 22.x.

```bash
npm install
npm run dev
```

Open the local URL printed by the development server. No API keys, database, sign-in, or internet connection are required for the demo.

## Deploy to Vercel

1. Import `samshanmukh/PaceGuard-AI` in Vercel.
2. The committed `vercel.json` pins the **Next.js** framework preset; keep the repository root as `.`.
3. Leave the build command as `next build` and the output directory unset.
4. Deploy. The demo requires no environment variables.

Optional Qdrant or hosted Lyzr credentials can be added later in Vercel Project Settings. Without them, PaceGuard uses its deterministic local workflow and seeded semantic memory.

Useful checks:

```bash
npm run build
npx tsc --noEmit
```

## The 2-minute product story

1. Enter through the cinematic landing screen.
2. In the Coach Command Center, find Maya as the top-priority decision.
3. Open her Athlete Intelligence profile and inspect the four converging signals and 21-day evidence timeline.
4. Review three semantically matched cases in Athlete Memory.
5. Generate a safer plan and watch the four-agent decision trace execute.
6. Approve the plan to update Maya’s readiness trajectory and today’s workout.
7. Open Athlete View to show the calm explanation and one-tap calf check-in.

For exact judge narration and timing, see [DEMO_SCRIPT.md](./DEMO_SCRIPT.md).

## Product surfaces

- **Cinematic demo entry** — establishes the consequence-driven sports technology story.
- **Coach Command Center** — team health metrics, priority decisions, readiness matrix, race countdown, and live AI activity.
- **Athlete Intelligence** — Maya’s readiness, responsible risk language, signal evidence, interactive chart, coach copilot, data confidence, and case retrieval.
- **Recommendation workspace** — sequential multi-agent execution, old/new plan comparison, safety review, manual adjustment, check-in request, and coach approval.
- **Team Risk Radar** — an explorable squad field with filters, readiness state, workload change, data gaps, and race proximity.
- **Athlete View** — responsive athlete-facing session, plain-language rationale, soreness scale, notes, and escalation guidance.
- **Architecture modal** — compact system view from wearable signals to an approved athlete plan.

## Demo data

`data/seed.ts` includes 12 fictional Bay Striders athletes:

- Maya Chen: readiness 41, +28% acute load, 5h 12m sleep, recovery down 18 points, calf tightness note.
- Eli Brooks: high readiness and stable training.
- Noah Williams: rebuilding load after a prior issue.
- Sofia Reyes: incomplete data, explicitly represented as uncertainty.
- Eight additional athletes with distinct goals, coaches, readiness states, notes, and race dates.

It also includes a plausible 21-day Maya timeline and four historical case records. Three are retrieved for Maya using the local semantic-memory provider.

## Architecture

```text
Wearables + athlete check-ins
          ↓
Signal normalization and feature processing
          ↓
Lyzr workflow adapter
  ├─ Signal Analyst Agent
  ├─ Evidence Agent ───────→ Qdrant athlete memory
  ├─ Plan Agent                    or local fallback
  └─ Safety Agent
          ↓
Coach approval / manual adjustment
          ↓
Role-scoped adjusted athlete plan
```

### Local workflow

`POST /api/decision` runs a deterministic local workflow so the demo is reliable without external services. The response includes each agent’s role and finding, retrieved evidence count, a complete adjustment plan, confidence, and safety language. The UI advances through the agents sequentially and exposes the result as a visible Decision Trace.

### Lyzr adapter

`lib/lyzr.ts` defines the workflow result and local implementation for:

1. Signal Analyst — synthesizes load, recovery, sleep, and athlete notes.
2. Evidence Agent — queries the athlete-memory provider.
3. Plan Agent — drafts a load-aware training adjustment.
4. Safety Review — enforces non-diagnostic language, uncertainty, and human approval.

The adapter can be replaced with a hosted Lyzr workflow without changing the coach-facing data contract.

### Qdrant athlete memory

`lib/memory.ts` defines a provider interface with two implementations:

- `LocalSemanticMemory` provides deterministic token-overlap retrieval over seeded cases.
- `QdrantAthleteMemory` is the production seam enabled when `QDRANT_URL` and `QDRANT_API_KEY` exist.

The demo deliberately falls back locally and sends no athlete data to an external service.

## Safety and responsible AI

- Alerts are framed as **training-load and recovery risk**, never diagnosis.
- Every recommendation displays confidence and missing context.
- Athlete notes increase the need for human review; they do not establish clinical facts.
- Coach approval is required before any training plan changes.
- The athlete sees only the approved plan and minimized supporting data.
- The product repeatedly advises direct athlete or qualified-professional review where appropriate.

## Technology

- Next.js App Router with TypeScript
- Tailwind CSS plus a heavily customized product stylesheet
- Radix Dialog primitives (the accessibility foundation used by shadcn/ui)
- Framer Motion for purposeful entrance, workflow, approval, and state transitions
- Recharts for the 21-day evidence timeline
- Lucide icons
- Local Next.js API route for the decision workflow
- Standard Next.js production build for zero-configuration Vercel deployment
- Provider seams for Lyzr and Qdrant

## Project map

```text
app/
  api/decision/route.ts   Local agent workflow endpoint
  globals.css             Complete responsive visual system
  layout.tsx              Metadata and social preview
  page.tsx                Interactive product surfaces and state
data/seed.ts              Fictional athletes, timeline, cases, activity
lib/lyzr.ts               Multi-agent workflow adapter
lib/memory.ts             Qdrant/local retrieval abstraction
lib/types.ts              Shared domain types
public/og.png             Bespoke social preview
DEMO_SCRIPT.md            Exact judge walkthrough
TODO_PRODUCTION.md        Integrations, privacy, and security path
```

## Optional environment variables

The app needs none for the local demo. See `.env.example` for the future Qdrant and Lyzr integration seams.

## Hackathon positioning

PaceGuard is designed for the **Athlete Performance & Coaching** track. The emphasis is a fast, legible decision loop: identify the risk, show the evidence, retrieve relevant memory, propose a safer action, enforce safety language, and leave the final decision with the coach.
