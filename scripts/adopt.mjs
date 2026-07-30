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

const args = process.argv.slice(2);

function flagValue(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1] ?? null;
}

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
  Then: never-sleep.config.json → notion.rootPageUrl
  Structure: templates/notion-workspace-structure.md
`);
} else {
  console.log(`Notion root received → set notion.rootPageUrl to:
  ${notionRoot}
`);
}

const checklist = [
  ["guides/user-guide.md", existsSync(join(root, "guides/user-guide.md"))],
  ["guides/onboarding.md", existsSync(join(root, "guides/onboarding.md"))],
  ["references/immutable-ops.md", existsSync(join(root, "references/immutable-ops.md"))],
  ["templates/onboarding-prompt.md", existsSync(join(root, "templates/onboarding-prompt.md"))],
  ["templates/notion-workspace-structure.md", existsSync(join(root, "templates/notion-workspace-structure.md"))],
  ["templates/automation-prompt.md", existsSync(join(root, "templates/automation-prompt.md"))],
  ["templates/AGENTS.fragment.md", existsSync(join(root, "templates/AGENTS.fragment.md"))],
  ["templates/config.example.json", existsSync(join(root, "templates/config.example.json"))],
];

for (const [name, ok] of checklist) {
  console.log(`${ok ? "ok" : "MISSING"}  ${name}`);
}

const configPath = join(target, "never-sleep.config.json");
if (existsSync(configPath)) {
  try {
    const cfg = JSON.parse(readFileSync(configPath, "utf8"));
    const hasRoot = Boolean(cfg?.notion?.rootPageUrl || cfg?.notion?.rootPageId);
    const base = cfg?.immutable?.baseBranch || cfg?.project?.baseBranch;
    console.log(hasRoot ? `ok  config has Notion root` : `MISSING  config notion.rootPageUrl/rootPageId`);
    console.log(
      base === "main" || base === "dev"
        ? `ok  baseBranch=${base}`
        : `MISSING  immutable.baseBranch must be main or dev (got ${base ?? "unset"})`,
    );
  } catch {
    console.log(`WARN  ${configPath} invalid JSON`);
  }
} else {
  console.log(`MISSING  ${configPath}`);
}

if (installSkills) {
  const script = join(root, "templates/default-skills.sh");
  console.log(`\nInstalling default companion skills via ${script} …\n`);
  const result = spawnSync("bash", [script], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
} else {
  console.log(`\nTip: node scripts/adopt.mjs --install-skills\n`);
}

console.log(`
Full guides: guides/user-guide.md · guides/onboarding.md

Next (human order):
  1. Config: Notion root + immutable.baseBranch (main|dev) + slack
  2. ONBOARD repo (do not paste Automations yet):
       Paste templates/onboarding-prompt.md into Cursor chat
       → customize AGENTS.md + docs/ops/automation-*.md
  3. Build Notion tree under root:
       templates/notion-workspace-structure.md
  4. CONFIGURE Cursor Automations with CUSTOMIZED docs/ops/automation-*.md
       (Prompt/Instructions field ×4) — templates/automation-prompt.md
  5. Immutable locks always on: long wake, auto-merge to base, worker subagents
`);
