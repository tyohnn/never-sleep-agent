# Notion bootstrap (manual, v0)

v0 does **not** fully auto-create Notion databases. Use this checklist once per overnight project (or shared hub).

## 1. Databases

Create (or reuse) two databases under a project parent page:

### Tasks

Properties:

- **Name** (title)
- **Status** — Not started / In progress / Done / Blocked
- **Priority** — P0 / P1 / P2 / P3
- **Notes** (text)
- **Branch** (text)
- **PR** (url)

Optional: Source (slack/seed/agent), Related Document.

### Documents

Properties:

- **Name** (title)
- **Kind** — `run-log` | `decision` | `status` | `brief` | `prompt`
- **Status** — In progress / Done
- **Summary** (text)
- **Related Asset** (text or relation) — optional

## 2. Seed documents (recommended)

| Name | Kind | Status |
|---|---|---|
| `BOARD · heartbeat armed` | status | In progress |
| `Run log · <UTC> · SEED` | run-log | Done |

BOARD body: see `references/notion-schema.md` machine block. Set an initial `nextHeavy`.

SEED run-log: list planted Tasks + “heartbeat may start”.

## 3. Seed tasks

Plant at least one **P0/P1** Task the first HEAVY wake can claim. Prefer small, evidence-backed first slice over a giant slate.

## 4. Hand to config

Copy IDs/URLs into `never-sleep.config.json` (from `config.example.json`) and into the Automation prompt.

## 5. Optional shared hub

Multi-repo: either

- **A)** one Notion hub (shared Tasks/Documents) + per-repo AGENTS product rules, or
- **B)** per-repo Notion parents

Document the choice on BOARD. Skill core supports both; agents must not guess the wrong parent.
