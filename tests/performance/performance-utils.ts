/**
 * Performance Testing Utilities
 *
 * Shared utilities for component performance testing including
 * measurement helpers, benchmark calculations, and reporting functions.
 */

import { performance, PerformanceObserver } from 'perf_hooks';

// ================================
// TYPE DEFINITIONS
// ================================

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentCount: number;
  timestamp: number;
  testName?: string;
}

export interface BenchmarkResults {
  average: number;
  min: number;
  max: number;
  median: number;
  p95: number;
  p99: number;
  samples: number;
  standardDeviation: number;
}

export interface PerformanceReport {
  testSuite: string;
  timestamp: string;
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    memoryTotal?: number;
  };
  results: BenchmarkResults[];
  thresholds: Record<string, number>;
  passed: boolean;
  failures: string[];
  recommendations: string[];
}

// ================================
// PERFORMANCE CONSTANTS
// ================================

export const PERFORMANCE_CATEGORIES = {
  RENDER: 'render',
  RE_RENDER: 're-render',
  MOUNT: 'mount',
  UNMOUNT: 'unmount',
  THEME_SWITCH: 'theme-switch',
  STRESS_TEST: 'stress-test',
} as const;

export const COMPONENT_TYPES = {
  BUTTON: 'button',
  INPUT: 'input',
  CARD: 'card',
  MIXED: 'mixed',
} as const;

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Calculate statistical benchmarks from performance times
 */
export function calculateBenchmarks(times: number[]): BenchmarkResults {
  if (times.length === 0) {
    throw new Error('Cannot calculate benchmarks for empty array');
  }

  const sorted = times.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const sum = times.reduce((a, b) => a + b, 0);
  const average = sum / length;

  // Calculate standard deviation
  const variance = times.reduce((acc, time) => acc + Math.pow(time - average, 2), 0) / length;
  const standardDeviation = Math.sqrt(variance);

  return {
    average,
    min: sorted[0],
    max: sorted[length - 1],
    median: length % 2 === 0
      ? (sorted[length / 2 - 1] + sorted[length / 2]) / 2
      : sorted[Math.floor(length / 2)],
    p95: sorted[Math.floor(length * 0.95)],
    p99: sorted[Math.floor(length * 0.99)],
    samples: length,
    standardDeviation,
  };
}

/**
 * Get current memory usage in MB
 */
export function getMemoryUsage(): number {
  if (process.memoryUsage) {
    const usage = process.memoryUsage();
    return usage.heapUsed / 1024 / 1024; // Convert to MB
  }
  return 0;
}

/**
 * Force garbage collection if available
 */
export function forceGarbageCollection(): void {
  if (global.gc) {
    global.gc();
  }
}

/**
 * Create a performance observer for measuring render times
 */
export function createPerformanceObserver(
  onMeasurement: (metrics: PerformanceMetrics) => void
): PerformanceObserver {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.name.includes('component-render')) {
        onMeasurement({
          renderTime: entry.duration,
          componentCount: 1,
          timestamp: entry.startTime,
          testName: entry.name,
        });
      }
    });
  });

  observer.observe({ entryTypes: ['measure'] });
  return observer;
}

/**
 * Format performance time for display
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds < 1) {
    return `${(milliseconds * 1000).toFixed(0)}μs`;
  } else if (milliseconds < 1000) {
    return `${milliseconds.toFixed(2)}ms`;
  } else {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  }
}

/**
 * Format memory usage for display
 */
export function formatMemory(megabytes: number): string {
  if (megabytes < 1) {
    return `${(megabytes * 1024).toFixed(0)}KB`;
  } else if (megabytes < 1024) {
    return `${megabytes.toFixed(2)}MB`;
  } else {
    return `${(megabytes / 1024).toFixed(2)}GB`;
  }
}

/**
 * Check if performance meets thresholds
 */
export function validatePerformance(
  benchmark: BenchmarkResults,
  thresholds: {
    average?: number;
    p95?: number;
    p99?: number;
    max?: number;
  }
): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  if (thresholds.average && benchmark.average > thresholds.average) {
    failures.push(`Average time ${formatTime(benchmark.average)} exceeds threshold ${formatTime(thresholds.average)}`);
  }

  if (thresholds.p95 && benchmark.p95 > thresholds.p95) {
    failures.push(`P95 time ${formatTime(benchmark.p95)} exceeds threshold ${formatTime(thresholds.p95)}`);
  }

  if (thresholds.p99 && benchmark.p99 > thresholds.p99) {
    failures.push(`P99 time ${formatTime(benchmark.p99)} exceeds threshold ${formatTime(thresholds.p99)}`);
  }

  if (thresholds.max && benchmark.max > thresholds.max) {
    failures.push(`Max time ${formatTime(benchmark.max)} exceeds threshold ${formatTime(thresholds.max)}`);
  }

  return {
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Generate performance recommendations based on results
 */
export function generateRecommendations(
  benchmarks: BenchmarkResults[],
  thresholds: Record<string, number>
): string[] {
  const recommendations: string[] = [];

  // Analyze average performance
  const averageTime = benchmarks.reduce((sum, b) => sum + b.average, 0) / benchmarks.length;

  if (averageTime > 10) {
    recommendations.push('Consider optimizing component render performance with React.memo or useMemo');
  }

  if (averageTime > 50) {
    recommendations.push('Implement code splitting to reduce initial bundle size');
  }

  // Check for high variance
  const highVariance = benchmarks.some(b => b.standardDeviation > b.average * 0.5);
  if (highVariance) {
    recommendations.push('High performance variance detected - investigate inconsistent render times');
  }

  // Check P95 vs average ratio
  const highP95Ratio = benchmarks.some(b => b.p95 > b.average * 3);
  if (highP95Ratio) {
    recommendations.push('P95 times are significantly higher than average - check for performance outliers');
  }

  // Memory recommendations
  const memoryMetrics = benchmarks.filter(b => b.samples > 0);
  if (memoryMetrics.length > 0) {
    recommendations.push('Monitor memory usage in production environments');
    recommendations.push('Consider implementing component virtualization for large lists');
  }

  // General recommendations
  recommendations.push(
    'Set up continuous performance monitoring in CI/CD pipeline',
    'Profile components in production-like environments',
    'Use React Developer Tools Profiler for detailed performance analysis'
  );

  return recommendations;
}

/**
 * Create a performance report
 */
export function createPerformanceReport(
  testSuite: string,
  benchmarks: BenchmarkResults[],
  thresholds: Record<string, number>
): PerformanceReport {
  const validation = benchmarks.map((benchmark, index) =>
    validatePerformance(benchmark, {
      average: Object.values(thresholds)[index] || 10,
    })
  );

  const passed = validation.every(v => v.passed);
  const failures = validation.flatMap(v => v.failures);

  return {
    testSuite,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryTotal: process.memoryUsage ? process.memoryUsage().rss / 1024 / 1024 : undefined,
    },
    results: benchmarks,
    thresholds,
    passed,
    failures,
    recommendations: generateRecommendations(benchmarks, thresholds),
  };
}

/**
 * Wait for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Warm up the test environment with dummy renders
 */
export async function warmupEnvironment(warmupCount: number = 5): Promise<void> {
  for (let i = 0; i < warmupCount; i++) {
    performance.mark(`warmup-${i}-start`);
    await delay(1); // Small delay to simulate work
    performance.mark(`warmup-${i}-end`);
    performance.measure(`warmup-${i}`, `warmup-${i}-start`, `warmup-${i}-end`);
  }

  // Clear warmup marks
  performance.clearMarks();
  performance.clearMeasures();
}

/**
 * Run a performance test with multiple samples
 */
export async function runPerformanceTest(
  testName: string,
  testFn: () => Promise<number> | number,
  sampleCount: number = 10
): Promise<BenchmarkResults> {
  const times: number[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const startTime = performance.now();
    await testFn();
    const endTime = performance.now();
    times.push(endTime - startTime);

    // Small delay between tests to avoid interference
    await delay(10);
  }

  return calculateBenchmarks(times);
}

/**
 * Class-based performance tester for more complex scenarios
 */
export class AdvancedPerformanceTester {
  private metrics: PerformanceMetrics[] = [];
  private observer?: PerformanceObserver;
  private startMemory: number = 0;

  constructor() {
    this.reset();
  }

  /**
   * Start performance measurement session
   */
  start(): void {
    this.reset();
    this.startMemory = getMemoryUsage();

    this.observer = createPerformanceObserver((metrics) => {
      this.metrics.push({
        ...metrics,
        memoryUsage: getMemoryUsage() - this.startMemory,
      });
    });
  }

  /**
   * Stop performance measurement session
   */
  stop(): PerformanceMetrics[] {
    if (this.observer) {
      this.observer.disconnect();
    }
    return this.metrics;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Reset all measurements
   */
  reset(): void {
    this.metrics = [];
    if (this.observer) {
      this.observer.disconnect();
    }
    performance.clearMarks();
    performance.clearMeasures();
    forceGarbageCollection();
  }

  /**
   * Add manual measurement
   */
  recordMeasurement(name: string, time: number, componentCount: number = 1): void {
    this.metrics.push({
      renderTime: time,
      componentCount,
      timestamp: performance.now(),
      testName: name,
      memoryUsage: getMemoryUsage() - this.startMemory,
    });
  }

  /**
   * Calculate benchmarks for all recorded measurements
   */
  calculateBenchmarks(): BenchmarkResults {
    const times = this.metrics.map(m => m.renderTime);
    return calculateBenchmarks(times);
  }
}

// ================================
// EXPORTS
// ================================

export default {
  calculateBenchmarks,
  getMemoryUsage,
  forceGarbageCollection,
  createPerformanceObserver,
  formatTime,
  formatMemory,
  validatePerformance,
  generateRecommendations,
  createPerformanceReport,
  delay,
  warmupEnvironment,
  runPerformanceTest,
  AdvancedPerformanceTester,
  PERFORMANCE_CATEGORIES,
  COMPONENT_TYPES,
};