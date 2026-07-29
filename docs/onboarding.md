# Project onboarding (before Automations)

Automation 프롬프트를 Cursor에 붙여넣기 **전에**, 대상 레포·제품·Notion 루트를 이해하는 **온보딩**을 한다.  
온보딩 결과로 **맞춤형** `AGENTS.md`와 네 Automation 프롬프트를 작성한 뒤 저장한다.

제네릭 `templates/automation-*.md`를 그대로 복붙하는 것은 최후 수단이다. 기본은 **이해하고 → 고치고 → 저장**.

## Who runs onboarding

| Actor | How |
|---|---|
| Human + chat agent | Cursor 채팅에서 [`templates/onboarding-prompt.md`](../templates/onboarding-prompt.md)를 한 번 실행 |
| Optional one-shot Automation | 같은 프롬프트로 Automation을 **한 번만** 수동 Run (cron 없이) |

온보딩 에이전트는 제품 HEAVY를 하지 않는다. 이해·문서·프롬프트 초안만.

## Inputs (human provides)

1. 제품 레포 (이미 Automation 대상 레포)
2. **Notion 루트** URL/ID
3. Slack owner + channel (알면)
4. Base branch 선택: `main` 또는 `dev` (immutable)
5. 한 줄 제품 의도 / 이번 overnight 목표 (있으면)

## Onboarding steps

1. **Repo map** — README, package layout, apps/, AGENTS.md 기존 내용, CI, deploy
2. **Stack** — Next/React/RN, Supabase, Vercel, turbo, AI SDK 등 → companion skills 매핑
3. **Product locks** — 금지 숏컷, 필수 파이프라인, 증거 형식 (사람에게 확인 질문)
4. **Notion hub** — 루트 아래 구조를 [`notion-workspace-structure.md`](../templates/notion-workspace-structure.md)대로 점검/생성 가이드
5. **Immutable ops** — [`immutable-ops.md`](../references/immutable-ops.md)를 맞춤 문서에 고정 삽입 (수정 금지 블록)
6. **Write artifacts** (PR 또는 직접 커밋 — 팀 정책에 따름):
   - 레포 `AGENTS.md` — fragment + 온보딩으로 채운 Product plugin + immutable 블록
   - `never-sleep.config.json` — root, baseBranch, slack, DB ids
   - `docs/ops/never-sleep-onboarding.md` (권장) — 레포 이해 요약
   - `docs/ops/automation-*.md` 또는 `.cursor/never-sleep/automation-*.md` — **이 레포용으로 수정된** 네 프롬프트
7. Human review → Cursor Automations UI에 **맞춤 프롬프트** 붙여 저장

## Customize rules

| File | Customize | Never customize away |
|---|---|---|
| `AGENTS.md` | product tracks, forbidden shortcuts, evidence, research topics | immutable ops block; MCP hard rules; worker=subagents |
| `automation-worker.md` (project copy) | repo name, paths, Notion root, domain hints in briefs | immutable paste block; subagent mandate |
| `automation-director.md` | decision domains, parallel track hints | immutable paste block; no product LEASE |
| `automation-researcher.md` | topic seeds, source prefs | immutable; no product PRs |
| `automation-auditor.md` | repo-specific checklist extras | immutable; Notion root check |

## Output checklist

- [ ] Onboarding brief written (`docs/ops/never-sleep-onboarding.md`)
- [ ] `AGENTS.md` customized + immutable block present
- [ ] Four **project-local** automation prompts customized
- [ ] `never-sleep.config.json` has Notion root + `immutable.baseBranch`
- [ ] Notion workspace structure under root matches template (or gaps tasked)
- [ ] Human pasted **customized** prompts into Cursor Automations (not vanilla templates)
- [ ] cron enabled

## After onboarding

평소 루프는 [`user-guide.md`](user-guide.md) Phase D–E.  
온보딩을 다시 하는 경우: 레포 구조가 크게 바뀌었거나 base branch/제품 lock이 바뀌었을 때.
