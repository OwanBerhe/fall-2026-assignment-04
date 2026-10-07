import { spawnSync } from 'node:child_process';

const input = process.argv[2] || 'docs/architecture/schema.mmd';
const output = 'docs/architecture/erd.svg';

const args = ['mmdc', '-i', input, '-o', output];

const result = spawnSync('npx', args, { encoding: 'utf8' });

if (result.status !== 0) {
  console.error(`SYNTAX_ERROR: ${result.stderr || result.error?.message}`);
  process.exit(1);
}

console.log('SUCCESS');
process.exit(0);