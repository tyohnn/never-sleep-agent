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
| Owner (in `ownerUserIds`) | Always persist opinion → Notion **STEER** Document + Task when actionable. Highest priority for direction. |
| Other humans (if any) | Optional: Task only if clearly actionable; do **not** override owner STEER |
| Bots / the agent | Ignore for inbox absorb |

If `ownerUserIds` is empty, treat the first human replier in the standing thread as provisional owner for that night, and note the ambiguity in the run-log. Prefer setting IDs at adopt time.

### v0 default: thread replies

On wake start (and again before exit):

1. Read replies on the standing outbox thread since last absorb
2. Filter to **owner** replies (helmsman)
3. For each new owner reply → write Notion **STEER** (see `notion-schema.md`) — **even if** it is opinion/direction without a concrete task
4. If actionable → also create/update Notion Task (`Source=slack-steer`, high Priority)
5. Update BOARD: `activeSteer`, and `nextHeavy` when the steer implies it
6. Ack in-thread: STEER URL (+ Task URL if any) + whether direction changed
7. Record absorbed steers in the run-log

Do **not** rely on Slack thread memory alone. If it is not in Notion, the next wake cannot steer from it.

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
Steer absorbed → Notion STEER: <url>
Task: <url> · Priority: P0 · nextHeavy: yes
Direction: <one line restatement>
```

```text
Steer noted (opinion only) → Notion STEER: <url>
No new Task; BOARD activeSteer updated.
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
