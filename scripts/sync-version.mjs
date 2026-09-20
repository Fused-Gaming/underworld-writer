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
  lock: readJson('package-lock.json')
};

const mismatches = [];
const check = (label, actual) => {
  if (actual !== target) mismatches.push(`${label}: ${actual ?? '(missing)'} != ${target}`);
};

check('package.json', files.package.version);
check('plugin.json', files.plugin.version);
check('VERSION.json', files.version.version);
check('package-lock.json', files.lock.version);
check('package-lock.json packages[""]', files.lock.packages?.['']?.version);

if (checkOnly) {
  if (mismatches.length) {
    console.error('Version synchronization failed:');
    mismatches.forEach((item) => console.error(`  - ${item}`));
    process.exit(1);
  }
  console.log(`Version synchronization passed: ${target}`);
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

writeJson('package.json', files.package);
writeJson('plugin.json', files.plugin);
writeJson('VERSION.json', files.version);
writeJson('package-lock.json', files.lock);

console.log(`Synchronized release metadata to ${target}.`);
console.log('Review VERSION.json changelog/release notes before publishing.');
