# Required MCPs (hard)

never-sleep agents **must** use these Cursor MCP servers for their domains. Do not bypass with ad-hoc REST/scripts when the MCP is available and authenticated.

| MCP | Required for | Typical operations |
|---|---|---|
| **Notion** | all roles, every wake | STEER, Tasks, BOARD, LEASE, run-log, Decisions, Research, Audit |
| **Slack** | all roles, every wake | owner inbox absorb, outbox report, acks |
| **Supabase** | data / Auth / Edge / SQL work | schema, migrations advisors, SQL, logs, project URL/keys — plus `supabase` skills |
| **Vercel** | deploy / project / env / domain work | project status, deployments, env — plus `deploy-to-vercel` / `vercel-cli` skills |

## Hard rules

1. **Discover then call** — use the environment’s MCP tool descriptors (`GetMcpTools` / equivalent) before invoking.
2. **Auth gaps are blockers, not silent skips** — if a required MCP is `needsAuth` / error:
   - record in run-log + Slack
   - auditor / worker files a P0/P1 ops Task
   - do not invent “success” for that surface
3. **Notion + Slack are always in the critical path** — even LIGHT/DIRECT/RESEARCH/AUDIT wakes. No “Notion later.”
4. **Supabase MCP** — use whenever the wake touches DB, RLS, Auth, Edge Functions, or Postgres performance. Prefer MCP + Supabase skills over raw guessing.
5. **Vercel MCP** — use whenever the wake deploys, inspects previews, or changes project/env. Prefer MCP + Vercel skills over undocumented CLI flags alone.
6. **Evidence** — run-logs should cite MCP-backed actions (page URLs, deploy URLs, advisory summaries), not only local file edits.

## Role expectations

| Role | Notion | Slack | Supabase | Vercel |
|---|---|---|---|---|
| worker | always | always | when product data/deploy path needs it | when shipping / preview evidence |
| director | always (wide read/write board) | always | read project health if board depends on it | read deploy/blockers if relevant |
| researcher | always (write Research) | always | optional | optional |
| auditor | always (schema + hygiene) | always | verify MCP auth + advisors when project uses Supabase | verify MCP auth + project linkage |

## Fallback (degraded mode)

If MCP is down mid-wake:

1. Finish what you can locally / via `gh`
2. Exit packet still required
3. Mode note: `DEGRADED · missing=<notion|slack|supabase|vercel>`
4. Do not mark STEER/Tasks “synced” if Notion writes failed

## Adopt checklist

- [ ] Notion MCP authenticated in Cursor
- [ ] Slack MCP authenticated (or documented bot path that the Automation can call)
- [ ] Supabase MCP authenticated for the overnight project(s)
- [ ] Vercel MCP authenticated for the overnight project(s)
- [ ] `never-sleep.config.json` points at Notion parents + Slack owner IDs
- [ ] Default skills installed (`templates/default-skills.sh`)
