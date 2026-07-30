# Local handbook content removed

Handbook bodies live in Supabase SSOT (`handbookId: never-sleep-agent`).

```bash
# pull → .supabase-content/docs (gitignored)
pnpm --filter docs pull:supabase

# build / dev with Connect env set (auto-pulls)
pnpm --filter docs build
OMD_CONTENT_DIR=.supabase-content/docs pnpm --filter docs dev
```
