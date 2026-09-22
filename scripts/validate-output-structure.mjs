#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];
const exists = (p) => fs.existsSync(path.join(root, p));
const readJson = (p) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  } catch (error) {
    errors.push(`${p}: invalid or unreadable JSON (${error.message})`);
    return null;
  }
};

const packageJson = readJson('package.json');
const releaseVersion = packageJson?.version;
if (!releaseVersion) errors.push('package.json: version is required');

const pluginJson = readJson('plugin.json');
if (pluginJson && releaseVersion && pluginJson.version !== releaseVersion) {
  errors.push(`plugin.json: version ${pluginJson.version} must match package.json ${releaseVersion}`);
}

const versionJson = readJson('VERSION.json');
if (versionJson && releaseVersion && versionJson.version !== releaseVersion) {
  errors.push(`VERSION.json: version ${versionJson.version} must match package.json ${releaseVersion}`);
}

const lockJson = readJson('package-lock.json');
if (lockJson && releaseVersion) {
  if (lockJson.version !== releaseVersion || lockJson.packages?.['']?.version !== releaseVersion) {
    warnings.push(`package-lock.json metadata is legacy (${lockJson.version}); normalize with npm run version:sync -- ${releaseVersion} before publishing`);
  }
}

const forbiddenRootPaths = [
  'podcast-output',
  'generated-output',
  'producer-ready',
  'guest-handoff',
  'generated-script.md'
];
for (const p of forbiddenRootPaths) {
  if (exists(p)) errors.push(`Forbidden generated-output location: ${p}`);
}

const registryPath = 'output/SERIES_REGISTRY.json';
if (!exists(registryPath)) {
  errors.push(`Missing ${registryPath}`);
} else {
  const registry = readJson(registryPath);
  if (registry) {
    if (!registry.schemaVersion) errors.push(`${registryPath}: schemaVersion is required`);
    if (!Array.isArray(registry.series)) errors.push(`${registryPath}: series must be an array`);

    const registered = new Set((registry.series ?? []).map((s) => s.slug));
    const outputEntries = fs.readdirSync(path.join(root, 'output'), { withFileTypes: true });
    for (const entry of outputEntries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === 'examples') continue;
      if (!registered.has(entry.name)) errors.push(`Unregistered output series directory: output/${entry.name}`);
    }

    for (const series of registry.series ?? []) {
      const expectedSource = `projects/${series.slug}`;
      const expectedOutput = `output/${series.slug}`;
      if (series.sourceRoot !== expectedSource) errors.push(`${series.slug}: sourceRoot must be ${expectedSource}`);
      if (series.outputRoot !== expectedOutput) errors.push(`${series.slug}: outputRoot must be ${expectedOutput}`);
      if (!exists(series.sourceRoot)) errors.push(`${series.slug}: missing sourceRoot ${series.sourceRoot}`);
      if (!exists(series.outputRoot)) errors.push(`${series.slug}: missing outputRoot ${series.outputRoot}`);

      const seriesConfigPath = `${series.outputRoot}/SERIES_CONFIG.json`;
      if (!exists(seriesConfigPath)) {
        errors.push(`${series.slug}: missing SERIES_CONFIG.json`);
        continue;
      }
      const seriesConfig = readJson(seriesConfigPath);
      if (!seriesConfig) continue;
      if (seriesConfig.seriesSlug !== series.slug) errors.push(`${seriesConfigPath}: seriesSlug must be ${series.slug}`);
      if (!seriesConfig.schemaVersion) errors.push(`${seriesConfigPath}: schemaVersion is required`);
      if (seriesConfig.generator?.version && releaseVersion && seriesConfig.generator.version !== releaseVersion) {
        errors.push(`${seriesConfigPath}: generator.version ${seriesConfig.generator.version} must match release ${releaseVersion}`);
      }

      for (const seasonNumber of series.seasons ?? []) {
        const seasonRoot = `${series.outputRoot}/season-${seasonNumber}`;
        const seasonConfigPath = `${seasonRoot}/SEASON_CONFIG.json`;
        if (!exists(seasonConfigPath)) {
          errors.push(`${series.slug}: missing ${seasonConfigPath}`);
          continue;
        }
        const seasonConfig = readJson(seasonConfigPath);
        if (!seasonConfig) continue;
        if (seasonConfig.seriesSlug !== series.slug) errors.push(`${seasonConfigPath}: seriesSlug mismatch`);
        if (seasonConfig.seasonNumber !== seasonNumber) errors.push(`${seasonConfigPath}: seasonNumber mismatch`);
        if (!seasonConfig.schemaVersion) errors.push(`${seasonConfigPath}: schemaVersion is required`);

        for (const episodeNumber of seasonConfig.episodes ?? []) {
          const episodeRoot = `${seasonRoot}/episode-${episodeNumber}`;
          const episodeConfigPath = `${episodeRoot}/EPISODE_CONFIG.json`;
          if (!exists(episodeConfigPath)) {
            errors.push(`${series.slug} S${seasonNumber}E${episodeNumber}: missing EPISODE_CONFIG.json`);
            continue;
          }
          const episodeConfig = readJson(episodeConfigPath);
          if (!episodeConfig) continue;
          if (episodeConfig.episodeNumber !== episodeNumber) errors.push(`${episodeConfigPath}: episodeNumber mismatch`);
          if (episodeConfig.seasonNumber !== seasonNumber) errors.push(`${episodeConfigPath}: seasonNumber mismatch`);
          if (episodeConfig.seriesSlug && episodeConfig.seriesSlug !== series.slug) errors.push(`${episodeConfigPath}: seriesSlug mismatch`);
          if (!episodeConfig.schemaVersion) warnings.push(`${episodeConfigPath}: legacy config has no schemaVersion; new scaffolds must include one`);
          if (episodeConfig.generator?.version && releaseVersion && episodeConfig.generator.version !== releaseVersion) {
            warnings.push(`${episodeConfigPath}: legacy generator.version ${episodeConfig.generator.version}; new scaffolds use ${releaseVersion}`);
          }
        }
      }
    }
  }
}

const projectsRoot = path.join(root, 'projects');
if (fs.existsSync(projectsRoot)) {
  for (const entry of fs.readdirSync(projectsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '_template') continue; // Skip template directory
    const legacyEpisodes = path.join(projectsRoot, entry.name, 'episodes');
    if (fs.existsSync(legacyEpisodes)) errors.push(`Generated episode tree is forbidden under projects/: projects/${entry.name}/episodes`);
  }
}

if (warnings.length) {
  console.warn('Workspace warnings:');
  warnings.forEach((warning) => console.warn(`  - ${warning}`));
}

if (errors.length) {
  console.error('Workspace validation failed:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`Workspace validation passed for release ${releaseVersion}.`);
