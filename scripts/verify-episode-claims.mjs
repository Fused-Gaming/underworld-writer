#!/usr/bin/env node
/**
 * Index a project's case files into VerificationRAG and verify a given
 * episode's key claims against them, writing a verification report.
 *
 * Usage:
 *   node scripts/verify-episode-claims.mjs \
 *     --project projects/insight-corruption \
 *     --episode-config output/insight-corruption/season-1/episode-1/EPISODE_CONFIG.json \
 *     --out output/insight-corruption/season-1/episode-1/verification-report.json
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VerificationRAG } from '../dist/rag/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    args[argv[i].replace(/^--/, '')] = argv[i + 1];
  }
  return args;
}

function findCaseFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findCaseFiles(full));
    } else if (entry.endsWith('-case.json') || entry.endsWith('-fraud.json') || entry.endsWith('-corruption.json')) {
      results.push(full);
    }
  }
  return results;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectDir = args.project ?? 'projects/insight-corruption';
  const episodeConfigPath = args['episode-config'];
  const outPath = args.out;

  if (!episodeConfigPath || !outPath) {
    console.error('Usage: --project <dir> --episode-config <file> --out <file>');
    process.exit(1);
  }

  const rag = new VerificationRAG();
  const charactersDir = join(projectDir, 'characters');
  const caseFilePaths = findCaseFiles(charactersDir);

  const caseIdByFileName = new Map();
  for (const path of caseFilePaths) {
    const caseFile = JSON.parse(readFileSync(path, 'utf-8'));
    rag.indexCaseFile(caseFile, path);
    caseIdByFileName.set(path.split('/').pop(), caseFile.caseId ?? path);
  }
  console.log(`Indexed ${caseFilePaths.length} case files (${rag.corpusSize()} evidence chunks).`);

  const episodeConfig = JSON.parse(readFileSync(episodeConfigPath, 'utf-8'));
  const claims = episodeConfig.keyPoints ?? [];
  const caseReferenceFileName = episodeConfig.caseReference?.split('/').pop();
  const caseId = caseReferenceFileName ? caseIdByFileName.get(caseReferenceFileName) : undefined;

  const results = claims.map((claim) => rag.verifyClaim({ claim, caseId }));

  const report = {
    episodeNumber: episodeConfig.episodeNumber,
    title: episodeConfig.title,
    generatedAt: new Date().toISOString(),
    corpusSize: rag.corpusSize(),
    claims: results,
  };

  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`Verification report written to ${outPath}`);
  console.log(
    `Verdicts: ${results.map((r) => r.verdict).join(', ')}`
  );
}

main();
