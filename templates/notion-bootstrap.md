# Notion bootstrap (manual, v0)

## 0. Required input — Notion root page

**유저가 반드시 제공한다:** overnight 허브 **루트 페이지** URL 또는 page ID.

| Field | Required |
|---|---|
| `notion.rootPageUrl` or `rootPageId` | yes |

트리·폴더·뷰 전체: [`notion-workspace-structure.md`](notion-workspace-structure.md)  
스키마 상세: [`../references/notion-schema.md`](../references/notion-schema.md)

```bash
node scripts/adopt.mjs --target /path/to/repo \
  --notion-root "https://www.notion.so/..../Your-Root-Page"
```

## 1. Databases under the root

Create these DBs (children of root or under `10 · Databases`):

| DB | Why |
|---|---|
| **Tasks** | 실행 작업 |
| **Documents** | STEER, run-log, Decision, BOARD, LEASE, Audit 요약 |
| **Requests** | Slack 유저 요청 큐 |
| **Research** | 리서치 브리프 (**전용 DB · skill standard** — Documents에 넣지 않음) |
| **Goals** | tonight / week 목표 |
| **Findings** | auditor 어긋남·갭 |

### Tasks

Name, Status, Priority P0–P3, Notes, Branch, PR, Source, optional relations → Request / Goal

### Documents

Name, Kind (`run-log|decision|status|brief|prompt|steer`), Status, Summary  
`steer` Kind 필수.

### Requests

Name, Status (`inbox|triaged|in_progress|done|rejected|superseded`), Priority, Raw quote, Slack permalink, Owner, links to STEER/Task/Goal

### Research

Name (`Research · <UTC> · <theme>`), Status (`draft|ready|triaged|consumed|stale`), Theme, Summary, Topics, Sources (required), Relevance, relations → Goal/Tasks/Request  
Body: findings + takeaways. See `research-protocol.md`.

### Goals

Name, Status (`proposed|active|paused|done|dropped`), Horizon (`tonight|this_week|milestone`), Priority, Success criteria, Active checkbox

### Findings

Name, Status (`open|triaged|fixed|wontfix|recheck`), Severity P0–P3, Area, Expected, Actual, Evidence, links to Audit/Task/Goal

## 2. Seed pages

| Name | Where |
|---|---|
| `00 · README` | page under root |
| `BOARD · heartbeat …` | Documents or page; Kind=status |
| One **Goal** (active, tonight/this_week) | Goals DB |
| One **P0/P1 Task** linked to that Goal | Tasks DB |
| Optional SEED brief | Documents |

BOARD fields include `activeGoal`, `activeSteer`, `nextHeavy`, `openRequests`, `openFindingsP0P1`.

## 3. Config

```json
{
  "notion": {
    "rootPageUrl": "<root>",
    "tasksDataSourceId": "<…>",
    "documentsDataSourceId": "<…>",
    "requestsDataSourceId": "<…>",
    "researchDataSourceId": "<…>",
    "goalsDataSourceId": "<…>",
    "findingsDataSourceId": "<…>",
    "boardPageId": "<…>"
  }
}
```

Slack: `ownerUserIds`, `outboxChannelId`.  
`immutable.baseBranch`: `main` or `dev`.

## 4. Absorb / write rules (remember)

Slack owner reply → **Requests** (+ STEER + Task if actionable).  
Researcher → **Research** DB row (never Documents brief).  
Auditor gap → **Findings** (+ Audit summary doc).  
Director: 1–3 **active Goals**; triage Research `ready`; align `nextHeavy`.

## 5. Automations

Onboard → customize prompts → save in Cursor UI (`automation-prompt.md`).
