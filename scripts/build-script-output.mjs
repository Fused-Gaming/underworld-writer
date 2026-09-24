#!/usr/bin/env node
/**
 * Converts an episode package (projects/<show>/episode-packages/season-<n>/
 * episode-<n>.json, the segment-first editorial source of truth) into the
 * ScriptOutput shape modal/app.py's generate_episode_audio actually consumes
 * (src/podcast-types.ts's ScriptOutput), writing it to
 * output/<show>/season-<n>/episode-<n>/script-output.json.
 *
 * This converter did not previously exist. modal/app.py has always read
 * script-output.json, but nothing produced that file from the newer
 * segment-first episode-package/editorial-package.mjs system — only the
 * older, disconnected src/podcast-script-generator.ts (character-driven,
 * single/two-part) CLI ever wrote it. Episode 1's audio was generated from
 * a stale copy of that older output, which predated later editorial
 * revisions to the episode package and does not reflect them.
 *
 * Segment IDs are preserved verbatim from the episode package so that
 * modal/config/production_profiles' cue markers (e.g.
 * "series-intro:end", "shipment-network:start") in
 * episode-XX.production.json continue to resolve correctly once
 * production audio is wired in.
 *
 * Usage:
 *   node scripts/build-script-output.mjs --series insight-corruption --season 1 --episode 1
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  return idx === -1 ? fallback : args[idx + 1];
};

const series = getArg('series');
const season = Number(getArg('season'));
const episode = Number(getArg('episode'));
if (!series || !season || !episode) {
  console.error('Usage: node scripts/build-script-output.mjs --series <slug> --season <n> --episode <n>');
  process.exit(1);
}

const root = process.cwd();
const packagePath = path.join(
  root, 'projects', series, 'episode-packages', `season-${season}`, `episode-${episode}.json`
);
const outDir = path.join(root, 'output', series, `season-${season}`, `episode-${episode}`);
const outPath = path.join(outDir, 'script-output.json');
const segmentsDir = path.join(outDir, 'scripts', 'segments');
const manifestPath = path.join(outDir, 'scripts', 'manifest.json');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const podcastSegments = pkg.podcast?.segments;
if (!Array.isArray(podcastSegments) || podcastSegments.length === 0) {
  console.error(`No podcast.segments array found in ${packagePath}`);
  process.exit(1);
}

// Some segments (type "reusable"/"sponsor") reference a shared template +
// variant (templates/editorial/shared-segments.json) instead of embedding
// body text inline in the episode package. Re-implementing that template
// resolution here would risk drifting from editorial-package.mjs's own
// logic; instead, read the already-assembled per-segment .md files it
// wrote to output/<show>/.../scripts/segments/ (run `npm run
// editorial:generate` first if these are missing or stale).
if (!fs.existsSync(manifestPath)) {
  console.error(
    `${manifestPath} not found. Run: npm run editorial:generate -- --series ${series} --season ${season} --episode ${episode}`
  );
  process.exit(1);
}
const scriptManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const orderById = new Map(scriptManifest.segments.map((s) => [s.id, s.order]));

const readAssembledBody = (segId) => {
  const order = orderById.get(segId);
  if (order === undefined) {
    throw new Error(`Segment "${segId}" from the episode package is missing from ${manifestPath}. Regenerate with npm run editorial:generate.`);
  }
  const files = fs.readdirSync(segmentsDir).filter((f) => f.startsWith(`${String(order).padStart(2, '0')}-`));
  if (files.length !== 1) {
    throw new Error(`Expected exactly one segment file for order ${order} (${segId}) in ${segmentsDir}, found ${files.length}`);
  }
  const raw = fs.readFileSync(path.join(segmentsDir, files[0]), 'utf8');
  // Header block (# title, **Field:** value lines) is separated from the
  // body by the first blank line.
  const blankLineIndex = raw.indexOf('\n\n');
  if (blankLineIndex === -1) throw new Error(`Could not find header/body split in ${files[0]}`);
  return raw.slice(blankLineIndex + 2).trim();
};

const WORDS_PER_MINUTE = 145; // matches templates/editorial's assembly convention
const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const estimatedSeconds = (text) => Math.round((wordCount(text) / WORDS_PER_MINUTE) * 60);

const segments = podcastSegments.map((seg) => {
  const body = readAssembledBody(seg.id);
  return {
    id: seg.id,
    title: seg.title,
    duration: estimatedSeconds(body),
    text: body,
    speaker: 'narrator',
  };
});

const totalWords = segments.reduce((sum, seg) => sum + wordCount(seg.text), 0);
const totalMinutes = Math.round((totalWords / WORDS_PER_MINUTE) * 100) / 100;

const scriptOutput = {
  format: 'single',
  title: pkg.title || `${series} S${season}E${episode}`,
  episodes: [
    {
      partNumber: 1,
      duration: totalMinutes,
      segments,
      openingHook: segments[0]?.text ?? '',
      closingStatement: segments[segments.length - 1]?.text ?? '',
    },
  ],
  attributions: [],
  qaWindows: [],
  missingFacts: [],
  metadata: {
    generatedDate: new Date().toISOString(),
    characterName: series,
    sourcePackage: path.relative(root, packagePath),
    generator: 'scripts/build-script-output.mjs',
  },
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(scriptOutput, null, 2)}\n`);

console.log(`Wrote ${segments.length} segments (${totalWords} words, ~${totalMinutes} min) to ${path.relative(root, outPath)}`);
