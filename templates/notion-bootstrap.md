# Notion bootstrap (manual, v0)

## 0. Required input — Notion root page

**유저가 반드시 제공한다:** overnight 허브의 **루트 페이지** URL 또는 page ID.

| Field (config) | Required | Example |
|---|---|---|
| `notion.rootPageUrl` | one of url/id | `https://www.notion.so/.../Overnight-Hub-...` |
| `notion.rootPageId` | one of url/id | UUID from the page |

Put it in `never-sleep.config.json` **before** asking agents to write Tasks/Documents.  
All ops DBs and BOARD live **under this root**. Agents must not invent another parent.

```bash
# optional helper — prints adopt steps with your root
node scripts/adopt.mjs --target /path/to/repo \
  --notion-root "https://www.notion.so/..../Your-Root-Page"
```

v0 does **not** fully auto-create databases. Use the checklist below under that root.

## 1. Databases (under the root page)

Create (or reuse) two databases as children of the root:

### Tasks

Properties:

- **Name** (title)
- **Status** — Not started / In progress / Done / Blocked
- **Priority** — P0 / P1 / P2 / P3
- **Notes** (text)
- **Branch** (text)
- **PR** (url)

Optional: Source (`slack-steer` / `slack` / `seed` / `agent` / `director` / `research` / `audit`), Related Document.

### Documents

Properties:

- **Name** (title)
- **Kind** — `run-log` | `decision` | `status` | `brief` | `prompt` | **`steer`**
- **Status** — In progress / Done
- **Summary** (text)
- **Related Asset** (text or relation) — optional

`steer` is required for helmsman persistence. If you cannot add the option yet, use Name `STEER · …` with Kind=`decision` temporarily.

## 2. Seed documents (recommended)

Under the same root (or in Documents DB):

| Name | Kind | Status |
|---|---|---|
| `BOARD · heartbeat armed` | status | In progress |
| `Run log · <UTC> · SEED` | run-log | Done |

BOARD body: see `references/notion-schema.md` machine block. Include `activeSteer: none`, `nextHeavy`, `parallelTracks: none`, `directorAt: none`, and optionally `notionRoot: <url>`.

SEED run-log: list planted Tasks + root URL + “heartbeat may start”.

## 3. Seed tasks

Plant at least one **P0/P1** Task the first **worker** HEAVY wake can claim.

## 4. Fill config

```json
{
  "notion": {
    "rootPageUrl": "<your root>",
    "rootPageId": "<optional id>",
    "tasksDataSourceId": "<from Tasks DB>",
    "documentsDataSourceId": "<from Documents DB>",
    "boardPageId": "<BOARD page>"
  }
}
```

Also set `slack.ownerUserIds` and `slack.outboxChannelId`.

Authenticate MCPs: Notion, Slack, Supabase, Vercel.  
Install default skills: `node scripts/adopt.mjs --install-skills`.

## 5. Automations (human — prompt configuration)

디스크 파일만으로는 부족하다. Cursor **Automations 설정**에서 역할별 프롬프트를 붙여 저장한다:

→ [`automation-prompt.md`](automation-prompt.md)

## 6. Optional shared hub

- **A)** one Notion root (shared hub) + per-repo AGENTS product rules  
- **B)** per-repo Notion root  

Document the choice on BOARD. Agents must use config `notion.rootPageUrl` / `rootPageId` — never guess.
