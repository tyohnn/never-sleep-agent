# Oh My Docs gate (soft-require)

never-sleep-agent does **not** replace Oh My Docs. It only gates on whether the project already adopted it.

## Detection

At wake start, check for:

```text
.omd/project.json
```

(or the project’s documented OMD root if they customize it)

Read `contentSource.ssot` (`local` | `notion` | `supabase`). Missing `contentSource` means `local`.

This skill repo itself uses **Supabase SSOT**:

| Field | Value |
|---|---|
| `projectRef` | `vtuprmfqbwhryjoznjxg` (shared BYO `oh-my-docs`) |
| `handbookId` | `never-sleep-agent` |
| `schemaVersion` | `1.1` |
| Public site | not this repo’s Vercel project — wire hosting separately |

## If present → docs-first

Before HEAVY product/code changes:

1. Read relevant handbook / ops docs via the project’s OMD workflow
2. Prefer updating docs/decisions when locks change
3. Cite doc paths or Notion `decision` pages in the run-log
4. Do not invent product rules that contradict handbook + `AGENTS.md`

Treat that SSOT as the handbook content home for product doctrine. Ops data (STEER, Tasks, LEASE) stays in Notion.

Exact OMD CLI/commands are owned by the Oh My Docs skill (`oh-my-doc`). Prefer:

```bash
npx skills add tyohnn/oh-my-docs --skill oh-my-doc -y
node .agents/skills/oh-my-doc/scripts/omd.mjs inspect --json
node .agents/skills/oh-my-doc/scripts/omd.mjs adopt --ssot supabase --project-ref <ref> --yes --json
```

## If absent → Notion-only

Continue the wake with Notion Tasks / Documents / BOARD only. Do **not** hard-fail.

In the run-log and Slack outbox, **recommend adopt**:

```text
OMD: not detected (.omd/project.json missing) — operating Notion-only.
Recommend: adopt Oh My Docs so overnight locks have a handbook home.
```

Do not block LIGHT/MERGE or critical HEAVY on missing OMD in v0.

## Relationship to Notion

| Concern | Home |
|---|---|
| Wake continuity, leases, run-logs | Notion |
| Stable handbook / product doctrine | Oh My Docs (when present) |
| Human helmsman for tonight | Slack owner replies → Notion `STEER · *` (+ Tasks) |

When both exist, decisions that should outlive a night belong in OMD (or a Notion `decision` that points at OMD). Ephemeral wake state stays in Notion.
