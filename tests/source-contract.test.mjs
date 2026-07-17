import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("uses the standard Vercel-compatible Next.js toolchain", async () => {
  const [packageJson, nextConfig, apiRoute, vercelConfig] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/decision/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);
  const pkg = JSON.parse(packageJson);
  const vercel = JSON.parse(vercelConfig);

  assert.equal(pkg.scripts.dev, "next dev");
  assert.equal(pkg.scripts.build, "next build");
  assert.equal(pkg.scripts.start, "next start");
  assert.equal(pkg.engines.node, "22.x");
  assert.ok(pkg.dependencies.next);
  assert.equal(pkg.devDependencies.vinext, undefined);
  assert.equal(pkg.devDependencies.wrangler, undefined);
  assert.equal(vercel.framework, "nextjs");
  assert.match(nextConfig, /reactStrictMode:\s*true/);
  assert.match(apiRoute, /runtime\s*=\s*"nodejs"/);
});

test("keeps product, safety, and provider seams in source", async () => {
  const [page, layout, seed, memory, workflow] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../data/seed.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/memory.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/lyzr.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Decision trace/);
  assert.match(page, /coach approval required/i);
  assert.match(page, /Team Risk Radar/);
  assert.match(layout, /PaceGuard AI — Adaptive Athlete Intelligence/);
  assert.match(seed, /Maya Chen/);
  assert.match(seed, /readiness: 41/);
  assert.match(memory, /class LocalSemanticMemory/);
  assert.match(memory, /class QdrantAthleteMemory/);
  assert.match(workflow, /Signal Analyst/);
  assert.match(workflow, /Safety Review/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
});
