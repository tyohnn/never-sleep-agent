<!--
  never-sleep-agent — paste/merge into the target repo AGENTS.md
  Product rules stay in this file; ops loop stays in the skill.
-->

## Overnight ops (never-sleep-agent)

This repo participates in the **never-sleep-agent** wake loop via **four Cursor Automations**.

### Ownership split

| Concern | Owner |
|---|---|
| Roles, LEASE, Slack/STEER, run-log shape | `never-sleep-agent` skill |
| Product pipeline, domain skills, quality gates | **this `AGENTS.md`** |
| Ops board data | Notion (**Notion MCP**) |
| Human channel | Slack (**Slack MCP**) |
| Data / Auth platform | Supabase (**Supabase MCP** + supabase skills) |
| Deploy / previews | Vercel (**Vercel MCP** + vercel skills) |
| Handbook | Oh My Docs (if `.omd/project.json` exists) |
| Human helmsman | Slack owner → Notion `STEER · *` |
| Agent direction | **director** Automation |

### Required MCPs (hard)

Every wake must use **Notion** + **Slack** MCP. Use **Supabase** and **Vercel** MCP whenever those surfaces are touched. Do not bypass available MCPs.

### Default companion skills

Install once on the environment:

```bash
node path/to/never-sleep-agent/scripts/adopt.mjs --install-skills
```

Includes React/Next/shadcn/turborepo/ai-sdk/vercel/supabase/ui-ux/agent-browser packs. See skill `references/default-skills.md`.

### Cursor Automations

| Role | Does |
|---|---|
| worker | HEAVY/LIGHT/MERGE orchestrator — **all direct work via Task subagents** |
| director | board-wide direction, priorities, parallel work, Decisions |
| researcher | web / X / YouTube → `Research ·` briefs |
| auditor | missing decisions, Notion schema, MCP/skills gaps |

Prompts (separate files — **human must paste into Cursor Automations**):

- `templates/automation-worker.md`
- `templates/automation-director.md`
- `templates/automation-researcher.md`
- `templates/automation-auditor.md`

Checklist: `templates/automation-prompt.md`. Skill install alone does **not** register Automations.

### Every Automation wake

1. Follow `never-sleep-agent` for your **role**
2. MCP gate → absorb owner Slack → `STEER · *` → ack
3. Read active STEER first
4. Role-native work (workers: spawn subagents with product sections + default skills in the brief — parent does not code)
5. Exit packet via Notion + Slack MCP
6. **No empty-handed exits**

### Product plugin (fill in — worker primary)

- Primary track:
- Forbidden shortcuts:
- Evidence required in run-log:
- Research topic hints (for researcher):
- Supabase project ref (if any):
- Vercel project (if any):

### Notion / Slack (user inputs)

- **Notion root page URL** (`notion.rootPageUrl`) — required:
- Tasks / Documents / BOARD (under that root):
- Owner Slack user IDs (`slack.ownerUserIds`):
- Standing outbox thread / channel:

### Automations (human must configure prompts)

Cursor Automations ×4 — paste role prompts into each Automation’s **Prompt settings** (see skill `templates/automation-prompt.md`). Files on disk alone do nothing.
