# Wake protocol

## Cron ≠ deadline

Cursor Automation cron (`*/N`) **only spawns** a wake.  
The wake itself may run **30–90+ minutes** (longer if the product track needs it).

Do **not**:

- skip mandatory product steps to “fit” the cron interval
- treat the next cron tick as a kill signal for good work
- exit early with “nothing to do”

## Entry checklist

Every wake, in order:

1. **Identity** — note agent URL / branch / wake time (UTC)
2. **Config** — load project never-sleep config if present (`never-sleep.config.json` or documented Notion parent IDs), including `slack.ownerUserIds`
3. **Slack Inbox (helmsman)** — absorb **owner** thread replies → Notion `STEER · *` (+ Tasks if actionable) → ack (see `slack-protocol.md`)
4. **Steer scan** — active `STEER · *` first; these outrank agent Tasks/docs when choosing direction
5. **Board scan** — `BOARD · *` (`activeSteer`, `nextHeavy`), Tasks (P0–P3, prefer `slack-steer`), recent run-logs, active `LEASE · *`
6. **Collision** — `gh pr list` + unexpired leases (see `collision-and-merge.md`)
7. **Mode** — HEAVY / LIGHT / MERGE (must not contradict active STEER)
8. **OMD gate** — soft-require (see `omd-gate.md`)
9. **Work** — project `AGENTS.md` owns product steps; owner STEER owns *direction*
10. **Exit packet** — always (below)

## Modes

### HEAVY

Preconditions (typical):

- ≤1 open automation PR (or policy allows continuing the same lease branch)
- no unexpired overlapping `LEASE · *` on the same code areas
- a clear `nextHeavy` / P0–P1 Task exists (or STEER/inbox created one)
- work target aligns with active owner STEER (if any)

Actions:

- claim `LEASE · <branch>` (default ~90m; refresh while working)
- implement via project AGENTS / domain skills **along the steered direction**
- push, open/update PR, drive toward green
- write evidence into run-log; mark STEER `Done` only when that steer was applied or superseded

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
HEAVY | LIGHT | MERGE — why

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

If HEAVY is blocked and MERGE has nothing:

- research blockers (docs, upstream, env)
- propose or create Notion Tasks / decision notes
- optionally capture links into a `brief` Document
- still post Slack Outbox with findings

Project AGENTS may specialize idle-research (web, yt-dlp, handbook, etc.). This skill only forbids silent no-op exits.

## First wake (SEED)

Optional bootstrap wake when human arms overnight:

1. Confirm Notion Tasks + Documents parents
2. Create or refresh `BOARD · heartbeat …`
3. Plant initial P0–P1 Tasks if missing
4. Write `Run log · … · SEED`
5. Slack: “armed — nextHeavy = …”

See `templates/notion-bootstrap.md`.
