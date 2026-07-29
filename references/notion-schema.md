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

Optional but useful: Assignee, Related Document, Source (`slack` / `seed` / `agent`).

### Documents

Minimum properties:

| Property | Type | Notes |
|---|---|---|
| Name | title | naming rules below |
| Kind | select | `run-log` \| `decision` \| `status` \| `brief` \| `prompt` |
| Status | status/select | In progress / Done / … |
| Summary | text | one-line for board scans |
| Related Asset | text / relation | optional product link |

## Naming rules

| Pattern | Kind | Purpose |
|---|---|---|
| `Run log · YYYY-MM-DD HH:mm UTC · <MODE>` | `run-log` | every wake exit |
| `LEASE · <branch>` | `status` | exclusive work claim |
| `BOARD · heartbeat …` | `status` | shared overnight pointer |
| `Decision · …` | `decision` | locked choices |
| `Brief · …` | `brief` | research / context packs |
| `Prompt · …` | `prompt` | reusable automation text |

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
nextHeavy: <Task title or one-liner>
```

Update `heartbeatAt` / `nextHeavy` every wake. HEAVY wakes should leave a concrete `nextHeavy` for the following agent.

## LEASE document

See `wake-protocol.md`. One active lease per exclusive code area. Overlapping unexpired leases on the same areas → other agents stay LIGHT.

## Slack → Task absorption

When inbox yields a human request:

1. Create Task: Status `Not started` (or `In progress` if acting now), Priority from urgency (`P0` if “do tonight”)
2. Notes: quote Slack permalink + raw ask
3. Optionally set Source = `slack`
4. If it should be next HEAVY, update BOARD `nextHeavy`
5. Ack in Slack thread

## Query habits (agent)

Prefer:

1. Active `LEASE · *` with Status In progress
2. `BOARD · *` for `nextHeavy`
3. Tasks sorted Priority then Status
4. Latest few `Run log · *` for continuity

Use Notion MCP search/fetch/query tools available in the environment. Do not invent schema fields that are not on the DB — adapt to the project’s actual property names when they differ, and note drift in run-log.
