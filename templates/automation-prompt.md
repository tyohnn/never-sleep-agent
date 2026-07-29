# Cursor Automations — 프롬프트를 설정에 저장하세요

`templates/automation-*.md`는 레포 안 **초안**일 뿐이다.  
**유저가 Cursor → Automations 설정에서 프롬프트 필드를 직접 구성·저장**해야 overnight가 돈다.

에이전트/스킬 설치 ≠ Automation 등록 ≠ 프롬프트 설정 완료.

## 전제 입력

Automation을 만들기 **전에**:

- [ ] `never-sleep.config.json`에 **Notion 루트** (`notion.rootPageUrl` 또는 `rootPageId`) 기입
- [ ] Slack `ownerUserIds` + `outboxChannelId`
- [ ] Notion / Slack / Supabase / Vercel MCP 인증
- [ ] companion 스킬 설치 (`adopt.mjs --install-skills`)

Notion 루트 없이 Automation만 켜면 wake가 허브를 못 찾는다. → [`notion-bootstrap.md`](notion-bootstrap.md)

## Human checklist — Automation 프롬프트 설정

- [ ] Cursor → **Automations** 열기
- [ ] overnight **대상 레포** 선택
- [ ] Automation **4개** 생성 (아래 이름 권장)
- [ ] 각 Automation의 **Prompt / Instructions 설정**에 해당 md의 `---` 아래를 붙여넣기
- [ ] 프롬프트 안 `[REPO]`·Notion 루트·config 경로를 채우기 (또는 “read `never-sleep.config.json`” 명시)
- [ ] **cron / schedule** 저장 (spawn only)
- [ ] Save · Enabled
- [ ] (권장) 역할마다 수동 Run 1회로 smoke test

저장하지 않으면 worker/director/researcher/auditor는 **시작되지 않는다**.

## 역할별 프롬프트 파일 (설정에 넣을 내용)

| Automation 이름 (권장) | Prompt로 설정할 파일 | Role |
|---|---|---|
| `never-sleep · worker` | [`automation-worker.md`](automation-worker.md) | LEASE 오케스트레이션; 구현은 Task 서브에이전트 |
| `never-sleep · director` | [`automation-director.md`](automation-director.md) | 우선순위·병렬 트랙·Decision |
| `never-sleep · researcher` | [`automation-researcher.md`](automation-researcher.md) | 웹 / X / YouTube → Notion |
| `never-sleep · auditor` | [`automation-auditor.md`](automation-auditor.md) | 워크플로·스키마·MCP 점검 |

**한 프롬프트를 네 설정에 재사용하지 말 것.**

## How to configure (Cursor UI)

1. Automations → **New Automation**
2. Name: e.g. `never-sleep · worker`
3. Repository: your overnight product repo
4. Open `templates/automation-worker.md` in the skill/repo
5. Copy everything **after** the paste horizontal rule (`---` that precedes `You are the **worker**…`)
6. Paste into the Automation’s **prompt / instructions** field
7. In Project pointers (inside the pasted text), set:
   - Notion root URL (same as `notion.rootPageUrl`)
   - path to `never-sleep.config.json`
   - Slack channel / owner IDs
8. Set schedule (cron)
9. Save
10. Repeat for director / researcher / auditor with **their** files

스킬을 업데이트한 뒤에는 md가 바뀌었는지 확인하고, 바뀌었으면 Automation 프롬프트 설정을 **다시** 붙여 저장한다.

## Suggested crons (spawn only)

| Role | Example |
|---|---|
| worker | `*/15` |
| director | `*/30` or `0 * * * *` |
| researcher | `0 */2 * * *` |
| auditor | `30 */3 * * *` |

## Related

- 유저 전체 흐름: [`docs/user-guide.md`](../docs/user-guide.md)
- Notion 루트: [`notion-bootstrap.md`](notion-bootstrap.md)
