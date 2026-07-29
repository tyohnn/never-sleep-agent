# Notion workspace structure (under root)

진짜 Notion “Template Gallery” 복제본이 아니다.  
유저가 준 **루트 페이지** 아래에 이렇게 만들라는 **구조 명세서**다. DB 스키마 상세는 `notion-schema.md` / `notion-bootstrap.md`.

## Root

```text
📁 <Overnight Root>                    ← user input: notion.rootPageUrl
├── 📄 00 · README (hub index)
├── 📄 BOARD · heartbeat …
├── 📂 10 · Databases
│     ├── 🗂 Tasks
│     ├── 🗂 Documents                  ← STEER / run-log / Decision / BOARD / LEASE …
│     ├── 🗂 Requests                   ← Slack 유저 요청 정리
│     ├── 🗂 Findings                   ← auditor 어긋남/갭
│     └── 🗂 Goals                      ← overnight/주간 목표
├── 📂 20 · Steering
│     └── 📄 Helmsman · how to reply in Slack
├── 📂 30 · Decisions
├── 📂 40 · Research
├── 📂 50 · Audits
├── 📂 60 · Run logs
├── 📂 70 · Leases
└── 📂 90 · Meta
      ├── 📄 SEED · overnight plan
      ├── 📄 Prompt · automation index
      └── 📄 Config · pointers (no secrets)
```

최소 필수:

```text
📁 <Overnight Root>
├── 📄 00 · README
├── 📄 BOARD · heartbeat …
├── 🗂 Tasks
├── 🗂 Documents
├── 🗂 Requests      ← Slack 요청 큐 (권장 필수)
├── 🗂 Goals         ← 목표 (권장 필수)
└── 🗂 Findings      ← auditor 갭 (강력 권장; 없으면 Audit 문서만으로 임시 가능)
```

Views로 Run logs / STEER / Decisions / Research / Audits / Leases를 Documents에서 필터해도 된다. 폴더 `20–70`은 사람이 찾기 쉬우라고 두는 **선택 구조**다.

## Page: `00 · README` (hub index)

본문에 고정 블록:

```markdown
# Overnight hub

- Notion root: <url>
- Repo: <github url>
- Base branch: main | dev
- Slack outbox: <channel>
- Owner (helmsman): <slack ids>
- Automations: worker / director / researcher / auditor
- Skill: never-sleep-agent
- Immutable ops: cron=spawn only; auto-merge green into base; worker→subagents

## Links
- BOARD
- Tasks / Documents / Requests / Findings / Goals
- SEED
- Repo AGENTS.md
- docs/ops/never-sleep-onboarding.md
```

## Page: `BOARD · heartbeat …`

Kind=`status` if in Documents DB. Machine block per `notion-schema.md`, plus:

```text
notionRoot: <url>
baseBranch: main|dev
```

## Databases

### Tasks (under `10 · Databases` or directly under root)

| Property | Type | Values |
|---|---|---|
| Name | title | |
| Status | status/select | Not started / In progress / Done / Blocked |
| Priority | select | P0 / P1 / P2 / P3 |
| Notes | text | |
| Branch | text | |
| PR | url | |
| Source | select | slack-steer / slack / seed / agent / director / research / audit |
| codeAreas | text | optional — for parallelTracks |

**Views (recommended):**

- `P0–P1 Ready` — Status ≠ Done, Priority P0/P1
- `In progress`
- `From Slack` — Source contains slack
- `By Source`

### Documents

| Property | Type | Values |
|---|---|---|
| Name | title | |
| Kind | select | run-log / decision / status / brief / prompt / **steer** |
| Status | status/select | In progress / Done |
| Summary | text | |
| Related Asset | text | optional |
| Role | select | optional |
| Request / Goal | relation | optional |

**Views:** STEER active · Run logs · Decisions · Research · Audits · Leases · BOARD

### Requests (Slack 유저 요청)

| Property | Type | Values |
|---|---|---|
| Name | title | short ask |
| Status | select | inbox / triaged / in_progress / done / rejected / superseded |
| Priority | select | P0–P3 |
| Raw quote | text | |
| Slack permalink | url | |
| Owner | text | |
| STEER / Task / Goal | relation or url | |

**Views:** Inbox · Open · By Goal

### Findings (auditor 어긋남)

| Property | Type | Values |
|---|---|---|
| Name | title | |
| Status | select | open / triaged / fixed / wontfix / recheck |
| Severity | select | P0–P3 |
| Area | select | steer / goals / tasks / lease / schema / mcp / … |
| Expected / Actual / Evidence | text | |
| Audit / Task / Goal | relation or url | |

**Views:** Open · P0–P1 · By Area

### Goals

| Property | Type | Values |
|---|---|---|
| Name | title | |
| Status | select | proposed / active / paused / done / dropped |
| Horizon | select | tonight / this_week / milestone |
| Priority | select | P0–P3 |
| Success criteria | text | |
| Active | checkbox | |

**Views:** Active · Tonight · This week

스키마 상세: `references/notion-schema.md`.

## Naming cheat sheet

| Pattern | Kind |
|---|---|
| `STEER · <UTC> · <short>` | steer |
| `Run log · <UTC> · <MODE>` | run-log |
| `LEASE · <branch>` | status |
| `BOARD · heartbeat …` | status |
| `Decision · …` | decision |
| `Research · <UTC> · <theme>` | brief |
| `Audit · <UTC>` | brief |
| `Prompt · …` | prompt |
| `SEED · …` | brief or prompt |

## Build order (human or onboarding agent)

1. User creates empty **root** page → put URL in config  
2. Create `00 · README` under root  
3. Create DBs: Tasks, Documents, **Requests**, **Goals**, **Findings**  
4. Create BOARD + seed Goal + seed Task  
5. Add views (Requests Inbox, Findings Open, Goals Active, STEER, …)  
6. Optional folders 20–90  
7. Hub index links in `00 · README`  
8. Config: root + all dataSourceIds + boardPageId  

## Anti-patterns

- Ops pages outside the user root  
- Slack asks only in chat / STEER body with **no Requests row**  
- Auditor gaps only in prose Audit doc with **no Findings row** (hard to track open items)  
- No Goals — only bouncing `nextHeavy`  
- Missing Kind=`steer` / No BOARD  
- Secrets in Config page  
