# never-sleep-agent

Cursor에 설치하는 **밤새 운영 OS 스킬**.

네 개의 Cursor Automation이 Notion + Slack으로 조율한다.  
주인 Slack 답변은 Notion `STEER · *` **조타(helmsman)** — 모든 에이전트 계획보다 우선.

## 유저 가이드 (설치·사용)

**시작점:** [`docs/user-guide.md`](docs/user-guide.md) · **온보딩:** [`docs/onboarding.md`](docs/onboarding.md)

1. 입력: Notion 루트 · baseBranch(`main`|`dev`) · Slack  
2. 온보딩으로 레포 이해 → **맞춤** `AGENTS.md` + `docs/ops/automation-*.md`  
3. Notion 루트 아래 워크스페이스 구조 ([`templates/notion-workspace-structure.md`](templates/notion-workspace-structure.md))  
4. Cursor Automations에 **맞춤 프롬프트** 설정·저장  
5. 불변 규칙: 긴 wake · base로 auto-merge · worker=서브에이전트 ([`references/immutable-ops.md`](references/immutable-ops.md))

## Roles

| Role | Job |
|---|---|
| **worker** | LEASE 오케스트레이션 — 직접 구현 금지, **Task 서브에이전트**에 위임 |
| **director** | 보드·STEER·리서치를 읽고 방향·우선순위·병렬 트랙·의사결정 |
| **researcher** | 웹 / X / YouTube → Notion `Research ·` |
| **auditor** | 누락 의사결정·Notion DB·워크플로 점검 |

제품 lock은 스킬 밖 — 대상 레포 `AGENTS.md` 소유.

## Install (한 줄)

```bash
npx skills add https://github.com/tyohnn/never-sleep-agent --skill never-sleep-agent -y
```

그다음 반드시 [`docs/user-guide.md`](docs/user-guide.md)의 Phase A–C를 따른다.  
**스킬 설치 ≠ Automation 등록.** 프롬프트 파일:

- [`templates/automation-worker.md`](templates/automation-worker.md)
- [`templates/automation-director.md`](templates/automation-director.md)
- [`templates/automation-researcher.md`](templates/automation-researcher.md)
- [`templates/automation-auditor.md`](templates/automation-auditor.md)

체크리스트: [`templates/automation-prompt.md`](templates/automation-prompt.md)

## Layout

```text
SKILL.md
docs/user-guide.md     # 유저 설치·사용 (시작점)
references/             # wake, roles, MCP, subagents, …
templates/
  automation-*.md       # Automation 프롬프트 초안 (Cursor에 직접 저장)
  AGENTS.fragment.md
  default-skills.sh
  …
scripts/adopt.mjs
examples/
```

## Coordination (요약)

- Agents do not DM each other — **Notion is the bus**
- Worker claims `LEASE · *` and spawns Task subagents for all product work
- Director owns Decisions / priorities / `parallelTracks`
- Required MCPs: Notion, Slack (+ Supabase, Vercel when in scope)
- Cron = spawn only. Empty-handed exits forbidden.

## Phases

| Phase | Status |
|---|---|
| 0 Plan + name lock | done |
| 1 Skill skeleton + roles | this repo |
| 2 Slack contract polish | next |
| 3 `adopt.mjs` fleshed out | partial (`--install-skills`) |
| 4 Dogfood | pending |

## License / ownership

Skill core only. Product plugins and Notion workspaces stay with the adopting team.
