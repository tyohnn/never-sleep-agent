# Oh My Docs gate (soft-require)

never-sleep-agent does **not** replace Oh My Docs. It only gates on whether the project already adopted it.

## Detection

At wake start, check for:

```text
.omd/project.json
```

(or the project’s documented OMD root if they customize it)

## If present → docs-first

Before HEAVY product/code changes:

1. Read relevant handbook / ops docs via the project’s OMD workflow
2. Prefer updating docs/decisions when locks change
3. Cite doc paths or Notion `decision` pages in the run-log
4. Do not invent product rules that contradict handbook + `AGENTS.md`

Exact OMD CLI/commands are owned by the Oh My Docs install in that repo. Follow project AGENTS if it spells the gate steps.

## If absent → Notion-only

Continue the wake with Notion Tasks / Documents / BOARD only.

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
