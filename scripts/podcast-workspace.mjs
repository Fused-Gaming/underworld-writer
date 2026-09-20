#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'output', 'SERIES_REGISTRY.json');
const schemaVersion = '1.0';
const packageVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const generator = { name: '@h4shed/skill-underworld-writer', version: packageVersion };
const args = process.argv.slice(2);

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};
const touch = (file, content = '') => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, content);
};
const assertSlug = (slug) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '')) {
    fail(`Invalid series slug: ${slug ?? '(missing)'}`);
  }
};
const registry = () => {
  if (!fs.existsSync(registryPath)) fail('Missing output/SERIES_REGISTRY.json');
  return readJson(registryPath);
};
const findSeries = (slug) => {
  const data = registry();
  const series = data.series.find((item) => item.slug === slug);
  if (!series) fail(`Unknown series '${slug}'. Create it first with podcast:new-series.`);
  return { data, series };
};

function preflight() {
  const data = registry();
  console.log(`UNDERWORLD WRITER ${packageVersion} WORKSPACE CONTRACT`);
  console.log('Source material: projects/<series-slug>/');
  console.log('Generated output: output/<series-slug>/');
  console.log('Examples only: output/examples/');
  console.log('');
  console.log('Registered series:');
  for (const item of data.series) {
    console.log(`  - ${item.slug} (${item.status}) seasons: ${(item.seasons ?? []).join(', ') || 'none'}`);
  }
  console.log('');
  console.log('Scaffold with podcast:new-series, podcast:new-season, podcast:new-episode.');
  console.log('Validate with npm run validate:workspace before completion.');
}

function createSeries(slug, title = slug) {
  assertSlug(slug);
  const data = registry();
  if (data.series.some((item) => item.slug === slug)) fail(`Series '${slug}' already exists.`);

  const sourceRoot = path.join(root, 'projects', slug);
  const outputRoot = path.join(root, 'output', slug);
  fs.mkdirSync(sourceRoot, { recursive: true });
  fs.mkdirSync(outputRoot, { recursive: true });

  touch(path.join(sourceRoot, 'README.md'), `# ${title} Source Workspace\n\nResearch, evidence, case files, and editorial source material belong here.\n`);
  touch(path.join(outputRoot, 'README.md'), `# ${title}\n\nCanonical generated podcast output for \`${slug}\`.\n`);
  for (const dir of ['assets', 'audio', 'publishing', 'voice']) {
    touch(path.join(outputRoot, 'production', dir, '.gitkeep'));
  }

  writeJson(path.join(outputRoot, 'SERIES_CONFIG.json'), {
    schemaVersion,
    generator,
    seriesName: title,
    seriesSlug: slug,
    seasons: [],
    status: 'planned'
  });

  data.series.push({
    slug,
    title,
    sourceRoot: `projects/${slug}`,
    outputRoot: `output/${slug}`,
    status: 'planned',
    seasons: []
  });
  writeJson(registryPath, data);
  console.log(`Created series '${slug}'.`);
}

function createSeason(slug, rawSeason) {
  assertSlug(slug);
  const seasonNumber = Number(rawSeason);
  if (!Number.isInteger(seasonNumber) || seasonNumber < 1) fail('Season number must be a positive integer.');
  const { data, series } = findSeries(slug);
  if (series.seasons.includes(seasonNumber)) fail(`Season ${seasonNumber} already exists for ${slug}.`);

  const seasonRoot = path.join(root, series.outputRoot, `season-${seasonNumber}`);
  writeJson(path.join(seasonRoot, 'SEASON_CONFIG.json'), {
    schemaVersion,
    seriesSlug: slug,
    seasonNumber,
    status: 'planned',
    episodes: []
  });

  series.seasons.push(seasonNumber);
  series.seasons.sort((a, b) => a - b);
  writeJson(registryPath, data);

  const seriesConfigPath = path.join(root, series.outputRoot, 'SERIES_CONFIG.json');
  const seriesConfig = readJson(seriesConfigPath);
  seriesConfig.schemaVersion ??= schemaVersion;
  seriesConfig.generator = generator;
  seriesConfig.seasons = [...series.seasons];
  writeJson(seriesConfigPath, seriesConfig);
  console.log(`Created ${slug} season ${seasonNumber}.`);
}

function createEpisode(slug, rawSeason, rawEpisode) {
  assertSlug(slug);
  const seasonNumber = Number(rawSeason);
  const episodeNumber = Number(rawEpisode);
  if (!Number.isInteger(seasonNumber) || seasonNumber < 1) fail('Season number must be a positive integer.');
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1) fail('Episode number must be a positive integer.');

  const { series } = findSeries(slug);
  if (!series.seasons.includes(seasonNumber)) fail(`Season ${seasonNumber} is not registered for ${slug}.`);
  const seasonRoot = path.join(root, series.outputRoot, `season-${seasonNumber}`);
  const seasonConfigPath = path.join(seasonRoot, 'SEASON_CONFIG.json');
  if (!fs.existsSync(seasonConfigPath)) fail(`Missing ${path.relative(root, seasonConfigPath)}`);
  const seasonConfig = readJson(seasonConfigPath);
  if (seasonConfig.episodes.includes(episodeNumber)) fail(`Episode ${episodeNumber} already exists.`);

  const episodeRoot = path.join(seasonRoot, `episode-${episodeNumber}`);
  writeJson(path.join(episodeRoot, 'EPISODE_CONFIG.json'), {
    schemaVersion,
    generator,
    seriesSlug: slug,
    seasonNumber,
    episodeNumber,
    title: `Episode ${episodeNumber}`,
    status: 'planned'
  });
  touch(path.join(episodeRoot, 'README.md'), `# Episode ${episodeNumber}\n\nStatus: planned\n`);
  for (const dir of ['planning', 'scripts', 'producer-briefs', 'published-assets', 'verification', 'provenance']) {
    touch(path.join(episodeRoot, dir, '.gitkeep'));
  }

  seasonConfig.episodes.push(episodeNumber);
  seasonConfig.episodes.sort((a, b) => a - b);
  writeJson(seasonConfigPath, seasonConfig);
  console.log(`Created ${slug} S${seasonNumber}E${episodeNumber}.`);
}

const [first, second, third, fourth] = args;
if (first === 'preflight') preflight();
else if (first === 'series' && second === 'create') createSeries(third, args.slice(3).join(' ') || third);
else if (first === 'season' && second === 'create') createSeason(third, fourth);
else if (first === 'episode' && second === 'create') createEpisode(third, fourth, args[4]);
else {
  console.log(`Usage:\n  node scripts/podcast-workspace.mjs preflight\n  node scripts/podcast-workspace.mjs series create <slug> [title]\n  node scripts/podcast-workspace.mjs season create <slug> <season>\n  node scripts/podcast-workspace.mjs episode create <slug> <season> <episode>`);
  process.exit(first ? 1 : 0);
}
