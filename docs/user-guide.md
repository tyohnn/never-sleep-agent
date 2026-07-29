# never-sleep-agent — 유저 설치·사용 가이드

사람(유저/주인) 기준 end-to-end.  
**온보딩으로 레포를 이해 → 맞춤 AGENTS/Automation 작성 → Cursor에 프롬프트 설정** 순서를 지킨다.

## 필수 입력

| 입력 | 어디 |
|---|---|
| **Notion 루트 페이지** URL/ID | `never-sleep.config.json` → `notion.rootPageUrl` |
| Base branch | `immutable.baseBranch` = `main` 또는 `dev` |
| Slack owner + channel | `slack.ownerUserIds`, `outboxChannelId` |
| 제품 레포 | Cursor + `AGENTS.md` |

## 한 장 요약

```text
[입력] Notion 루트 · baseBranch(main|dev) · Slack · 레포

[설치] 스킬 → MCP → companion skills → config에 루트 기입

[온보딩] 레포 이해 (templates/onboarding-prompt.md)
        → 맞춤 AGENTS.md
        → 맞춤 docs/ops/automation-*.md
        → Notion 루트 아래 워크스페이스 구조

[저장] 유저가 Cursor Automations ×4에 맞춤 프롬프트 설정·저장 + cron

[불변] 긴 wake · base로 auto-merge · worker=서브에이전트 · STEER · MCP

[운영] Slack 답글 = 조타 · cron이 네 역할을 깨움
```

상세 온보딩: [`onboarding.md`](onboarding.md)  
불변 규칙: [`../references/immutable-ops.md`](../references/immutable-ops.md)  
Notion 구조: [`../templates/notion-workspace-structure.md`](../templates/notion-workspace-structure.md)

---

## Phase A — 환경

1. 스킬 설치  
2. MCP: Notion / Slack / Supabase / Vercel  
3. `node scripts/adopt.mjs --install-skills`  
4. `never-sleep.config.json` 복사 후:
   - `notion.rootPageUrl` (필수)
   - `immutable.baseBranch`: `"main"` 또는 `"dev"`
   - slack ids  

```bash
node scripts/adopt.mjs --target /path/to/repo \
  --notion-root "https://www.notion.so/.../Your-Root"
```

---

## Phase B — 온보딩 (Automations 붙이기 전)

제네릭 프롬프트를 바로 붙이지 않는다.

1. Cursor 채팅에 [`templates/onboarding-prompt.md`](../templates/onboarding-prompt.md) 실행 (또는 one-shot Automation 수동 Run)
2. 온보딩 에이전트가 레포를 읽고:
   - `docs/ops/never-sleep-onboarding.md`
   - 맞춤 `AGENTS.md` (immutable 블록 포함)
   - 맞춤 `docs/ops/automation-{worker,director,researcher,auditor}.md`
   - Notion 루트 아래 구조 점검/생성 가이드 수행
3. 당신이 내용 리뷰·수정

Product lock·앱 경로·리서치 토픽은 여기서 레포에 맞게 채운다.

---

## Phase C — Notion 워크스페이스 구조

루트 아래에 명세서대로 만든다 (Notion 갤러리 템플릿 아님):

→ [`templates/notion-workspace-structure.md`](../templates/notion-workspace-structure.md)

최소 DB:

| DB | 용도 |
|---|---|
| Tasks | 실행 작업 |
| Documents | STEER·run-log·Decision·BOARD·LEASE… |
| **Requests** | Slack 유저 요청 정리 (inbox 큐) |
| **Goals** | tonight/week 목표 |
| **Findings** | auditor 어긋남/갭 (강력 권장) |

Slack 답글 → Requests 행 (+ STEER + Task). Auditor 갭 → Findings 행. Director가 Goals 1–3개 유지.

IDs를 config에 기입.

---

## Phase D — Automation 프롬프트 설정 (당신)

**맞춤 파일**을 Cursor Automations에 넣는다 (스킬 vanilla 템플릿 그대로 X).

| Automation | 붙여넣을 파일 |
|---|---|
| `never-sleep · worker` | `docs/ops/automation-worker.md` |
| `never-sleep · director` | `docs/ops/automation-director.md` |
| `never-sleep · researcher` | `docs/ops/automation-researcher.md` |
| `never-sleep · auditor` | `docs/ops/automation-auditor.md` |

절차: [`templates/automation-prompt.md`](../templates/automation-prompt.md)

각 프롬프트에 **Immutable ops** 블록이 들어 있어야 한다 (긴 wake, baseBranch, auto-merge, subagents).

cron 예: worker `*/15`, director `*/30`, researcher `0 */2`, auditor `30 */3`.

---

## Phase E — 불변 규칙 (절대 완화 금지)

| Lock | 의미 |
|---|---|
| Cron = spawn only | Automation을 짧게 끝내지 않음. 30–90분+ OK |
| Base `main` \| `dev` | 그 브랜치로만 overnight 통합 |
| Auto-merge when green | CI green + lease-safe면 자동 머지 (STEER hold 제외) |
| Worker → subagents | 부모 워커가 제품 코드 직접 수정 금지 |
| Notion root | 루트 밖 금지 |
| STEER / MCP / no empty exit | 조타·MCP·빈손 종료 금지 |

---

## Phase F — 평소 사용

1. Slack overnight 스레드 읽기  
2. 답글 = 조타 → Notion `STEER · *`  
3. 우선순위: STEER > director Decision/BOARD > Tasks  

막히면: Notion 루트 / Automation 프롬프트 저장 여부 / MCP / LEASE 충돌.

---

## 체크리스트

- [ ] 스킬 + MCP + companion skills  
- [ ] Notion 루트 + baseBranch in config  
- [ ] **온보딩 완료** (레포 이해 + 맞춤 AGENTS + 맞춤 automation md)  
- [ ] Notion 워크스페이스 구조 (최소 README/BOARD/Tasks/Documents)  
- [ ] Cursor Automations ×4에 **맞춤** 프롬프트 설정·저장 + cron  
- [ ] Immutable 블록 포함 확인  
- [ ] smoke wake + STEER 실험  
