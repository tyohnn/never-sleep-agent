#!/usr/bin/env node
/**
 * never-sleep-agent adopt helper
 *
 *   node scripts/adopt.mjs --target /path/to/repo
 *   node scripts/adopt.mjs --notion-root "https://www.notion.so/...."
 *   node scripts/adopt.mjs --install-skills
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

function flagValue(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1] ?? null;
}

const args = process.argv.slice(2);
const installSkills = args.includes("--install-skills");
const target = resolve(flagValue("--target") || process.cwd());
const notionRoot = flagValue("--notion-root");

console.log(`never-sleep-agent adopt
skill root: ${root}
target:     ${target}
notion root: ${notionRoot || "(not passed — REQUIRED in never-sleep.config.json)"}
`);

if (!notionRoot) {
  console.log(`INPUT REQUIRED: Notion root page
  Pass:  --notion-root "https://www.notion.so/.../Your-Overnight-Root"
  Then put the same value in never-sleep.config.json → notion.rootPageUrl
  Tasks / Documents / BOARD must live under this root.
`);
} else {
  console.log(`Notion root received.
  Write into ${join(target, "never-sleep.config.json")}:
    "notion": { "rootPageUrl": ${JSON.stringify(notionRoot)}, ... }
`);
}

const checklist = [
  ["SKILL.md", existsSync(join(root, "SKILL.md"))],
  ["docs/user-guide.md", existsSync(join(root, "docs/user-guide.md"))],
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

const configPath = join(target, "never-sleep.config.json");
if (existsSync(configPath)) {
  try {
    const cfg = JSON.parse(readFileSync(configPath, "utf8"));
    const hasRoot = Boolean(cfg?.notion?.rootPageUrl || cfg?.notion?.rootPageId);
    console.log(
      hasRoot
        ? `ok  ${configPath} has notion.rootPageUrl/rootPageId`
        : `MISSING  ${configPath} notion.rootPageUrl or rootPageId (user must set)`,
    );
  } catch {
    console.log(`WARN  ${configPath} is not valid JSON`);
  }
} else {
  console.log(`MISSING  ${configPath} — copy from templates/config.example.json`);
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
`);
}

console.log(`
Required MCPs: Notion, Slack, Supabase, Vercel
Full user guide: docs/user-guide.md

Next (human):
  1. Set Notion ROOT in config (notion.rootPageUrl or rootPageId)
     ${notionRoot ? `suggested: ${notionRoot}` : "example: --notion-root \"https://www.notion.so/...\""}
  2. Bootstrap DBs under that root — templates/notion-bootstrap.md
  3. Merge templates/AGENTS.fragment.md into ${join(target, "AGENTS.md")}
  4. Set slack.ownerUserIds + outboxChannelId
  5. CONFIGURE Automation prompts in Cursor UI (not automatic):
       Open Automations → create 4 → paste each file into Prompt/Instructions → Save
       - templates/automation-worker.md     → "never-sleep · worker"
       - templates/automation-director.md   → "never-sleep · director"
       - templates/automation-researcher.md → "never-sleep · researcher"
       - templates/automation-auditor.md    → "never-sleep · auditor"
     How-to: templates/automation-prompt.md
`);
