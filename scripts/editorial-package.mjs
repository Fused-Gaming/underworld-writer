#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const args = process.argv.slice(2);
const command = args[0] ?? 'generate';
const arg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const series = arg('--series');
const season = Number(arg('--season', '1'));
const episode = Number(arg('--episode', '1'));
const checkOnly = args.includes('--check');
const lintFlag = args.includes('--lint');
const strictLint = args.includes('--strict');

if (!series || !Number.isInteger(season) || !Number.isInteger(episode)) {
  console.error('Usage: node scripts/editorial-package.mjs generate --series <slug> --season <n> --episode <n> [--check]');
  process.exit(1);
}

const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const ensure = (p) => fs.mkdirSync(path.join(root, p), { recursive: true });
const write = (p, body) => {
  if (checkOnly) return;
  ensure(path.dirname(p));
  fs.writeFileSync(path.join(root, p), body.endsWith('\n') ? body : `${body}\n`);
};
const writeJson = (p, value) => write(p, `${JSON.stringify(value, null, 2)}\n`);
const words = (text) => (text.match(/\b[\w’'-]+\b/g) ?? []).length;
const hash = (text) => crypto.createHash('sha256').update(text).digest('hex');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const packagePath = `projects/${series}/episode-packages/season-${season}/episode-${episode}.json`;
const templatesPath = 'templates/editorial/shared-segments.json';
if (!fs.existsSync(path.join(root, packagePath))) throw new Error(`Missing package spec: ${packagePath}`);

const spec = readJson(packagePath);
const templates = readJson(templatesPath);

function interpolate(text, values) {
  return text.replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`);
}

function resolveShared(kind, item) {
  const values = {
    seriesTitle: spec.seriesTitle,
    episodeNumber: String(spec.episodeNumber),
    ...spec.variables,
    ...item.variables,
  };
  const candidates = templates[kind]?.[item.template];
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error(`Unknown ${kind} template: ${item.template}`);
  }
  const index = item.variant ?? 0;
  return interpolate(candidates[index % candidates.length], values);
}

function renderPodcastSegment(segment, index) {
  const body = segment.shared ? resolveShared('podcast', segment) : segment.body;
  if (!body?.trim()) throw new Error(`Podcast segment ${segment.id} has no body`);
  const count = words(body);
  const fixed = segment.fixedDurationSeconds ?? null;
  const seconds = fixed ?? Math.round((count / spec.podcast.wordsPerMinute) * 60);
  const header = [
    `# ${String(index + 1).padStart(2, '0')} — ${segment.title}`,
    '',
    `**Segment ID:** ${segment.id}`,
    `**Type:** ${segment.type}`,
    `**Words:** ${count}`,
    `**Estimated runtime:** ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
    segment.claimIds?.length ? `**Claim IDs:** ${segment.claimIds.join(', ')}` : null,
    '',
    body.trim(),
    '',
  ].filter((line) => line !== null).join('\n');
  return { ...segment, body, wordCount: count, estimatedSeconds: seconds, markdown: header };
}

const podcastSegments = spec.podcast.segments.map(renderPodcastSegment);
const podcastById = new Map(podcastSegments.map((segment) => [segment.id, segment]));

function renderArticleSection(section, index) {
  let body;
  let claimIds = section.claimIds ?? [];
  if (section.shared) {
    body = resolveShared('article', section);
  } else if (section.fromPodcast) {
    const source = podcastById.get(section.fromPodcast);
    if (!source) throw new Error(`Article section ${section.id} references unknown podcast segment ${section.fromPodcast}`);
    body = source.body;
    if (!claimIds.length) claimIds = source.claimIds ?? [];
  } else {
    body = section.body;
  }
  if (!body?.trim()) throw new Error(`Article section ${section.id} has no body`);
  const count = words(body);
  const heading = section.headingLevel === 1 ? '# ' : '## ';
  const markdown = `${heading}${section.title}\n\n${body.trim()}\n`;
  return { ...section, body, claimIds, wordCount: count, markdown, index };
}

const spokenSeconds = podcastSegments.reduce((sum, s) => sum + s.estimatedSeconds, 0);
const spokenWords = podcastSegments.reduce((sum, s) => sum + s.wordCount, 0);
const targetSeconds = spec.podcast.targetRuntimeMinutes * 60;
const toleranceSeconds = (spec.podcast.runtimeToleranceMinutes ?? 1) * 60;
const runtimePass = Math.abs(spokenSeconds - targetSeconds) <= toleranceSeconds;

const outputRoot = `output/${series}/season-${season}/episode-${episode}`;
const segmentRoot = `${outputRoot}/scripts/segments`;
const generatedAt = new Date().toISOString();

// Clear stale segment files before writing the current set: if segment
// count/order/ids change between runs (a resequence, a renamed segment),
// old files at colliding numeric prefixes otherwise linger indefinitely
// and silently shadow/duplicate the current ones for anything that globs
// this directory (e.g. scripts/build-script-output.mjs).
if (!checkOnly) fs.rmSync(path.join(root, segmentRoot), { recursive: true, force: true });
for (const [i, segment] of podcastSegments.entries()) {
  const filename = `${String(i + 1).padStart(2, '0')}-${slugify(segment.id)}.md`;
  write(`${segmentRoot}/${filename}`, segment.markdown);
}

const assembledScript = [
  `# ${spec.seriesTitle} — Episode ${spec.episodeNumber}: ${spec.title}`,
  '',
  `**Generated from:** \`${packagePath}\``,
  `**Words:** ${spokenWords}`,
  `**Estimated runtime:** ${(spokenSeconds / 60).toFixed(2)} minutes at ${spec.podcast.wordsPerMinute} WPM / fixed segment durations`,
  `**Runtime validation:** ${runtimePass ? 'PASS' : 'FAIL'}`,
  '',
  '> The segmented files under `scripts/segments/` are authoritative. This assembled file is generated for producer read-through only.',
  '',
  ...podcastSegments.map((s) => `## ${s.title}\n\n${s.body.trim()}\n`),
].join('\n');
write(`${outputRoot}/scripts/assembled-script.md`, assembledScript);

writeJson(`${outputRoot}/scripts/manifest.json`, {
  schemaVersion: '1.0',
  generatedAt,
  sourcePackage: packagePath,
  seriesSlug: series,
  seasonNumber: season,
  episodeNumber: episode,
  wordsPerMinute: spec.podcast.wordsPerMinute,
  targetRuntimeMinutes: spec.podcast.targetRuntimeMinutes,
  estimatedRuntimeMinutes: Number((spokenSeconds / 60).toFixed(2)),
  totalWords: spokenWords,
  runtimePass,
  segments: podcastSegments.map((s, i) => ({
    order: i + 1,
    id: s.id,
    type: s.type,
    title: s.title,
    wordCount: s.wordCount,
    estimatedSeconds: s.estimatedSeconds,
    claimIds: s.claimIds ?? [],
    sha256: hash(s.body),
  })),
});

const articleSections = spec.article.sections.map(renderArticleSection);
const articleWords = articleSections.reduce((sum, s) => sum + s.wordCount, 0);
const articleMin = spec.article.targetWords?.minimum ?? 1000;
const articleMax = spec.article.targetWords?.maximum ?? 2500;
const articlePass = articleWords >= articleMin && articleWords <= articleMax;
const articleRoot = `${outputRoot}/published-assets/articles/${spec.article.channel}`;

// Same staleness issue as the podcast segments above.
if (!checkOnly) fs.rmSync(path.join(root, articleRoot, "segments"), { recursive: true, force: true });
for (const [i, section] of articleSections.entries()) {
  const filename = `${String(i + 1).padStart(2, '0')}-${slugify(section.id)}.md`;
  write(`${articleRoot}/segments/${filename}`, section.markdown);
}

const assembledArticle = [
  `# ${spec.article.headline}`,
  '',
  ...articleSections.map((s) => `${s.headingLevel === 1 ? '' : `## ${s.title}\n\n`}${s.body.trim()}\n`),
].join('\n');
write(`${articleRoot}/article.md`, assembledArticle);
writeJson(`${articleRoot}/manifest.json`, {
  schemaVersion: '1.0',
  generatedAt,
  sourcePackage: packagePath,
  channel: spec.article.channel,
  targetWords: spec.article.targetWords,
  totalWords: articleWords,
  lengthPass: articlePass,
  sections: articleSections.map((s, i) => ({
    order: i + 1,
    id: s.id,
    title: s.title,
    wordCount: s.wordCount,
    claimIds: s.claimIds ?? [],
    sha256: hash(s.body),
  })),
});

console.log(`Podcast: ${spokenWords} words, ${(spokenSeconds / 60).toFixed(2)} min — ${runtimePass ? 'PASS' : 'FAIL'}`);
console.log(`Article: ${articleWords} words — ${articlePass ? 'PASS' : 'FAIL'} (${articleMin}-${articleMax})`);

if (!runtimePass || !articlePass) process.exitCode = 1;
if (command === 'check' && !checkOnly) console.warn('Use --check to validate without writing files.');

// Editorial style/cliché/repetition linting — runs standalone with --lint,
// or automatically as part of --check. Never blocks `generate` unless
// severity is 'error' and --strict is also passed.
if (lintFlag || checkOnly) {
  await runEditorialLint();
}

async function runEditorialLint() {
  let lintModule;
  try {
    lintModule = await import('../dist/editorial-lint.js');
  } catch {
    console.warn('Editorial lint skipped: run `npm run build` first (dist/editorial-lint.js not found).');
    return;
  }
  const { lintSegments } = lintModule;

  const segments = [
    ...podcastSegments.map((s) => ({ id: `podcast:${s.id}`, text: s.body })),
    ...articleSections.map((s) => ({ id: `article:${s.id}`, text: s.body })),
  ];

  const result = lintSegments(segments);
  if (result.violations.length === 0) {
    console.log('Editorial lint: no violations found.');
    return;
  }

  console.log(`Editorial lint: ${result.violations.length} violation(s) — ${result.errorCount} error, ${result.warnCount} warn, ${result.reviewCount} review`);
  for (const v of result.violations) {
    const loc = v.location.segmentId ? `${v.location.segmentId}:${v.location.line}:${v.location.offset}` : `${v.location.line}:${v.location.offset}`;
    const suggestion = v.suggestion ? ` (suggest: ${v.suggestion})` : '';
    console.log(`  [${v.severity.toUpperCase()}] ${loc} — ${v.message}${suggestion}`);
  }

  if (result.errorCount > 0 && strictLint) {
    console.error('Editorial lint: failing due to error-severity violations under --strict.');
    process.exitCode = 1;
  }
}
