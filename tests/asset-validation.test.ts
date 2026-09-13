/**
 * Asset Validation Tests
 *
 * Tests for asset licensing and cleanroom sandbox integration
 */

import { AssetValidator, assetValidators } from '../src/asset-validation';

describe('Asset Validation', () => {
  let validator: AssetValidator;

  beforeEach(() => {
    validator = new AssetValidator();
  });

  describe('AssetValidator', () => {
    it('should validate asset with valid license', async () => {
      const result = await validator.validateAsset({
        path: 'assets/test-icon.svg',
        license: 'svgrepo-free',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject asset with invalid license', async () => {
      const result = await validator.validateAsset({
        path: 'assets/test-icon.svg',
        license: 'proprietary',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should warn on missing attribution', async () => {
      const result = await validator.validateAsset({
        path: 'assets/test-icon.svg',
        license: 'svgrepo-free',
        attribution: '',
        usage: 'package-icon',
      });

      expect(result.warnings).toBeDefined();
      expect(result.warnings?.length).toBeGreaterThan(0);
    });

    it('should warn on improper asset path', async () => {
      const result = await validator.validateAsset({
        path: 'src/test-icon.svg',
        license: 'svgrepo-free',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some((w) => w.includes('assets/'))).toBe(true);
    });

    it('should generate attribution string', () => {
      const attribution = validator.getAttributionString({
        path: 'assets/test.svg',
        license: 'svgrepo-free',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(attribution).toContain('Test Author');
      expect(attribution).toContain('svgrepo-free');
    });

    it('should validate for publishing', async () => {
      const validAsset = await validator.validateForPublishing({
        path: 'assets/test-icon.svg',
        license: 'svgrepo-free',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(validAsset).toBe(true);
    });

    it('should fail publishing validation on errors', async () => {
      const invalidAsset = await validator.validateForPublishing({
        path: 'assets/test.svg',
        license: 'proprietary',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(invalidAsset).toBe(false);
    });

    it('should fail publishing validation on warnings', async () => {
      const hasWarnings = await validator.validateForPublishing({
        path: 'src/test.svg',
        license: 'svgrepo-free',
        attribution: 'Test Author',
        usage: 'package-icon',
      });

      expect(hasWarnings).toBe(false);
    });
  });

  describe('Asset Validators - Pre-configured', () => {
    it('should have underworld icon configuration', () => {
      expect(assetValidators.underworldIcon).toBeDefined();
      expect(assetValidators.underworldIcon.path).toContain('underworld-writer-icon.svg');
    });

    it('should validate underworld icon with configured settings', async () => {
      const result = await validator.validateAsset(assetValidators.underworldIcon);

      expect(result.valid).toBe(true);
      expect(result.attribution).toBe('SVG Repo community');
    });
  });

  describe('License Compliance', () => {
    it('should support all open source licenses', async () => {
      const licenses = ['svgrepo-free', 'cc0', 'mit', 'apache2', 'unlicense', 'public-domain'];

      for (const license of licenses) {
        const result = await validator.validateAsset({
          path: 'assets/test.svg',
          license,
          attribution: 'Test',
          usage: 'package-icon',
        });

        expect(result.valid).toBe(true);
      }
    });

    it('should include timestamp in validation result', async () => {
      const result = await validator.validateAsset({
        path: 'assets/test.svg',
        license: 'svgrepo-free',
        attribution: 'Test',
        usage: 'package-icon',
      });

      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
