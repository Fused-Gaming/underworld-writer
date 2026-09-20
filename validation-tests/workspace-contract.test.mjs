import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceCli = path.join(repoRoot, 'scripts', 'podcast-workspace.mjs');
const validator = path.join(repoRoot, 'scripts', 'validate-output-structure.mjs');

const writeJson = (root, relative, value) => {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
};

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'underworld-workspace-'));
  writeJson(root, 'package.json', { name: '@h4shed/skill-underworld-writer', version: '2.2.0' });
  writeJson(root, 'plugin.json', { name: 'underworld-writer', version: '2.2.0' });
  writeJson(root, 'VERSION.json', { version: '2.2.0' });
  writeJson(root, 'package-lock.json', { version: '2.2.0', packages: { '': { version: '2.2.0' } } });
  writeJson(root, 'output/SERIES_REGISTRY.json', { schemaVersion: '1.0', series: [] });
  return root;
}

const run = (root, script, args = []) => spawnSync(process.execPath, [script, ...args], {
  cwd: root,
  encoding: 'utf8'
});

test('scaffolds a registered series, season, and episode in the canonical tree', () => {
  const root = fixture();
  try {
    assert.equal(run(root, workspaceCli, ['series', 'create', 'test-show', 'Test Show']).status, 0);
    assert.equal(run(root, workspaceCli, ['season', 'create', 'test-show', '1']).status, 0);
    assert.equal(run(root, workspaceCli, ['episode', 'create', 'test-show', '1', '1']).status, 0);

    const episode = JSON.parse(fs.readFileSync(path.join(root, 'output/test-show/season-1/episode-1/EPISODE_CONFIG.json'), 'utf8'));
    assert.equal(episode.seriesSlug, 'test-show');
    assert.equal(episode.seasonNumber, 1);
    assert.equal(episode.episodeNumber, 1);
    assert.equal(episode.generator.version, '2.2.0');

    const result = run(root, validator);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('validator rejects rogue generated output roots', () => {
  const root = fixture();
  try {
    fs.mkdirSync(path.join(root, 'generated-output'), { recursive: true });
    const result = run(root, validator);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Forbidden generated-output location/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('validator rejects unregistered real series output', () => {
  const root = fixture();
  try {
    fs.mkdirSync(path.join(root, 'output/rogue-series'), { recursive: true });
    const result = run(root, validator);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unregistered output series directory/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
