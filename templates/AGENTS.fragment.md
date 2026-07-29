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
| Ops board data | Notion |
| Handbook | Oh My Docs (if `.omd/project.json` exists) |
| Human helmsman | Slack owner → Notion `STEER · *` |
| Agent direction | **director** Automation (priorities, parallelTracks, Decisions) |

### Cursor Automations

| Role | Does |
|---|---|
| worker | HEAVY/LIGHT/MERGE under LEASE |
| director | board-wide direction, priorities, parallel work, Decisions |
| researcher | web / X / YouTube → `Research ·` briefs |
| auditor | missing decisions, Notion schema, workflow gaps |

Prompts: skill `templates/automation-*.md`.

### Every Automation wake

1. Follow `never-sleep-agent` for your **role**
2. Absorb owner Slack → `STEER · *` (+ Tasks) → ack
3. Read active STEER first (helmsman > director > agent plans)
4. Do **role-native** work (workers: product sections below)
5. Exit packet: role-tagged run-log + BOARD + Slack
6. **No empty-handed exits**

### Product plugin (fill in — worker primary)

- Primary track:
- Forbidden shortcuts:
- Evidence required in run-log:
- Research topic hints (for researcher):

### Notion

- Tasks / Documents parents:
- BOARD: `BOARD · heartbeat …` (`activeSteer`, `nextHeavy`, `parallelTracks`)
- Lease default: ~90m for worker HEAVY

### Slack (helmsman)

- Outbox channel / standing thread:
- Owner Slack user IDs (`slack.ownerUserIds`):
- Inbox: owner replies → STEER
