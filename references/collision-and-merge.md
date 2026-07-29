# Collision and merge

Parallel overnight agents are expected. Coordination is via **PRs + Notion leases**, not chat hope.

## Collision check (every wake)

Before picking HEAVY:

1. `gh pr list` (open PRs on the overnight base branch)
2. Notion: Documents named `LEASE · *` with Status `In progress` and unexpired `leaseUntil`
3. BOARD `codeAreas` / `nextHeavy` if present

### Overlap rules

| Situation | Mode |
|---|---|
| No open PR, no foreign lease | **HEAVY** OK |
| One open PR that is *your* continuation / same lease branch | **HEAVY** OK (continue) |
| ≥2 open automation PRs | **LIGHT** (or **MERGE** if one is green) |
| Foreign unexpired lease on same `codeAreas` | **LIGHT** |
| Green PR, lease-safe | **MERGE** first |

When unsure whether areas overlap, assume conflict → LIGHT.

## Claiming a lease

HEAVY only after:

1. Collision check passed
2. Create/update `LEASE · <branch>` with `leaseUntil`
3. Update BOARD pointer (agent URL, branch, intent)

Refresh the lease while still working past the original window.

## Merge policy

Defaults (override in project AGENTS if needed):

- Prefer **auto-merge when green** for overnight automation PRs
- Do not merge if:
  - another lease owns the same areas and disagrees
  - CI red
  - human Slack said hold
- After merge: close lease if work complete, set Task Done, set BOARD `nextHeavy`

## Multi-agent etiquette

- One HEAVY implementer per code area
- LIGHT agents may still:
  - absorb Slack inbox
  - fix docs/ops that do not steal the lease
  - merge green lease-safe PRs
  - idle-research and plant Tasks
- Never force-push someone else’s lease branch
- Never clear another agent’s lease unless `leaseUntil` is clearly expired and BOARD shows abandoned work — then note it in run-log
- Owner STEER that says hold/redirect/release a lease wins over agent intent; obey and record in run-log

## PR hygiene

Overnight PRs should include:

- what mode claimed the work
- Notion Task / run-log links when useful
- evidence for product gates (project-specific)

Branch naming: follow the environment’s convention (e.g. `cursor/<desc>-xxxx`).
