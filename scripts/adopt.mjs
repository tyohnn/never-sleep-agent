#!/usr/bin/env node
/**
 * never-sleep-agent adopt helper
 *
 *   node scripts/adopt.mjs --target /path/to/repo
 *   node scripts/adopt.mjs --install-skills
 *   node scripts/adopt.mjs --target /path/to/repo --install-skills
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

const args = process.argv.slice(2);
const installSkills = args.includes("--install-skills");
const target = resolve(
  args.includes("--target") ? args[args.indexOf("--target") + 1] : process.cwd(),
);

console.log(`never-sleep-agent adopt
skill root: ${root}
target:     ${target}
`);

const checklist = [
  ["SKILL.md", existsSync(join(root, "SKILL.md"))],
  ["references/roles.md", existsSync(join(root, "references/roles.md"))],
  ["references/required-mcps.md", existsSync(join(root, "references/required-mcps.md"))],
  ["references/default-skills.md", existsSync(join(root, "references/default-skills.md"))],
  ["references/worker-subagents.md", existsSync(join(root, "references/worker-subagents.md"))],
  ["templates/default-skills.sh", existsSync(join(root, "templates/default-skills.sh"))],
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

if (installSkills) {
  const script = join(root, "templates/default-skills.sh");
  console.log(`\nInstalling default companion skills via ${script} …\n`);
  const result = spawnSync("bash", [script], { stdio: "inherit" });
  if (result.status !== 0) {
    console.error("default-skills.sh failed; fix network/auth and retry.");
    process.exit(result.status ?? 1);
  }
} else {
  console.log(`
Default skills not installed this run. To install:
  node scripts/adopt.mjs --install-skills
  # or: bash templates/default-skills.sh
`);
}

console.log(`
Required MCPs (authenticate in Cursor — agents must use them):
  - Notion
  - Slack
  - Supabase
  - Vercel
See references/required-mcps.md

Full user guide: docs/user-guide.md

Next:
  1. Merge templates/AGENTS.fragment.md into ${join(target, "AGENTS.md")}
  2. Copy templates/config.example.json → ${join(target, "never-sleep.config.json")}
  3. Set slack.ownerUserIds + Notion IDs; confirm mcp.required in config
  4. Follow templates/notion-bootstrap.md (Kind includes steer)
  5. Install default skills if you have not: --install-skills
  6. HUMAN MUST SAVE 4 prompts in Cursor Automations (not automatic):
       - templates/automation-worker.md     → Automation "never-sleep · worker"
       - templates/automation-director.md   → Automation "never-sleep · director"
       - templates/automation-researcher.md → Automation "never-sleep · researcher"
       - templates/automation-auditor.md    → Automation "never-sleep · auditor"
     Checklist: templates/automation-prompt.md
`);

const fragmentHead = read("templates/AGENTS.fragment.md").split("\n").slice(0, 14).join("\n");
console.log("--- AGENTS.fragment.md (head) ---\n" + fragmentHead + "\n...");
