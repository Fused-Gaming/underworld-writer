/**
 * Asset Validation Module
 *
 * Provides cleanroom sandbox integration for validating package assets
 * including icons, images, and other distributable content.
 */

export interface AssetValidationConfig {
  path: string;
  license: string;
  attribution: string;
  usage: 'package-icon' | 'documentation' | 'ui-element' | 'other';
  checksum?: string;
}

export interface AssetValidationResult {
  valid: boolean;
  path: string;
  license: string;
  attribution: string;
  timestamp: Date;
  errors?: string[];
  warnings?: string[];
}

/**
 * Asset Validator
 * Validates assets for licensing compliance and distribution readiness
 */
export class AssetValidator {
  private validLicenses = [
    'svgrepo-free',
    'cc0',
    'mit',
    'apache2',
    'unlicense',
    'public-domain',
  ];

  /**
   * Validate an asset for distribution
   */
  async validateAsset(config: AssetValidationConfig): Promise<AssetValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check license
    if (!this.validLicenses.includes(config.license.toLowerCase())) {
      errors.push(`License "${config.license}" not in approved list`);
    }

    // Check attribution
    if (!config.attribution || config.attribution.trim().length === 0) {
      warnings.push('Attribution should be provided for proper credit');
    }

    // Check path
    if (!config.path.startsWith('assets/')) {
      warnings.push(`Asset should be in assets/ directory, found: ${config.path}`);
    }

    const result: AssetValidationResult = {
      valid: errors.length === 0,
      path: config.path,
      license: config.license,
      attribution: config.attribution,
      timestamp: new Date(),
    };

    if (errors.length > 0) {
      result.errors = errors;
    }
    if (warnings.length > 0) {
      result.warnings = warnings;
    }

    return result;
  }

  /**
   * Get attribution string for distribution
   */
  getAttributionString(config: AssetValidationConfig): string {
    return `Icon: ${config.attribution} (License: ${config.license})`;
  }

  /**
   * Validate asset for npm publishing
   */
  async validateForPublishing(config: AssetValidationConfig): Promise<boolean> {
    const result = await this.validateAsset(config);
    return result.valid && !result.warnings?.length;
  }
}

/**
 * Pre-configured validators for known assets
 */
export const assetValidators = {
  underworldIcon: {
    path: 'assets/underworld-writer-icon.svg',
    license: 'svgrepo-free',
    attribution: 'SVG Repo community',
    usage: 'package-icon' as const,
  },
};
