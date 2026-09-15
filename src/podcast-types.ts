/**
 * Podcast Scripting Engine Type Definitions
 *
 * TypeScript interfaces for podcast script generation, guest handoffs, and producer materials
 */

export interface ScriptSegment {
  title: string;
  duration: number; // in seconds
  text: string;
  speaker?: 'narrator' | 'guest' | 'both';
  pausePoints?: string[]; // [PAUSE] markers for natural conversation breaks
  adlibNotes?: string[]; // notes encouraging guest responses
}

export interface FactAttribution {
  claim: string;
  tier: 1 | 2 | 3 | 4;
  source: string;
  caseNumber?: string; // For PACER records
  confidence: number; // 0-1 confidence score
}

export interface ScriptOutput {
  format: 'single' | 'two-part';
  title: string;
  episodes: {
    partNumber: number;
    duration: number; // total minutes
    segments: ScriptSegment[];
    openingHook: string;
    closingStatement: string;
  }[];
  attributions: FactAttribution[];
  qaWindows: QAWindow[];
  missingFacts: MissingFactWindow[];
  metadata: {
    generatedDate: string;
    characterName: string;
    caseReference?: string;
    verificationStatus: 'all-tier-1' | 'mixed' | 'requires-verification';
  };
}

export interface ProducerBrief {
  episodeTitle: string;
  episodeNumber?: string;
  series?: string;
  characterName: string;
  duration: string; // e.g., "8-12 minutes"
  summary: string;
  keyFacts: string[];
  talkingPoints: string[];
  guestProfile?: {
    name?: string;
    expertise: string;
    recentRelevance?: string;
  };
  verificationStatus: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    tier4Count: number;
    overall: string;
  };
  recordingNotes: string[];
}

export interface GuestScript {
  title: string;
  format: 'single' | 'two-part';
  parts: {
    partNumber: number;
    segments: {
      speaker: 'producer' | 'guest';
      text: string;
      pausePoint?: boolean;
      adlibNote?: string;
      questionPrompt?: string;
    }[];
  }[];
  backgroundInfo: string;
  discussionTopics: string[];
  expectedRuntime: number; // minutes per part
}

export interface QAWindow {
  timeMarker: string;
  lineNumber: number;
  topic: string;
  context: string;
  suggestedQuestions: string[];
  linkedFacts: string[];
  opportunityType: 'clarification' | 'expert-input' | 'verification' | 'anecdote';
}

export interface MissingFactWindow {
  claim: string;
  claimContext: string;
  tier: 1 | 2 | 3 | 4;
  confidence: number;
  verificationApproach: string;
  interviewOpportunity: string;
  suggestedFollowUp: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface ScriptConfig {
  format: 'single' | 'two-part';
  includeAttribution: boolean;
  includeSpeakerLabels: boolean;
  includeTimecodes: boolean;
  minSegmentDuration: number; // seconds
  maxSegmentDuration: number; // seconds
  conversationalTone: boolean;
  targetAudience: 'general' | 'security-community' | 'podcast-audience';
  sourceVerificationTier?: 1 | 2 | 3 | 4; // Minimum tier to include
}

export interface PACERCaseData {
  caseNumber: string;
  title: string;
  court: string;
  filedDate: string;
  status: 'open' | 'closed';
  defendants: string[];
  sentencingInfo?: {
    sentenceDate: string;
    sentenceLength: string;
    releaseDate: string;
  };
  charges: string[];
  outcome: string;
}

export interface CharacterForPodcast {
  phase1: {
    name: string;
    aliases: string[];
    origin: string;
    background: string;
    coreMotivation: string;
  };
  phase2: {
    roleAndRank: string;
    factionAffiliation: {
      primary: string;
      allies: string[];
      opposition: string[];
    };
    relationships: Array<{
      name: string;
      type: string;
      description: string;
    }>;
  };
  phase3: {
    storyArc: {
      act1: string;
      act2: string;
      act3: string;
    };
    hierarchiesAndConflicts: {
      internal: string[];
      external: string[];
      personal: string[];
    };
    thematicElements: string[];
  };
}

/**
 * True Crime Case File
 *
 * Shape used by the podcast-production case files under `projects/*\/characters/*.json`
 * (e.g. `joanne-segovia-case.json`). This is distinct from CharacterForPodcast (the
 * Fiction three-phase schema) and from PACERCaseData (raw court-record data) -
 * ScriptGenerator normalizes it into CharacterForPodcast via adaptCaseFileToCharacter().
 */
export interface TrueCrimeCaseFile {
  caseId?: string;
  caseName?: string;
  brand?: string;
  type?: string;
  region?: string;
  year?: number;
  character: {
    name: string;
    title?: string;
    role?: string;
    background?: string;
    faction?: string;
    motivations?: string;
  };
  offense: {
    type?: string;
    description: string;
    severity?: string;
    scale?: string;
    duration?: string;
    yearsActive?: string;
    impact?: string;
  };
  howTheyGotAwayWithIt?: {
    strategy?: string;
    keyFactors?: string[];
  };
  sentence: Record<string, string | undefined>;
  fallout?: {
    consequences?: string[];
    avoided?: string;
  };
  narrative_hooks?: {
    headline?: string;
    question?: string;
    investigation_angle?: string;
  };
  sources: string[];
  verification_status: string;
}

export interface PodcastGenerationResult {
  script: ScriptOutput;
  producerBrief: ProducerBrief;
  guestScript: GuestScript;
  characterSheet: {
    name: string;
    aliases: string[];
    role: string;
    faction: string;
    keyFacts: string[];
  };
  timeline?: {
    event: string;
    date: string;
    significance: string;
  }[];
  generatedAt: string;
  duration: number; // ms to generate
}
