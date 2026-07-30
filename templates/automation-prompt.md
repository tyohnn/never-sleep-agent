# Cursor Automations — 맞춤 프롬프트를 설정에 저장

## 순서 (중요)

1. **온보딩 먼저** — [`guides/onboarding.md`](../guides/onboarding.md) / [`onboarding-prompt.md`](onboarding-prompt.md)  
   레포를 이해하고 `docs/ops/automation-*.md`를 **이 프로젝트용으로 수정**한다.
2. 그다음 Cursor → Automations에서 **맞춤 파일**을 Prompt/Instructions에 붙여 저장한다.
3. 스킬 레포의 vanilla `templates/automation-*.md`는 초안일 뿐, 그대로 복붙하지 않는 것이 기본이다.

에이전트/스킬 설치 ≠ 온보딩 완료 ≠ Automation 프롬프트 설정 완료.

## 전제 입력

- [ ] Notion 루트 (`notion.rootPageUrl`)
- [ ] `immutable.baseBranch` = `main` 또는 `dev`
- [ ] Slack owner + channel
- [ ] 온보딩 산출물: 맞춤 `AGENTS.md` + `docs/ops/automation-*.md`
- [ ] Notion 워크스페이스 구조 — [`notion-workspace-structure.md`](notion-workspace-structure.md)
- [ ] MCP 인증 + companion skills

## Human checklist — Automation 프롬프트 설정

- [ ] Cursor → **Automations**
- [ ] 대상 레포 선택
- [ ] Automation **4개** 생성
- [ ] 각 Automation **Prompt 설정**에 아래 **프로젝트 로컬** 파일 붙여넣기
- [ ] 프롬프트 안에 **Immutable ops** 블록이 있는지 확인
- [ ] cron 저장 · Enabled
- [ ] smoke Run 1회/역할 (또는 worker+director)

| Automation 이름 | 설정할 파일 (온보딩 후) |
|---|---|
| `never-sleep · worker` | `docs/ops/automation-worker.md` |
| `never-sleep · director` | `docs/ops/automation-director.md` |
| `never-sleep · researcher` | `docs/ops/automation-researcher.md` |
| `never-sleep · auditor` | `docs/ops/automation-auditor.md` |

온보딩 전이면 스킬 `templates/automation-*.md`를 복사해 `docs/ops/`에 두고 수정한 뒤 붙여라.

## Immutable (모든 프롬프트에 유지)

[`references/immutable-ops.md`](../references/immutable-ops.md)

- 짧게 돌지 않음 (cron = spawn only, 30–90분+)
- base = main 또는 dev → 그곳으로 auto-merge when green
- worker = Task 서브에이전트만 구현
- Notion 루트 준수 · STEER · MCP · no empty exit

## How to configure (Cursor UI)

1. New Automation → name `never-sleep · <role>`
2. Repository = product repo
3. Open **customized** `docs/ops/automation-<role>.md`
4. Copy paste-block (`---` 아래 `You are the…`)
5. Paste into Prompt/Instructions → set Notion root + config path
6. Schedule → Save  
7. Repeat for all four roles — **do not reuse one prompt**

## Suggested crons

| Role | Example |
|---|---|
| worker | `*/15` |
| director | `*/30` |
| researcher | `0 */2 * * *` |
| auditor | `30 */3 * * *` |
