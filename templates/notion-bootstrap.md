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

Optional: Source (`slack-steer` / `slack` / `seed` / `agent` / `director` / `research` / `audit`), Related Document.

### Documents

Properties:

- **Name** (title)
- **Kind** — `run-log` | `decision` | `status` | `brief` | `prompt` | **`steer`**
- **Status** — In progress / Done
- **Summary** (text)
- **Related Asset** (text or relation) — optional

`steer` is required for helmsman persistence. If you cannot add the option yet, use Name `STEER · …` with Kind=`decision` temporarily.

## 2. Seed documents (recommended)

| Name | Kind | Status |
|---|---|---|
| `BOARD · heartbeat armed` | status | In progress |
| `Run log · <UTC> · SEED` | run-log | Done |

BOARD body: see `references/notion-schema.md` machine block. Include `activeSteer: none`, `nextHeavy`, `parallelTracks: none`, `directorAt: none`.

SEED run-log: list planted Tasks + “heartbeat may start”. Owner Slack replies after arming create `STEER · *` docs. Expect `Research ·` / `Audit ·` / `Decision ·` from the matching Cursor Automations.

## 3. Seed tasks

Plant at least one **P0/P1** Task the first **worker** HEAVY wake can claim. Prefer small, evidence-backed first slice over a giant slate. Director will rebalance and add parallel tracks later.

## 4. Hand to config + four Automations + MCPs + skills

Copy IDs/URLs into `never-sleep.config.json` (from `config.example.json`).

Set `slack.ownerUserIds` to the helmsman Slack user id(s).

Authenticate Cursor MCPs: **Notion, Slack, Supabase, Vercel** (`references/required-mcps.md`).

Install default companion skills: `node scripts/adopt.mjs --install-skills`.

**Human:** create four Cursor Automations and **paste/save** each role prompt (`templates/automation-prompt.md`). Files on disk are not enough.

## 5. Optional shared hub

Multi-repo: either

- **A)** one Notion hub (shared Tasks/Documents) + per-repo AGENTS product rules, or
- **B)** per-repo Notion parents

Document the choice on BOARD. Skill core supports both; agents must not guess the wrong parent.
