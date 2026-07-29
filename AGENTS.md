# AGENTS.md — never-sleep-agent (skill repo)

This repository **is** the skill. Changes here ship as overnight OS docs/templates, not as a product app.

## Scope

**In scope**

- `SKILL.md` wake loop + four Cursor Automation roles
- `docs/user-guide.md` end-user install/use guide
- `references/*` contracts (roles, research, audit, required MCPs, default skills)
- `templates/*` adopt artifacts + `automation-*.md` + `default-skills.sh`
- `scripts/adopt.mjs` (`--install-skills`)
- `examples/*` as non-normative illustrations

**Out of scope**

- Product pipelines (Seedream, img2threejs, Parametric Asset, …)
- Creating GitHub product repos
- Fully automatic Notion DB provisioning (v0)
- Replacing Oh My Docs

## Editing rules

1. Prefer contract clarity over clever automation
2. Keep product examples in `examples/` — never promote them into skill hard rules
3. When changing wake/Slack/Notion contracts, update `references/` and matching `templates/` in the same change
4. Open questions stay in README until locked; then delete the question and encode the default

## Local verification

- Layout matches README tree
- `SKILL.md` frontmatter `name: never-sleep-agent`
- Links between SKILL ↔ references ↔ templates resolve
- No Pax Humana / product lock language inside `references/` (examples only)

## Wake note

If this skill repo itself is edited by an overnight agent, still follow never-sleep norms: run-log in the operator’s Notion, Slack report, no empty exits. There is no product track here — HEAVY means improving the skill contracts.
