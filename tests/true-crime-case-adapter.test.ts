/**
 * Regression test for the true-crime case-file adapter.
 *
 * Before this fix, passing a case file from projects/*\/characters/*.json
 * (the documented true-crime / podcast-production input) straight into
 * ScriptGenerator threw "Cannot read properties of undefined (reading 'name')"
 * because the class only understood the Fiction CharacterForPodcast schema
 * (phase1/phase2/phase3), not the case-file schema (character/offense/sentence).
 */

import { ScriptGenerator, adaptCaseFileToCharacter, isTrueCrimeCaseFile } from '../src/podcast-script-generator.js';
import { TrueCrimeCaseFile } from '../src/podcast-types.js';

const SAMPLE_CASE_FILE: TrueCrimeCaseFile = {
  caseId: 'test-case-001',
  caseName: 'Test Official - Bribery Case',
  brand: 'Insight Corruption',
  type: 'government-corruption',
  region: 'Test City, California',
  year: 2024,
  character: {
    name: 'Test Official',
    title: 'City Contracts Manager',
    role: 'Municipal Official',
    background: '15 years in municipal government.',
    faction: 'City Government',
    motivations: 'Personal enrichment through contract steering.',
  },
  offense: {
    type: 'Bribery',
    description: 'Accepted payments in exchange for steering city contracts.',
  },
  howTheyGotAwayWithIt: {
    strategy: 'Restitution agreement',
    keyFactors: ['Paid back funds before sentencing', 'No prior record'],
  },
  sentence: {
    status: 'CASE CONCLUDED',
    prison_time: '6 months',
  },
  fallout: {
    consequences: ['Lost position', 'Barred from public contracts'],
  },
  narrative_hooks: {
    headline: 'City Official Steered Contracts for Cash',
    question: 'How did a six-figure bribery scheme end in six months?',
    investigation_angle: 'Restitution as a substitute for accountability',
  },
  sources: ['Test Times (2024)', 'City Gazette (2024)'],
  verification_status: 'VERIFIED - Published reporting',
};

describe('true-crime case file adapter', () => {
  it('identifies a case file as distinct from a CharacterForPodcast', () => {
    expect(isTrueCrimeCaseFile(SAMPLE_CASE_FILE)).toBe(true);
  });

  it('maps a case file onto the CharacterForPodcast shape without inventing facts', () => {
    const character = adaptCaseFileToCharacter(SAMPLE_CASE_FILE);
    expect(character.phase1.name).toBe('Test Official');
    expect(character.phase3.storyArc.act1).toBe(SAMPLE_CASE_FILE.offense.description);
    expect(character.phase3.storyArc.act3).toContain('CASE CONCLUDED');
  });

  it('generates a script from a raw case file instead of throwing', () => {
    const generator = new ScriptGenerator(SAMPLE_CASE_FILE, { format: 'single' });
    const script = generator.generateScript();
    expect(script.title).toContain('Test Official');
  });

  it('tiers attributions from the case file sources instead of defaulting to Tier 4', () => {
    const generator = new ScriptGenerator(SAMPLE_CASE_FILE);
    const script = generator.generateScript();
    expect(script.attributions.length).toBe(SAMPLE_CASE_FILE.sources.length);
    expect(script.attributions.every((a) => a.tier <= 2)).toBe(true);
  });
});
