#!/usr/bin/env node
/**
 * never-sleep-agent adopt helper (Phase 3 stub)
 *
 * Intended behavior (not fully implemented in v0 skeleton):
 *  - copy templates/AGENTS.fragment.md hints into target AGENTS.md
 *  - write never-sleep.config.json from flags / prompts
 *  - print Automation prompt + Notion bootstrap checklist
 *
 * Usage (future):
 *   node scripts/adopt.mjs --target /path/to/repo
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

const target = resolve(
  process.argv.includes("--target")
    ? process.argv[process.argv.indexOf("--target") + 1]
    : process.cwd(),
);

console.log(`never-sleep-agent adopt (stub)
skill root: ${root}
target:     ${target}
`);

const checklist = [
  ["SKILL.md", existsSync(join(root, "SKILL.md"))],
  ["references/roles.md", existsSync(join(root, "references/roles.md"))],
  ["templates/AGENTS.fragment.md", existsSync(join(root, "templates/AGENTS.fragment.md"))],
  ["templates/automation-prompt.md", existsSync(join(root, "templates/automation-prompt.md"))],
  ["templates/automation-worker.md", existsSync(join(root, "templates/automation-worker.md"))],
  ["templates/automation-director.md", existsSync(join(root, "templates/automation-director.md"))],
  ["templates/automation-researcher.md", existsSync(join(root, "templates/automation-researcher.md"))],
  ["templates/automation-auditor.md", existsSync(join(root, "templates/automation-auditor.md"))],
  ["templates/config.example.json", existsSync(join(root, "templates/config.example.json"))],
  ["templates/notion-bootstrap.md", existsSync(join(root, "templates/notion-bootstrap.md"))],
];

for (const [name, ok] of checklist) {
  console.log(`${ok ? "ok" : "MISSING"}  ${name}`);
}

console.log(`
Next (manual until Phase 3 completes):
  1. Merge templates/AGENTS.fragment.md into ${join(target, "AGENTS.md")}
  2. Copy templates/config.example.json → ${join(target, "never-sleep.config.json")}
  3. Set slack.ownerUserIds (helmsman) — owner replies become Notion STEER
  4. Create FOUR Cursor Automations from templates/automation-prompt.md
     - worker / director / researcher / auditor
  5. Follow templates/notion-bootstrap.md (Documents Kind includes steer)
`);

// Keep stub honest: show fragment head so operators see the contract.
const fragmentHead = read("templates/AGENTS.fragment.md").split("\n").slice(0, 12).join("\n");
console.log("--- AGENTS.fragment.md (head) ---\n" + fragmentHead + "\n...");
