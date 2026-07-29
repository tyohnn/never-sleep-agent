<!--
  never-sleep-agent — paste/merge into the target repo AGENTS.md
  Product rules stay in this file; ops loop stays in the skill.
-->

## Overnight ops (never-sleep-agent)

This repo participates in the **never-sleep-agent** wake loop.

### Ownership split

| Concern | Owner |
|---|---|
| Wake modes, LEASE, Slack in/out, run-log shape | `never-sleep-agent` skill |
| Product pipeline, domain skills, quality gates | **this `AGENTS.md`** |
| Ops board data | Notion |
| Handbook | Oh My Docs (if `.omd/project.json` exists) |

### Every Automation wake

1. Read and follow the `never-sleep-agent` skill
2. Absorb **owner** Slack replies → Notion `STEER · *` (+ Tasks if actionable) → ack
3. Read active STEER **before** choosing work — helmsman outranks agent Tasks/docs
4. Collision-check → pick HEAVY / LIGHT / MERGE (aligned with STEER)
5. Soft OMD gate when present
6. Do product work **using the sections below** (not inventing a parallel process)
7. Exit packet: run-log + BOARD (`activeSteer`, `nextHeavy`) + Slack outbox + next recommendation
8. **No empty-handed exits** — idle-research if blocked

### Product plugin (fill in)

- Primary track:
- Forbidden shortcuts:
- Evidence required in run-log:
- Idle-research specialization:

### Notion

- Tasks parent / data source:
- Documents parent / data source:
- BOARD document name: `BOARD · heartbeat …`
- Lease default: ~90m for HEAVY implementation

### Slack (helmsman)

- Outbox channel / standing thread:
- Owner Slack user IDs (`slack.ownerUserIds`):
- Inbox: owner thread replies → Notion STEER (optional emoji gate: off by default)
- Rule: active STEER outranks agent-authored plans
