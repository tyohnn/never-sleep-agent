#!/usr/bin/env bash
# never-sleep-agent — install default companion skills into the Cursor environment.
# Run once per machine / overnight environment (or via: node scripts/adopt.mjs --install-skills).
set -euo pipefail

npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -y
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns -y
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-native-skills -y
npx skills add https://github.com/vercel-labs/agent-skills --skill deploy-to-vercel -y
npx skills add https://github.com/vercel-labs/agent-browser --skill agent-browser -y
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-view-transitions -y
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines -y
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-cli-with-tokens -y
npx skills add https://github.com/vercel/turborepo --skill turborepo -y
npx skills add https://github.com/vercel/ai --skill ai-sdk -y
npx skills add https://github.com/vercel/vercel --skill vercel-cli -y
npx skills add https://github.com/vercel/next.js --skill next-cache-components-optimizer -y
npx skills add https://github.com/shadcn/ui --skill shadcn -y
npx skills add https://github.com/vercel-labs/openreview --skill next-best-practices -y
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max -y
npx skills add https://github.com/supabase/agent-skills --skill supabase -y
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices -y

echo "never-sleep-agent: default companion skills installed."
