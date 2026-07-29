# Cursor Automations — never-sleep-agent

Create **four** Cursor Automations on the target repo. Same skill, different prompts + crons.

| Automation name (suggested) | Prompt file | Role |
|---|---|---|
| `never-sleep · worker` | [`automation-worker.md`](automation-worker.md) | implement under LEASE |
| `never-sleep · director` | [`automation-director.md`](automation-director.md) | priorities, parallel tracks, decisions |
| `never-sleep · researcher` | [`automation-researcher.md`](automation-researcher.md) | web / X / YouTube → Notion |
| `never-sleep · auditor` | [`automation-auditor.md`](automation-auditor.md) | workflow + Notion schema gaps |

Shared contracts: `references/roles.md`, helmsman STEER, Notion hub, Slack standing thread.

### Suggested crons (spawn only)

| Role | Example |
|---|---|
| worker | `*/15` |
| director | `*/30` or `0 * * * *` |
| researcher | `0 */2 * * *` |
| auditor | `30 */3 * * *` |

Stagger so director often lands before a worker burst. Exact timing is team preference.

Each prompt file is paste-ready — fill `[REPO]` and Notion/Slack IDs once, or point all four at the same `never-sleep.config.json`.
