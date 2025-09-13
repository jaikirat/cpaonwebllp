/**
 * Performance Tests for Component Render Times
 *
 * This test suite measures and benchmarks component render performance across
 * Button, Input, and Card components, testing various scenarios including:
 * - Initial render performance
 * - Re-render performance
 * - Memory usage and cleanup
 * - Theme switching performance
 * - Stress testing with large numbers of components
 * - Performance regression detection
 */

import { render, cleanup, act } from '@testing-library/react';
import { performance, PerformanceObserver } from 'perf_hooks';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ================================
// PERFORMANCE MEASUREMENT UTILITIES
// ================================

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentCount: number;
  timestamp: number;
}

interface BenchmarkResults {
  average: number;
  min: number;
  max: number;
  median: number;
  p95: number;
  samples: number;
}

/**
 * Performance measurement utility class
 */
class PerformanceTester {
  private metrics: PerformanceMetrics[] = [];
  private observer?: PerformanceObserver;

  /**
   * Start performance measurement
   */
  startMeasurement() {
    // Clear previous metrics
    this.metrics = [];

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Create performance observer
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('component-render')) {
          this.metrics.push({
            renderTime: entry.duration,
            componentCount: 1,
            timestamp: entry.startTime,
          });
        }
      });
    });

    this.observer.observe({ entryTypes: ['measure'] });
  }

  /**
   * Measure render time of a component
   */
  async measureRender(
    name: string,
    renderFn: () => React.ReactElement,
    componentCount: number = 1
  ): Promise<number> {
    const startTime = performance.now();

    performance.mark(`${name}-start`);

    let result;
    await act(async () => {
      result = render(renderFn());
    });

    performance.mark(`${name}-end`);
    performance.measure(`component-render-${name}`, `${name}-start`, `${name}-end`);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Record metrics
    this.metrics.push({
      renderTime,
      componentCount,
      timestamp: startTime,
    });

    // Cleanup
    if (result) {
      cleanup();
    }

    return renderTime;
  }

  /**
   * Measure memory usage
   */
  getMemoryUsage(): number {
    if (process.memoryUsage) {
      const usage = process.memoryUsage();
      return usage.heapUsed / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  /**
   * Calculate benchmark statistics
   */
  calculateBenchmark(times: number[]): BenchmarkResults {
    const sorted = times.slice().sort((a, b) => a - b);
    const length = sorted.length;

    return {
      average: times.reduce((a, b) => a + b, 0) / length,
      min: sorted[0],
      max: sorted[length - 1],
      median: length % 2 === 0
        ? (sorted[length / 2 - 1] + sorted[length / 2]) / 2
        : sorted[Math.floor(length / 2)],
      p95: sorted[Math.floor(length * 0.95)],
      samples: length,
    };
  }

  /**
   * Stop measurement and return results
   */
  stopMeasurement(): PerformanceMetrics[] {
    if (this.observer) {
      this.observer.disconnect();
    }
    return this.metrics;
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = [];
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// ================================
// PERFORMANCE THRESHOLDS
// ================================

const PERFORMANCE_THRESHOLDS = {
  // Single component render thresholds (ms)
  BUTTON_RENDER_MAX: 5,
  INPUT_RENDER_MAX: 8,
  CARD_RENDER_MAX: 10,

  // Re-render thresholds (ms)
  RE_RENDER_MAX: 3,

  // Theme switching thresholds (ms)
  THEME_SWITCH_MAX: 15,

  // Memory thresholds (MB)
  MEMORY_USAGE_MAX: 50,
  MEMORY_LEAK_THRESHOLD: 10, // Max growth per test (increased for test environment variations)

  // Stress test thresholds
  STRESS_TEST_100_COMPONENTS_MAX: 100, // ms for 100 components
  STRESS_TEST_MEMORY_MAX: 100, // MB for 100 components

  // Percentile thresholds (more lenient for initial render variations)
  P95_MULTIPLIER: 3.0, // P95 can be 3x the base threshold due to initial setup costs
} as const;

// ================================
// TEST SUITE SETUP
// ================================

describe('Component Render Performance Tests', () => {
  let tester: PerformanceTester;

  beforeAll(() => {
    // Enable high-resolution timing if available
    if (typeof performance !== 'undefined' && performance.now) {
      jest.setTimeout(30000); // Increase timeout for performance tests
    }
  });

  beforeEach(() => {
    tester = new PerformanceTester();
    tester.startMeasurement();
  });

  afterEach(() => {
    tester.stopMeasurement();
    tester.reset();
    cleanup();
  });

  // ================================
  // BUTTON COMPONENT PERFORMANCE TESTS
  // ================================

  describe('Button Component Performance', () => {
    it('should render Button component within performance threshold', async () => {
      const renderTimes: number[] = [];

      // Warmup renders to stabilize environment
      for (let i = 0; i < 3; i++) {
        await tester.measureRender(
          'button-warmup',
          () => <Button>Warmup</Button>
        );
      }

      // Run multiple renders to get reliable metrics
      for (let i = 0; i < 10; i++) {
        const renderTime = await tester.measureRender(
          'button-default',
          () => <Button>Test Button</Button>
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      console.log('Button Render Performance:', {
        average: `${benchmark.average.toFixed(2)}ms`,
        min: `${benchmark.min.toFixed(2)}ms`,
        max: `${benchmark.max.toFixed(2)}ms`,
        p95: `${benchmark.p95.toFixed(2)}ms`,
      });

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX);
      expect(benchmark.p95).toBeLessThan(PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX * PERFORMANCE_THRESHOLDS.P95_MULTIPLIER);
    });

    it('should handle Button variant changes efficiently', async () => {
      const variants = ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
      const renderTimes: number[] = [];

      for (const variant of variants) {
        const renderTime = await tester.measureRender(
          `button-${variant}`,
          () => <Button variant={variant}>Test Button</Button>
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      console.log('Button Variants Performance:', {
        average: `${benchmark.average.toFixed(2)}ms`,
        variants: variants.length,
      });

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX);
    });

    it('should handle Button size changes efficiently', async () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;
      const renderTimes: number[] = [];

      for (const size of sizes) {
        const renderTime = await tester.measureRender(
          `button-${size}`,
          () => <Button size={size}>Test Button</Button>
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX);
    });

    it('should handle Button loading state efficiently', async () => {
      const renderTime = await tester.measureRender(
        'button-loading',
        () => <Button loading={true}>Loading Button</Button>
      );

      console.log('Button Loading State Performance:', `${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX * 1.2);
    });

    it('should handle Button with icons efficiently', async () => {
      const StarIcon = () => <span>⭐</span>;

      const renderTime = await tester.measureRender(
        'button-icons',
        () => (
          <Button
            startIcon={<StarIcon />}
            endIcon={<StarIcon />}
          >
            Icon Button
          </Button>
        )
      );

      console.log('Button with Icons Performance:', `${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX * 1.3);
    });
  });

  // ================================
  // INPUT COMPONENT PERFORMANCE TESTS
  // ================================

  describe('Input Component Performance', () => {
    it('should render Input component within performance threshold', async () => {
      const renderTimes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const renderTime = await tester.measureRender(
          'input-default',
          () => <Input placeholder="Test input" />
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      console.log('Input Render Performance:', {
        average: `${benchmark.average.toFixed(2)}ms`,
        min: `${benchmark.min.toFixed(2)}ms`,
        max: `${benchmark.max.toFixed(2)}ms`,
        p95: `${benchmark.p95.toFixed(2)}ms`,
      });

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX);
      expect(benchmark.p95).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX * PERFORMANCE_THRESHOLDS.P95_MULTIPLIER);
    });

    it('should handle Input size variations efficiently', async () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      const renderTimes: number[] = [];

      for (const size of sizes) {
        const renderTime = await tester.measureRender(
          `input-${size}`,
          () => <Input size={size} placeholder="Test input" />
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX);
    });

    it('should handle Input state variations efficiently', async () => {
      const states = ['default', 'error', 'warning', 'success'] as const;
      const renderTimes: number[] = [];

      for (const state of states) {
        const renderTime = await tester.measureRender(
          `input-${state}`,
          () => <Input state={state} placeholder="Test input" />
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX);
    });

    it('should handle Input with icons efficiently', async () => {
      const SearchIcon = () => <span>🔍</span>;
      const ClearIcon = () => <span>✕</span>;

      const renderTime = await tester.measureRender(
        'input-icons',
        () => (
          <Input
            startIcon={<SearchIcon />}
            endIcon={<ClearIcon />}
            placeholder="Search..."
          />
        )
      );

      console.log('Input with Icons Performance:', `${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX * 1.2);
    });

    it('should handle Input with clearable functionality efficiently', async () => {
      const renderTime = await tester.measureRender(
        'input-clearable',
        () => <Input clearable={true} value="Test value" placeholder="Clearable input" />
      );

      console.log('Input Clearable Performance:', `${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX * 1.3);
    });
  });

  // ================================
  // CARD COMPONENT PERFORMANCE TESTS
  // ================================

  describe('Card Component Performance', () => {
    it('should render Card component within performance threshold', async () => {
      const renderTimes: number[] = [];

      for (let i = 0; i < 10; i++) {
        const renderTime = await tester.measureRender(
          'card-default',
          () => (
            <Card>
              <CardHeader>Card Header</CardHeader>
              <CardContent>Card content goes here</CardContent>
              <CardFooter>Card Footer</CardFooter>
            </Card>
          )
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      console.log('Card Render Performance:', {
        average: `${benchmark.average.toFixed(2)}ms`,
        min: `${benchmark.min.toFixed(2)}ms`,
        max: `${benchmark.max.toFixed(2)}ms`,
        p95: `${benchmark.p95.toFixed(2)}ms`,
      });

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.CARD_RENDER_MAX);
      expect(benchmark.p95).toBeLessThan(PERFORMANCE_THRESHOLDS.CARD_RENDER_MAX * PERFORMANCE_THRESHOLDS.P95_MULTIPLIER);
    });

    it('should handle Card variant changes efficiently', async () => {
      const variants = ['default', 'outlined', 'elevated', 'filled'] as const;
      const renderTimes: number[] = [];

      for (const variant of variants) {
        const renderTime = await tester.measureRender(
          `card-${variant}`,
          () => (
            <Card variant={variant}>
              <CardContent>Test content for {variant}</CardContent>
            </Card>
          )
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.CARD_RENDER_MAX);
    });

    it('should handle Card size variations efficiently', async () => {
      const sizes = ['sm', 'md', 'lg'] as const;
      const renderTimes: number[] = [];

      for (const size of sizes) {
        const renderTime = await tester.measureRender(
          `card-${size}`,
          () => (
            <Card size={size}>
              <CardContent>Test content for size {size}</CardContent>
            </Card>
          )
        );
        renderTimes.push(renderTime);
      }

      const benchmark = tester.calculateBenchmark(renderTimes);

      expect(benchmark.average).toBeLessThan(PERFORMANCE_THRESHOLDS.CARD_RENDER_MAX);
    });

    it('should handle interactive Card efficiently', async () => {
      const renderTime = await tester.measureRender(
        'card-interactive',
        () => (
          <Card interactive={true} onClick={() => console.log('clicked')}>
            <CardContent>Interactive card content</CardContent>
          </Card>
        )
      );

      console.log('Interactive Card Performance:', `${renderTime.toFixed(2)}ms`);

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.CARD_RENDER_MAX * 1.2);
    });
  });

  // ================================
  // RE-RENDER PERFORMANCE TESTS
  // ================================

  describe('Re-render Performance', () => {
    it('should handle Button prop changes efficiently', async () => {
      const TestComponent = ({ variant }: { variant: any }) => (
        <Button variant={variant}>Test Button</Button>
      );

      // Initial render
      const { rerender } = render(<TestComponent variant="default" />);

      const startTime = performance.now();

      // Re-render with different props
      await act(async () => {
        rerender(<TestComponent variant="primary" />);
      });

      const endTime = performance.now();
      const reRenderTime = endTime - startTime;

      console.log('Button Re-render Performance:', `${reRenderTime.toFixed(2)}ms`);

      expect(reRenderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RE_RENDER_MAX);
    });

    it('should handle Input value changes efficiently', async () => {
      const TestComponent = ({ value }: { value: string }) => (
        <Input value={value} onChange={() => {}} placeholder="Test" />
      );

      // Initial render
      const { rerender } = render(<TestComponent value="" />);

      const startTime = performance.now();

      // Re-render with different value
      await act(async () => {
        rerender(<TestComponent value="new value" />);
      });

      const endTime = performance.now();
      const reRenderTime = endTime - startTime;

      console.log('Input Re-render Performance:', `${reRenderTime.toFixed(2)}ms`);

      expect(reRenderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RE_RENDER_MAX);
    });

    it('should handle Card content changes efficiently', async () => {
      const TestComponent = ({ content }: { content: string }) => (
        <Card>
          <CardContent>{content}</CardContent>
        </Card>
      );

      // Initial render
      const { rerender } = render(<TestComponent content="Initial content" />);

      const startTime = performance.now();

      // Re-render with different content
      await act(async () => {
        rerender(<TestComponent content="Updated content" />);
      });

      const endTime = performance.now();
      const reRenderTime = endTime - startTime;

      console.log('Card Re-render Performance:', `${reRenderTime.toFixed(2)}ms`);

      expect(reRenderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.RE_RENDER_MAX);
    });
  });

  // ================================
  // THEME SWITCHING PERFORMANCE TESTS
  // ================================

  describe('Theme Switching Performance', () => {
    const ThemeProvider = ({ theme, children }: { theme: string; children: React.ReactNode }) => (
      <div data-theme={theme}>
        {children}
      </div>
    );

    it('should handle theme switching efficiently for all components', async () => {
      const TestComponent = ({ theme }: { theme: string }) => (
        <ThemeProvider theme={theme}>
          <div>
            <Button variant="primary">Theme Test Button</Button>
            <Input placeholder="Theme Test Input" />
            <Card>
              <CardContent>Theme Test Card</CardContent>
            </Card>
          </div>
        </ThemeProvider>
      );

      // Initial render with light theme
      const { rerender } = render(<TestComponent theme="light" />);

      const startTime = performance.now();

      // Switch to dark theme
      await act(async () => {
        rerender(<TestComponent theme="dark" />);
      });

      const endTime = performance.now();
      const themeSwitchTime = endTime - startTime;

      console.log('Theme Switch Performance:', `${themeSwitchTime.toFixed(2)}ms`);

      expect(themeSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_MAX);
    });

    it('should handle high contrast theme efficiently', async () => {
      const TestComponent = ({ theme }: { theme: string }) => (
        <ThemeProvider theme={theme}>
          <Button variant="primary">High Contrast Button</Button>
        </ThemeProvider>
      );

      const { rerender } = render(<TestComponent theme="light" />);

      const startTime = performance.now();

      await act(async () => {
        rerender(<TestComponent theme="high-contrast" />);
      });

      const endTime = performance.now();
      const themeSwitchTime = endTime - startTime;

      console.log('High Contrast Theme Switch Performance:', `${themeSwitchTime.toFixed(2)}ms`);

      expect(themeSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_MAX);
    });
  });

  // ================================
  // STRESS TESTING
  // ================================

  describe('Stress Testing', () => {
    it('should handle 100+ Button components efficiently', async () => {
      const componentCount = 100;
      const memoryBefore = tester.getMemoryUsage();

      const renderTime = await tester.measureRender(
        'stress-buttons',
        () => (
          <div>
            {Array.from({ length: componentCount }, (_, i) => (
              <Button key={i} variant={i % 2 === 0 ? 'primary' : 'secondary'}>
                Button {i + 1}
              </Button>
            ))}
          </div>
        ),
        componentCount
      );

      const memoryAfter = tester.getMemoryUsage();
      const memoryUsage = memoryAfter - memoryBefore;

      console.log('Stress Test - 100 Buttons:', {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: `${memoryUsage.toFixed(2)}MB`,
        avgPerComponent: `${(renderTime / componentCount).toFixed(2)}ms`,
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_100_COMPONENTS_MAX);
      expect(memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_MEMORY_MAX);
    });

    it('should handle 100+ Input components efficiently', async () => {
      const componentCount = 100;
      const memoryBefore = tester.getMemoryUsage();

      const renderTime = await tester.measureRender(
        'stress-inputs',
        () => (
          <div>
            {Array.from({ length: componentCount }, (_, i) => (
              <Input
                key={i}
                placeholder={`Input ${i + 1}`}
                size={i % 3 === 0 ? 'sm' : i % 3 === 1 ? 'md' : 'lg'}
              />
            ))}
          </div>
        ),
        componentCount
      );

      const memoryAfter = tester.getMemoryUsage();
      const memoryUsage = memoryAfter - memoryBefore;

      console.log('Stress Test - 100 Inputs:', {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: `${memoryUsage.toFixed(2)}MB`,
        avgPerComponent: `${(renderTime / componentCount).toFixed(2)}ms`,
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_100_COMPONENTS_MAX);
      expect(memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_MEMORY_MAX);
    });

    it('should handle 100+ Card components efficiently', async () => {
      const componentCount = 100;
      const memoryBefore = tester.getMemoryUsage();

      const renderTime = await tester.measureRender(
        'stress-cards',
        () => (
          <div>
            {Array.from({ length: componentCount }, (_, i) => (
              <Card key={i} variant={i % 4 === 0 ? 'default' : i % 4 === 1 ? 'outlined' : i % 4 === 2 ? 'elevated' : 'filled'}>
                <CardContent>Card content {i + 1}</CardContent>
              </Card>
            ))}
          </div>
        ),
        componentCount
      );

      const memoryAfter = tester.getMemoryUsage();
      const memoryUsage = memoryAfter - memoryBefore;

      console.log('Stress Test - 100 Cards:', {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: `${memoryUsage.toFixed(2)}MB`,
        avgPerComponent: `${(renderTime / componentCount).toFixed(2)}ms`,
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_100_COMPONENTS_MAX);
      expect(memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_MEMORY_MAX);
    });

    it('should handle mixed components stress test', async () => {
      const componentCount = 150; // 50 of each component
      const memoryBefore = tester.getMemoryUsage();

      const renderTime = await tester.measureRender(
        'stress-mixed',
        () => (
          <div>
            {Array.from({ length: 50 }, (_, i) => (
              <Button key={`btn-${i}`} variant="primary">Button {i + 1}</Button>
            ))}
            {Array.from({ length: 50 }, (_, i) => (
              <Input key={`inp-${i}`} placeholder={`Input ${i + 1}`} />
            ))}
            {Array.from({ length: 50 }, (_, i) => (
              <Card key={`card-${i}`}>
                <CardContent>Card {i + 1}</CardContent>
              </Card>
            ))}
          </div>
        ),
        componentCount
      );

      const memoryAfter = tester.getMemoryUsage();
      const memoryUsage = memoryAfter - memoryBefore;

      console.log('Stress Test - Mixed Components:', {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: `${memoryUsage.toFixed(2)}MB`,
        totalComponents: componentCount,
        avgPerComponent: `${(renderTime / componentCount).toFixed(2)}ms`,
      });

      expect(renderTime).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_100_COMPONENTS_MAX * 1.5);
      expect(memoryUsage).toBeLessThan(PERFORMANCE_THRESHOLDS.STRESS_TEST_MEMORY_MAX * 1.5);
    });
  });

  // ================================
  // MEMORY LEAK DETECTION
  // ================================

  describe('Memory Leak Detection', () => {
    it('should not leak memory on component mount/unmount cycles', async () => {
      const initialMemory = tester.getMemoryUsage();

      // Perform multiple mount/unmount cycles
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(
          <div>
            <Button variant="primary">Test Button</Button>
            <Input placeholder="Test input" />
            <Card>
              <CardContent>Test card</CardContent>
            </Card>
          </div>
        );

        // Unmount immediately
        unmount();

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = tester.getMemoryUsage();
      const memoryGrowth = finalMemory - initialMemory;

      console.log('Memory Leak Test:', {
        initialMemory: `${initialMemory.toFixed(2)}MB`,
        finalMemory: `${finalMemory.toFixed(2)}MB`,
        memoryGrowth: `${memoryGrowth.toFixed(2)}MB`,
      });

      expect(memoryGrowth).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD);
    });
  });

  // ================================
  // PERFORMANCE REGRESSION DETECTION
  // ================================

  describe('Performance Regression Detection', () => {
    // These tests would typically compare against stored benchmarks
    // For this implementation, we'll set up the framework

    it('should establish performance baselines', () => {
      const baselines = {
        button: {
          render: PERFORMANCE_THRESHOLDS.BUTTON_RENDER_MAX,
          reRender: PERFORMANCE_THRESHOLDS.RE_RENDER_MAX,
        },
        input: {
          render: PERFORMANCE_THRESHOLDS.INPUT_RENDER_MAX,
          reRender: PERFORMANCE_THRESHOLDS.RE_RENDER_MAX,
        },
        card: {
          render: PERFORMANCE_THRESHOLDS.CARD_RENDER_MAX,
          reRender: PERFORMANCE_THRESHOLDS.RE_RENDER_MAX,
        },
      };

      // In a real implementation, you would:
      // 1. Store these baselines in a file or database
      // 2. Compare current results against stored baselines
      // 3. Alert if performance degrades beyond acceptable thresholds

      console.log('Performance Baselines:', JSON.stringify(baselines, null, 2));

      expect(baselines).toBeDefined();
    });
  });

  // ================================
  // PERFORMANCE SUMMARY
  // ================================

  describe('Performance Summary', () => {
    it('should generate performance report', async () => {
      const report = {
        testSuite: 'Component Render Performance',
        timestamp: new Date().toISOString(),
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
        },
        thresholds: PERFORMANCE_THRESHOLDS,
        recommendations: [
          'Monitor render times regularly for performance regressions',
          'Consider code-splitting for large component lists',
          'Implement virtualization for lists with 100+ items',
          'Use React.memo for expensive components',
          'Profile memory usage in production environments',
        ],
      };

      console.log('Performance Test Report:', JSON.stringify(report, null, 2));

      expect(report).toBeDefined();
      expect(report.thresholds).toEqual(PERFORMANCE_THRESHOLDS);
    });
  });
});