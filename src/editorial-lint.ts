/**
 * Editorial Lint
 *
 * Style/cliché/repetition linting for generated podcast and article text —
 * "anti-cheap-model" guardrails per issue #146. This module never rewrites
 * text; it only reports violations with severity, a suggested replacement
 * (where applicable), and a location so a human or downstream tooling can
 * act on them.
 *
 * The default dictionary lives in `templates/editorial/style-dictionary.json`
 * and can be overridden or extended per-brand or per-project by loading a
 * separate JSON file in the same shape and merging it with
 * `mergeStyleDictionaries` before calling `lintText` / `lintSegments`.
 */

import fs from 'node:fs';
import path from 'node:path';

export type Severity = 'error' | 'warn' | 'review';

export interface PhraseRule {
  phrase: string;
  severity: Severity;
  suggestion?: string;
}

export interface PreferredTermRule {
  avoid: string;
  preferred: string;
  severity: Severity;
}

export interface StyleDictionary {
  bannedPhrases: PhraseRule[];
  discouragedPhrases: PhraseRule[];
  preferredTerms: PreferredTermRule[];
  transitionWords: string[];
}

export interface TextSegment {
  id: string;
  text: string;
}

export interface LintLocation {
  segmentId?: string;
  line: number;
  offset: number;
}

export interface LintViolation {
  rule:
    | 'banned-phrase'
    | 'discouraged-phrase'
    | 'preferred-term'
    | 'repeated-sentence-opening'
    | 'repeated-transition-word'
    | 'excessive-rhetorical-questions'
    | 'frequent-ngram';
  severity: Severity;
  message: string;
  match: string;
  suggestion?: string;
  location: LintLocation;
}

export interface LintOptions {
  /** Style dictionary to lint against. Defaults to the built-in default. */
  dictionary?: StyleDictionary;
  /** Minimum times an n-gram (3-4 words) must repeat to be flagged. Default 3. */
  ngramRepeatThreshold?: number;
  /** Minimum times a transition word must appear to be flagged. Default 2. */
  transitionWordThreshold?: number;
  /** Minimum consecutive/nearby paragraphs sharing an opening word/phrase to flag. Default 3. */
  repeatedOpeningThreshold?: number;
  /** Fraction of sentences that are rhetorical questions above which to flag (0-1). Default 0.15. */
  rhetoricalQuestionRatio?: number;
}

export interface LintResult {
  violations: LintViolation[];
  errorCount: number;
  warnCount: number;
  reviewCount: number;
}

const DEFAULT_DICTIONARY: StyleDictionary = {
  bannedPhrases: [],
  discouragedPhrases: [],
  preferredTerms: [],
  transitionWords: [],
};

/**
 * Load a style dictionary from a JSON file on disk (e.g.
 * `templates/editorial/style-dictionary.json`, or a project/brand-level
 * override in the same shape).
 */
export function loadStyleDictionary(filePath: string): StyleDictionary {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    bannedPhrases: raw.bannedPhrases ?? [],
    discouragedPhrases: raw.discouragedPhrases ?? [],
    preferredTerms: raw.preferredTerms ?? [],
    transitionWords: raw.transitionWords ?? [],
  };
}

/**
 * Merge a base dictionary with one or more overrides. Overrides are
 * concatenated (not deduped) onto the base, so a project/brand override
 * file can add or re-flag phrases without having to repeat the whole
 * default list. Later dictionaries win on exact `phrase`/`avoid` collisions
 * (last-write wins on severity/suggestion for that entry).
 */
export function mergeStyleDictionaries(
  base: StyleDictionary,
  ...overrides: StyleDictionary[]
): StyleDictionary {
  const result: StyleDictionary = {
    bannedPhrases: [...base.bannedPhrases],
    discouragedPhrases: [...base.discouragedPhrases],
    preferredTerms: [...base.preferredTerms],
    transitionWords: [...base.transitionWords],
  };

  for (const override of overrides) {
    for (const rule of override.bannedPhrases ?? []) {
      const i = result.bannedPhrases.findIndex((r) => r.phrase === rule.phrase);
      if (i >= 0) result.bannedPhrases[i] = rule;
      else result.bannedPhrases.push(rule);
    }
    for (const rule of override.discouragedPhrases ?? []) {
      const i = result.discouragedPhrases.findIndex((r) => r.phrase === rule.phrase);
      if (i >= 0) result.discouragedPhrases[i] = rule;
      else result.discouragedPhrases.push(rule);
    }
    for (const rule of override.preferredTerms ?? []) {
      const i = result.preferredTerms.findIndex((r) => r.avoid === rule.avoid);
      if (i >= 0) result.preferredTerms[i] = rule;
      else result.preferredTerms.push(rule);
    }
    for (const word of override.transitionWords ?? []) {
      if (!result.transitionWords.includes(word)) result.transitionWords.push(word);
    }
  }

  return result;
}

let cachedDefaultDictionary: StyleDictionary | null = null;

/**
 * The built-in default dictionary, loaded from
 * `templates/editorial/style-dictionary.json` relative to the repo root.
 * Falls back to an empty dictionary if the file can't be found (e.g. when
 * this module is used outside the repo), so callers can still supply their
 * own dictionary via `LintOptions.dictionary`.
 */
export function getDefaultStyleDictionary(): StyleDictionary {
  if (cachedDefaultDictionary) return cachedDefaultDictionary;
  // Resolved relative to the current working directory rather than
  // import.meta.url, so this works identically whether the module is
  // compiled to ESM (tsc build) or CommonJS (ts-jest under Jest).
  const candidates = [
    path.join(process.cwd(), 'templates/editorial/style-dictionary.json'),
  ];
  for (const resolved of candidates) {
    try {
      cachedDefaultDictionary = loadStyleDictionary(resolved);
      return cachedDefaultDictionary;
    } catch {
      // try next candidate
    }
  }
  cachedDefaultDictionary = DEFAULT_DICTIONARY;
  return cachedDefaultDictionary;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function lineAndOffsetAt(text: string, index: number): { line: number; offset: number } {
  const upToIndex = text.slice(0, index);
  const lines = upToIndex.split('\n');
  const line = lines.length;
  const offset = lines[lines.length - 1].length;
  return { line, offset };
}

function findPhraseOccurrences(
  text: string,
  segmentId: string | undefined,
  rule: PhraseRule,
  ruleName: LintViolation['rule']
): LintViolation[] {
  const violations: LintViolation[] = [];
  const pattern = new RegExp(`\\b${escapeRegExp(rule.phrase)}\\b`, 'gi');
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const { line, offset } = lineAndOffsetAt(text, match.index);
    violations.push({
      rule: ruleName,
      severity: rule.severity,
      message: `"${match[0]}" is a flagged phrase.`,
      match: match[0],
      suggestion: rule.suggestion,
      location: { segmentId, line, offset },
    });
  }
  return violations;
}

function findPreferredTermOccurrences(
  text: string,
  segmentId: string | undefined,
  rule: PreferredTermRule
): LintViolation[] {
  const violations: LintViolation[] = [];
  const pattern = new RegExp(`\\b${escapeRegExp(rule.avoid)}\\b`, 'gi');
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const { line, offset } = lineAndOffsetAt(text, match.index);
    violations.push({
      rule: 'preferred-term',
      severity: rule.severity,
      message: `"${match[0]}" — prefer "${rule.preferred}".`,
      match: match[0],
      suggestion: rule.preferred,
      location: { segmentId, line, offset },
    });
  }
  return violations;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function splitSentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstWords(sentenceOrParagraph: string, count: number): string {
  const words = sentenceOrParagraph
    .replace(/^[#>*\-\s]+/, '')
    .split(/\s+/)
    .slice(0, count)
    .join(' ')
    .toLowerCase()
    .replace(/[.,!?;:]+$/, '');
  return words;
}

function detectRepeatedOpenings(
  text: string,
  segmentId: string | undefined,
  threshold: number
): LintViolation[] {
  const violations: LintViolation[] = [];
  const paragraphs = splitParagraphs(text);
  const openings = paragraphs.map((p) => firstWords(p, 2));

  let runStart = 0;
  for (let i = 1; i <= openings.length; i += 1) {
    const sameAsPrev = i < openings.length && openings[i] === openings[runStart] && openings[runStart].length > 0;
    if (!sameAsPrev) {
      const runLength = i - runStart;
      if (runLength >= threshold && openings[runStart].length > 0) {
        const { line, offset } = lineAndOffsetAt(text, text.indexOf(paragraphs[runStart]));
        violations.push({
          rule: 'repeated-sentence-opening',
          severity: 'warn',
          message: `${runLength} nearby paragraphs open with "${openings[runStart]}".`,
          match: openings[runStart],
          location: { segmentId, line, offset },
        });
      }
      runStart = i;
    }
  }
  return violations;
}

function detectRepeatedTransitionWords(
  text: string,
  segmentId: string | undefined,
  transitionWords: string[],
  threshold: number
): LintViolation[] {
  if (transitionWords.length === 0) return [];
  const violations: LintViolation[] = [];
  const counts = new Map<string, number>();
  const firstIndex = new Map<string, number>();

  for (const word of transitionWords) {
    const pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
    let match: RegExpExecArray | null;
    let count = 0;
    let first = -1;
    while ((match = pattern.exec(text)) !== null) {
      count += 1;
      if (first === -1) first = match.index;
    }
    if (count > 0) {
      counts.set(word.toLowerCase(), count);
      firstIndex.set(word.toLowerCase(), first);
    }
  }

  for (const [word, count] of counts.entries()) {
    if (count >= threshold) {
      const idx = firstIndex.get(word)!;
      const { line, offset } = lineAndOffsetAt(text, idx);
      violations.push({
        rule: 'repeated-transition-word',
        severity: 'warn',
        message: `Transition word "${word}" used ${count} times.`,
        match: word,
        location: { segmentId, line, offset },
      });
    }
  }
  return violations;
}

function detectExcessiveRhetoricalQuestions(
  text: string,
  segmentId: string | undefined,
  ratio: number
): LintViolation[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];
  const questions = sentences.filter((s) => s.trim().endsWith('?'));
  const actualRatio = questions.length / sentences.length;
  if (questions.length >= 2 && actualRatio >= ratio) {
    const idx = text.indexOf(questions[0]);
    const { line, offset } = idx >= 0 ? lineAndOffsetAt(text, idx) : { line: 1, offset: 0 };
    return [
      {
        rule: 'excessive-rhetorical-questions',
        severity: 'review',
        message: `${questions.length}/${sentences.length} sentences are questions (${Math.round(actualRatio * 100)}%).`,
        match: questions[0],
        location: { segmentId, line, offset },
      },
    ];
  }
  return [];
}

function tokenizeWords(text: string): string[] {
  return (text.toLowerCase().match(/\b[a-z0-9’'-]+\b/g) ?? []);
}

function detectFrequentNgrams(
  text: string,
  segmentId: string | undefined,
  threshold: number
): LintViolation[] {
  const violations: LintViolation[] = [];
  const words = tokenizeWords(text);
  for (const n of [3, 4]) {
    const counts = new Map<string, number>();
    for (let i = 0; i + n <= words.length; i += 1) {
      const gram = words.slice(i, i + n).join(' ');
      counts.set(gram, (counts.get(gram) ?? 0) + 1);
    }
    for (const [gram, count] of counts.entries()) {
      if (count >= threshold) {
        const idx = text.toLowerCase().indexOf(gram);
        const { line, offset } = idx >= 0 ? lineAndOffsetAt(text, idx) : { line: 1, offset: 0 };
        violations.push({
          rule: 'frequent-ngram',
          severity: 'review',
          message: `${n}-gram "${gram}" repeats ${count} times.`,
          match: gram,
          location: { segmentId, line, offset },
        });
      }
    }
  }
  return violations;
}

/**
 * Lint a single block of text (e.g. one segment's body) against a style
 * dictionary and repetition heuristics. Never mutates or rewrites the
 * input — report-only.
 */
export function lintText(text: string, options: LintOptions = {}, segmentId?: string): LintViolation[] {
  const dictionary = options.dictionary ?? getDefaultStyleDictionary();
  const ngramThreshold = options.ngramRepeatThreshold ?? 3;
  const transitionThreshold = options.transitionWordThreshold ?? 2;
  const openingThreshold = options.repeatedOpeningThreshold ?? 3;
  const rhetoricalRatio = options.rhetoricalQuestionRatio ?? 0.15;

  const violations: LintViolation[] = [];

  for (const rule of dictionary.bannedPhrases) {
    violations.push(...findPhraseOccurrences(text, segmentId, rule, 'banned-phrase'));
  }
  for (const rule of dictionary.discouragedPhrases) {
    violations.push(...findPhraseOccurrences(text, segmentId, rule, 'discouraged-phrase'));
  }
  for (const rule of dictionary.preferredTerms) {
    violations.push(...findPreferredTermOccurrences(text, segmentId, rule));
  }

  violations.push(...detectRepeatedOpenings(text, segmentId, openingThreshold));
  violations.push(...detectRepeatedTransitionWords(text, segmentId, dictionary.transitionWords, transitionThreshold));
  violations.push(...detectExcessiveRhetoricalQuestions(text, segmentId, rhetoricalRatio));
  violations.push(...detectFrequentNgrams(text, segmentId, ngramThreshold));

  return violations;
}

/**
 * Lint a list of segments (podcast segments, article sections, etc). Each
 * segment is linted independently for phrase/preferred-term/ngram/
 * rhetorical-question rules; repeated-sentence-opening is also checked
 * across the whole concatenated script so cross-segment repetition is
 * caught, tagged with the segment id it falls in.
 */
export function lintSegments(segments: TextSegment[], options: LintOptions = {}): LintResult {
  const violations: LintViolation[] = [];

  for (const segment of segments) {
    violations.push(...lintText(segment.text, options, segment.id));
  }

  // Cross-segment repeated openings (nearby paragraphs across segment boundaries).
  const combined = segments.map((s) => s.text.trim()).join('\n\n');
  const dictionary = options.dictionary ?? getDefaultStyleDictionary();
  const openingThreshold = options.repeatedOpeningThreshold ?? 3;
  const crossSegmentOpenings = detectRepeatedOpenings(combined, undefined, openingThreshold);
  // Avoid duplicate reporting: only add cross-segment findings not already
  // captured by a single segment's own paragraphs.
  for (const v of crossSegmentOpenings) {
    const alreadyFound = violations.some(
      (existing) => existing.rule === 'repeated-sentence-opening' && existing.match === v.match
    );
    if (!alreadyFound) violations.push(v);
  }
  void dictionary; // dictionary already applied per-segment above

  return summarize(violations);
}

function summarize(violations: LintViolation[]): LintResult {
  let errorCount = 0;
  let warnCount = 0;
  let reviewCount = 0;
  for (const v of violations) {
    if (v.severity === 'error') errorCount += 1;
    else if (v.severity === 'warn') warnCount += 1;
    else reviewCount += 1;
  }
  return { violations, errorCount, warnCount, reviewCount };
}

/** Convenience wrapper: lint a single text block and return a summarized LintResult. */
export function lint(text: string, options: LintOptions = {}): LintResult {
  return summarize(lintText(text, options));
}
