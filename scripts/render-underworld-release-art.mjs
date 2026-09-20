#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const valueFor = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = valueFor("--version") || pkg.version;
const changelogPath = valueFor("--changelog") || path.join(root, "CHANGELOG.md");
const templatePngPath = valueFor("--template") || path.join(root, "assets/branding/underworld-writer-release-changelog-template.png");
const outPath = valueFor("--out") || path.join(root, "release-artifacts/underworld-writer-release-og-1200x630.svg");

const changelog = fs.readFileSync(changelogPath, "utf8");
const templatePng = fs.readFileSync(templatePngPath).toString("base64");

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sectionForRelease(markdown, releaseVersion) {
  const lines = markdown.split(/\r?\n/);
  const target = `## [${releaseVersion}]`;
  let start = lines.findIndex((line) => line.startsWith(target));
  if (start < 0) start = lines.findIndex((line) => line.startsWith("## [Unreleased]"));
  if (start < 0) throw new Error(`No changelog section found for ${releaseVersion} or Unreleased`);

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## [")) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

function parseArtworkItems(section) {
  const lines = section.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === "### Release Artwork");

  if (headingIndex >= 0) {
    const items = [];
    for (let i = headingIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("### ")) break;
      const match = line.match(/^- \*\*(.+?)\*\*\s*[—-]\s*(.+)$/);
      if (match) items.push({ title: match[1].trim(), body: match[2].trim() });
      if (items.length === 6) break;
    }
    if (items.length) return items;
  }

  const fallback = [];
  for (const category of ["Added", "Changed", "Fixed"]) {
    const start = lines.findIndex((line) => line.trim() === `### ${category}`);
    if (start < 0) continue;
    for (let i = start + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("### ")) break;
      const match = line.match(/^- (.+)$/);
      if (!match) continue;
      const cleaned = match[1].replace(/`/g, "").trim();
      const words = cleaned.split(/\s+/);
      fallback.push({
        title: words.slice(0, 3).join(" ").replace(/[.:;,]+$/g, "").toUpperCase(),
        body: words.slice(3).join(" ") || category
      });
      if (fallback.length === 6) return fallback;
    }
  }
  return fallback;
}

function wrap(text, maxChars, maxLines = 2) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (words.join(" ").length > lines.join(" ").length) {
    const i = lines.length - 1;
    lines[i] = lines[i].replace(/[.,;:!?-]*$/g, "");
    while (lines[i].length > maxChars - 1) lines[i] = lines[i].slice(0, -1);
    lines[i] += "…";
  }
  return lines;
}

const section = sectionForRelease(changelog, version);
const items = parseArtworkItems(section);
while (items.length < 6) items.push({ title: "RELEASE NOTE", body: "See CHANGELOG.md for details." });

const xPositions = [39, 229, 419, 609, 799, 989];
const cards = items.map((item, index) => {
  const x = xPositions[index];
  const title = wrap(item.title.toUpperCase(), 18, 1)[0];
  const bodyLines = wrap(item.body, 24, 2);
  return `
    <g data-release-card="${index + 1}">
      <rect x="${x + 2}" y="452" width="168" height="92" fill="#070A12"/>
      <text x="${x + 18}" y="477" font-family="Arial, Helvetica, sans-serif" font-size="13.5" font-weight="800" fill="#F7F7FA">${xml(title)}</text>
      ${bodyLines.map((line, li) => `<text x="${x + 18}" y="${503 + li * 18}" font-family="Arial, Helvetica, sans-serif" font-size="12.5" fill="#D5D7DF">${xml(line)}</text>`).join("\n      ")}
    </g>`;
}).join("\n");

const output = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Underworld Writer v${xml(version)} release changelog">
  <image href="data:image/png;base64,${templatePng}" x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>
  <g id="underworld-writer-release-data">
    <rect x="60" y="295" width="132" height="34" rx="4" fill="#080910"/>
    <text x="67" y="323" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#FF31C4">v${xml(version)}</text>
${cards}
    <g transform="translate(924 566)">
      <rect width="224" height="30" rx="15" fill="#05050a" fill-opacity="0.78" stroke="#ff2abf" stroke-opacity="0.42"/>
      <circle cx="17" cy="15" r="4" fill="#ff2abf"/>
      <text x="31" y="20" font-family="Menlo, Consolas, monospace" font-size="11" letter-spacing="1.2" fill="#d7d9e0">CHANGELOG / v${xml(version)}</text>
    </g>
  </g>
</svg>\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);
console.log(`Rendered ${path.relative(root, outPath)} from CHANGELOG.md release ${version}`);
