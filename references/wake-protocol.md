# Wake protocol

## Cron ≠ deadline

Cursor Automation cron (`*/N`) **only spawns** a wake.  
The wake itself may run **30–90+ minutes** (longer if the product track needs it).

Do **not**:

- skip mandatory product steps to “fit” the cron interval
- treat the next cron tick as a kill signal for good work
- exit early with “nothing to do”

## Role

Each Cursor Automation declares `role` = `worker` | `director` | `researcher` | `auditor`.  
See [`roles.md`](roles.md). Shared steps below; role-native work differs after the preamble.

## Entry checklist (shared preamble)

Every wake, in order:

1. **Identity** — agent URL / branch / wake time (UTC) / **role**
2. **Config** — `never-sleep.config.json` (Notion IDs, `slack.ownerUserIds`, `roles.enabled`, `mcp.required`)
3. **MCP gate** — Notion + Slack MCPs must work this wake; Supabase/Vercel MCPs when those surfaces are in scope (`required-mcps.md`). Auth failure → run-log `DEGRADED` + ops Task, do not fake sync.
4. **Slack Inbox (helmsman)** — via **Slack MCP**: absorb **owner** replies → Notion **MCP** `STEER · *` (+ Tasks) → ack
5. **Steer scan** — active `STEER · *` first (outranks all agent plans)
6. **Board scan** — `BOARD · *` (`activeSteer`, `nextHeavy`, `parallelTracks`), Tasks, LEASEs, recent role run-logs
7. **Role branch** — continue with the matching section below; load [`default-skills.md`](default-skills.md) companions when implementing/deploying

### Worker continuation

8. **Collision** — `gh pr list` + leases (`collision-and-merge.md`)
9. **Mode** — HEAVY / LIGHT / MERGE (aligned with STEER + director BOARD)
10. **OMD gate** — soft-require (`omd-gate.md`)
11. **Work via subagents** — parent does **not** implement inline; spawn Cursor Task subagents per [`worker-subagents.md`](worker-subagents.md) (`AGENTS.md` + default skills + Supabase/Vercel MCP in the brief)
12. **Exit packet** (Notion + Slack MCP) — cite every subagent in the run-log

### Director continuation

8. Wide read via **Notion MCP** — Decisions, Research, Audits, all open Tasks
9. **Mode DIRECT** — rebalance priorities, `parallelTracks`, write `Decision · *`
10. **Exit packet** (no product LEASE)

### Researcher continuation

8. Follow [`research-protocol.md`](research-protocol.md); persist via **Notion MCP**
9. **Mode RESEARCH**
10. **Exit packet**

### Auditor continuation

8. Follow [`audit-protocol.md`](audit-protocol.md) — include MCP + default-skills checklist
9. **Mode AUDIT**
10. **Exit packet**

## Modes

### HEAVY

Preconditions (typical):

- ≤1 open automation PR (or policy allows continuing the same lease branch)
- no unexpired overlapping `LEASE · *` on the same code areas
- a clear `nextHeavy` / P0–P1 Task exists (or STEER/inbox created one)
- work target aligns with active owner STEER (if any)

Actions:

- claim `LEASE · <branch>` (default ~90m; refresh while working)
- **spawn Task subagents** to implement via project AGENTS / domain skills along the steered direction — parent must not code the product itself (`worker-subagents.md`)
- subagents push / open/update PR; parent drives toward green (merge when safe)
- write evidence + **subagent list** into run-log; mark STEER `Done` only when that steer was applied or superseded

### LIGHT

When HEAVY would collide or the board is blocked:

- do **not** open a competing implementation PR
- still merge green, lease-safe PRs
- update Tasks / BOARD / run-log
- plan next HEAVY, or run **idle-research**

### MERGE

When a PR is green and lease-safe:

- land it (repo policy: auto-merge or explicit merge)
- release / close related lease if done
- update Tasks + BOARD `nextHeavy`
- report in Slack

## Leases

Before HEAVY code changes, create or update a Notion Document:

| Field | Value |
|---|---|
| Name | `LEASE · <branch-name>` |
| Kind | `status` |
| Status | `In progress` |
| Summary | one line: what + `leaseUntil` |

Defaults:

- general HEAVY: **~90 minutes** from claim
- short polish / docs-only: **~45 minutes** is OK if project AGENTS says so

While working, **refresh** `leaseUntil` / heartbeat so other wakes stay in LIGHT.

On finish or abort: set lease Status to `Done` (or clear Summary to expired) and point BOARD at next work.

## Exit packet (mandatory)

Never end a wake without all of:

1. **Run log** Document — name `Run log · YYYY-MM-DD HH:mm UTC · <MODE>`
2. **BOARD update** (if project uses BOARD) — `activeSteer`, `nextHeavy`, openPrCount, heartbeatAt
3. **Slack Outbox** — mode / changes / PR / evidence / steer / next / blockers
4. **Inbox absorb** — any new **owner** thread replies since start → STEER (+ Tasks)
5. **Next wake recommendation** — HEAVY target or LIGHT reason (must cite STEER when present)

### Run-log minimum sections

```markdown
## Mode
HEAVY | LIGHT | MERGE | DIRECT | RESEARCH | AUDIT — role=<worker|director|researcher|auditor> — why

## Active steer
STEER url(s) + one-line owner intent (or none)

## Open PRs
count + links at wake start

## Lease
claimed / refreshed / none

## What changed
bullets

## Evidence
PR, commits, screenshots, artifact paths

## Inbox / steer absorbed
STEER + Tasks created from owner Slack (or none)

## Next wake recommendation
1. … (aligned with activeSteer)
```

## Idle-research (anti empty-hand)

If a **worker** is blocked and MERGE has nothing:

- light research on blockers (docs, upstream, env)
- propose or create Notion Tasks
- still post Slack Outbox with findings

Deep multi-source trend passes belong to the **researcher** Automation (`research-protocol.md`). This skill only forbids silent no-op exits.

## First wake (SEED)

Optional bootstrap wake when human arms overnight:

1. Confirm Notion Tasks + Documents parents
2. Create or refresh `BOARD · heartbeat …`
3. Plant initial P0–P1 Tasks if missing
4. Write `Run log · … · SEED`
5. Slack: “armed — nextHeavy = …”

See `templates/notion-bootstrap.md`.
