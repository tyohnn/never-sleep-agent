<!--
  never-sleep-agent — merge into target repo AGENTS.md AFTER onboarding.
  Customize Product plugin from repo reality. Do not remove Immutable ops.
-->

## Overnight ops (never-sleep-agent)

This repo participates in the **never-sleep-agent** wake loop via **four Cursor Automations**.

Onboarding: skill `docs/onboarding.md` → customize this file + `docs/ops/automation-*.md` → human saves prompts in Cursor Automations UI.

### Ownership split

| Concern | Owner |
|---|---|
| Roles, LEASE, Slack/STEER, run-log shape | `never-sleep-agent` skill |
| Product pipeline, domain skills, quality gates | **this `AGENTS.md`** |
| Ops board data | Notion under **user root** (Notion MCP) |
| Human channel | Slack (Slack MCP) |
| Data / Auth | Supabase MCP + skills |
| Deploy / previews | Vercel MCP + skills |
| Human helmsman | Slack owner → Notion `STEER · *` |
| Agent direction | **director** Automation |

### Immutable ops (do not override)

1. Cron = spawn only; wakes may run **30–90+ minutes**. Never shorten real work to fit cron.
2. Base branch = **`main` or `dev`** (see `never-sleep.config.json` → `immutable.baseBranch`). Feature branches merge into that base only.
3. **Auto-merge** green, lease-safe overnight PRs into the base branch (unless owner STEER says hold).
4. Worker parent: orchestrate only; all product implementation via **Task subagents**.
5. Notion + Slack MCP every wake; hub only under configured Notion root.
6. Owner STEER outranks agent plans; no empty-handed exits.

Full text: skill `references/immutable-ops.md`.

### Required MCPs (hard)

Every wake: **Notion** + **Slack**. When in scope: **Supabase** + **Vercel**. Do not bypass available MCPs.

### Default companion skills

```bash
node path/to/never-sleep-agent/scripts/adopt.mjs --install-skills
```

### Cursor Automations

| Role | Does |
|---|---|
| worker | HEAVY/LIGHT/MERGE orchestrator — Task subagents implement |
| director | priorities, parallelTracks, Decisions |
| researcher | web / X / YouTube → **Research DB** |
| auditor | workflow / schema / MCP gaps |

**Project-local prompts** (customize in onboarding, then paste into Cursor):

- `docs/ops/automation-worker.md`
- `docs/ops/automation-director.md`
- `docs/ops/automation-researcher.md`
- `docs/ops/automation-auditor.md`

Vanilla skill templates are starting points only. Checklist: skill `templates/automation-prompt.md`.

### Every Automation wake

1. Follow `never-sleep-agent` for your role + immutable ops
2. MCP gate → owner Slack → `STEER · *` → ack
3. Read active STEER first
4. Role-native work (worker: spawn subagents)
5. Exit packet via Notion + Slack
6. No empty-handed exits; auto-merge when green into base branch

### Product plugin (fill in during onboarding)

- Primary track:
- Forbidden shortcuts:
- Evidence required in run-log:
- Research topic hints:
- Supabase project ref:
- Vercel project:
- Monorepo / app paths:

### Notion / Slack (user inputs)

- **Notion root** (`notion.rootPageUrl`):
- Workspace structure: skill `templates/notion-workspace-structure.md`
- DBs: Tasks / Documents / **Requests** / **Research** / **Goals** / **Findings** / BOARD:
- Owner Slack user IDs:
- Outbox channel / thread:
- Base branch (`immutable.baseBranch`): main | dev
