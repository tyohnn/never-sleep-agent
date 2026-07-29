# Research protocol (researcher role)

Dedicated Cursor Automation for **trend / technique research** → Notion. Does not implement product features.

## Goal

Find recent, relevant signals; write durable Notion briefs; plant candidate Tasks for director/worker. Keep the overnight loop fed when implementation is blocked or the board is quiet.

## Sources (use what the environment allows)

| Source | How | Notes |
|---|---|---|
| Web search | Cursor `WebSearch` / fetch | primary default |
| YouTube search | YouTube Data API (if `YOUTUBE_API_KEY` / project config) | titles, channel, publishedAt, url |
| YouTube deepen | `yt-dlp` metadata / subtitles when installed | cite video id; store quotes sparingly |
| X (Twitter) | available X/Twitter tooling or web fallback | prefer links + paraphrase; respect ToS/rate limits |
| Docs / GitHub | fetch READMEs, releases, discussions | good for “what shipped this week” |

If a source is unavailable, note it in the Research doc and continue with the others — do not empty-exit.

Config keys (optional) under `research` in `never-sleep.config.json`:

```json
{
  "research": {
    "topics": ["optional topic overrides"],
    "youtubeApiKeyEnv": "YOUTUBE_API_KEY",
    "maxItemsPerSource": 8,
    "preferLanguages": ["en", "ko"]
  }
}
```

Topics default from: active STEER, BOARD intent/`nextHeavy`, open P0–P1 Tasks, project `AGENTS.md` research hints.

## Wake steps

1. Shared preamble (STEER absorb, BOARD read) — see `roles.md`
2. Build a short topic list (3–7) aligned with helmsman + director priorities
3. Search each enabled source; dedupe by URL
4. Write **one** Notion Document per wake (or per major theme if huge):

   - Name: `Research · YYYY-MM-DD HH:mm UTC · <theme>`
   - Kind: `brief`
   - Status: `Done`
   - Summary: one-line “so what” for director

5. Optionally create candidate Tasks (`Source=research`, default **P2**):

   - only when a finding implies concrete overnight work
   - link back to the Research doc
   - do **not** self-promote to P0 (director/STEER does that)

6. Slack outbox: theme, top 3 findings, Research URL, candidate Tasks
7. Run-log Mode: `RESEARCH · role=researcher`

## Research doc body shape

```markdown
## Topics
- …

## Findings
### 1. <title>
- source: <url>
- kind: web | youtube | x | github | …
- date: <if known>
- takeaway: …
- relevance to board: …

## Recommended actions
- Task ideas (P2 unless promoted): …
- Decisions director should consider: …

## Sources unavailable
- …
```

## Hard rules

- Cite URLs. No unsourced “hot takes” as facts.
- Do not claim product work is done.
- Do not open product implementation PRs or product LEASEs.
- Do not drown the board: prefer one strong brief over twenty shallow Tasks.
- Respect owner STEER topic bans (“no more X research”).
- Prefer actionable overnight relevance over generic hype.

## When worker is idle

If the **worker** Automation hits idle-research fallback, it may do a **lighter** version of this protocol. Prefer leaving deep multi-source passes to the researcher Automation when it exists.
