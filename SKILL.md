---
name: never-sleep-agent
description: Overnight ops loop for Cursor Automation — cron wake → Slack inbox absorb → Notion LEASE/Tasks/run-log → optional Oh My Docs gate → product work via project AGENTS.md → Slack outbox. Use when adopting overnight wakes, running HEAVY/LIGHT/MERGE modes, or coordinating multi-agent leases.
---

# never-sleep-agent

Cursor에 설치하는 **밤새 운영 OS 스킬**.  
cron으로 깨우면 → Notion으로 조율 → (있으면) Oh My Docs 게이트 → 작업 → Slack 보고.  
Slack 스레드 요청은 Notion에 흡수해서 다음 wake에서 계속 쓴다.

제품 파이프라인(Seedream, img2threejs, asset slate 등)은 **이 스킬 밖**에 둔다. 그건 대상 레포의 `AGENTS.md` / domain skills가 소유한다.

## When to use

- Cursor Automation cron이 overnight wake를 spawn했을 때
- 레포에 never-sleep adopt를 할 때 (`templates/` + optional `scripts/adopt.mjs`)
- HEAVY / LIGHT / MERGE 모드 선택, LEASE, Slack inbox/outbox가 필요할 때

## Architecture

```text
[Cursor Automation cron */N]
        │
        ▼
 never-sleep-agent
        ├── Slack Inbox ──► Notion Tasks/Documents
        ├── Notion LEASE + Tasks + run-log
        ├── Oh My Docs gate (optional)
        ├── Project AGENTS.md / domain skills
        └── Slack Outbox ◄── wake summary
```

| Layer | Owner |
|---|---|
| Skill core | this skill (`SKILL.md` + `references/`) |
| Product plugin | 대상 레포 `AGENTS.md` |
| Ops data | Notion |
| Handbook | Oh My Docs (soft-require) |
| Human channel | Slack |

## Required reading (by phase)

Read only what the current step needs:

1. Wake entry → [`references/wake-protocol.md`](references/wake-protocol.md)
2. Collision / mode pick → [`references/collision-and-merge.md`](references/collision-and-merge.md)
3. Notion writes → [`references/notion-schema.md`](references/notion-schema.md)
4. Slack in/out → [`references/slack-protocol.md`](references/slack-protocol.md)
5. Docs-first check → [`references/omd-gate.md`](references/omd-gate.md)

Adopt / bootstrap templates live under [`templates/`](templates/).

## Wake loop (summary)

Cron = **spawn only**. A wake may run **30–90+ minutes**. Do not truncate real work to fit the cron interval.

```text
1. Load config (templates/config.example.json shape or project adopt)
2. Slack Inbox → Notion Tasks (ack absorbed items)
3. Collision check (open PRs + active LEASE · *)
4. Pick mode: HEAVY | LIGHT | MERGE
5. Oh My Docs soft gate (if .omd/project.json exists)
6. Claim / refresh LEASE · <branch> when doing HEAVY work
7. Execute via project AGENTS.md / domain skills
8. Before exit (always):
   - run-log Document
   - BOARD / nextHeavy update (if present)
   - Slack Outbox report
   - next wake recommendation
```

**Empty-handed exit is forbidden.** If HEAVY is blocked, do LIGHT ops, merge green lease-safe PRs, or idle-research — then still write run-log + Slack.

## Modes

| Mode | When | What |
|---|---|---|
| **HEAVY** | ≤1 open automation PR, no overlapping lease | Implement + push toward green/auto-merge |
| **LIGHT** | ≥2 open PRs or lease conflict | No competing impl PR; merge green; status / idle-research |
| **MERGE** | Green PR ready, lease-safe | Land immediately, then report |

Details: [`references/collision-and-merge.md`](references/collision-and-merge.md).

## Non-goals (v0)

- GitHub 레포 생성 자동화
- 특정 제품 도메인 규칙 내장 (Pax Humana 등)
- Notion DB 완전 자동 생성 (bootstrap 가이드만)
- Oh My Docs 대체 (연동만)

## Adopt (human + agent)

1. Install skill into the target environment
2. Copy [`templates/AGENTS.fragment.md`](templates/AGENTS.fragment.md) into project `AGENTS.md`
3. Paste [`templates/automation-prompt.md`](templates/automation-prompt.md) into Cursor Automation
4. Bootstrap Notion per [`templates/notion-bootstrap.md`](templates/notion-bootstrap.md)
5. Optionally drop [`templates/config.example.json`](templates/config.example.json) as project config
6. Phase 3+: run `node scripts/adopt.mjs` when available

## Examples

Product-specific overnight patterns (reference only, not loaded as rules):

- [`examples/pax-humana.md`](examples/pax-humana.md)
