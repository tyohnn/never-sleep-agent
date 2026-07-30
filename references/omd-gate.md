# Oh My Docs gate (soft-require)

never-sleep-agent does **not** replace Oh My Docs. It only gates on whether the project already adopted it.

## Detect

```text
.omd/project.json
```

Read `contentSource.ssot` (`local` | `notion` | `supabase`). Missing `contentSource` means `local`.

This skill repo itself uses **Supabase SSOT**:

| Field | Value |
|---|---|
| `projectRef` | `vtuprmfqbwhryjoznjxg` (shared BYO `oh-my-docs`) |
| `handbookId` | `never-sleep-agent` |
| `schemaVersion` | `1.1` |
| Public site | not this repo’s Vercel project — wire hosting separately |

## Soft-require behavior

If `.omd/project.json` is missing on a **product** target repo:

1. Do **not** hard-fail the wake.
2. Continue Notion-only ops.
3. Slack/run-log note:

```text
OMD: not detected (.omd/project.json missing) — operating Notion-only.
Recommend: adopt Oh My Docs so overnight locks have a handbook home.
```

When present, treat that SSOT as the handbook content home for product doctrine. Ops data (STEER, Tasks, LEASE) stays in Notion.

| Concern | Home |
|---|---|
| Wake ops / STEER / Tasks | Notion |
| Stable handbook / product doctrine | Oh My Docs (when present) |

Exact OMD CLI/commands are owned by the Oh My Docs skill (`oh-my-doc`). Prefer:

```bash
npx skills add tyohnn/oh-my-docs --skill oh-my-doc -y
node .agents/skills/oh-my-doc/scripts/omd.mjs inspect --json
node .agents/skills/oh-my-doc/scripts/omd.mjs adopt --ssot supabase --project-ref <ref> --yes --json
```
