#!/usr/bin/env node
/**
 * Builds the fully static export that Cloudflare serves.
 *
 * The Next.js route handlers under src/app/api are the Node/Postgres path used
 * in development and on a Node host. Cloudflare serves those same two routes
 * from worker/index.ts instead, so they are moved aside for the export build
 * and always restored afterwards.
 */
import { rename, rm, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const API = "src/app/api";
const PARKED = ".api-parked";

const exists = async (p) => access(p).then(() => true).catch(() => false);

async function main() {
  if (await exists(PARKED)) await rm(PARKED, { recursive: true, force: true });
  const hadApi = await exists(API);
  if (hadApi) await rename(API, PARKED);

  try {
    await rm("out", { recursive: true, force: true });
    const res = spawnSync("npx", ["next", "build"], {
      stdio: "inherit",
      env: { ...process.env, DEPLOY_TARGET: "static" },
      shell: process.platform === "win32",
    });
    if (res.status !== 0) process.exitCode = res.status ?? 1;
  } finally {
    if (hadApi) await rename(PARKED, API);
  }
}

main();
