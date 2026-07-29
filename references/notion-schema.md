# Notion schema (v0)

Ops data lives under a **user-provided root** (`notion.rootPageUrl` / `rootPageId`).  
v0 does not fully auto-create DBs — bootstrap under that root (`notion-bootstrap.md`, `notion-workspace-structure.md`).

## Database map

| DB | Purpose | Primary writers |
|---|---|---|
| **Tasks** | Executable work | worker, director, slack absorb |
| **Documents** | run-log, STEER narrative, Decision, Audit summary, BOARD, LEASE | all roles |
| **Requests** | Slack **유저 요청** 큐 | all wakes (absorb), director |
| **Research** | 트렌드/기술 리서치 브리프 (**표준 전용 DB**) | researcher |
| **Findings** | 어긋남/갭 | auditor |
| **Goals** | overnight/주간 목표 | human, director |

**Skill standard (required hub DBs):** Tasks, Documents, Requests, Research, Goals, Findings.

Research를 Documents `brief`에 섞지 않는다. 쿼리·트리아지·Goal 연결이 깨진다.

---

## Tasks

| Property | Type | Notes |
|---|---|---|
| Name | title | |
| Status | status/select | Not started / In progress / Done / Blocked |
| Priority | select | P0–P3 |
| Notes | text | |
| Branch | text | |
| PR | url | |
| Source | select | slack-steer / slack / seed / agent / director / research / audit / request |
| Request | relation → Requests | optional |
| Goal | relation → Goals | optional |
| codeAreas | text | optional |

---

## Documents

| Property | Type | Notes |
|---|---|---|
| Name | title | naming rules below |
| Kind | select | `run-log` \| `decision` \| `status` \| `brief` \| `prompt` \| **`steer`** |
| Status | status/select | In progress / Done |
| Summary | text | |
| Related Asset | text | optional |
| Role | select | optional |
| Request | relation → Requests | optional (for STEER) |
| Goal | relation → Goals | optional |

### Naming

| Pattern | Kind |
|---|---|
| `Run log · <UTC> · <MODE>` | run-log |
| `LEASE · <branch>` | status |
| `BOARD · heartbeat …` | status |
| `STEER · <UTC> · <short>` | steer |
| `Decision · …` | decision |
| `Audit · <UTC>` | brief (pass summary; gaps → Findings) |
| `Prompt · …` / `SEED · …` | prompt / brief |

Research briefs live in the **Research DB**, not Documents.

---

## Requests (유저 요청 DB)

Slack에서 받은 주인/유저 요구를 **한 줄 단위로 정리**하는 DB.  
STEER 문서(서술)와 Task(실행) 사이의 **정규화된 큐**.

| Property | Type | Notes |
|---|---|---|
| Name | title | short ask, e.g. `P0 remint barracks` |
| Status | select | `inbox` / `triaged` / `in_progress` / `done` / `rejected` / `superseded` |
| Priority | select | P0–P3 |
| Raw quote | text | verbatim Slack text |
| Slack permalink | url | |
| Owner | text | slack user id/name |
| Absorbed at | date/text | ISO |
| Interpretation | text | one-line agent restatement |
| STEER | relation/url → Documents | linked `STEER ·` page |
| Task | relation/url → Tasks | if actionable |
| Goal | relation → Goals | which goal this serves |
| Supersedes | relation → Requests | optional |

### Slack → Requests absorb (every wake)

1. New owner Slack reply → create **Request** (`Status=inbox`)
2. Create/update **STEER** Document; link Request ↔ STEER
3. If actionable → Task (`Source=slack-steer` or `request`), link Request
4. Director/worker sets Request `triaged` / `in_progress` / `done`
5. BOARD `activeSteer` + ack in Slack with Request URL

Do not keep asks only inside STEER body or Slack memory.

**Views:** `Inbox`, `Open (not done)`, `Linked to Goal`, `This week`.

---

## Research (리서치 전용 DB — skill standard)

researcher Automation의 정규 저장소. Documents에 넣지 않는다.

| Property | Type | Notes |
|---|---|---|
| Name | title | `Research · <UTC> · <theme>` |
| Status | select | `draft` / `ready` / `triaged` / `consumed` / `stale` |
| Theme | text/select | short theme label |
| Summary | text | one-line so-what for director |
| Topics | text | comma or multi |
| Sources | text | cited URLs (required) |
| Source kinds | multi-select/text | web / youtube / x / github / docs |
| Relevance | select | `P0` / `P1` / `P2` / `P3` / `noise` — suggested, director may change |
| Goal | relation → Goals | which goal this informs |
| Tasks | relation → Tasks | candidate follow-ups |
| Request | relation → Requests | if triggered by a user ask |
| Wake | text/url | agent url / run-log link |
| Body | page content | findings + takeaways (see research-protocol) |

**Views:** `Ready for triage` · `By Goal` · `This week` · `Consumed` · `Stale`

Lifecycle: researcher writes `ready` → director triages (`triaged` / spawn Tasks / link Goal) → `consumed` when acted on, or `stale` if obsolete.

---

## Findings (어긋남 / auditor DB)

계약·보드·STEER·실행 사이의 **드리프트·누락·충돌**을 추적.  
`Audit ·` run-log는 “이번 패스 요약”; **열린 이슈는 Findings 행**으로 남긴다.

없어도 Documents-only로 가능하지만, 밤이 길어지면 Findings 없이 open gap이 묻힌다 → **권장 필수에 가깝게** 둔다.

| Property | Type | Notes |
|---|---|---|
| Name | title | e.g. `STEER vs nextHeavy mismatch` |
| Status | select | `open` / `triaged` / `fixed` / `wontfix` / `recheck` |
| Severity | select | `P0` / `P1` / `P2` / `P3` |
| Area | select | steer / goals / tasks / lease / schema / mcp / skills / automation / merge / product / other |
| Summary | text | one line |
| Evidence | text | URLs, run-log, PR |
| Expected | text | what contract says |
| Actual | text | what was observed |
| Audit | relation/url | parent `Audit ·` pass |
| Task | relation/url | repair Task if any |
| Goal | relation → Goals | optional |
| Found by | select | auditor / director / worker / human |
| Found at | date/text | ISO |

Auditor wake: create/update Findings for each real gap; close `fixed` when repaired; Slack highlights open P0/P1 Findings.

**Views:** `Open`, `P0–P1`, `By Area`, `Needs recheck`.

---

## Goals (목표 DB)

overnight / 주간 방향을 Tasks·STEER보다 위에 두는 **목표**.  
없으면 `nextHeavy`만으로 표류하기 쉬움 → **권장**.

| Property | Type | Notes |
|---|---|---|
| Name | title | e.g. `Ship img2threejs remint path` |
| Status | select | `proposed` / `active` / `paused` / `done` / `dropped` |
| Horizon | select | `tonight` / `this_week` / `milestone` |
| Priority | select | P0–P3 |
| Success criteria | text | measurable / evidence |
| Notes | text | |
| Active | checkbox | convenience |
| Related Requests | relation → Requests | |
| Related Tasks | relation → Tasks | |

BOARD additions:

```text
activeGoal: <Goals url or name>
goalProgress: <one line>
```

Director: keep exactly **1–3 active Goals**; map STEER/Requests onto Goals; set `nextHeavy` that serves `activeGoal`.  
Owner STEER may change Goals (promote/pause) — record Request + update Goals row.

---

## STEER documents (narrative)

Still written as Documents Kind=`steer` (full quote + interpretation).  
Always link the matching **Request** row.

### Priority rank

| Rank | Artifact |
|---|---|
| 1 | Active owner **STEER** + open **Requests** (inbox/triaged) |
| 2 | Active **Goals** |
| 3 | Director Decisions + BOARD `nextHeavy` / `parallelTracks` |
| 4 | Tasks (`slack-steer` / request-linked) |
| 5 | Open **Findings** P0–P1 (may force LIGHT/audit work) |
| 6 | **Research** rows (`ready` / high Relevance) → director triage |
| 7 | Research/audit candidate Tasks |
| 8 | Worker suggestions |

---

## BOARD machine block

```text
agent: <url>
role: worker | director | researcher | auditor
branch: …
pr: …
codeAreas: …
intent: …
startedAt: …
leaseUntil: …
heartbeatAt: …
openPrCount: …
activeSteer: …
activeGoal: …
goalProgress: …
nextHeavy: …
parallelTracks: …
openRequests: <n>
openFindingsP0P1: <n>
directorAt: …
lastResearch: …
lastAudit: …
notionRoot: …
baseBranch: main|dev
```

---

## Query habits

1. Open **Requests** (inbox / not done)  
2. Active **STEER**  
3. Active **Goals**  
4. BOARD  
5. Open **Findings** P0–P1  
6. LEASE + Tasks  
7. **Research** DB (`ready` / by Goal)  
8. Recent run-logs / Audit summaries  

Adapt property names if the project DB drifts; note drift as a Finding.
