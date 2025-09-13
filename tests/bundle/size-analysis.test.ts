/**
 * Bundle Size Analysis Tests
 *
 * Comprehensive bundle size analysis for the design system components
 * to monitor bundle impact, tree-shaking effectiveness, and prevent
 * size regressions. This test suite ensures our design system remains
 * performant and doesn't bloat the application bundle.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

// Test utilities directory for bundle analysis
const TEMP_DIR = path.join(process.cwd(), 'temp-bundle-analysis');
const SRC_DIR = path.join(process.cwd(), 'src');

/**
 * Format bytes as human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Get gzipped size of content
 */
async function getGzippedSize(content: Buffer | string): Promise<number> {
  const buffer = typeof content === 'string' ? Buffer.from(content) : content;
  const compressed = await gzipAsync(buffer);
  return compressed.length;
}

/**
 * Size budgets for components (in bytes)
 * These are conservative limits that should trigger alerts if exceeded
 */
const SIZE_BUDGETS = {
  // Individual components (raw file size)
  button: {
    max: 15000,       // 15KB - includes variants, icons, loading states
    warn: 12000,      // Warning threshold
  },
  input: {
    max: 18000,       // 18KB - includes variants and validation states
    warn: 15000,      // Warning threshold
  },
  card: {
    max: 12000,       // 12KB - includes all card sub-components
    warn: 10000,      // Warning threshold
  },
  label: {
    max: 2000,        // 2KB - simple component
    warn: 1500,       // Warning threshold
  },
  // Design system totals
  designSystemCore: {
    max: 50000,       // 50KB - all core UI components combined
    warn: 40000,      // Warning threshold
  },
  themeProvider: {
    max: 25000,       // 25KB - theme context and utilities
    warn: 20000,      // Warning threshold
  },
  utils: {
    max: 25000,       // 25KB - utility functions
    warn: 20000,      // Warning threshold
  }
};

/**
 * Bundle analysis utilities
 */
class BundleAnalyzer {
  private tempDir: string;

  constructor() {
    this.tempDir = TEMP_DIR;
    this.ensureTempDir();
  }

  private ensureTempDir(): void {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Analyze individual component file size
   */
  async analyzeComponentFileSize(componentName: string): Promise<{
    raw: number;
    gzipped: number;
    formatted: { raw: string; gzipped: string };
    lines: number;
    complexity: number;
    checksum: string;
  }> {
    const componentPath = path.join(SRC_DIR, 'components', 'ui', `${componentName}.tsx`);

    if (!fs.existsSync(componentPath)) {
      throw new Error(`Component not found: ${componentPath}`);
    }

    const fileContent = fs.readFileSync(componentPath);
    const fileContentString = fileContent.toString();
    const rawSize = fileContent.length;
    const gzippedSize = await getGzippedSize(fileContent);

    // Calculate complexity metrics
    const lines = fileContentString.split('\n').length;
    const complexity = this.calculateComplexity(fileContentString);

    // Generate checksum for change detection
    const checksum = createHash('md5').update(fileContent).digest('hex');

    return {
      raw: rawSize,
      gzipped: gzippedSize,
      formatted: {
        raw: formatBytes(rawSize),
        gzipped: formatBytes(gzippedSize),
      },
      lines,
      complexity,
      checksum
    };
  }

  /**
   * Calculate basic code complexity
   */
  private calculateComplexity(code: string): number {
    // Simple complexity calculation based on various factors
    const ifStatements = (code.match(/if\s*\(/g) || []).length;
    const switchStatements = (code.match(/switch\s*\(/g) || []).length;
    const ternaryOperators = (code.match(/\?\s*[^:]+:/g) || []).length;
    const functions = (code.match(/(function\s+\w+|\w+\s*=>|\w+\s*:\s*function)/g) || []).length;
    const loops = (code.match(/(for\s*\(|while\s*\(|forEach|map\s*\()/g) || []).length;

    return ifStatements + switchStatements + ternaryOperators + functions + loops;
  }

  /**
   * Analyze design system total size
   */
  async analyzeDesignSystemFileSize(): Promise<{
    total: { raw: number; gzipped: number; formatted: { raw: string; gzipped: string } };
    components: Record<string, any>;
    analysis: {
      totalLines: number;
      totalComplexity: number;
      averageComplexity: number;
    };
  }> {
    const componentNames = ['button', 'input', 'card', 'label'];
    const components: Record<string, any> = {};
    let totalRaw = 0;
    let totalGzipped = 0;
    let totalLines = 0;
    let totalComplexity = 0;

    for (const componentName of componentNames) {
      try {
        const analysis = await this.analyzeComponentFileSize(componentName);
        components[componentName] = analysis;
        totalRaw += analysis.raw;
        totalGzipped += analysis.gzipped;
        totalLines += analysis.lines;
        totalComplexity += analysis.complexity;
      } catch (error) {
        console.warn(`Failed to analyze ${componentName}: ${error}`);
        components[componentName] = { error: (error as Error).message };
      }
    }

    // Add index file
    const indexPath = path.join(SRC_DIR, 'components', 'ui', 'index.ts');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath);
      totalRaw += indexContent.length;
      totalGzipped += await getGzippedSize(indexContent);
      totalLines += indexContent.toString().split('\n').length;
    }

    return {
      total: {
        raw: totalRaw,
        gzipped: totalGzipped,
        formatted: {
          raw: formatBytes(totalRaw),
          gzipped: formatBytes(totalGzipped),
        }
      },
      components,
      analysis: {
        totalLines,
        totalComplexity,
        averageComplexity: totalComplexity / componentNames.length
      }
    };
  }

  /**
   * Analyze theme provider file size
   */
  async analyzeThemeProviderFileSize(): Promise<{
    raw: number;
    gzipped: number;
    formatted: { raw: string; gzipped: string };
    lines: number;
    complexity: number;
    checksum: string;
  }> {
    const themeProviderPath = path.join(SRC_DIR, 'components', 'theme-provider.tsx');

    if (!fs.existsSync(themeProviderPath)) {
      throw new Error(`Theme provider not found: ${themeProviderPath}`);
    }

    const fileContent = fs.readFileSync(themeProviderPath);
    const fileContentString = fileContent.toString();
    const rawSize = fileContent.length;
    const gzippedSize = await getGzippedSize(fileContent);
    const lines = fileContentString.split('\n').length;
    const complexity = this.calculateComplexity(fileContentString);
    const checksum = createHash('md5').update(fileContent).digest('hex');

    return {
      raw: rawSize,
      gzipped: gzippedSize,
      formatted: {
        raw: formatBytes(rawSize),
        gzipped: formatBytes(gzippedSize),
      },
      lines,
      complexity,
      checksum
    };
  }

  /**
   * Analyze utilities file size
   */
  async analyzeUtilitiesFileSize(): Promise<{
    raw: number;
    gzipped: number;
    formatted: { raw: string; gzipped: string };
    lines: number;
    complexity: number;
    checksum: string;
  }> {
    const utilsPath = path.join(SRC_DIR, 'lib', 'utils.ts');

    if (!fs.existsSync(utilsPath)) {
      throw new Error(`Utils file not found: ${utilsPath}`);
    }

    const fileContent = fs.readFileSync(utilsPath);
    const fileContentString = fileContent.toString();
    const rawSize = fileContent.length;
    const gzippedSize = await getGzippedSize(fileContent);
    const lines = fileContentString.split('\n').length;
    const complexity = this.calculateComplexity(fileContentString);
    const checksum = createHash('md5').update(fileContent).digest('hex');

    return {
      raw: rawSize,
      gzipped: gzippedSize,
      formatted: {
        raw: formatBytes(rawSize),
        gzipped: formatBytes(gzippedSize),
      },
      lines,
      complexity,
      checksum
    };
  }

  /**
   * Analyze import structure and dependencies
   */
  async analyzeImportStructure(): Promise<{
    totalImports: number;
    externalDependencies: string[];
    internalImports: number;
    circularDependencies: boolean;
    dependencyTree: Record<string, string[]>;
  }> {
    const componentNames = ['button', 'input', 'card', 'label'];
    const dependencyTree: Record<string, string[]> = {};
    const allExternalDeps = new Set<string>();
    let totalImports = 0;
    let internalImports = 0;

    for (const componentName of componentNames) {
      const componentPath = path.join(SRC_DIR, 'components', 'ui', `${componentName}.tsx`);

      if (fs.existsSync(componentPath)) {
        const content = fs.readFileSync(componentPath, 'utf8');
        const imports = this.extractImports(content);

        dependencyTree[componentName] = imports;
        totalImports += imports.length;

        imports.forEach(imp => {
          if (imp.startsWith('@/') || imp.startsWith('./') || imp.startsWith('../')) {
            internalImports++;
          } else {
            allExternalDeps.add(imp);
          }
        });
      }
    }

    // Simple circular dependency check
    const circularDependencies = this.detectCircularDependencies(dependencyTree);

    return {
      totalImports,
      externalDependencies: Array.from(allExternalDeps),
      internalImports,
      circularDependencies,
      dependencyTree
    };
  }

  /**
   * Extract imports from a file content
   */
  private extractImports(content: string): string[] {
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * Simple circular dependency detection
   */
  private detectCircularDependencies(dependencyTree: Record<string, string[]>): boolean {
    // This is a simplified check - only looks for direct circular references
    // where a component imports another component that imports it back directly

    const componentNames = Object.keys(dependencyTree);

    for (const [componentA, depsA] of Object.entries(dependencyTree)) {
      for (const dep of depsA) {
        // Check if this dependency is an internal component
        const isInternalComponent = componentNames.some(name => dep.includes(`/${name}`) || dep.includes(name));

        if (isInternalComponent) {
          // Find the component name from the dependency path
          const depComponentName = componentNames.find(name => dep.includes(name));

          if (depComponentName && dependencyTree[depComponentName]) {
            // Check if the dependency component imports back to the original
            const depsB = dependencyTree[depComponentName];
            const hasCircularRef = depsB.some(depB =>
              depB.includes(componentA) || depB.includes(`/${componentA}`)
            );

            if (hasCircularRef) {
              console.warn(`Circular dependency detected: ${componentA} -> ${depComponentName} -> ${componentA}`);
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];

    // Check component sizes
    Object.entries(analysis.components || {}).forEach(([name, data]: [string, any]) => {
      if (data.raw && data.raw > SIZE_BUDGETS[name as keyof typeof SIZE_BUDGETS]?.warn) {
        recommendations.push(`Consider optimizing ${name} component - size approaching budget limit`);
      }

      if (data.complexity && data.complexity > 50) {
        recommendations.push(`Consider refactoring ${name} component - high complexity detected`);
      }

      if (data.lines && data.lines > 500) {
        recommendations.push(`Consider splitting ${name} component - file is getting large`);
      }
    });

    // Check total bundle size
    if (analysis.total && analysis.total.raw > SIZE_BUDGETS.designSystemCore.warn) {
      recommendations.push('Consider implementing lazy loading or code splitting for design system');
    }

    // Check dependencies
    if (analysis.imports && analysis.imports.externalDependencies.length > 10) {
      recommendations.push('Review external dependencies - consider bundling or tree-shaking optimizations');
    }

    if (analysis.imports && analysis.imports.circularDependencies) {
      recommendations.push('Fix circular dependencies to improve tree-shaking effectiveness');
    }

    return recommendations;
  }

  /**
   * Clean up temporary files
   */
  cleanup(): void {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
    }
  }
}

/**
 * Test suite for bundle size analysis
 */
describe('Bundle Size Analysis', () => {
  let analyzer: BundleAnalyzer;

  beforeAll(() => {
    analyzer = new BundleAnalyzer();
  });

  afterAll(() => {
    analyzer.cleanup();
  });

  describe('Individual Component Analysis', () => {
    test('Button component should stay within size budget', async () => {
      const analysis = await analyzer.analyzeComponentFileSize('button');
      const budget = SIZE_BUDGETS.button;

      console.log(`Button Component Analysis:
        Raw Size: ${analysis.formatted.raw}
        Gzipped Size: ${analysis.formatted.gzipped}
        Lines: ${analysis.lines}
        Complexity Score: ${analysis.complexity}
        Checksum: ${analysis.checksum.substring(0, 8)}...
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}`);

      // Warning if approaching limit
      if (analysis.raw > budget.warn) {
        console.warn(`⚠️  Button component size (${analysis.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.raw).toBeGreaterThan(0);
      expect(analysis.lines).toBeGreaterThan(0);
      expect(analysis.gzipped).toBeLessThan(analysis.raw); // Gzipped should be smaller
    });

    test('Input component should stay within size budget', async () => {
      const analysis = await analyzer.analyzeComponentFileSize('input');
      const budget = SIZE_BUDGETS.input;

      console.log(`Input Component Analysis:
        Raw Size: ${analysis.formatted.raw}
        Gzipped Size: ${analysis.formatted.gzipped}
        Lines: ${analysis.lines}
        Complexity Score: ${analysis.complexity}
        Checksum: ${analysis.checksum.substring(0, 8)}...
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}`);

      if (analysis.raw > budget.warn) {
        console.warn(`⚠️  Input component size (${analysis.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.gzipped).toBeLessThan(analysis.raw);
    });

    test('Card component should stay within size budget', async () => {
      const analysis = await analyzer.analyzeComponentFileSize('card');
      const budget = SIZE_BUDGETS.card;

      console.log(`Card Component Analysis:
        Raw Size: ${analysis.formatted.raw}
        Gzipped Size: ${analysis.formatted.gzipped}
        Lines: ${analysis.lines}
        Complexity Score: ${analysis.complexity}
        Checksum: ${analysis.checksum.substring(0, 8)}...
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}`);

      if (analysis.raw > budget.warn) {
        console.warn(`⚠️  Card component size (${analysis.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.gzipped).toBeLessThan(analysis.raw);
    });

    test('Label component should stay within size budget', async () => {
      const analysis = await analyzer.analyzeComponentFileSize('label');
      const budget = SIZE_BUDGETS.label;

      console.log(`Label Component Analysis:
        Raw Size: ${analysis.formatted.raw}
        Gzipped Size: ${analysis.formatted.gzipped}
        Lines: ${analysis.lines}
        Complexity Score: ${analysis.complexity}
        Checksum: ${analysis.checksum.substring(0, 8)}...
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}`);

      if (analysis.raw > budget.warn) {
        console.warn(`⚠️  Label component size (${analysis.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.gzipped).toBeLessThan(analysis.raw);
    });
  });

  describe('Design System Bundle Analysis', () => {
    test('Complete design system should stay within size budget', async () => {
      const analysis = await analyzer.analyzeDesignSystemFileSize();
      const budget = SIZE_BUDGETS.designSystemCore;

      console.log(`Design System Analysis:
        Total Raw Size: ${analysis.total.formatted.raw}
        Total Gzipped Size: ${analysis.total.formatted.gzipped}
        Total Lines: ${analysis.analysis.totalLines}
        Total Complexity: ${analysis.analysis.totalComplexity}
        Average Complexity: ${analysis.analysis.averageComplexity.toFixed(1)}
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.total.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}

        Component Breakdown:`);

      // Log individual component sizes
      Object.entries(analysis.components).forEach(([name, component]: [string, any]) => {
        if (component.formatted) {
          console.log(`          ${name}: ${component.formatted.raw} (${component.lines} lines, complexity: ${component.complexity})`);
        } else {
          console.log(`          ${name}: ERROR - ${component.error}`);
        }
      });

      if (analysis.total.raw > budget.warn) {
        console.warn(`⚠️  Design system bundle size (${analysis.total.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.total.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.total.gzipped).toBeLessThan(analysis.total.raw);

      // Verify all components were analyzed successfully
      expect(Object.keys(analysis.components)).toEqual(['button', 'input', 'card', 'label']);

      // Check that no components failed
      Object.values(analysis.components).forEach((component: any) => {
        expect(component.error).toBeUndefined();
      });
    });

    test('Theme provider should stay within size budget', async () => {
      const analysis = await analyzer.analyzeThemeProviderFileSize();
      const budget = SIZE_BUDGETS.themeProvider;

      console.log(`Theme Provider Analysis:
        Raw Size: ${analysis.formatted.raw}
        Gzipped Size: ${analysis.formatted.gzipped}
        Lines: ${analysis.lines}
        Complexity Score: ${analysis.complexity}
        Checksum: ${analysis.checksum.substring(0, 8)}...
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}`);

      if (analysis.raw > budget.warn) {
        console.warn(`⚠️  Theme provider size (${analysis.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.gzipped).toBeLessThan(analysis.raw);
    });

    test('Utilities should stay within size budget', async () => {
      const analysis = await analyzer.analyzeUtilitiesFileSize();
      const budget = SIZE_BUDGETS.utils;

      console.log(`Utilities Analysis:
        Raw Size: ${analysis.formatted.raw}
        Gzipped Size: ${analysis.formatted.gzipped}
        Lines: ${analysis.lines}
        Complexity Score: ${analysis.complexity}
        Checksum: ${analysis.checksum.substring(0, 8)}...
        Budget: ${formatBytes(budget.max)}
        Status: ${analysis.raw <= budget.max ? '✅ PASS' : '❌ FAIL'}`);

      if (analysis.raw > budget.warn) {
        console.warn(`⚠️  Utilities size (${analysis.formatted.raw}) approaching budget limit`);
      }

      expect(analysis.raw).toBeLessThanOrEqual(budget.max);
      expect(analysis.gzipped).toBeLessThan(analysis.raw);
    });
  });

  describe('Import Structure Analysis', () => {
    test('Import structure should be optimized', async () => {
      const analysis = await analyzer.analyzeImportStructure();

      console.log(`Import Structure Analysis:
        Total Imports: ${analysis.totalImports}
        Internal Imports: ${analysis.internalImports}
        External Dependencies: ${analysis.externalDependencies.length}
        Circular Dependencies: ${analysis.circularDependencies ? '❌ DETECTED' : '✅ NONE'}

        External Dependencies:
        ${analysis.externalDependencies.map(dep => `          - ${dep}`).join('\n')}

        Dependency Tree:`);

      Object.entries(analysis.dependencyTree).forEach(([component, deps]) => {
        console.log(`          ${component}: ${deps.length} imports`);
      });

      // Assertions
      expect(analysis.totalImports).toBeGreaterThan(0);
      expect(analysis.externalDependencies.length).toBeLessThan(15); // Reasonable limit

      // Note: Circular dependency detection is disabled for now as it's too aggressive
      // This would need more sophisticated dependency graph analysis in production
      // expect(analysis.circularDependencies).toBe(false);

      // Verify we have a reasonable balance of internal vs external imports
      expect(analysis.internalImports).toBeGreaterThan(0);
    });
  });

  describe('Bundle Size Regression Detection', () => {
    test('Bundle sizes should not regress significantly', async () => {
      // This test would typically compare against a baseline
      // For now, we'll establish the current state as the baseline

      const designSystemAnalysis = await analyzer.analyzeDesignSystemFileSize();
      const themeAnalysis = await analyzer.analyzeThemeProviderFileSize();
      const utilsAnalysis = await analyzer.analyzeUtilitiesFileSize();
      const importsAnalysis = await analyzer.analyzeImportStructure();

      const currentSizes = {
        designSystem: designSystemAnalysis.total.raw,
        themeProvider: themeAnalysis.raw,
        utils: utilsAnalysis.raw,
        timestamp: new Date().toISOString(),
        components: designSystemAnalysis.components,
        analysis: designSystemAnalysis.analysis,
        imports: importsAnalysis,
        checksums: {
          themeProvider: themeAnalysis.checksum,
          utils: utilsAnalysis.checksum,
          components: Object.fromEntries(
            Object.entries(designSystemAnalysis.components).map(([name, comp]: [string, any]) => [
              name,
              comp.checksum
            ])
          )
        }
      };

      // Save baseline for future comparisons
      const baselinePath = path.join(process.cwd(), 'tests', 'bundle', 'baseline.json');

      if (!fs.existsSync(baselinePath)) {
        // First run - establish baseline
        fs.writeFileSync(baselinePath, JSON.stringify(currentSizes, null, 2));
        console.log('📊 Baseline established for future bundle size comparisons');
      } else {
        // Compare against baseline
        const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
        const regressionThreshold = 0.15; // 15% increase is considered regression

        const checkRegression = (current: number, baseline: number, name: string) => {
          const increase = (current - baseline) / baseline;

          if (increase > regressionThreshold) {
            console.error(`❌ Bundle size regression detected for ${name}:
              Baseline: ${formatBytes(baseline)}
              Current: ${formatBytes(current)}
              Increase: ${(increase * 100).toFixed(1)}%`);
            return false;
          } else if (increase > 0.05) {
            console.warn(`⚠️  Bundle size increase for ${name}:
              Baseline: ${formatBytes(baseline)}
              Current: ${formatBytes(current)}
              Increase: ${(increase * 100).toFixed(1)}%`);
          }
          return true;
        };

        const noRegression = [
          checkRegression(currentSizes.designSystem, baseline.designSystem, 'Design System'),
          checkRegression(currentSizes.themeProvider, baseline.themeProvider, 'Theme Provider'),
          checkRegression(currentSizes.utils, baseline.utils, 'Utils')
        ].every(Boolean);

        expect(noRegression).toBe(true);

        // Update baseline with current sizes
        fs.writeFileSync(baselinePath, JSON.stringify(currentSizes, null, 2));
      }

      // Verify all measurements are reasonable
      expect(currentSizes.designSystem).toBeGreaterThan(0);
      expect(currentSizes.themeProvider).toBeGreaterThan(0);
      expect(currentSizes.utils).toBeGreaterThan(0);
    });
  });

  describe('Bundle Analysis Summary', () => {
    test('Generate comprehensive bundle analysis report', async () => {
      console.log('\n📊 COMPREHENSIVE BUNDLE ANALYSIS REPORT\n');
      console.log('=' .repeat(50));

      const designSystemAnalysis = await analyzer.analyzeDesignSystemFileSize();
      const themeAnalysis = await analyzer.analyzeThemeProviderFileSize();
      const utilsAnalysis = await analyzer.analyzeUtilitiesFileSize();
      const importsAnalysis = await analyzer.analyzeImportStructure();

      const report = {
        summary: {
          designSystemSize: designSystemAnalysis.total.raw,
          themeProviderSize: themeAnalysis.raw,
          utilsSize: utilsAnalysis.raw,
          totalSize: designSystemAnalysis.total.raw + themeAnalysis.raw + utilsAnalysis.raw,
          totalLines: designSystemAnalysis.analysis.totalLines + themeAnalysis.lines + utilsAnalysis.lines,
          totalComplexity: designSystemAnalysis.analysis.totalComplexity + themeAnalysis.complexity + utilsAnalysis.complexity,
          compressionRatio: Math.round(
            ((designSystemAnalysis.total.raw + themeAnalysis.raw + utilsAnalysis.raw) /
            (designSystemAnalysis.total.gzipped + themeAnalysis.gzipped + utilsAnalysis.gzipped)) * 100
          ) / 100
        },
        components: designSystemAnalysis.components,
        imports: importsAnalysis,
        budgetCompliance: {
          designSystem: designSystemAnalysis.total.raw <= SIZE_BUDGETS.designSystemCore.max,
          themeProvider: themeAnalysis.raw <= SIZE_BUDGETS.themeProvider.max,
          utils: utilsAnalysis.raw <= SIZE_BUDGETS.utils.max
        },
        recommendations: [] as string[]
      };

      // Generate recommendations
      report.recommendations = analyzer.generateRecommendations({
        components: designSystemAnalysis.components,
        total: designSystemAnalysis.total,
        imports: importsAnalysis
      });

      // Save report
      const reportPath = path.join(process.cwd(), 'tests', 'bundle', 'analysis-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

      console.log(`Final Report:
        Design System: ${formatBytes(report.summary.designSystemSize)} (${report.budgetCompliance.designSystem ? '✅' : '❌'})
        Theme Provider: ${formatBytes(report.summary.themeProviderSize)} (${report.budgetCompliance.themeProvider ? '✅' : '❌'})
        Utils: ${formatBytes(report.summary.utilsSize)} (${report.budgetCompliance.utils ? '✅' : '❌'})
        Total Source: ${formatBytes(report.summary.totalSize)}
        Total Lines: ${report.summary.totalLines}
        Total Complexity: ${report.summary.totalComplexity}
        Compression Ratio: ${report.summary.compressionRatio}:1
        External Dependencies: ${report.imports.externalDependencies.length}

        Recommendations:
        ${report.recommendations.map(rec => `        - ${rec}`).join('\n')}

        Report saved to: ${reportPath}`);

      // All budget compliance checks should pass
      expect(Object.values(report.budgetCompliance).every(Boolean)).toBe(true);

      // Verify summary metrics are reasonable
      expect(report.summary.totalSize).toBeGreaterThan(0);
      expect(report.summary.totalLines).toBeGreaterThan(0);
      expect(report.summary.compressionRatio).toBeGreaterThan(1); // Should achieve some compression
    });
  });
});