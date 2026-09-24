#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const requested = args.find((arg) => !arg.startsWith('--'));

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const writeJson = (p, value) => fs.writeFileSync(path.join(root, p), `${JSON.stringify(value, null, 2)}\n`);
const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const pkg = readJson('package.json');
const target = requested ?? pkg.version;
if (!semver.test(target)) {
  console.error(`Invalid semantic version: ${target}`);
  process.exit(1);
}

const files = {
  package: readJson('package.json'),
  plugin: readJson('plugin.json'),
  version: readJson('VERSION.json'),
  lock: readJson('package-lock.json'),
  claudePlugin: readJson('.claude-plugin/plugin.json'),
  marketplace: readJson('.claude-plugin/marketplace.json')
};
const marketplaceEntry = files.marketplace.plugins?.find((p) => p.name === files.claudePlugin.name);
const indexPath = path.join(root, 'src', 'index.ts');
let indexSource = fs.readFileSync(indexPath, 'utf8');
const skillVersionMatch = /const skill = \{[\s\S]*?version:\s*'([^']+)'/.exec(indexSource);
const skillVersion = skillVersionMatch?.[1];

const errors = [];
const warnings = [];
const requireMatch = (label, actual) => {
  if (actual !== target) errors.push(`${label}: ${actual ?? '(missing)'} != ${target}`);
};
const warnMatch = (label, actual) => {
  if (actual !== target) warnings.push(`${label}: ${actual ?? '(missing)'} != ${target}`);
};

requireMatch('package.json', files.package.version);
requireMatch('plugin.json', files.plugin.version);
requireMatch('VERSION.json', files.version.version);
requireMatch('src/index.ts skill.version', skillVersion);
requireMatch('.claude-plugin/plugin.json', files.claudePlugin.version);
requireMatch('.claude-plugin/marketplace.json plugins[].version', marketplaceEntry?.version);
warnMatch('package-lock.json', files.lock.version);
warnMatch('package-lock.json packages[""]', files.lock.packages?.['']?.version);

if (checkOnly) {
  if (warnings.length) {
    console.warn('Lockfile metadata should be normalized before publishing:');
    warnings.forEach((item) => console.warn(`  - ${item}`));
    console.warn(`  Run: npm run version:sync -- ${target}`);
  }
  if (errors.length) {
    console.error('Release version synchronization failed:');
    errors.forEach((item) => console.error(`  - ${item}`));
    process.exit(1);
  }
  console.log(`Publish version synchronization passed: ${target}`);
  process.exit(0);
}

files.package.version = target;
files.plugin.version = target;
files.version.version = target;
files.version.majorVersion = Number(target.split('.')[0]);
files.version.minorVersion = Number(target.split('.')[1]);
files.version.patchVersion = Number(target.split('.')[2].split('-')[0]);
files.lock.version = target;
files.lock.packages ??= {};
files.lock.packages[''] ??= {};
files.lock.packages[''].version = target;
files.claudePlugin.version = target;
if (marketplaceEntry) marketplaceEntry.version = target;

if (!skillVersionMatch) {
  console.error('Could not locate src/index.ts skill.version');
  process.exit(1);
}
indexSource = indexSource.replace(
  /(const skill = \{[\s\S]*?version:\s*)'[^']+'/, 
  `$1'${target}'`
);

writeJson('package.json', files.package);
writeJson('plugin.json', files.plugin);
writeJson('VERSION.json', files.version);
writeJson('package-lock.json', files.lock);
writeJson('.claude-plugin/plugin.json', files.claudePlugin);
writeJson('.claude-plugin/marketplace.json', files.marketplace);
fs.writeFileSync(indexPath, indexSource);

console.log(`Synchronized package, plugin, release ledger, exported skill, lockfile, and Claude plugin/marketplace metadata to ${target}.`);
console.log('Review VERSION.json and CHANGELOG.md before publishing.');
