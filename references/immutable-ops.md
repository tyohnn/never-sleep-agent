# Immutable ops locks

These rules are **never overridden** by product AGENTS.md, STEER tone, director preference, or “just this once.”  
STEER may redirect *what* to build; it may not cancel these locks.

Config mirrors: `never-sleep.config.json` → `immutable.*` (defaults below). If config disagrees with this file, **this file wins** until the skill version explicitly changes.

## 1. Cron ≠ short work

- Automation cron only **spawns** a wake.
- A wake may run **30–90+ minutes** (longer if the track needs it).
- Forbidden: truncating mandatory steps, skipping subagents, or skipping evidence to “fit” the cron interval.
- Forbidden: treating the next cron tick as a kill signal for good work.

## 2. Base branch

- Overnight PRs target the configured base branch only: default **`main`**, or **`dev`** when the repo’s integration branch is `dev`.
- Set exactly one primary: `immutable.baseBranch` (e.g. `"main"` or `"dev"`).
- Optional read-only mirrors: `immutable.allowedBaseBranches: ["main", "dev"]`.
- Forbidden: opening overnight merge PRs against random feature branches as the integration target.
- Feature work still uses `cursor/…` branches; they merge **into** the base branch.

## 3. Auto-merge when green

- Overnight automation PRs into the base branch **enable auto-merge** (or merge immediately) when:
  - CI green
  - lease-safe / no conflicting foreign LEASE
  - owner STEER has not said `hold` / `do not merge`
- Prefer `gh pr merge --auto` (or repo equivalent) as soon as the PR is up, so green lands without waiting for a human morning click.
- Forbidden: leaving green, lease-safe overnight PRs idle “for review” by default.

## 4. Worker = subagents only

- Parent worker never implements product code inline.
- All direct product work → Cursor Task subagents.
- See `worker-subagents.md`.

## 5. Helmsman + MCP

- Owner Slack → Notion `STEER · *` every absorb; active STEER outranks agent plans.
- Notion + Slack MCP every wake; Supabase/Vercel MCP when those surfaces apply.
- Empty-handed exits forbidden.

## 6. Notion hub under user root

- All ops pages/DBs live under config `notion.rootPageUrl` / `rootPageId`.
- Forbidden: writing overnight ops into a guessed unrelated Notion location.

## Paste block (include in every customized Automation)

```text
## Immutable ops (do not override)
1. Cron = spawn only; wakes may run 30–90+ minutes. Never shorten real work to fit cron.
2. Base branch = <main|dev from config>. Feature branches merge into that base only.
3. Auto-merge green, lease-safe overnight PRs into the base branch (unless STEER says hold).
4. Worker parent: orchestrate only; all product implementation via Task subagents.
5. Notion+Slack MCP every wake; hub only under configured Notion root.
6. Owner STEER outranks agent plans; no empty-handed exits.
```
