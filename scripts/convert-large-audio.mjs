#!/usr/bin/env node
/**
 * Find generated episode WAV files over a size threshold, convert each to
 * MP3 with ffmpeg, and remove the source WAV so only the compressed file
 * is committed. Per AGENTS.md / modal/CHATTERBOX_INTEGRATION_PLAN.md
 * Section 13, WAV masters are a CPU-mastering intermediate, not the
 * distributable episode artifact — MP3 is what gets committed.
 *
 * Usage:
 *   node scripts/convert-large-audio.mjs [--root output] [--max-mb 100] [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const root = arg('--root', 'output');
const maxMb = Number(arg('--max-mb', '100'));
const dryRun = args.includes('--dry-run');
const maxBytes = maxMb * 1024 * 1024;

function findWavFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findWavFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.wav')) {
      results.push(full);
    }
  }
  return results;
}

function hasFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const wavFiles = findWavFiles(root);
const oversized = wavFiles.filter((file) => fs.statSync(file).size > maxBytes);

if (wavFiles.length === 0) {
  console.log(`No .wav files found under ${root}/.`);
  process.exit(0);
}

console.log(`Found ${wavFiles.length} .wav file(s) under ${root}/; ${oversized.length} exceed ${maxMb}MB.`);

if (oversized.length === 0) {
  process.exit(0);
}

if (!hasFfmpeg()) {
  console.error('ffmpeg is required to convert oversized .wav files to .mp3 but was not found on PATH.');
  process.exit(1);
}

for (const wavPath of oversized) {
  const sizeMb = (fs.statSync(wavPath).size / (1024 * 1024)).toFixed(1);
  const mp3Path = wavPath.replace(/\.wav$/i, '.mp3');
  console.log(`${wavPath} (${sizeMb}MB) -> ${mp3Path}`);
  if (dryRun) continue;

  execFileSync('ffmpeg', [
    '-y',
    '-i', wavPath,
    '-codec:a', 'libmp3lame',
    '-qscale:a', '2',
    mp3Path,
  ], { stdio: 'inherit' });

  fs.rmSync(wavPath);
  console.log(`  converted and removed source WAV: ${wavPath}`);
}
