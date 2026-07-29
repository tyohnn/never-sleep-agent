# Cursor Automations — YOU must save these prompts

레포의 `templates/automation-*.md`는 **초안 저장소**일 뿐이다.  
Cursor가 자동으로 Automation을 만들지 않는다. **유저(인간)가 Cursor UI에서 Automation 4개를 만들고, 아래 프롬프트를 각각 붙여 저장**해야 overnight가 돈다.

에이전트/스킬만 설치한 상태 ≠ Automation 등록 완료.

## Human checklist (필수)

- [ ] Cursor → Automations (또는 Cloud Agents Automations) 열기
- [ ] 대상 레포에 Automation **4개** 생성
- [ ] 각 Automation에 아래 파일 내용을 **전부 붙여넣기** (헤더 안내 제외, `---` 아래부터)
- [ ] `[REPO]` / Notion·Slack ID 자리를 채우거나 `never-sleep.config.json`을 쓰도록 통일
- [ ] cron 저장 (spawn only)
- [ ] 각 Automation이 `never-sleep-agent` 스킬 + default companion skills를 쓸 수 있는 환경인지 확인
- [ ] Notion / Slack / Supabase / Vercel MCP 인증 완료

저장하지 않으면 worker/director/researcher/auditor wake는 **시작되지 않는다**.

## Prompt files (role별 분리 저장됨)

| Automation 이름 (권장) | 프롬프트 파일 | Role |
|---|---|---|
| `never-sleep · worker` | [`automation-worker.md`](automation-worker.md) | LEASE 오케스트레이션; 구현은 Task 서브에이전트 |
| `never-sleep · director` | [`automation-director.md`](automation-director.md) | 우선순위·병렬 트랙·Decision |
| `never-sleep · researcher` | [`automation-researcher.md`](automation-researcher.md) | 웹 / X / YouTube → Notion |
| `never-sleep · auditor` | [`automation-auditor.md`](automation-auditor.md) | 워크플로·스키마·MCP 점검 |

공유 계약: `references/roles.md`, helmsman STEER, Notion hub, Slack standing thread.

## Before first overnight

1. Authenticate MCPs: **Notion, Slack, Supabase, Vercel** (`references/required-mcps.md`)
2. Install default skills: `bash templates/default-skills.sh` or `node scripts/adopt.mjs --install-skills`
3. Fill `never-sleep.config.json` (`mcp.required`, Notion IDs, `ownerUserIds`)
4. **Save the four prompts into Cursor Automations** (this page)

## Suggested crons (spawn only)

| Role | Example |
|---|---|
| worker | `*/15` |
| director | `*/30` or `0 * * * *` |
| researcher | `0 */2 * * *` |
| auditor | `30 */3 * * *` |

Stagger so director often lands before a worker burst. Exact timing is team preference.

## How to paste

1. Open `templates/automation-<role>.md`
2. Copy from the line after the horizontal rule (`---`) that begins the paste block (or the whole “You are the …” section as labeled in each file)
3. Cursor → New Automation → paste into the prompt field → Save
4. Repeat for all four roles — **do not reuse one prompt for all roles**
