# Worker → subagents (hard)

The **worker** Cursor Automation is an **orchestrator**, not a coder.

All direct product/implementation work must run through **Cursor Task / subagents**. The parent worker must not edit product code, author features, or drive long coding sessions itself.

## Parent worker may do (inline)

- Shared preamble: MCP gate, Slack inbox → STEER, BOARD/LEASE reads
- Collision check + mode pick (HEAVY / LIGHT / MERGE)
- Claim / refresh / release `LEASE · *`
- Spawn, brief, and wait on subagents (Task tool)
- Merge green lease-safe PRs (`gh`) when MERGE / unblocking
- Notion run-log + BOARD heartbeat + Slack outbox
- Tiny ops notes in Notion (not product source)

## Parent worker must NOT do (inline)

- Edit application / product source for the Task
- “Quick fix” product bugs without a subagent
- Write product tests/UI/API implementations itself
- Skip subagents because the change “looks small”

If something is product work, **spawn a subagent**.

## Subagent mandate (HEAVY)

When mode is HEAVY:

1. Claim lease
2. For each work slice (usually one Notion Task / parallel track item):
   - Spawn a Cursor **Task** subagent with a complete brief
   - Prefer `subagent_type` suited to the job (`generalPurpose`, `explore`, `computerUse` for UI evidence, etc.)
   - Prefer model from config `worker.subagentModel` (default suggestion: `cursor-grok-4.5-high-fast` or the team’s locked overnight model)
3. Wait for handoff; verify PR/evidence
4. If more slices remain and lease allows, spawn the next (or parallel disjoint slices)
5. Parent writes run-log citing **every** subagent + PR

Empty HEAVY without at least one subagent spawn is a contract violation — note as failure in run-log.

## Brief template (give every subagent)

```text
You are a never-sleep WORKER SUBAGENT for [REPO].
Parent role=worker. Do the implementation; parent handles Notion/Slack orchestration.

## Goal
<Notion Task title + URL>

## Constraints
- Follow repo AGENTS.md product locks
- Load never-sleep default companion skills when coding/deploying
- Use Supabase MCP / Vercel MCP when those surfaces apply
- Branch/LEASE: <branch> (do not steal other leases)
- STEER / Decision links: <urls>
- Acceptance: <bullets>

## Deliver
- Commits + PR (or update existing PR)
- Evidence paths / deploy URL if relevant
- Short handoff: what changed, what’s left, blockers
```

## Parallel subagents

When BOARD `parallelTracks` lists **disjoint** `codeAreas`, the parent may spawn multiple Task subagents in parallel — still one LEASE story per area (or one lease covering a single exclusive slice). Do not parallelize overlapping paths.

## LIGHT / MERGE

| Mode | Subagents |
|---|---|
| LIGHT | Optional: one small subagent for non-colliding ops/docs if needed; otherwise parent does Notion/Slack/`gh` merge only |
| MERGE | Parent may merge via `gh`; if merge needs code conflict resolution → **subagent**, not parent |

## Run-log requirements

```markdown
## Subagents
- <id or label> · model · goal · PR/handoff · status
- …

## Parent actions
- lease / merge / Notion / Slack only (list)
```

If zero subagents on a HEAVY wake that claimed to implement: mark wake non-compliant.

## Config

```json
{
  "worker": {
    "requireSubagentsForDirectWork": true,
    "subagentModel": "cursor-grok-4.5-high-fast",
    "allowParentProductEdits": false
  }
}
```

`allowParentProductEdits` must stay **false** in v0.
