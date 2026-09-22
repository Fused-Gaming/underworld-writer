import {
  lint,
  lintText,
  lintSegments,
  getDefaultStyleDictionary,
  mergeStyleDictionaries,
  StyleDictionary,
} from '../src/editorial-lint';

describe('editorial-lint', () => {
  const clicheProse = `
In today's fast-paced world, it's important to note that we need to delve into the tapestry of modern life.

In today's fast-paced world, the landscape is shifting fast, and it's important to note the realm of possibility.

In today's fast-paced world, let's dive in and navigate this multifaceted, comprehensive, robust landscape together.

Furthermore, this is crucial. Moreover, this is pivotal. Furthermore, this underscores a robust, comprehensive approach.

Are you ready for this? Have you ever wondered why this matters? Isn't it amazing how it all connects? Don't you think so too?
`.trim();

  const cleanProse = `
Marcus Webb signed the deed on a Tuesday morning in March 1987, three weeks before the bank called his loan.

He had borrowed against the warehouse to cover payroll, a decision his lawyer warned against in writing.

The warehouse burned down that August. Investigators found accelerant near the loading dock and two witnesses placed Webb's truck nearby.

He was charged with arson and insurance fraud in October, and a jury convicted him the following spring.
`.trim();

  it('flags multiple banned/discouraged phrases in cliché-heavy AI-sounding prose', () => {
    const result = lint(clicheProse);
    expect(result.violations.length).toBeGreaterThan(5);
    expect(result.errorCount).toBeGreaterThan(0);

    const matchedPhrases = result.violations.map((v) => v.match.toLowerCase());
    expect(matchedPhrases).toEqual(
      expect.arrayContaining(["in today's fast-paced world", "it's important to note", 'delve into'])
    );
  });

  it('detects repeated sentence openings across nearby paragraphs', () => {
    const violations = lintText(clicheProse);
    const openingViolations = violations.filter((v) => v.rule === 'repeated-sentence-opening');
    expect(openingViolations.length).toBeGreaterThan(0);
    expect(openingViolations[0].match).toContain("in today's");
  });

  it('detects repeated transition words', () => {
    const violations = lintText(clicheProse);
    const transitionViolations = violations.filter((v) => v.rule === 'repeated-transition-word');
    expect(transitionViolations.length).toBeGreaterThan(0);
    expect(transitionViolations.some((v) => v.match === 'furthermore')).toBe(true);
  });

  it('detects excessive rhetorical questions', () => {
    const violations = lintText(clicheProse);
    const questionViolations = violations.filter((v) => v.rule === 'excessive-rhetorical-questions');
    expect(questionViolations.length).toBeGreaterThan(0);
  });

  it('detects suspiciously frequent n-grams', () => {
    const repeatedNgramText = Array(4)
      .fill("this is the kind of thing that happens all the time in this industry.")
      .join(' ');
    const violations = lintText(repeatedNgramText);
    const ngramViolations = violations.filter((v) => v.rule === 'frequent-ngram');
    expect(ngramViolations.length).toBeGreaterThan(0);
  });

  it('produces no error-severity violations for clean, concrete prose', () => {
    const result = lint(cleanProse);
    expect(result.errorCount).toBe(0);
  });

  it('flags preferred-term substitutions like utilize -> use', () => {
    const violations = lintText('We should utilize this approach in order to succeed.');
    const termViolations = violations.filter((v) => v.rule === 'preferred-term');
    expect(termViolations.some((v) => v.match.toLowerCase() === 'utilize')).toBe(true);
  });

  it('never rewrites the input text (report-only)', () => {
    const original = clicheProse;
    const before = original;
    lintText(original);
    expect(original).toBe(before);
  });

  it('supports project/brand-level dictionary overrides via mergeStyleDictionaries', () => {
    const base = getDefaultStyleDictionary();
    const override: StyleDictionary = {
      bannedPhrases: [{ phrase: 'synergistic paradigm', severity: 'error', suggestion: 'Cut it.' }],
      discouragedPhrases: [],
      preferredTerms: [],
      transitionWords: [],
    };
    const merged = mergeStyleDictionaries(base, override);
    const result = lint('This is a synergistic paradigm shift.', { dictionary: merged });
    expect(result.violations.some((v) => v.match.toLowerCase() === 'synergistic paradigm')).toBe(true);
  });

  it('lints a list of segments and tags violations with segment ids', () => {
    const result = lintSegments([
      { id: 'seg-1', text: "In today's fast-paced world, delve into this." },
      { id: 'seg-2', text: 'Nothing wrong here at all, just plain facts.' },
    ]);
    const seg1Violations = result.violations.filter((v) => v.location.segmentId === 'seg-1');
    expect(seg1Violations.length).toBeGreaterThan(0);
    const seg2Violations = result.violations.filter((v) => v.location.segmentId === 'seg-2');
    expect(seg2Violations.length).toBe(0);
  });
});
