# PaceGuard AI — 105-second judge walkthrough

Keep the app on the landing screen before presenting. The narration below is written for approximately 105 seconds at a calm demo pace.

## 0:00–0:12 — The consequence

**Show:** Landing screen.

**Say:** “Every training decision has consequences. PaceGuard AI turns an endurance team’s training load, recovery, sleep, and athlete feedback into one clear, explainable daily coaching decision.”

**Do:** Click **Open Coach Command Center**.

## 0:12–0:29 — The coach’s priority

**Show:** Coach Command Center and Maya’s priority card.

**Say:** “Coach Alex monitors 12 Bay Striders athletes. Maya Chen is racing a 10K in 18 days, but PaceGuard has flagged elevated training-load and recovery risk. Her acute load jumped 28%, sleep fell to five hours twelve, recovery dropped 18 points, and she noted calf tightness after intervals.”

**Do:** Click Maya’s card or **Intelligence**.

## 0:29–0:51 — Evidence, not alarm

**Show:** Why This Changed panel, then the 21-day timeline.

**Say:** “This is not an injury diagnosis. PaceGuard shows exactly why readiness moved to 41 and makes uncertainty explicit. On the timeline, workload rises while sleep and recovery fall—then Maya adds her subjective note. The coach sees the evidence, missing clinical context, and the requirement to confirm directly with the athlete.”

**Do:** Briefly point to the comparable-case section below.

## 0:51–1:03 — Athlete memory

**Show:** Three Comparable Situations cards.

**Say:** “The Evidence Agent retrieves semantically similar athlete situations from Qdrant athlete memory, with a deterministic local fallback for this demo. The top match used reduced interval volume and the athlete completed the target race healthy. Similarity informs judgment; it never predicts Maya’s outcome.”

**Do:** Click **Generate safer plan**.

## 1:03–1:27 — The agentic decision trace

**Show:** Recommendation workspace as the four steps complete.

**Say:** “A visible Lyzr workflow separates responsibilities: the Signal Analyst synthesizes the pattern, the Evidence Agent retrieves comparable cases, the Plan Agent redesigns today’s session, and the Safety Agent checks non-diagnostic language, uncertainty, and human approval.”

**Show:** Original plan versus PaceGuard draft.

**Say:** “Instead of eight hard 800s, PaceGuard proposes 35 minutes easy plus mobility, a 15% weekly load reduction, and a calf reassessment tomorrow.”

## 1:27–1:41 — Human approval

**Say:** “The AI cannot change training by itself. Coach Alex makes the final call.”

**Do:** Click **Approve plan**.

**Show:** Updated readiness ring, Protected Plan status, and approved timeline marker.

## 1:41–1:55 — Close the loop

**Do:** Open **Athlete View**.

**Say:** “Maya receives a calm, minimized experience: ‘Today, we’re protecting your race,’ the approved workout, a plain-language explanation, and a one-tap calf check-in. PaceGuard helps teams act earlier—without replacing coaches or clinicians.”

## Optional 10-second sponsor close

Open **How it works** if judges ask about architecture.

**Say:** “The product is ready for real wearable connectors, a hosted Lyzr workflow, and Qdrant memory. Today’s build runs fully offline, so the story is reliable in every demo.”

## Demo recovery shortcuts

- If the recommendation drawer is closed accidentally, click **Generate safer plan** again.
- If the plan is already approved, refresh the page to reset local UI state.
- If time is short, skip the detailed case-card narration and move directly from the timeline to **Generate safer plan**.
