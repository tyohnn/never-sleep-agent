# never-sleep-agent

Cursor에 설치하는 **밤새 운영 OS 스킬**.

네 개의 Cursor Automation이 Notion + Slack으로 조율한다.

| Role | Job |
|---|---|
| **worker** | LEASE 아래 구현 (HEAVY/LIGHT/MERGE) |
| **director** | 전체 보드·STEER·리서치를 읽고 방향·우선순위·병렬 트랙·의사결정 |
| **researcher** | 웹 / X / YouTube → Notion `Research ·` |
| **auditor** | 누락 의사결정·Notion DB·워크플로 점검 |

주인 Slack 답변은 Notion `STEER · *` **조타(helmsman)** — 모든 에이전트 계획보다 우선.

제품 lock은 스킬 밖 — 대상 레포 `AGENTS.md` 소유.

## Install

```bash
npx skills add <org>/never-sleep-agent --skill never-sleep-agent -y
```

## Layout

```text
SKILL.md
references/          # wake, roles, Notion, Slack, research, audit, …
templates/
  automation-prompt.md          # index of 4 Automations
  automation-{worker,director,researcher,auditor}.md
  AGENTS.fragment.md
  notion-bootstrap.md
  …
scripts/adopt.mjs
examples/
```

## Quick adopt

1. Install the skill
2. Authenticate MCPs: **Notion, Slack, Supabase, Vercel**
3. `node scripts/adopt.mjs --install-skills` — default React/Next/Vercel/Supabase/UI pack
4. Merge `templates/AGENTS.fragment.md` into the target repo
5. Create **four** Cursor Automations — [`templates/automation-prompt.md`](templates/automation-prompt.md)
6. Bootstrap Notion (`templates/notion-bootstrap.md`) — Kind includes `steer`
7. Copy `templates/config.example.json` → `never-sleep.config.json`

### Required MCPs

Agents must use Notion + Slack every wake; Supabase + Vercel MCPs whenever those surfaces are in scope. See [`references/required-mcps.md`](references/required-mcps.md).

### Default skills

[`templates/default-skills.sh`](templates/default-skills.sh) / [`references/default-skills.md`](references/default-skills.md).

## Coordination

- Agents do not DM each other — **Notion is the bus**
- Shared preamble every wake: absorb owner STEER → read BOARD
- Worker alone claims product `LEASE · *`
- Director owns `Decision · *`, Task priorities, `parallelTracks`
- Researcher / auditor never ship product features

Cron = spawn only. Empty-handed exits forbidden.

## Phases

| Phase | Status |
|---|---|
| 0 Plan + name lock | done |
| 1 Skill skeleton + roles | this repo |
| 2 Slack contract polish | next |
| 3 `adopt.mjs` fleshed out | stub |
| 4 Dogfood | pending |

## Open questions (v0)

1. Distribution — private/org until dogfood stabilizes
2. Inbox — owner thread replies → STEER; emoji optional
3. BOARD/SEED — recommended, not hard-fail
4. Multi-repo — skill-per-repo and/or shared Notion hub
5. Auditor `canFinalizeDecisions` — default **false** (draft only)

## License / ownership

Skill core only. Product plugins and Notion workspaces stay with the adopting team.
