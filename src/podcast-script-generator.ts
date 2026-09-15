/**
 * Podcast Script Generator
 *
 * Core engine for generating fact-checked podcast scripts with guest handoffs,
 * producer briefs, and interview optimization for true crime narratives.
 */

import {
  CharacterForPodcast,
  ScriptOutput,
  ProducerBrief,
  GuestScript,
  ScriptSegment,
  QAWindow,
  MissingFactWindow,
  ScriptConfig,
  PACERCaseData,
  PodcastGenerationResult,
  FactAttribution,
  TrueCrimeCaseFile,
} from './podcast-types.js';

/**
 * True-crime case files (projects/*\/characters/*.json) use a `character` /
 * `offense` / `sentence` shape, not the Fiction three-phase CharacterForPodcast
 * shape ScriptGenerator was originally written against. Without this adapter,
 * passing a case file straight to ScriptGenerator throws
 * "Cannot read properties of undefined (reading 'name')" on `phase1.name` -
 * reproducible via: node dist/cli.js generate-script --character <case-file>.json
 */
export function isTrueCrimeCaseFile(
  input: CharacterForPodcast | TrueCrimeCaseFile
): input is TrueCrimeCaseFile {
  return !('phase1' in input) && 'character' in input && 'offense' in input;
}

export function adaptCaseFileToCharacter(raw: TrueCrimeCaseFile): CharacterForPodcast {
  const c = raw.character;
  const sentenceSummary = Object.entries(raw.sentence ?? {})
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
    .join('; ');

  return {
    phase1: {
      name: c.name,
      aliases: [],
      origin: raw.region ? `${raw.region}${raw.year ? `, ${raw.year}` : ''}` : 'Region not on file',
      background: c.background ?? 'No background documented in case file.',
      coreMotivation: c.motivations ?? 'Not documented in case file.',
    },
    phase2: {
      roleAndRank: c.role ?? c.title ?? 'Role not on file',
      factionAffiliation: {
        primary: c.faction ?? raw.type ?? 'Unspecified',
        allies: [],
        opposition: [],
      },
      relationships: [],
    },
    phase3: {
      storyArc: {
        act1: raw.offense.description,
        act2:
          raw.howTheyGotAwayWithIt?.strategy ??
          `Case status: ${raw.sentence?.status ?? 'unresolved - see sentence field'}`,
        act3: sentenceSummary || 'Outcome not yet on file.',
      },
      hierarchiesAndConflicts: {
        internal: raw.howTheyGotAwayWithIt?.keyFactors ?? [],
        external: raw.fallout?.consequences ?? [],
        personal: [],
      },
      thematicElements: [raw.narrative_hooks?.investigation_angle, raw.narrative_hooks?.question].filter(
        (x): x is string => Boolean(x)
      ),
    },
  };
}

export class ScriptGenerator {
  private character: CharacterForPodcast;
  private config: ScriptConfig;
  private caseData?: PACERCaseData;
  private sourceCaseFile?: TrueCrimeCaseFile;

  constructor(
    character: CharacterForPodcast | TrueCrimeCaseFile,
    config: Partial<ScriptConfig> = {},
    caseData?: PACERCaseData
  ) {
    if (isTrueCrimeCaseFile(character)) {
      this.sourceCaseFile = character;
      this.character = adaptCaseFileToCharacter(character);
    } else {
      this.character = character;
    }
    this.config = {
      format: 'single',
      includeAttribution: true,
      includeSpeakerLabels: true,
      includeTimecodes: false,
      minSegmentDuration: 30,
      maxSegmentDuration: 180,
      conversationalTone: true,
      targetAudience: 'podcast-audience',
      ...config,
    };
    this.caseData = caseData;
  }

  /**
   * Generate complete podcast script with all components
   */
  generateScript(): ScriptOutput {
    let episodes: ScriptOutput['episodes'];

    if (this.config.format === 'single') {
      episodes = [this.generateSingleEpisode()];
    } else {
      episodes = this.generateTwoPartEpisode();
    }

    const attributions = this.extractAttributions();
    const qaWindows = this.identifyQAWindows();
    const missingFacts = this.flagMissingFacts();

    return {
      format: this.config.format,
      title: `The Story of ${this.character.phase1.name}`,
      episodes,
      attributions,
      qaWindows,
      missingFacts,
      metadata: {
        generatedDate: new Date().toISOString(),
        characterName: this.character.phase1.name,
        caseReference: this.caseData?.caseNumber,
        verificationStatus: this.calculateVerificationStatus(),
      },
    };
  }

  /**
   * Generate single-episode format (~8-12 minutes)
   */
  private generateSingleEpisode(): ScriptOutput['episodes'][0] {
    const segments: ScriptSegment[] = [
      this.createOpening(),
      this.createFoundationSegment(),
      this.createIntegrationSegment(),
      this.createArcSegment(),
      this.createClosing(),
    ];

    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);

    return {
      partNumber: 1,
      duration: Math.round(totalDuration / 60),
      segments,
      openingHook: segments[0].text.split('\n')[0],
      closingStatement: segments[segments.length - 1].text.split('\n')[0],
    };
  }

  /**
   * Generate two-part episode format (~6-8 minutes each)
   */
  private generateTwoPartEpisode(): ScriptOutput['episodes'] {
    const part1Segments: ScriptSegment[] = [
      this.createOpening(),
      this.createFoundationSegment(),
      this.createIntegrationSegment(),
      this.createCliffhangerSegment(),
    ];

    const part2Segments: ScriptSegment[] = [
      this.createRecapSegment(),
      this.createArcSegment(),
      this.createResolutionSegment(),
      this.createClosing(),
    ];

    const part1Duration = part1Segments.reduce((sum, seg) => sum + seg.duration, 0);
    const part2Duration = part2Segments.reduce((sum, seg) => sum + seg.duration, 0);

    return [
      {
        partNumber: 1,
        duration: Math.round(part1Duration / 60),
        segments: part1Segments,
        openingHook: part1Segments[0].text.split('\n')[0],
        closingStatement: 'To be continued...',
      },
      {
        partNumber: 2,
        duration: Math.round(part2Duration / 60),
        segments: part2Segments,
        openingHook: part2Segments[0].text.split('\n')[0],
        closingStatement: part2Segments[part2Segments.length - 1].text.split('\n')[0],
      },
    ];
  }

  /**
   * Create opening segment with hook
   */
  private createOpening(): ScriptSegment {
    const name = this.character.phase1.name;
    const motivation = this.character.phase1.coreMotivation;

    return {
      title: 'Opening Hook',
      duration: 45,
      speaker: 'narrator',
      text: `Every criminal has a story. Today, we're telling the story of ${name}.

${this.character.phase1.origin}

But this isn't just a story about crime. It's a story about ambition, power, and the choices that led someone down a path they can never escape from.

What drove ${name} to ${motivation}? How did they rise to power in ${this.character.phase2.factionAffiliation.primary}? And what ultimately led to their downfall?

This is their story. And it starts here.`,
      pausePoints: ['After "never escape from"'],
      adlibNotes: ['Pause for dramatic effect', 'Build tension in voice'],
    };
  }

  /**
   * Create foundation segment (Phase 1)
   */
  private createFoundationSegment(): ScriptSegment {
    const { name, origin, background, coreMotivation } = this.character.phase1;

    return {
      title: 'Character Foundation',
      duration: 120,
      speaker: 'both',
      text: `${name} didn't start out as a criminal. Like many people, they had a beginning, a transformation point.

${origin}

${background}

The core of who ${name} became was shaped by one fundamental drive: ${coreMotivation}

${this.caseData ? `[VERIFY: Court records from ${this.caseData.caseNumber} document this period]` : ''}

This foundation is crucial to understanding what comes next. Because the choices made in these early days would echo throughout their entire life.`,
      pausePoints: [
        'After describing origin',
        'After core motivation',
      ],
      adlibNotes: [
        'Ask the guest: "What do you think changed in them?"',
        'Invite guest perspective on the turning point',
      ],
    };
  }

  /**
   * Create underworld integration segment (Phase 2)
   */
  private createIntegrationSegment(): ScriptSegment {
    const { roleAndRank, factionAffiliation, relationships } = this.character.phase2;

    const alliesList = factionAffiliation.allies.join(', ') || 'none listed';
    const oppositionList = factionAffiliation.opposition.join(', ') || 'none listed';
    const keyRelationships = relationships.slice(0, 3).map(r => `${r.name} (${r.type})`).join(', ');

    return {
      title: 'Underworld Integration',
      duration: 150,
      speaker: 'both',
      text: `This is where ${this.character.phase1.name} fully stepped into the criminal underworld.

As ${roleAndRank}, they became a key player in ${factionAffiliation.primary}.

Their allies included: ${alliesList}

Their opposition consisted of: ${oppositionList}

Key relationships in their network: ${keyRelationships}

${this.caseData ? `[Tier 1: Federal records from ${this.caseData.caseNumber} confirm these affiliations]` : '[VERIFY: These relationships need confirmation]'}

But having power in the criminal world means constant vigilance. Constant pressure. Constant danger.`,
      pausePoints: [
        'After introducing role',
        'After listing key relationships',
      ],
      adlibNotes: [
        'Guest: "How dangerous was this position?"',
        'Ask about internal dynamics in the faction',
      ],
    };
  }

  /**
   * Create narrative arc segment (Phase 3, Act 1-2)
   */
  private createArcSegment(): ScriptSegment {
    const { act1, act2, act3 } = this.character.phase3.storyArc;
    const themes = this.character.phase3.thematicElements.slice(0, 3).join(', ');

    return {
      title: 'Narrative Arc',
      duration: 180,
      speaker: 'both',
      text: `The story unfolds in three acts.

Act One: ${act1}

During this time, the underlying themes of their life became clear: ${themes}

Act Two: ${act2}

This is where the tension reaches its peak. Where the contradictions in their life become unbearable.

[Q&A: What internal conflicts do you think they were experiencing?]

The conflicts were everywhere:
- Internal: ${this.character.phase3.hierarchiesAndConflicts.internal.join('; ')}
- External: ${this.character.phase3.hierarchiesAndConflicts.external.join('; ')}
- Personal: ${this.character.phase3.hierarchiesAndConflicts.personal.join('; ')}`,
      pausePoints: [
        'After Act One description',
        'Before Act Two',
        'After Q&A marker',
      ],
      adlibNotes: [
        'Let guest respond to Q&A about internal conflicts',
        'Build dramatic tension here',
      ],
    };
  }

  /**
   * Create cliffhanger for two-part episodes
   */
  private createCliffhangerSegment(): ScriptSegment {
    const { act3 } = this.character.phase3.storyArc;

    return {
      title: 'Cliffhanger',
      duration: 60,
      speaker: 'narrator',
      text: `But Act Three - the final act - would be unlike anything that came before.

${act3}

And that's where this episode ends. But the real drama? That's just beginning.

Next time on this series: We explore what happens when power collapses. When the unstoppable force meets an immovable object.

Don't miss it.`,
      adlibNotes: ['Build anticipation for part 2'],
    };
  }

  /**
   * Create recap segment for part 2
   */
  private createRecapSegment(): ScriptSegment {
    const { name } = this.character.phase1;
    const { act1, act2 } = this.character.phase3.storyArc;

    return {
      title: 'Part 2 Recap',
      duration: 45,
      speaker: 'narrator',
      text: `Welcome back. You're listening to the story of ${name}.

In part one, we learned how they rose through the ranks of ${this.character.phase2.factionAffiliation.primary}.

We saw Act One: ${act1}

And Act Two: ${act2}

But the pressure was mounting. The contradictions were becoming unbearable.

Today, in part two, we explore what happens next.`,
    };
  }

  /**
   * Create resolution segment (Act 3 resolution)
   */
  private createResolutionSegment(): ScriptSegment {
    const { name } = this.character.phase1;
    const { act3 } = this.character.phase3.storyArc;

    return {
      title: 'Resolution',
      duration: 150,
      speaker: 'both',
      text: `Act Three finally arrives: ${act3}

${this.caseData ? `The official record shows: ${this.caseData.outcome}` : ''}

[Q&A: What do you think was the turning point?]

This is where everything comes together. Where all the choices made earlier converge into a single, inescapable conclusion.

The story of ${name} is ultimately a story about consequences. About how power, once seized, can never truly be held. About how every choice in the criminal underworld carries a weight that compounds over time.`,
      pausePoints: [
        'After Act Three description',
        'After Q&A marker',
      ],
      adlibNotes: [
        'Invite guest analysis of the outcome',
        'Pause for reflection',
      ],
    };
  }

  /**
   * Create closing segment
   */
  private createClosing(): ScriptSegment {
    const { name } = this.character.phase1;
    const themes = this.character.phase3.thematicElements.join(', ');

    return {
      title: 'Closing',
      duration: 60,
      speaker: 'narrator',
      text: `The story of ${name} is one of many in the criminal underworld.

But it matters. It matters because it illustrates the fundamental themes we've explored: ${themes}

In telling their story, we better understand how power works. How it corrupts. How it destroys.

${name} is no longer a mystery. They're a cautionary tale.

And that's a story worth telling.

Thank you for listening. This has been [Series Name].`,
      adlibNotes: ['Warm, reflective tone'],
    };
  }

  /**
   * Extract fact attributions
   */
  private extractAttributions(): FactAttribution[] {
    const attributions: FactAttribution[] = [];

    if (this.sourceCaseFile) {
      // Case file's own sources/verification_status are real reporting, not
      // "character narrative" - tier per docs/use-cases/true-crime/protocols/verification-engine.md:
      // Tier 1 = federal/court record, Tier 2 = multiple published sources, Tier 3 = single source.
      const sources = this.sourceCaseFile.sources ?? [];
      const isFederalRecord = /verified.*federal|federal.*indictment|pacer/i.test(
        this.sourceCaseFile.verification_status ?? ''
      );
      const tier: 1 | 2 | 3 = isFederalRecord ? 1 : sources.length > 1 ? 2 : 3;
      for (const source of sources) {
        attributions.push({
          claim: this.sourceCaseFile.narrative_hooks?.headline ?? `${this.character.phase1.name} case facts`,
          tier,
          source,
          confidence: tier === 1 ? 1.0 : tier === 2 ? 0.85 : 0.6,
        });
      }
      return attributions;
    }

    if (this.caseData) {
      attributions.push({
        claim: `${this.character.phase1.name} case information`,
        tier: 1,
        source: 'PACER Federal Records',
        caseNumber: this.caseData.caseNumber,
        confidence: 1.0,
      });

      attributions.push({
        claim: this.caseData.outcome,
        tier: 1,
        source: `Court Case ${this.caseData.caseNumber}`,
        caseNumber: this.caseData.caseNumber,
        confidence: 1.0,
      });
    }

    // Character details are Tier 4 (character narrative)
    attributions.push({
      claim: `${this.character.phase1.name} character profile`,
      tier: 4,
      source: 'Character narrative',
      confidence: 0.7,
    });

    return attributions;
  }

  /**
   * Identify Q&A insertion points
   */
  private identifyQAWindows(): QAWindow[] {
    return [
      {
        timeMarker: '3:45',
        lineNumber: 12,
        topic: 'Formative experiences',
        context: 'After describing character origin',
        suggestedQuestions: [
          'What do you think was the pivotal moment?',
          'How common is this type of trajectory?',
          'What alternatives existed?',
        ],
        linkedFacts: ['origin', 'core motivation'],
        opportunityType: 'clarification',
      },
      {
        timeMarker: '7:20',
        lineNumber: 28,
        topic: 'Power dynamics',
        context: 'During underworld integration',
        suggestedQuestions: [
          'How dangerous was this position?',
          'What were the daily pressures like?',
          'How was loyalty maintained?',
        ],
        linkedFacts: ['role', 'faction', 'relationships'],
        opportunityType: 'expert-input',
      },
      {
        timeMarker: '11:15',
        lineNumber: 45,
        topic: 'Internal conflicts',
        context: 'Discussing narrative tensions',
        suggestedQuestions: [
          'What internal conflicts do you think they experienced?',
          'How did these conflicts manifest?',
          'Could anything have changed the outcome?',
        ],
        linkedFacts: ['conflicts', 'themes'],
        opportunityType: 'verification',
      },
    ];
  }

  /**
   * Flag missing facts that need verification
   */
  private flagMissingFacts(): MissingFactWindow[] {
    const missing: MissingFactWindow[] = [];

    if (!this.caseData) {
      missing.push({
        claim: 'Character involvement in major criminal operations',
        claimContext: 'Phase 2 - Underworld Integration',
        tier: 3,
        confidence: 0.6,
        verificationApproach: 'PACER case lookup or law enforcement records',
        interviewOpportunity: 'Ask guest about documented evidence of involvement',
        suggestedFollowUp: 'Can you recall specific operations or dates?',
        importance: 'high',
      });
    }

    // Check for specific relationship details
    if (this.character.phase2.relationships.length < 3) {
      missing.push({
        claim: 'Network relationships and allegiances',
        claimContext: 'Phase 2 - relationships section',
        tier: 4,
        confidence: 0.5,
        verificationApproach: 'Interview subject or known associates',
        interviewOpportunity: 'Discuss specific individuals and their roles',
        suggestedFollowUp: 'What happened to these individuals after?',
        importance: 'medium',
      });
    }

    // Check for specific conflict details
    if (this.character.phase3.hierarchiesAndConflicts.external.length === 0) {
      missing.push({
        claim: 'External conflicts and opposition',
        claimContext: 'Phase 3 - hierarchies and conflicts',
        tier: 3,
        confidence: 0.6,
        verificationApproach: 'Law enforcement perspective or rival faction accounts',
        interviewOpportunity: 'Ask about external threats or rivals',
        suggestedFollowUp: 'Who posed the biggest threat?',
        importance: 'high',
      });
    }

    return missing;
  }

  /**
   * Calculate overall verification status
   */
  private calculateVerificationStatus(): 'all-tier-1' | 'mixed' | 'requires-verification' {
    const attributions = this.extractAttributions();
    const tier1Count = attributions.filter(a => a.tier === 1).length;

    if (tier1Count === attributions.length) return 'all-tier-1';
    if (tier1Count > 0) return 'mixed';
    return 'requires-verification';
  }

  /**
   * Create producer brief
   */
  createProducerBrief(): ProducerBrief {
    const attributions = this.extractAttributions();

    return {
      episodeTitle: `The Story of ${this.character.phase1.name}`,
      characterName: this.character.phase1.name,
      duration: this.config.format === 'single' ? '8-12 minutes' : '14-20 minutes (2 parts)',
      summary: this.character.phase1.origin,
      keyFacts: [
        this.character.phase1.background,
        `Role: ${this.character.phase2.roleAndRank}`,
        `Faction: ${this.character.phase2.factionAffiliation.primary}`,
        this.character.phase3.storyArc.act3,
      ],
      talkingPoints: [
        'What drove them to this path?',
        'How did they rise to power?',
        'What were the consequences?',
        'What can we learn from this story?',
      ],
      guestProfile: {
        expertise: 'Criminal justice / Underworld dynamics',
        recentRelevance: 'Ongoing impact of their actions',
      },
      verificationStatus: {
        tier1Count: attributions.filter(a => a.tier === 1).length,
        tier2Count: attributions.filter(a => a.tier === 2).length,
        tier3Count: attributions.filter(a => a.tier === 3).length,
        tier4Count: attributions.filter(a => a.tier === 4).length,
        overall: this.calculateVerificationStatus(),
      },
      recordingNotes: [
        'Use natural pauses for guest questions',
        'Allow for guest anecdotes',
        'Flag verification opportunities',
        'Maintain dramatic tension throughout',
      ],
    };
  }

  /**
   * Create guest script (for interview preparation)
   */
  createGuestScript(): GuestScript {
    const script = this.generateScript();

    return {
      title: `Guest Script: ${this.character.phase1.name}`,
      format: this.config.format,
      parts: script.episodes.map((episode) => ({
        partNumber: episode.partNumber,
        segments: episode.segments.map((segment) => ({
          speaker: 'producer' as const,
          text: `[NARRATOR INTRO: ${segment.title}]\n\n${segment.text}`,
          pausePoint: segment.pausePoints?.length ? true : false,
          adlibNote: segment.adlibNotes ? segment.adlibNotes[0] : undefined,
          questionPrompt: segment.adlibNotes ? segment.adlibNotes[1] : undefined,
        })),
      })),
      backgroundInfo: this.character.phase1.background,
      discussionTopics: this.character.phase3.thematicElements,
      expectedRuntime: Math.round(script.episodes[0].duration / 2),
    };
  }
}
