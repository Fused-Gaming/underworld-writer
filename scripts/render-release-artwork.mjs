#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const checkOnly = argv.includes('--check');
const versionArg = argv.find((arg) => arg.startsWith('--version='));

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = versionArg ? versionArg.slice('--version='.length) : packageJson.version;

const changelogPath = path.join(root, 'CHANGELOG.md');
const templatePath = path.join(root, 'underworld-writer-release-og-1200x630-preview.svg');
const outputPath = path.join(root, 'release-artifacts', 'underworld-writer-release-og-1200x630.svg');

const changelog = fs.readFileSync(changelogPath, 'utf8');
const template = fs.readFileSync(templatePath, 'utf8');

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function extractReleaseSection(markdown, targetVersion) {
  const escaped = targetVersion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^## \\[${escaped}\\](?:[^\\n]*)\\n([\\s\\S]*?)(?=^## \\[|\\Z)`, 'm'));
  if (!match) throw new Error(`CHANGELOG.md does not contain ## [${targetVersion}]`);
  return match[1];
}

function sectionBody(release, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = release.match(new RegExp(`^### ${escaped}\\s*\\n([\\s\\S]*?)(?=^### |\\Z)`, 'm'));
  return match ? match[1] : '';
}

function parseArtworkItems(release) {
  const explicit = sectionBody(release, 'Release Artwork')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => {
      const match = line.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      return match ? { title: match[1].trim(), description: match[2].trim() } : null;
    })
    .filter(Boolean);

  if (explicit.length >= 1) return explicit.slice(0, 6);

  return ['Added', 'Changed', 'Fixed']
    .flatMap((heading) => sectionBody(release, heading)
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).replace(/`/g, '')))
    .slice(0, 6)
    .map((description, index) => ({ title: `CHANGE ${index + 1}`, description }));
}

function wrap(text, max = 28, maxLines = 2) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = next;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);
  if (words.join(' ').length > lines.join(' ').length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:!?]?$/, '')}…`;
  }
  return lines.slice(0, maxLines);
}

function normalized(item) {
  return `${item.title.trim().toUpperCase()}|${item.description.trim()}`;
}

const baselineVersion = '2.2.1';
const baselineCards = [
  { title: 'SEGMENT-FIRST', description: 'Podcast & article pipelines' },
  { title: 'VOICE READY', description: 'Scripts, timing & production docs' },
  { title: 'ROCK-HARDENED', description: 'Validated releases & changelog art' },
  { title: 'OPEN SOURCE', description: 'Build. Audit. Improve. Together.' },
  { title: 'REAL IMPACT', description: 'Fiction, true-crime, and investigative stories.' },
  { title: 'BUILT FOR MORE', description: 'Episodes. Series. A more transparent tomorrow.' },
];

const release = extractReleaseSection(changelog, version);
const items = parseArtworkItems(release);
if (!items.length) throw new Error(`No release artwork items could be derived for ${version}`);

const defaults = baselineCards;
const cards = Array.from({ length: 6 }, (_, i) => items[i] ?? defaults[i]);

// The approved v2.2.1 ArtPatch SVG is the visual source of truth. If the
// changelog still describes that exact release, copy it byte-for-byte.
const isApprovedBaseline = version === baselineVersion
  && cards.every((item, index) => normalized(item) === normalized(baselineCards[index]));

let rendered = template;

if (!isApprovedBaseline) {
  const xs = [59, 245, 432, 619, 813, 1001];
  const cardText = (item, x) => {
    const desc = wrap(item.description, 27, 2);
    return `
    <g data-release-art-card="true">
      <rect x="${x - 7}" y="447" width="166" height="80" rx="5" fill="#070B14" fill-opacity="0.985"/>
      <text x="${x}" y="466" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" fill="#FFFFFF">${escapeXml(item.title.toUpperCase())}</text>
      ${desc.map((line, idx) => `<text x="${x}" y="${489 + idx * 18}" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#D4D6DE">${escapeXml(line)}</text>`).join('\n      ')}
    </g>`;
  };

  const dynamicLayer = `
    <!-- BEGIN UNDERWORLD WRITER CHANGELOG-DERIVED LAYER -->
    <g id="underworld-release-dynamic" pointer-events="none">
      <rect x="52" y="281" width="156" height="43" rx="8" fill="#0A0710" fill-opacity="0.985"/>
      <text x="69" y="312" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" fill="#F02BB5">v${escapeXml(version)}</text>
      ${cards.map((item, index) => cardText(item, xs[index])).join('\n      ')}
      <rect x="923" y="565" width="226" height="32" rx="16" fill="#05050A" fill-opacity="0.92" stroke="#FF2ABF" stroke-opacity="0.35"/>
      <circle cx="941" cy="581" r="4" fill="#FF2ABF"/>
      <text x="955" y="586" font-family="Menlo, Consolas, monospace" font-size="11" letter-spacing="1.2" fill="#D7D9E0">CHANGELOG / v${escapeXml(version)}</text>
    </g>
    <!-- END UNDERWORLD WRITER CHANGELOG-DERIVED LAYER -->`;

  rendered = template
    .replace(/\n\s*<!-- BEGIN UNDERWORLD WRITER CHANGELOG-DERIVED LAYER -->[\s\S]*?<!-- END UNDERWORLD WRITER CHANGELOG-DERIVED LAYER -->/m, '')
    .replace(/CHANGELOG \/ v[0-9A-Za-z.+-]+/g, `CHANGELOG / v${version}`);

  const closing = rendered.lastIndexOf('</g>');
  if (closing === -1) throw new Error('Template is missing the expected outer </g>');
  rendered = `${rendered.slice(0, closing)}${dynamicLayer}\n  ${rendered.slice(closing)}`;
}

if (checkOnly) {
  if (!fs.existsSync(outputPath)) throw new Error(`Missing generated artwork: ${outputPath}`);
  const existing = fs.readFileSync(outputPath, 'utf8');
  if (existing !== rendered) throw new Error('Release artwork is stale. Run: npm run release:art');
  console.log(`Release artwork is current for v${version}: ${path.relative(root, outputPath)}`);
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, rendered);
  console.log(`Rendered v${version} release artwork from CHANGELOG.md → ${path.relative(root, outputPath)}`);
}
