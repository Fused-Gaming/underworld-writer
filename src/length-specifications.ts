/**
 * Length Specifications for Narratives and Podcast Episodes
 *
 * Defines precise length requirements and specifications for:
 * - Book narratives (word count / page count ranges)
 * - Podcast episodes (minute length with sponsor breaks)
 * - Production constraints and formatting requirements
 */

/**
 * Word Count Specification
 * Defines expected word count with minimum and maximum
 */
export interface WordCountSpec {
  unit: 'words';
  minimum: number;
  maximum: number;
  target?: number; // Expected/ideal length (between min and max)
  notes?: string;
}

/**
 * Page Count Specification
 * Defines expected page count with minimum and maximum
 * Allows specifying page format (letter, A4, etc.)
 */
export interface PageCountSpec {
  unit: 'pages';
  minimum: number;
  maximum: number;
  target?: number; // Expected/ideal length (between min and max)
  pageFormat?: 'letter' | 'a4' | 'trade-paperback' | 'mass-market-paperback'; // 8.5x11, 210x297mm, standard book sizes
  linesPerPage?: number; // For consistency across formats
  wordsPerPage?: number; // Average for conversion between word/page counts
  notes?: string;
}

/**
 * Narrative Length Specification
 * For book chapters, novellas, novels, short stories, etc.
 */
export interface NarrativeLengthSpec {
  type: 'book' | 'chapter' | 'novella' | 'short-story' | 'essay';
  format?: 'digital' | 'print' | 'both';
  length: WordCountSpec | PageCountSpec;
  estimatedReadingTime?: {
    unit: 'minutes';
    minimum: number;
    maximum: number;
    wordsPerMinute?: number; // For conversion (average: 200-250)
  };
  serializationSupport?: {
    episodic: boolean;
    episodeCount?: number;
    episodeLength?: WordCountSpec | PageCountSpec;
  };
}

/**
 * Sponsor Break Specification
 * Defines sponsor ad break details for podcast episodes
 */
export interface SponsorBreakSpec {
  position: 'pre-roll' | 'mid-roll' | 'post-roll' | 'dynamic';
  lengthSeconds: number;
  scriptTemplate?: string; // Template for ad read copy
  notes?: string;
}

/**
 * Podcast Episode Length Specification
 * Comprehensive length and break specifications for podcast episodes
 */
export interface PodcastLengthSpec {
  format: 'single-part' | 'two-part' | 'multi-part';
  parts: {
    partNumber: number;
    duration: {
      minimum: number; // minutes
      maximum: number; // minutes
      target?: number; // ideal length (between min and max)
    };
    sponsorBreaks: SponsorBreakSpec[];
    contentDuration?: {
      minimum: number; // minutes of actual content (excluding breaks)
      maximum: number;
      target?: number;
    };
    segments?: {
      name: string;
      estimatedDuration: number; // minutes
      canOverflow?: boolean; // Can this segment run over if needed?
    }[];
  }[];
  totalDuration?: {
    minimum: number; // sum of all parts
    maximum: number;
    target?: number;
  };
  estimatedEditingTime?: number; // hours to edit episode
  archiveFormat?: {
    full: boolean; // Full episode with all content
    edited?: boolean; // Trimmed version
    clipsDuration?: number; // Social media clip length (seconds)
  };
}

/**
 * Podcast Series Length Configuration
 * Defines overall series length specifications
 */
export interface PodcastSeriesLengthConfig {
  episodeCount: number;
  seasonCount: number;
  episodeLength: PodcastLengthSpec;
  sponsorBreaksPerEpisode: SponsorBreakSpec[];
  standardBreakDuration: number; // seconds
  totalSeriesDuration?: {
    minimum: number; // total minutes for all episodes
    maximum: number;
    target?: number;
  };
  perSeasonDuration?: {
    minimum: number;
    maximum: number;
    target?: number;
  };
  productionNotes?: {
    recordingTimePerEpisode?: number; // hours
    editingTimePerEpisode?: number; // hours
    reviewTimePerEpisode?: number; // hours
    totalProductionTimePerEpisode?: number; // hours
  };
}

/**
 * Production Constraint
 * Defines technical or business constraints on length
 */
export interface ProductionConstraint {
  type: 'technical' | 'distribution' | 'business' | 'editorial';
  description: string;
  impact: 'length-limit' | 'length-minimum' | 'segment-count' | 'break-frequency';
  value?: string | number;
  platform?: string; // e.g., 'spotify', 'youtube', 'apple-podcasts'
  notes?: string;
}

/**
 * Complete Length and Format Specification
 * Combines all length specifications for a project
 */
export interface LengthAndFormatSpec {
  projectType: 'book' | 'podcast-series' | 'podcast-episode' | 'mixed';
  narrativeSpec?: NarrativeLengthSpec;
  podcastSpec?: PodcastLengthSpec | PodcastSeriesLengthConfig;
  constraints: ProductionConstraint[];
  metadata: {
    createdDate: string;
    updatedDate: string;
    createdBy?: string;
    notes?: string;
  };
}

/**
 * Episode Configuration with Length
 * Extended episode config including detailed length specifications
 */
export interface EpisodeWithLengthSpec {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  description: string;
  length: PodcastLengthSpec;
  characters?: string[];
  location?: string;
  year?: number;
  tags?: string[];
  sourceVerificationTier?: number;
  status?: string;
  recordingDate?: string;
  airDate?: string;
  productionTeam?: {
    host?: string;
    producer?: string;
    engineer?: string;
    editor?: string;
    fact_checker?: string;
  };
  productionNotes?: {
    recordingTime?: number; // hours
    editingTime?: number; // hours
    reviewTime?: number; // hours
  };
}

/**
 * Helper function: Convert word count to estimated minutes
 */
export function wordsToMinutes(wordCount: number, wordsPerMinute: number = 225): number {
  return Math.round(wordCount / wordsPerMinute);
}

/**
 * Helper function: Convert minutes to estimated word count
 */
export function minutesToWords(minutes: number, wordsPerMinute: number = 225): number {
  return Math.round(minutes * wordsPerMinute);
}

/**
 * Helper function: Calculate total podcast duration including breaks
 */
export function calculatePodcastDuration(
  contentMinutes: number,
  breakSpecs: SponsorBreakSpec[]
): { content: number; breaks: number; total: number } {
  const breakSeconds = breakSpecs.reduce((sum, spec) => sum + spec.lengthSeconds, 0);
  const breakMinutes = breakSeconds / 60;
  return {
    content: contentMinutes,
    breaks: breakMinutes,
    total: contentMinutes + breakMinutes,
  };
}

/**
 * Helper function: Generate sponsor break schedule for episode
 */
export function generateBreakSchedule(
  totalMinutes: number,
  breakSpecs: SponsorBreakSpec[]
): { timeMarker: number; breakSpec: SponsorBreakSpec }[] {
  const breaks: { timeMarker: number; breakSpec: SponsorBreakSpec }[] = [];

  breakSpecs.forEach((spec) => {
    if (spec.position === 'pre-roll') {
      breaks.push({ timeMarker: 0, breakSpec: spec });
    } else if (spec.position === 'post-roll') {
      breaks.push({ timeMarker: totalMinutes, breakSpec: spec });
    } else if (spec.position === 'mid-roll') {
      // Place mid-roll at 50% of duration
      breaks.push({ timeMarker: Math.round(totalMinutes / 2), breakSpec: spec });
    } else if (spec.position === 'dynamic') {
      // Dynamic breaks can be placed during natural pauses
      // This is a placeholder for the producer to decide
      breaks.push({ timeMarker: Math.round(totalMinutes / 3), breakSpec: spec });
    }
  });

  return breaks.sort((a, b) => a.timeMarker - b.timeMarker);
}

export default {
  wordsToMinutes,
  minutesToWords,
  calculatePodcastDuration,
  generateBreakSchedule,
};
