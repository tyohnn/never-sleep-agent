# Default companion skills

At adopt (and on fresh overnight environments), install the baseline skill pack so workers do not reinvent React/Next/Vercel/Supabase patterns.

## Install

```bash
bash templates/default-skills.sh
# or
node scripts/adopt.mjs --install-skills
```

## Pack (deduped)

| Skill | Source |
|---|---|
| `vercel-react-best-practices` | vercel-labs/agent-skills |
| `vercel-composition-patterns` | vercel-labs/agent-skills |
| `vercel-react-native-skills` | vercel-labs/agent-skills |
| `deploy-to-vercel` | vercel-labs/agent-skills |
| `agent-browser` | vercel-labs/agent-browser |
| `vercel-react-view-transitions` | vercel-labs/agent-skills |
| `web-design-guidelines` | vercel-labs/agent-skills |
| `vercel-cli-with-tokens` | vercel-labs/agent-skills |
| `turborepo` | vercel/turborepo |
| `ai-sdk` | vercel/ai |
| `vercel-cli` | vercel/vercel |
| `next-cache-components-optimizer` | vercel/next.js |
| `shadcn` | shadcn/ui |
| `next-best-practices` | vercel-labs/openreview |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill |
| `supabase` | supabase/agent-skills |
| `supabase-postgres-best-practices` | supabase/agent-skills |

## When agents must load them

| Work | Prefer skills |
|---|---|
| React / Next UI | `vercel-react-best-practices`, `vercel-composition-patterns`, `next-best-practices`, `web-design-guidelines`, `ui-ux-pro-max`, `shadcn` |
| View transitions | `vercel-react-view-transitions` |
| RN | `vercel-react-native-skills` |
| Monorepo / turbo | `turborepo` |
| AI SDK routes | `ai-sdk` |
| Deploy / preview | `deploy-to-vercel`, `vercel-cli`, `vercel-cli-with-tokens` + **Vercel MCP** |
| Browser evidence | `agent-browser` |
| Cache components | `next-cache-components-optimizer` |
| Supabase / Postgres | `supabase`, `supabase-postgres-best-practices` + **Supabase MCP** |

Product-domain skills (e.g. Parametric Asset) stay in the target repo — this pack is the **platform default**, not a product lock.

## Auditor check

Auditor wakes should verify the pack is present (or note missing skills + file an ops Task). Missing pack is not a reason to skip product work if the environment cannot install mid-wake — record the gap and continue.
