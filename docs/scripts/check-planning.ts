import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { validatePlanning } from './planning-validation.ts';

const docsRoot = resolve(import.meta.dirname, '..');
const candidates = [
  process.env.OMD_CONTENT_DIR,
  '.supabase-content/docs',
  'content/docs',
]
  .filter((value): value is string => Boolean(value))
  .map((value) => resolve(docsRoot, value));

const contentDirectory = candidates.find((path) => existsSync(path));
if (!contentDirectory) {
  console.error(
    'No handbook content directory found. Pull Supabase SSOT first:\n' +
      '  pnpm --filter docs pull:supabase\n' +
      'or set OMD_CONTENT_DIR / Connect env and run prepare:content.',
  );
  process.exit(1);
}

const problems = validatePlanning(contentDirectory);

if (problems.length > 0) {
  console.error(`Planning validation found ${problems.length} problem(s):\n`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(
  `Planning IDs, references, lifecycle states, and navigation are valid (${contentDirectory}).`,
);
