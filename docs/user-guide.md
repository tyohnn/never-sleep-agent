# never-sleep-agent — 유저 설치·사용 가이드

이 문서는 **사람(유저/주인)** 기준으로, 스킬을 설치하고 overnight를 돌리기까지의 전 과정을 정리한다.  
에이전트가 대신 해줄 수 없는 단계(특히 Cursor Automation 저장)를 구분해서 표시한다.

## 한 장 요약

```text
[당신]
  1) 스킬 설치
  2) MCP 인증 (Notion / Slack / Supabase / Vercel)
  3) 기본 companion 스킬 설치
  4) 대상 레포에 AGENTS 조각 + never-sleep.config.json
  5) Notion Tasks/Documents/BOARD 준비
  6) Cursor Automation 4개에 프롬프트 붙여 저장  ← 필수·수동
  7) Slack 스레드에서 조타(STEER)

[Automation cron]
  → worker / director / researcher / auditor wake
  → Notion에 STEER·Task·run-log 쌓임
  → Slack으로 보고
  → 당신은 스레드에 답글만 하면 방향이 바뀜
```

스킬 파일만 clone/install한 상태로는 **밤새 루프가 시작되지 않는다.** Automation 4개를 Cursor에 저장해야 한다.

---

## 역할 이해 (당신이 쓰는 도구들)

| 구분 | 무엇인가 | 누가 만드나 |
|---|---|---|
| **Skill** `never-sleep-agent` | overnight OS 규칙 | `npx skills add` |
| **Companion skills** | React/Next/Vercel/Supabase 등 기본 팩 | `adopt.mjs --install-skills` |
| **MCP** | Notion / Slack / Supabase / Vercel 연결 | Cursor에서 당신이 인증 |
| **Notion hub** | Tasks, Documents, BOARD, STEER, run-log | 당신이 bootstrap (가이드 있음) |
| **Slack 스레드** | 조타(주인 답글) + 에이전트 보고 | 당신이 채널/스레드 지정 |
| **Cursor Automations ×4** | cron으로 깨우는 실제 에이전트 | **당신이 프롬프트 저장** |
| **대상 레포 `AGENTS.md`** | 제품 규칙 (스킬 밖) | 당신이 fragment merge + 제품 lock 작성 |

네 Automation:

| 이름 (권장) | 하는 일 |
|---|---|
| `never-sleep · worker` | LEASE 잡고, **서브에이전트**에게 구현 시킴 |
| `never-sleep · director` | 보드 읽고 우선순위·병렬·Decision |
| `never-sleep · researcher` | 웹/X/YouTube 리서치 → Notion |
| `never-sleep · auditor` | 워크플로·스키마·MCP 구멍 점검 |

---

## Phase A — 환경 준비 (당신)

### A1. 스킬 설치

대상 overnight 레포를 쓰는 Cursor 환경에서:

```bash
npx skills add https://github.com/tyohnn/never-sleep-agent --skill never-sleep-agent -y
```

(org/URL는 실제 배포 위치에 맞게 바꿈.)

설치 후에도 Automation은 **생기지 않음** — 규칙 문서만 로드 가능해짐.

### A2. MCP 인증 (필수)

Cursor MCP 설정에서 아래를 연결·로그인한다.

| MCP | 용도 |
|---|---|
| **Notion** | STEER, Task, BOARD, run-log — 매 wake |
| **Slack** | inbox(당신 답글) + outbox(보고) — 매 wake |
| **Supabase** | DB/Auth/Edge 작업 시 |
| **Vercel** | deploy/preview/env 작업 시 |

인증이 안 되면 overnight가 Notion/Slack에 쓰지 못하거나 `DEGRADED`로 끝난다.

### A3. 기본 companion 스킬 설치

never-sleep-agent 스킬 루트(또는 clone한 경로)에서:

```bash
node scripts/adopt.mjs --install-skills
# 또는
bash templates/default-skills.sh
```

React/Next/shadcn/Vercel/Supabase/UI/browser 팩이 깔린다. 목록: [`references/default-skills.md`](../references/default-skills.md).

### A4. adopt 체크 출력 (선택)

```bash
node scripts/adopt.mjs --target /path/to/your-product-repo
```

빠진 파일·다음 할 일·**Automation 저장 안내**가 출력된다.

---

## Phase B — 대상 레포 붙이기 (당신 + 한 번)

overnight를 돌릴 **제품 레포**에서:

### B1. `AGENTS.md`에 조각 merge

[`templates/AGENTS.fragment.md`](../templates/AGENTS.fragment.md) 내용을 레포 `AGENTS.md`에 합친다.  
아래 “Product plugin” 칸을 **당신 제품 규칙**으로 채운다 (파이프라인, 금지 숏컷, 증거 형식 등).

### B2. 설정 파일

```bash
cp path/to/never-sleep-agent/templates/config.example.json \
   /path/to/your-product-repo/never-sleep.config.json
```

최소한 채울 것:

- `project.name`, `baseBranch`
- `notion.tasksDataSourceId`, `documentsDataSourceId`, `boardPageId`
- `slack.outboxChannelId`, `slack.ownerUserIds` ← **당신 Slack 유저 ID**
- (있으면) Supabase/Vercel 프로젝트 힌트를 AGENTS에 적어 두기

### B3. Notion bootstrap

[`templates/notion-bootstrap.md`](../templates/notion-bootstrap.md) 따라:

1. Tasks DB (Status, Priority P0–P3, Notes, Branch, PR, Source 권장)
2. Documents DB — Kind에 **`steer`** 포함 (`run-log`, `decision`, `status`, `brief`, `prompt`, `steer`)
3. `BOARD · heartbeat armed` 문서 생성 (`activeSteer`, `nextHeavy`, `parallelTracks` 필드)
4. 첫 P0/P1 Task 하나 심기
5. (권장) SEED run-log 한 장

IDs를 `never-sleep.config.json`에 복사.

### B4. Slack

1. overnight용 채널 정하기
2. 채널 ID → config `outboxChannelId`
3. 당신 Slack member ID → `ownerUserIds` (조타수)
4. 첫 보고 스레드가 생기면 `standingThreadTs`를 나중에 넣어도 됨

이후 **그 스레드에 답글** = 에이전트 방향 지시. 매 wake가 Notion `STEER · *`로 저장한다.

---

## Phase C — Automation 4개 저장 (당신 · 가장 중요)

체크리스트 전문: [`templates/automation-prompt.md`](../templates/automation-prompt.md)

| 순서 | 할 일 |
|---|---|
| 1 | Cursor → Automations 열기 |
| 2 | 대상 레포에 Automation **새로 4개** 만들기 |
| 3 | 각 파일의 `---` **아래**를 프롬프트에 붙여넣기 |
| 4 | `[REPO]` 등 자리 채우기 (또는 config만 보고 동작하게 통일) |
| 5 | cron 저장 (예: worker `*/15`, director `*/30`, researcher `0 */2`, auditor `30 */3`) |
| 6 | 저장 — 파일만 레포에 있는 것과 다름 |

| Automation 이름 | 붙여넣을 파일 |
|---|---|
| `never-sleep · worker` | [`templates/automation-worker.md`](../templates/automation-worker.md) |
| `never-sleep · director` | [`templates/automation-director.md`](../templates/automation-director.md) |
| `never-sleep · researcher` | [`templates/automation-researcher.md`](../templates/automation-researcher.md) |
| `never-sleep · auditor` | [`templates/automation-auditor.md`](../templates/automation-auditor.md) |

**한 프롬프트를 네 역할에 재사용하지 말 것.**

---

## Phase D — 첫 밤 켜기 (당신)

1. Notion BOARD에 `nextHeavy`가 있는지 확인
2. (선택) Slack에 “armed — nextHeavy = …” 한 줄
3. Automations enabled + cron 대기  
   또는 각 Automation을 한 번씩 **수동 실행**해서 smoke test
4. 첫 wake 후 확인:
   - Notion에 `Run log · …` 생김
   - Slack outbox에 role 태그 보고
   - worker면 run-log에 **Subagents** 목록
5. 스레드에 짧게 지시 실험:  
   `P0: … 해줘` → 다음 wake에 `STEER · *` + Task가 생기는지 확인

---

## Phase E — 평소 사용법 (당신)

당신은 코딩 감독이 아니라 **조타수**다.

### 매일/밤새

1. Slack overnight 스레드 읽기 (mode / PR / evidence / next / blockers)
2. 방향이 틀리면 **스레드에 답글** (예: `stop X — do Y`, `P0: …`)
3. Notion BOARD / Tasks로 진행 확인 (원하면)
4. 중요한 락은 director의 `Decision · *` 또는 당신이 Slack으로 확정

### 우선순위가 먹는 순서

1. 당신 STEER (Slack → Notion)
2. director Decision + BOARD `nextHeavy` / `parallelTracks`
3. `slack-steer` Tasks
4. 그 외 agent Tasks / research 후보

### 건드리지 않아도 되는 것

- worker가 서브에이전트를 어떻게 쪼개는지 (계약상 부모는 구현 안 함)
- researcher/auditor의 세부 검색 — 결과만 Notion/Slack으로 보면 됨

### 막혔을 때

| 증상 | 볼 곳 |
|---|---|
| 보고가 안 옴 | Automation 저장·enable·cron / Slack MCP |
| STEER가 안 쌓임 | `ownerUserIds` / Notion Kind=`steer` / Slack MCP |
| 코드만 안 움직임 | worker Automation + LEASE 충돌 + 서브에이전트 로그 |
| DB/배포만 실패 | Supabase / Vercel MCP 인증 |
| 보드가 엉망 | auditor wake 또는 `Audit ·` 문서 |

---

## Phase F — 업데이트

스킬이 갱신되면:

```bash
npx skills add https://github.com/tyohnn/never-sleep-agent --skill never-sleep-agent -y
# companion 팩도 필요하면
node scripts/adopt.mjs --install-skills
```

Automation **프롬프트가 바뀌었으면** 해당 `templates/automation-*.md`를 다시 열어 Cursor Automation에 **다시 붙여 저장**해야 한다. 스킬 업데이트만으로 Automation 문구는 자동 갱신되지 않는다.

---

## 체크리스트 (복사해서 쓰기)

- [ ] `never-sleep-agent` 스킬 설치
- [ ] Notion / Slack / Supabase / Vercel MCP 인증
- [ ] `adopt.mjs --install-skills`
- [ ] 제품 레포 `AGENTS.md` fragment + 제품 lock
- [ ] `never-sleep.config.json` (Notion IDs, `ownerUserIds`, channel)
- [ ] Notion Tasks + Documents(`steer`) + BOARD + 첫 Task
- [ ] Slack 채널/스레드
- [ ] Cursor Automation 4개 프롬프트 **저장** + cron
- [ ] smoke wake 1회 × 역할 (또는 worker+director 최소)
- [ ] 스레드 답글 → STEER 생성 확인

완료되면 당신은 Slack만으로 overnight 방향을 잡을 수 있다.
