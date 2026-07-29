# Notion schema (v0)

Ops data lives in Notion. v0 does **not** auto-create databases; humans bootstrap (see `templates/notion-bootstrap.md`).

## Databases

### Tasks

Minimum properties:

| Property | Type | Notes |
|---|---|---|
| Name | title | Task title |
| Status | status/select | e.g. Not started / In progress / Done / Blocked |
| Priority | select | `P0` `P1` `P2` `P3` |
| Notes | rich text / text | acceptance, links, agent scratch |
| Branch | text / url | working branch |
| PR | url / text | pull request link |

Optional but useful: Assignee, Related Document, **Source** (`slack-steer` / `slack` / `seed` / `agent`).

Human-steered Tasks should use `Source=slack-steer` and usually **P0/P1**.

### Documents

Minimum properties:

| Property | Type | Notes |
|---|---|---|
| Name | title | naming rules below |
| Kind | select | `run-log` \| `decision` \| `status` \| `brief` \| `prompt` \| **`steer`** |
| Status | status/select | In progress / Done / … |
| Summary | text | one-line for board scans |
| Related Asset | text / relation | optional product link |

If the Documents DB cannot add `steer` yet, use Kind=`decision` with Name prefix `STEER ·` and note the workaround in the run-log. Prefer adding `steer` at bootstrap.

## Naming rules

| Pattern | Kind | Purpose |
|---|---|---|
| `Run log · YYYY-MM-DD HH:mm UTC · <MODE>` | `run-log` | every wake exit |
| `LEASE · <branch>` | `status` | exclusive work claim |
| `BOARD · heartbeat …` | `status` | shared overnight pointer |
| **`STEER · YYYY-MM-DD HH:mm UTC · <short>`** | **`steer`** | **owner Slack opinion / direction** |
| `Decision · …` | `decision` | locked choices |
| `Brief · …` | `brief` | research / context packs |
| `Prompt · …` | `prompt` | reusable automation text |

## STEER documents (helmsman)

Owner Slack thread replies are persisted as STEER so later wakes can redirect work without reading Slack history.

### When to write

- **Every new owner reply** in the standing overnight thread (and optional inbox channel)
- Opinion, veto, priority change, quality bar, “stop X / do Y” — all count
- Actionable asks also get a Task; the STEER still exists as the durable voice of the owner

### Body shape

```markdown
## Source
- slack: <permalink>
- user: <owner slack id or name>
- absorbedAt: <ISO>
- wake: <agent url>

## Owner said
> <verbatim quote>

## Interpretation
- intent: <one line>
- actionable: yes | no
- priority: P0 | P1 | …
- supersedes: <prior STEER url or none>

## Linked
- Task: <url or none>
- affects: nextHeavy | lease | merge hold | quality bar | …
```

### Lifecycle

| Status | Meaning |
|---|---|
| `In progress` | Active steering — must influence `nextHeavy` / mode choice |
| `Done` | Applied, superseded, or explicitly withdrawn by owner |

When a newer STEER replaces an older one, mark the old STEER `Done`, set `supersedes`, and point BOARD `activeSteer` at the new page.

### Priority vs agent artifacts

| Rank | Artifact |
|---|---|
| 1 | Active `STEER · *` (owner) |
| 2 | BOARD `nextHeavy` / `activeSteer` |
| 3 | Tasks with `Source=slack-steer` |
| 4 | Other human Tasks |
| 5 | Agent Tasks, agent run-log suggestions |

Agent-written docs never outrank an active STEER.

## BOARD document (recommended)

Not strictly required for skill core, but strongly recommended for multi-wake continuity.

Keep a short machine-readable block plus human notes:

```text
agent: <cursor agent url>
branch: <current or last HEAVY branch>
pr: <url or pending>
codeAreas: <comma paths>
intent: <one line>
startedAt: <ISO>
leaseUntil: see LEASE · <branch> | <ISO>
heartbeatAt: <ISO>
openPrCount: <n>
activeSteer: <STEER url or none>
nextHeavy: <Task title or one-liner>
```

Update `heartbeatAt`, `activeSteer`, and `nextHeavy` every wake. If an active STEER exists, `nextHeavy` must not contradict it.

## LEASE document

See `wake-protocol.md`. One active lease per exclusive code area. Overlapping unexpired leases on the same areas → other agents stay LIGHT.

Owner STEER may order lease release / hold / redirect — obey and document in run-log.

## Slack → STEER + Task absorption

When inbox yields an **owner** reply:

1. Create Document: Name `STEER · <UTC> · <short>`, Kind `steer`, Status `In progress`, Summary = one-line intent
2. Body: verbatim quote + interpretation + Slack permalink
3. If actionable: create Task (`Source=slack-steer`, Priority P0/P1 unless owner said otherwise), link from STEER
4. Update BOARD `activeSteer` (+ `nextHeavy` when implied)
5. Supersede older conflicting STEERs (`Done`)
6. Ack in Slack thread

## Query habits (agent)

Prefer, in order:

1. Active `STEER · *` (Status In progress) — **read before choosing work**
2. `BOARD · *` for `activeSteer` + `nextHeavy`
3. Active `LEASE · *`
4. Tasks: `slack-steer` / P0–P1 first, then others
5. Latest few `Run log · *` for continuity (agent suggestions only)

Use Notion MCP search/fetch/query tools available in the environment. Do not invent schema fields that are not on the DB — adapt to the project’s actual property names when they differ, and note drift in run-log.
