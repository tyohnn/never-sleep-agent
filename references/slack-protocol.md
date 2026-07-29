# Slack protocol

Slack is the **human control surface**: outbox every wake, inbox absorbed into Notion.

The overnight **owner (주인)** is the **helmsman (조타수)**. Their thread replies are not chat trivia — they are high-priority steering that must be persisted in Notion and used to redirect work above agent-authored Tasks/docs.

## Outbox (every wake)

Post (or reply in the standing overnight thread) a short report before exit.

Minimum fields:

| Field | Content |
|---|---|
| Mode | HEAVY / LIGHT / MERGE (+ one-line why) |
| Changed | bullets of what landed or moved |
| PR | link(s) or “none” |
| Evidence | screenshots, artifact paths, Notion run-log URL |
| Steer | active STEER links absorbed / applied — or “none” |
| Next | nextHeavy recommendation |
| Blockers | env / lease / human decision — or “none” |

Template: [`templates/slack-report.md`](../templates/slack-report.md).

Prefer **one standing thread per overnight window** (or per repo). New top-level posts only when starting a new night / new adopt.

## Inbox (human → agent)

### Owner = helmsman

Config `slack.ownerUserIds` (Slack user IDs) identifies whose replies count as **steer**.

| Author | Treatment |
|---|---|
| Owner (in `ownerUserIds`) | Persist → **Requests** row + **STEER** Document + Task when actionable. Highest priority for direction. |
| Other humans (if any) | Optional: Request/Task only if clearly actionable; do **not** override owner STEER |
| Bots / the agent | Ignore for inbox absorb |

If `ownerUserIds` is empty, treat the first human replier in the standing thread as provisional owner for that night, and note the ambiguity in the run-log. Prefer setting IDs at adopt time.

### v0 default: thread replies

On wake start (and again before exit):

1. Read replies on the standing outbox thread since last absorb
2. Filter to **owner** replies (helmsman)
3. For each new owner reply → create/update **Requests** row (`Status=inbox`) with raw quote + Slack permalink
4. Write Notion **STEER** Document linked to that Request — even for opinion-only asks
5. If actionable → Task (`Source=slack-steer` / `request`), link Request (+ Goal when clear)
6. Update BOARD: `activeSteer`, `openRequests`, `nextHeavy` / `activeGoal` when implied
7. Ack in-thread: Request URL + STEER URL (+ Task) + whether direction/goal changed
8. Record absorbed Requests in the run-log

Do **not** rely on Slack thread memory alone. Asks must land in **Requests** (not only STEER prose).

Non-owner chatter: ack lightly or ignore; do not spam STEER docs.

### Optional: dedicated channel

If config sets `slack.inboxChannelId`, also scan that channel for recent **owner** messages (same absorb rules). Still prefer threading under the overnight report when possible.

### Optional: emoji gate

If config enables `slack.emojiGate` (e.g. 📌):

- only owner messages / replies with that reaction become STEER/Tasks
- reduces noise in busy channels

v0 default is **owner thread replies without emoji gate**. Enable emoji when the channel is shared or noisy.

## Priority: steer outranks agent plans

When choosing mode / `nextHeavy` / what to implement:

1. **Active owner STEER** (Status In progress / newest unsuperseded)
2. BOARD `nextHeavy` (should already reflect steer)
3. Human-sourced Tasks (`Source=slack-steer` / `slack`)
4. Agent-seeded Tasks and agent run-log suggestions

If agent plans conflict with an active STEER, **follow the STEER** (or LIGHT + ask via Slack if impossible). Never silently continue the old agent plan.

## Ack patterns

```text
Request absorbed → <Requests url>
STEER: <url> · Task: <url or none> · Goal: <url or none>
Priority: P0 · nextHeavy: yes
Direction: <one line restatement>
```

```text
Request noted (opinion only) → <Requests url> + STEER: <url>
No Task; BOARD activeSteer updated.
```

```text
Cannot comply yet: <blocker>. Staying LIGHT. STEER kept In progress.
```

## Auth / tooling

**Prefer Slack MCP** for inbox + outbox. See `required-mcps.md`. Other bot/token paths are last-resort fallbacks only when MCP is unavailable.

If Slack MCP is unavailable:

- still complete Notion run-log + BOARD (via Notion MCP)
- note `DEGRADED · missing=slack` + reason in run-log
- continue using any STEER already in Notion
- file an ops Task; do not skip the rest of the exit packet

## What owners can say in-thread

Useful shapes:

- `P0: remint barracks via real pipeline`
- `stop HEAVY on X — do Y instead`
- `merge #42 when green`
- `next night focus: Track B polish only`
- `disagree with last run-log — quality bar is …`

Every such reply becomes a Notion STEER (plus Task when actionable). Agent restates the direction in ack so the owner can correct immediately.
