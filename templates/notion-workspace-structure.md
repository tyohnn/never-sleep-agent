# Notion workspace structure (under root)

진짜 Notion “Template Gallery” 복제본이 아니다.  
유저가 준 **루트 페이지** 아래에 이렇게 만들라는 **구조 명세서**다. DB 스키마 상세는 `notion-schema.md` / `notion-bootstrap.md`.

## Root

```text
📁 <Overnight Root>                    ← user input: notion.rootPageUrl
├── 📄 00 · README (hub index)
├── 📄 BOARD · heartbeat …
├── 📂 10 · Databases
│     ├── 🗂 Tasks                      ← Tasks DB
│     └── 🗂 Documents                  ← Documents DB (Kind includes steer)
├── 📂 20 · Steering
│     ├── (STEER · … pages live in Documents DB; this folder optional for pins)
│     └── 📄 Helmsman · how to reply in Slack
├── 📂 30 · Decisions
│     └── (Decision · … in Documents DB; optional pin gallery)
├── 📂 40 · Research
│     └── (Research · … briefs)
├── 📂 50 · Audits
│     └── (Audit · …)
├── 📂 60 · Run logs
│     └── (Run log · …)                 ← or rely on Documents DB views only
├── 📂 70 · Leases
│     └── (LEASE · … status docs)
└── 📂 90 · Meta
      ├── 📄 SEED · overnight plan
      ├── 📄 Prompt · automation index (links to repo docs/ops/automation-*.md)
      └── 📄 Config · pointers (root url, baseBranch, slack ids — no secrets)
```

최소 필수(작게 시작):

```text
📁 <Overnight Root>
├── 📄 00 · README
├── 📄 BOARD · heartbeat …
├── 🗂 Tasks
└── 🗂 Documents
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
- Tasks DB
- Documents DB
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
| Role | select | worker / director / researcher / auditor / human / onboarding — optional |

**Views (recommended):**

| View | Filter |
|---|---|
| STEER active | Kind=steer, Status=In progress |
| Run logs | Kind=run-log, sort name desc |
| Decisions | Kind=decision |
| Research | Kind=brief, Name starts with `Research` |
| Audits | Kind=brief, Name starts with `Audit` |
| Leases active | Kind=status, Name starts with `LEASE`, Status=In progress |
| BOARD | Kind=status, Name starts with `BOARD` |

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
3. Create Tasks DB + Documents DB (schema above)  
4. Create BOARD page + seed Task  
5. Add Documents views (STEER / Run logs / …)  
6. Optional folders 20–90 for human navigation  
7. Paste hub index links into `00 · README`  
8. Config: `rootPageUrl`, `tasksDataSourceId`, `documentsDataSourceId`, `boardPageId`

## Anti-patterns

- Ops pages outside the user root  
- Missing Kind=`steer`  
- No BOARD  
- Dumping everything as plain pages without Tasks DB  
- Secrets inside Notion Config page (tokens, API keys) — IDs/URLs only  
