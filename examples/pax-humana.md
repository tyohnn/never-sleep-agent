# Example: Pax Humana overnight (reference only)

**Not loaded as skill rules.** Shows how a product repo plugs into never-sleep-agent.

## Split

| Layer | Where |
|---|---|
| Ops loop | `never-sleep-agent` skill |
| Product | repo `AGENTS.md` + `.agents/skills/parametric-asset` |
| Ops data | Notion Tasks / Documents / `BOARD · heartbeat …` |
| Human | Slack overnight thread |

## Product track (illustrative)

- Official skill name: **Parametric Asset**
- Pipeline: Seedream → **img2threejs (required)** → Parametric Asset controls → dashboard → Notion evidence
- Forbidden: Seedream → hand-authored boxes + controls presented as done

## Wake adaptations seen in dogfood

- Track A (asset) leases ~90m; cron `*/10` is spawn-only
- BOARD carries `nextHeavy`, `completedAssets`, links to SEED/decision pages
- Run-logs cite forge artifacts / screenshots when reminting
- Idle-research when board quiet (web + optional yt-dlp) — project AGENTS owned this, not the skill
- Dual-track nights: A assets vs B dashboard polish — collision via leases/`codeAreas`

## What to copy vs leave

Copy into a new adopt:

- BOARD + run-log naming
- HEAVY/LIGHT/MERGE + Slack absorb
- soft OMD gate

Leave in the product repo:

- img2threejs mandate
- asset slate / Seedream budgets
- forge UI dogfood depth
