---
name: never-sleep-agent
description: Overnight ops OS for Cursor Automations — four roles (worker, director, researcher, auditor), required Notion/Slack/Supabase/Vercel MCPs, default Vercel/Supabase/React skill pack, owner Slack STEER into Notion, LEASE/run-log, Slack outbox. Use for overnight wakes, multi-agent direction, research, or workflow audits.
---

# never-sleep-agent

Cursor에 설치하는 **밤새 운영 OS 스킬**.  
cron으로 깨우면 → Notion으로 조율 → (있으면) Oh My Docs 게이트 → 역할별 작업 → Slack 보고.

주인(owner)의 Slack 스레드 답변은 **조타(STEER)** 로 Notion에 저장되고, 모든 에이전트 계획보다 우선한다.

제품 파이프라인은 **이 스킬 밖** — 대상 레포 `AGENTS.md` / domain skills 소유.

## Required MCPs (hard)

Agents **must** use these MCP servers for their domains (no silent bypass):

| MCP | Always / when |
|---|---|
| **Notion** | every wake (STEER, Tasks, BOARD, run-log, …) |
| **Slack** | every wake (inbox + outbox) |
| **Supabase** | any DB / Auth / Edge / SQL work |
| **Vercel** | any deploy / preview / project env work |

Details: [`references/required-mcps.md`](references/required-mcps.md).

## Default companion skills

Adopt installs the Vercel / Next / shadcn / Supabase / browser pack:

```bash
bash templates/default-skills.sh
# or: node scripts/adopt.mjs --install-skills
```

List: [`references/default-skills.md`](references/default-skills.md).

## Four Cursor Automations

한 레포에 Automation을 **4개** 둔다. 프롬프트: [`templates/automation-prompt.md`](templates/automation-prompt.md).

| Role | Job |
|---|---|
| **worker** | LEASE 오케스트레이션 — **직접 구현 금지, 전부 Task 서브에이전트** |
| **director** | 전체 Notion·STEER·리서치를 읽고 방향·우선순위·병렬 트랙·의사결정 |
| **researcher** | 웹 / X / YouTube(`yt-dlp`, Data API) 트렌드 → Notion `Research ·` |
| **auditor** | 누락 의사결정·Notion DB/스키마·워크플로 전반 점검 |

Contracts: [`references/roles.md`](references/roles.md).

## Architecture

```text
[Cursor Automations ×4 cron]
        │
        ▼
 never-sleep-agent (role=worker|director|researcher|auditor)
        ├── Slack Inbox (owner) ──► Notion STEER + Tasks
        ├── Notion BOARD + LEASE + Tasks + Decisions + Research + Audit
        ├── Oh My Docs gate (optional)
        ├── Worker parent → Task subagents → product AGENTS.md / skills
        └── Slack Outbox ◄── role-tagged wake summary
```

| Layer | Owner |
|---|---|
| Skill core | this skill |
| Product plugin | 대상 레포 `AGENTS.md` |
| Ops data | Notion |
| Handbook | Oh My Docs (soft-require) |
| Human helmsman | Slack owner → `STEER · *` |
| Agent director | priorities / parallelTracks / `Decision · *` |

## Required reading

1. Roles → [`references/roles.md`](references/roles.md)
2. Immutable ops → [`references/immutable-ops.md`](references/immutable-ops.md)
3. Worker subagents → [`references/worker-subagents.md`](references/worker-subagents.md)
4. Required MCPs → [`references/required-mcps.md`](references/required-mcps.md)
4. Default skills → [`references/default-skills.md`](references/default-skills.md)
5. Wake entry → [`references/wake-protocol.md`](references/wake-protocol.md)
6. Collision → [`references/collision-and-merge.md`](references/collision-and-merge.md)
7. Notion → [`references/notion-schema.md`](references/notion-schema.md)
8. Slack → [`references/slack-protocol.md`](references/slack-protocol.md)
9. OMD → [`references/omd-gate.md`](references/omd-gate.md)
10. Researcher → [`references/research-protocol.md`](references/research-protocol.md)
11. Auditor → [`references/audit-protocol.md`](references/audit-protocol.md)

## Shared wake preamble (all roles)

```text
1. Load config (role, slack.ownerUserIds, Notion IDs)
2. Verify Notion + Slack MCP usable; use Supabase/Vercel MCP when touching those surfaces
3. Owner Slack (Slack MCP) → STEER + Tasks (Notion MCP) → ack
4. Read active STEER (helmsman > everything)
5. Role-specific work — **worker: spawn Task subagents** (never implement product inline)
6. Exit packet: role-tagged run-log (Notion), BOARD, Slack outbox (Slack MCP)
```

**Empty-handed exit forbidden.**  
**Helmsman rule:** active owner STEER outranks director Decisions and all agent Tasks.  
**Worker subagent rule:** parent worker orchestrates only; all direct product work → Cursor Task subagents (`worker-subagents.md`).

## Modes

| Mode | Who | What |
|---|---|---|
| **HEAVY / LIGHT / MERGE** | worker | subagents implement / avoid collide / land green |
| **DIRECT** | director | priorities, parallelTracks, Decisions |
| **RESEARCH** | researcher | multi-source brief → Notion |
| **AUDIT** | auditor | gaps, schema, workflow |

## Non-goals (v0)

- GitHub 레포 생성 자동화
- 특정 제품 도메인 규칙 내장
- Notion DB 완전 자동 생성 (auditor가 bootstrap/수리 시도 + 가이드)
- Oh My Docs 대체
- 역할 간 직접 메시징 (Notion만)
- Cursor Automation 자동 생성 (유저가 프롬프트를 직접 저장)

## Adopt

**유저 가이드:** [`docs/user-guide.md`](docs/user-guide.md) · **온보딩:** [`docs/onboarding.md`](docs/onboarding.md)

요약:

1. Install skill + MCP + companion skills
2. User inputs: **Notion root**, `immutable.baseBranch` (`main`|`dev`), Slack
3. **Onboarding** (understand repo) → customize `AGENTS.md` + `docs/ops/automation-*.md`
4. Build Notion workspace under root — [`templates/notion-workspace-structure.md`](templates/notion-workspace-structure.md)
5. Human saves **customized** prompts in Cursor Automations UI
6. Immutable locks always on — [`references/immutable-ops.md`](references/immutable-ops.md)
7. Slack 조타 (STEER)

**Immutable:** cron≠short wake · base main/dev · auto-merge green · worker→subagents · Notion root only.

## Examples

- [`examples/pax-humana.md`](examples/pax-humana.md) (non-normative)
