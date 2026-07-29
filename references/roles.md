# Cursor Automation roles

never-sleep runs as **four Cursor Automations** (four cron-spawned agents) that share one Notion hub + Slack standing thread. They do not chat with each other; they coordinate through Notion.

Human owner Slack replies remain the **helmsman** (`STEER · *`). Agent roles never outrank active owner STEER.

## Role map

| Role | Cursor Automation | Job | Default cadence |
|---|---|---|---|
| **worker** | Implementation wake | HEAVY/LIGHT/MERGE code + product work under leases | frequent (`*/10`–`*/20`) |
| **director** | Direction wake | Read whole board; set priorities; plan parallel tracks; make tech/product decisions | medium (`*/30`–hourly) |
| **researcher** | Research wake | Trend research (web, X, YouTube) → Notion briefs + candidate Tasks | slower (hourly+) |
| **auditor** | Workflow wake | Find missing decisions; Notion schema/bootstrap; workflow gaps | slow (few×/night or daily) |

Each Automation gets its own prompt from `templates/automation-<role>.md` and should set `role` in run-logs / config.

## Shared entry (all roles)

Every role still:

1. Loads config (`never-sleep.config.json`)
2. Absorbs owner Slack → STEER (idempotent; do not duplicate)
3. Reads active STEER + BOARD
4. Writes a role-tagged run-log + Slack outbox slice
5. Never exits empty-handed

Role-specific work comes **after** that shared preamble. Details: `wake-protocol.md`.

## Authority & write rights

| Artifact | worker | director | researcher | auditor |
|---|---|---|---|---|
| Code / PR (product) | **yes** (under LEASE) | no* | no | no* |
| `LEASE · *` claim | **yes** | no | no | no |
| Task Priority / Status rebalance | light touch | **yes** | propose only | propose / fix ops Tasks |
| Parallel track plan on BOARD | read | **yes** | suggest | suggest |
| `Decision · *` | rare | **yes** | rare | gap → draft for director/owner |
| `STEER · *` (owner voice) | absorb only | absorb only | absorb only | absorb only |
| `Research · *` / research `brief` | no | read | **yes** | read |
| `Audit · *` workflow review | no | read | read | **yes** |
| Notion DB / property setup | no | request | no | **yes** (bootstrap + repairs) |
| Merge green lease-safe PRs | **yes** | yes if unblocking | no | yes if unblocking ops |

\* director/auditor may touch **ops docs / skill / AGENTS fragments** only when the Task explicitly says so and no worker lease overlaps those paths. Prefer filing Tasks for the worker.

## Director — direction & decisions

**Reads:** all recent STEER, BOARD, Tasks, LEASEs, run-logs, Research briefs, Audit findings, OMD/handbook if present.

**Writes:**

- Reordered Task priorities (P0–P3)
- BOARD: `nextHeavy`, `parallelTracks`, `directorAt`, decision links
- `Decision · …` for technical / functional locks (API shape, quality bar, track split, “do X not Y”)
- New Tasks for parallelizable work with clear `codeAreas` / non-overlap notes
- Slack: direction summary + what workers should pick next

**Does not:** open competing product implementation PRs or hold long code leases.

**Parallel work:** mark 2–N Tasks as ready with disjoint `codeAreas` (or explicit “same area → serialize”). Workers claim one lease each; if only one worker Automation exists, `parallelTracks` still prepares the queue for overlapping cron spawns / future agents.

## Worker — implementation

Owns HEAVY/LIGHT/MERGE and product `AGENTS.md` execution. See `wake-protocol.md` + `collision-and-merge.md`.

Picks work from:

1. active STEER
2. BOARD `nextHeavy` / `parallelTracks` (director-shaped)
3. P0–P1 Tasks (`slack-steer` first)

## Researcher — trends → Notion

Protocol: [`research-protocol.md`](research-protocol.md).

Outputs `Research · …` (Kind `brief`) with sources, and optional candidate Tasks (`Source=research`) at **P2** unless director/STEER promotes them.

Never skips citing sources. Never pretends research is product completion.

## Auditor — workflow integrity

Protocol: [`audit-protocol.md`](audit-protocol.md).

Checks missing decisions, schema drift, broken adopt pieces, stale leases, STEER not applied, empty-handed wakes, role coverage. May create/repair Notion DB properties per bootstrap guide. Files `Audit · …` + ops Tasks; escalates blockers to Slack.

## Collision between roles

- Multiple **workers** → normal lease/PR collision rules
- **director** vs **worker**: director changes priorities/decisions; worker finishes current lease slice then adopts new BOARD/`nextHeavy` on next wake (or aborts if STEER/Decision says stop)
- **researcher** never blocks workers
- **auditor** fixes ops schema without stealing product leases

## Cursor setup tips

1. Create **four Automations** in Cursor, same repo, different prompts
2. Stagger crons so director runs before a worker burst when possible (not required)
3. Same Notion hub + same Slack thread; tag Slack lines with role (`worker` / `director` / …)
4. Put `"role": "worker"|…` in each Automation prompt and in run-log Mode line: `HEAVY · role=worker`
5. Model choice: director/auditor can be stronger reasoning; worker/researcher can be faster — team preference

## Run-log role tag

```markdown
## Mode
HEAVY | LIGHT | MERGE | DIRECT | RESEARCH | AUDIT — role=<worker|director|researcher|auditor>
```

Modes `DIRECT` / `RESEARCH` / `AUDIT` are role-native (not product HEAVY). Workers still use HEAVY/LIGHT/MERGE.
