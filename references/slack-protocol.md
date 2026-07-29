# Slack protocol

Slack is the **human control surface**: outbox every wake, inbox absorbed into Notion.

## Outbox (every wake)

Post (or reply in the standing overnight thread) a short report before exit.

Minimum fields:

| Field | Content |
|---|---|
| Mode | HEAVY / LIGHT / MERGE (+ one-line why) |
| Changed | bullets of what landed or moved |
| PR | link(s) or “none” |
| Evidence | screenshots, artifact paths, Notion run-log URL |
| Next | nextHeavy recommendation |
| Blockers | env / lease / human decision — or “none” |

Template: [`templates/slack-report.md`](../templates/slack-report.md).

Prefer **one standing thread per overnight window** (or per repo). New top-level posts only when starting a new night / new adopt.

## Inbox (human → agent)

### v0 default: thread replies

On wake start (and again before exit):

1. Read replies on the standing outbox thread since last absorb
2. Treat actionable replies as work requests
3. Create Notion Tasks (see `notion-schema.md`)
4. Ack in-thread: Task URL + whether it became `nextHeavy`
5. Record absorbed items in the run-log

Non-actionable chatter: ack lightly or ignore; do not spam Tasks.

### Optional: dedicated channel

If config sets `slack.inboxChannelId`, also scan that channel for recent human messages (same absorb rules). Still prefer threading under the overnight report when possible.

### Optional: emoji gate

If config enables `slack.emojiGate` (e.g. 📌):

- only messages / replies with that reaction become Tasks
- reduces noise in busy channels

v0 default is **thread replies without emoji gate**. Enable emoji when the channel is shared or noisy.

## Ack patterns

```text
Absorbed → Notion Task: <url>
Priority: P1 · nextHeavy: yes
```

```text
Noted (not a task): will keep LIGHT until <blocker> clears.
```

## Auth / tooling

Environments differ (Slack MCP, bot token scripts, Cursor connectors). This skill defines the **contract**, not a single API client.

If Slack is unavailable:

- still complete Notion run-log + BOARD
- note `Slack outbox failed: <reason>` in run-log
- do not skip the rest of the exit packet

## What humans can say in-thread

Useful shapes:

- `P0: remint barracks via real pipeline`
- `stop HEAVY on X — lease conflict with me`
- `merge #42 when green`
- `next night focus: Track B polish only`

Agent should map these to Tasks + BOARD, not only chat memory.
