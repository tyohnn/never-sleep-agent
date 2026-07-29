# Research protocol (researcher role)

Dedicated Cursor Automation for **trend / technique research** → Notion **Research DB**.  
Does not implement product features.

## Standard storage (skill lock)

| Artifact | Where |
|---|---|
| Research brief | **Research** database (not Documents) |
| Name | `Research · YYYY-MM-DD HH:mm UTC · <theme>` |
| Status | `ready` when published for director |
| Candidate work | Tasks (`Source=research`, default **P2**), relation → Research row |
| Alignment | relation → Goals (and Requests if user-asked) |

Do **not** file research as Documents Kind=`brief`. That path is deprecated for this skill.

## Goal

Find recent, relevant signals; write durable Research rows; plant candidate Tasks for director/worker.

## Sources (use what the environment allows)

| Source | How | Notes |
|---|---|---|
| Web search | Cursor `WebSearch` / fetch | primary default |
| YouTube search | YouTube Data API (if key / config) | titles, channel, publishedAt, url |
| YouTube deepen | `yt-dlp` when installed | cite video id |
| X (Twitter) | available tooling or web fallback | links + paraphrase; rate limits |
| Docs / GitHub | fetch READMEs, releases, discussions | “what shipped” |

If a source is unavailable, note it on the Research row and continue — no empty-exit.

Config (`never-sleep.config.json` → `research`):

```json
{
  "research": {
    "topics": [],
    "youtubeApiKeyEnv": "YOUTUBE_API_KEY",
    "maxItemsPerSource": 8,
    "preferLanguages": ["en", "ko"]
  }
}
```

Topics default from: active STEER, Requests, Goals, BOARD `nextHeavy`, `AGENTS.md` research hints.

## Wake steps

1. Shared preamble (Requests/STEER absorb, Goals + BOARD read)
2. Topic list (3–7) aligned with helmsman + active Goals
3. Search enabled sources; dedupe by URL
4. Create **one Research DB row** per wake (or per major theme if huge):
   - Status=`ready`
   - Summary = one-line so-what
   - Sources filled (required)
   - Goal linked when clear
5. Optional candidate Tasks (`Source=research`, **P2**), relation back to Research
6. BOARD `lastResearch` = row URL; Slack outbox with top findings
7. Run-log Mode: `RESEARCH · role=researcher`

## Body shape (page content)

```markdown
## Topics
- …

## Findings
### 1. <title>
- source: <url>
- kind: web | youtube | x | github | …
- date: <if known>
- takeaway: …
- relevance to goal/board: …

## Recommended actions
- Task ideas (P2 unless promoted): …
- Decisions director should consider: …

## Sources unavailable
- …
```

## Director triage

- Scan Research `ready` view each DIRECT wake
- Promote useful items → Tasks / Decisions / Goal notes
- Set Status `triaged` or `consumed`; mark `stale` when obsolete
- Do not leave unbounded `ready` piles (auditor Finding if backlog grows)

## Hard rules

- Cite URLs. No unsourced claims.
- No product LEASE / implementation PRs.
- Prefer one strong Research row over Task spam.
- Respect STEER topic bans.
- Prefer overnight-actionable relevance over generic hype.

## When worker is idle

Worker may do a **light** research pass into the same **Research DB**. Deep multi-source passes belong to the researcher Automation.
