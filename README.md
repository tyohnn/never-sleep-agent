# never-sleep-agent

Cursor에 설치하는 **밤새 운영 OS 스킬**.

cron으로 깨우면 → Notion으로 조율 → (있으면) Oh My Docs 게이트 → 작업 → Slack 보고.  
Slack 스레드 요청은 Notion에 흡수해서 다음 wake에서 계속 쓴다.

제품 lock(Seedream, img2threejs, asset slate 등)은 **스킬 밖** — 대상 레포 `AGENTS.md`가 소유한다.

## Install

```bash
npx skills add <org>/never-sleep-agent --skill never-sleep-agent -y
```

Or clone this repo and point Cursor skills at it.

## Layout

```text
SKILL.md                 # skill entry
AGENTS.md                # contributor rules for this skill repo
references/              # wake / Notion / Slack / OMD / collision
templates/               # adopt fragments + automation prompt + config
scripts/adopt.mjs        # optional adopt helper (Phase 3+)
examples/                # product dogfood notes (not loaded as rules)
```

## Quick adopt

1. Install the skill
2. Merge [`templates/AGENTS.fragment.md`](templates/AGENTS.fragment.md) into the target repo
3. Paste [`templates/automation-prompt.md`](templates/automation-prompt.md) into Cursor Automation
4. Bootstrap Notion with [`templates/notion-bootstrap.md`](templates/notion-bootstrap.md)
5. Optionally copy [`templates/config.example.json`](templates/config.example.json) → `never-sleep.config.json`

## Wake modes

| Mode | Role |
|---|---|
| **HEAVY** | Implement under a Notion `LEASE · <branch>` |
| **LIGHT** | Avoid colliding; status, merges, idle-research |
| **MERGE** | Land green lease-safe PRs |

Cron = spawn only. Wakes may run 30–90+ minutes. Empty-handed exits are forbidden.

## Phases

| Phase | Status |
|---|---|
| 0 Plan + name lock | done |
| 1 Skill skeleton | this repo |
| 2 Slack contract polish | next |
| 3 optional `adopt.mjs` | stub |
| 4 Dogfood on a real overnight repo | pending |

## Open questions (v0)

Documented for discussion — defaults used in templates:

1. **Distribution** — private skill repo vs public skills.sh listing → default: private/org install until dogfood stabilizes
2. **Inbox** — thread replies vs emoji gate → default: thread replies; emoji optional via config
3. **BOARD/SEED** — required vs optional → default: recommended templates, not hard-fail
4. **Multi-repo** — skill-per-repo vs shared Notion hub → both supported; choose per adopt

## License / ownership

Skill core only. Product plugins and Notion workspaces stay with the adopting team.
