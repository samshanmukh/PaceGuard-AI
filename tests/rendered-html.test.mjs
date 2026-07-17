import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const bindings = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the PaceGuard demo entry", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    bindings,
    context,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>PaceGuard AI — Adaptive Athlete Intelligence<\/title>/i);
  assert.match(html, /Every training decision/);
  assert.match(html, /has consequences/);
  assert.match(html, /Open Coach Command Center/);
  assert.match(html, /Fictional demo data/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("returns a complete local multi-agent decision", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/decision", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ athleteId: "maya-chen" }),
    }),
    bindings,
    context,
  );

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.workflow, "lyzr-adapter/local-v1");
  assert.equal(result.agents.length, 4);
  assert.equal(result.evidenceCount, 3);
  assert.equal(result.plan.confidence, 86);
  assert.match(result.plan.replacement, /35-minute easy aerobic run/);
  assert.match(result.plan.guardrail, /qualified professional/);
});

test("keeps product, safety, and provider seams in source", async () => {
  const [page, seed, memory, workflow] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../data/seed.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/memory.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/lyzr.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Decision trace/);
  assert.match(page, /coach approval required/i);
  assert.match(page, /Team Risk Radar/);
  assert.match(seed, /Maya Chen/);
  assert.match(seed, /readiness: 41/);
  assert.match(memory, /class LocalSemanticMemory/);
  assert.match(memory, /class QdrantAthleteMemory/);
  assert.match(workflow, /Signal Analyst/);
  assert.match(workflow, /Safety Review/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
});
