# never-sleep-agent — 유저 설치·사용 가이드

이 문서는 **사람(유저/주인)** 기준으로, 스킬을 설치하고 overnight를 돌리기까지의 전 과정을 정리한다.  
에이전트가 대신 해줄 수 없는 단계(Notion 루트 입력, Cursor Automation 프롬프트 설정)를 구분해서 표시한다.

## 당신이 반드시 넣어야 하는 입력

| 입력 | 어디에 | 왜 |
|---|---|---|
| **Notion 루트 페이지** URL 또는 ID | `never-sleep.config.json` → `notion.rootPageUrl` / `rootPageId` | Tasks·Documents·BOARD·STEER가 이 페이지 **아래**에 생김. 루트 없으면 에이전트가 허브 위치를 모름 |
| **Slack owner user ID(s)** | `slack.ownerUserIds` | 조타수(당신) 답글만 STEER로 흡수 |
| **Slack outbox channel** | `slack.outboxChannelId` | wake 보고 위치 |
| **대상 레포** | Cursor Automation + `AGENTS.md` | 제품 작업 대상 |
| **Automation 프롬프트 4개** | Cursor Automations UI에 **직접 설정·저장** | 디스크의 `templates/automation-*.md`만으로는 cron이 안 돎 |

---

## 한 장 요약

```text
[당신 — 입력]
  · Notion 루트 페이지 URL/ID
  · Slack owner + channel
  · 제품 레포

[당신 — 설치]
  1) 스킬 설치
  2) MCP 인증 (Notion / Slack / Supabase / Vercel)
  3) companion 스킬 설치
  4) never-sleep.config.json 에 Notion 루트 등 기입
  5) 루트 아래에 Notion Tasks/Documents/BOARD bootstrap
  6) Cursor Automations ×4 생성 → 각 역할 프롬프트를 설정에 붙여 저장
  7) cron 저장 · Slack에서 조타

[Automation cron]
  → worker / director / researcher / auditor
  → Notion 루트 허브에 STEER·Task·run-log
  → Slack 보고 → 당신 답글이 다음 방향
```

---

## 역할 이해

| 구분 | 무엇인가 | 누가 |
|---|---|---|
| Skill `never-sleep-agent` | overnight OS 규칙 | `npx skills add` |
| Companion skills | React/Next/Vercel/Supabase 팩 | `adopt.mjs --install-skills` |
| MCP | Notion/Slack/Supabase/Vercel | Cursor에서 당신이 인증 |
| **Notion 루트 페이지** | overnight 허브의 부모 | **당신이 URL/ID 입력** |
| Slack 스레드 | 조타 + 보고 | 당신이 채널 지정 |
| **Cursor Automations ×4** | cron 에이전트 | **당신이 프롬프트를 Automation 설정에 저장** |
| 레포 `AGENTS.md` | 제품 규칙 | fragment merge + 제품 lock |

| Automation 이름 | 프롬프트 파일 |
|---|---|
| `never-sleep · worker` | `templates/automation-worker.md` |
| `never-sleep · director` | `templates/automation-director.md` |
| `never-sleep · researcher` | `templates/automation-researcher.md` |
| `never-sleep · auditor` | `templates/automation-auditor.md` |

---

## Phase A — 환경 준비

### A1. 스킬 설치

```bash
npx skills add https://github.com/tyohnn/never-sleep-agent --skill never-sleep-agent -y
```

스킬만 설치해도 Automation은 **생기지 않음**.

### A2. MCP 인증

| MCP | 용도 |
|---|---|
| Notion | 루트 허브 전체 — 매 wake |
| Slack | inbox/outbox — 매 wake |
| Supabase | DB/Auth/Edge |
| Vercel | deploy/preview/env |

### A3. companion 스킬

```bash
node scripts/adopt.mjs --install-skills
```

### A4. (권장) adopt + Notion 루트 전달

```bash
node scripts/adopt.mjs \
  --target /path/to/your-product-repo \
  --notion-root "https://www.notion.so/your-workspace/Your-Overnight-Root-xxxxx"
```

`--notion-root`는 안내·체크용이다. 실제 값은 다음 Phase에서 config에 저장한다.

---

## Phase B — Notion 루트 입력 + 레포 adopt

### B0. Notion 루트 페이지 정하기 (필수 입력)

1. Notion에서 overnight 허브로 쓸 **루트 페이지**를 하나 만든다 (또는 기존 페이지 선택).
2. 페이지 **Share → Copy link** 로 URL을 복사한다.
3. 제품 레포에 config를 만들고 루트를 넣는다:

```bash
cp path/to/never-sleep-agent/templates/config.example.json \
   /path/to/your-product-repo/never-sleep.config.json
```

```json
{
  "notion": {
    "rootPageUrl": "https://www.notion.so/....",
    "rootPageId": "REPLACE_WITH_PAGE_ID_IF_KNOWN",
    "tasksDataSourceId": "REPLACE_ME",
    "documentsDataSourceId": "REPLACE_ME",
    "boardPageId": "REPLACE_ME"
  }
}
```

- `rootPageUrl` **또는** `rootPageId` 중 하나는 필수.
- Tasks / Documents / BOARD는 이 루트 **하위**에 둔다. 에이전트·auditor는 루트를 기준으로 허브를 찾는다.
- 루트를 안 넣으면 bootstrap·wake가 잘못된 워크스페이스 위치에 쓰거나 중단될 수 있다.

상세: [`templates/notion-bootstrap.md`](../templates/notion-bootstrap.md).

### B1. `AGENTS.md` merge

[`templates/AGENTS.fragment.md`](../templates/AGENTS.fragment.md)를 합치고, Notion 루트 URL을 fragment의 Notion 칸에도 적어 둔다. 제품 lock을 채운다.

### B2. 루트 아래 DB bootstrap

루트 페이지 아래에:

1. **Tasks** DB  
2. **Documents** DB — Kind에 `steer` 포함  
3. `BOARD · heartbeat armed`  
4. 첫 P0/P1 Task  

나온 data source / page ID를 config의 `tasksDataSourceId`, `documentsDataSourceId`, `boardPageId`에 채운다.

### B3. Slack 입력

- `slack.outboxChannelId`
- `slack.ownerUserIds` ← 당신 member ID (조타수)

---

## Phase C — Automation 프롬프트 설정 (당신 · 필수)

디스크의 md 파일은 **초안**이다. Cursor **Automations 설정 화면**에서 프롬프트를 넣어야 한다.

전체 체크리스트: [`templates/automation-prompt.md`](../templates/automation-prompt.md)

### C1. Automation 만들기

1. Cursor에서 **Automations** (Cloud Agents Automations) 연다.
2. overnight 대상 **레포**를 고른다.
3. Automation을 **4개** 새로 만든다. 권장 이름:
   - `never-sleep · worker`
   - `never-sleep · director`
   - `never-sleep · researcher`
   - `never-sleep · auditor`

### C2. 각 Automation에 프롬프트 설정

역할마다 **다른** 파일을 연다 → `---` **아래** 전체를 복사 → 해당 Automation의 **Prompt / Instructions** 필드에 붙여넣기 → **Save**.

| Automation | 설정할 프롬프트 파일 |
|---|---|
| worker | [`templates/automation-worker.md`](../templates/automation-worker.md) |
| director | [`templates/automation-director.md`](../templates/automation-director.md) |
| researcher | [`templates/automation-researcher.md`](../templates/automation-researcher.md) |
| auditor | [`templates/automation-auditor.md`](../templates/automation-auditor.md) |

프롬프트 안의 `[REPO]`, Notion/Slack 자리는 채운다. 최소한 이렇게 명시한다:

- Notion 루트: config의 `notion.rootPageUrl` (또는 URL을 프롬프트 Project pointers에 직접 기입)
- `never-sleep.config.json` 경로
- Slack owner / channel

**한 프롬프트를 네 Automation에 복붙하지 말 것.** 역할이 깨진다.

### C3. 스케줄·옵션

| Role | cron 예 (spawn only) |
|---|---|
| worker | `*/15` |
| director | `*/30` |
| researcher | `0 */2 * * *` |
| auditor | `30 */3 * * *` |

- 레포 / 브랜치 / 도구(MCP)·스킬이 overnight 환경에서 쓰이는지 확인
- 저장 후 enabled

스킬을 나중에 업데이트하면 Automation 문구는 **자동 갱신되지 않는다.** md가 바뀌면 다시 열어 프롬프트 설정에 붙여 저장한다.

---

## Phase D — 첫 밤

1. config에 Notion 루트가 있는지 재확인  
2. BOARD `nextHeavy` 있는지 확인  
3. Automation 수동 실행 1회(최소 worker + director) smoke test  
4. 확인: 루트 아래 `Run log ·`, Slack 보고, worker면 Subagents 목록  
5. 스레드에 `P0: …` 답글 → `STEER · *` 생성 확인  

---

## Phase E — 평소 사용 (조타)

1. Slack overnight 스레드 읽기  
2. 방향 수정은 **답글** → Notion STEER  
3. 우선순위: 당신 STEER > director Decision/BOARD > Tasks  

| 증상 | 볼 곳 |
|---|---|
| Notion에 안 쌓임 | `notion.rootPageUrl` / MCP / DB가 루트 아래인지 |
| 보고 없음 | Automation 프롬프트 저장·enable·cron / Slack MCP |
| STEER 없음 | `ownerUserIds` / Kind=`steer` |
| 코드 안 움직임 | worker 프롬프트·LEASE·서브에이전트 |

---

## Phase F — 업데이트

```bash
npx skills add https://github.com/tyohnn/never-sleep-agent --skill never-sleep-agent -y
node scripts/adopt.mjs --install-skills
```

Automation 프롬프트 파일이 바뀌었으면 Cursor Automation 설정에 **다시 붙여 저장**.

---

## 체크리스트

- [ ] 스킬 설치
- [ ] Notion / Slack / Supabase / Vercel MCP 인증
- [ ] companion 스킬
- [ ] **Notion 루트 페이지 URL/ID → config**
- [ ] 루트 아래 Tasks / Documents(`steer`) / BOARD / 첫 Task
- [ ] `AGENTS.md` + `never-sleep.config.json` (owner, channel)
- [ ] Cursor Automations ×4 — 역할별 프롬프트를 **설정에 저장** + cron
- [ ] smoke wake + STEER 실험

완료되면 Slack 답글만으로 overnight 방향을 잡을 수 있다.
