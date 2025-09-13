# Component Performance Tests

This directory contains comprehensive performance tests for measuring and benchmarking component render times across the Button, Input, and Card components.

## Overview

The performance test suite measures:

- **Initial render performance** - Time to render components from scratch
- **Re-render performance** - Time to update components when props change
- **Memory usage** - Memory allocation and cleanup
- **Theme switching performance** - Performance impact of theme changes
- **Stress testing** - Performance with large numbers of component instances (100+)
- **Performance regression detection** - Automated threshold validation

## Files

### `render-performance.test.tsx`
Main performance test suite with comprehensive component benchmarks.

**Test Categories:**
- Button Component Performance
- Input Component Performance
- Card Component Performance
- Re-render Performance
- Theme Switching Performance
- Stress Testing (100+ components)
- Memory Leak Detection
- Performance Regression Detection

### `performance-utils.ts`
Utility functions and classes for performance measurement:
- `PerformanceTester` - Main testing class with render measurement
- `calculateBenchmarks()` - Statistical analysis of performance data
- `validatePerformance()` - Threshold validation
- `createPerformanceReport()` - Report generation

## Performance Thresholds

| Component | Render Time | Re-render Time | Notes |
|-----------|-------------|----------------|--------|
| Button    | < 5ms       | < 3ms          | Average across variants |
| Input     | < 8ms       | < 3ms          | Includes complex states |
| Card      | < 10ms      | < 3ms          | With all subcomponents |

**Additional Thresholds:**
- Theme switching: < 15ms
- Stress test (100 components): < 100ms
- Memory leak threshold: < 10MB growth
- P95 times: < 3x average threshold

## Running Performance Tests

```bash
# Run all performance tests
npm test tests/performance/

# Run specific performance test
npm test tests/performance/render-performance.test.tsx

# Run with verbose output
npm test tests/performance/ -- --verbose

# Generate coverage report
npm run test:coverage tests/performance/
```

## Understanding Results

### Benchmark Metrics

```typescript
interface BenchmarkResults {
  average: number;        // Average render time
  min: number;           // Fastest render
  max: number;           // Slowest render
  median: number;        // Middle value
  p95: number;          // 95th percentile
  samples: number;      // Number of test runs
}
```

### Performance Categories

- **Render Performance**: Initial component mounting
- **Re-render Performance**: Component updates with prop changes
- **Memory Performance**: Memory allocation and garbage collection
- **Stress Performance**: Behavior under load (100+ components)

### Sample Output

```
Button Render Performance: {
  average: '3.86ms',
  min: '1.05ms',
  max: '23.25ms',
  p95: '15.42ms'
}

Stress Test - 100 Buttons: {
  renderTime: '25.53ms',
  memoryUsage: '7.15MB',
  avgPerComponent: '0.26ms'
}
```

## Performance Optimization Guidelines

### When Performance Tests Fail

1. **High Average Times**
   - Check for unnecessary re-renders
   - Consider `React.memo` for expensive components
   - Profile component tree depth

2. **High P95 Times**
   - Often caused by initial render setup costs
   - Environment warming can help
   - Check for memory pressure

3. **Memory Leaks**
   - Ensure proper component cleanup
   - Check event listener removal
   - Validate ref cleanup

4. **Stress Test Failures**
   - Implement component virtualization
   - Consider code splitting
   - Use `React.lazy` for large lists

### Best Practices

- **Monitor Continuously**: Run performance tests in CI/CD
- **Set Realistic Thresholds**: Based on user experience requirements
- **Profile in Production**: Use React Developer Tools Profiler
- **Measure Real Usage**: Test with realistic data and interactions

## Environment Considerations

### Test Environment
- Node.js version affects performance
- Memory availability impacts tests
- CPU load can cause variance

### CI/CD Integration
```yaml
- name: Performance Tests
  run: |
    npm run test:performance
    # Store results for trend analysis
```

### Warming Up
Tests include environment warming to reduce variance:
```typescript
// Warmup renders to stabilize environment
for (let i = 0; i < 3; i++) {
  await tester.measureRender('warmup', () => <Component />);
}
```

## Customization

### Adding New Component Tests

1. Create measurement function:
```typescript
const renderTime = await tester.measureRender(
  'my-component',
  () => <MyComponent prop="value" />
);
```

2. Add performance threshold:
```typescript
const PERFORMANCE_THRESHOLDS = {
  MY_COMPONENT_RENDER_MAX: 12, // ms
  // ...
};
```

3. Validate results:
```typescript
expect(renderTime).toBeLessThan(
  PERFORMANCE_THRESHOLDS.MY_COMPONENT_RENDER_MAX
);
```

### Custom Benchmarks

```typescript
import { calculateBenchmarks } from './performance-utils';

const times = [1.2, 1.5, 1.1, 2.3, 1.4]; // ms
const benchmark = calculateBenchmarks(times);

console.log(`Average: ${benchmark.average}ms`);
console.log(`P95: ${benchmark.p95}ms`);
```

## Troubleshooting

### Common Issues

1. **Flaky Tests**
   - Increase sample size
   - Add warmup renders
   - Check system load

2. **Inconsistent Results**
   - Force garbage collection
   - Isolate test environment
   - Reduce concurrent processes

3. **Memory Test Failures**
   - Enable `--expose-gc` flag
   - Increase memory thresholds for test environment
   - Check for React dev tools impact

### Debug Commands

```bash
# Run with garbage collection enabled
node --expose-gc $(npm bin)/jest tests/performance/

# Monitor memory usage
node --max-old-space-size=4096 $(npm bin)/jest tests/performance/

# Enable performance profiling
NODE_ENV=test npm test tests/performance/ -- --runInBand
```

## Contributing

When adding new performance tests:

1. Follow existing patterns and naming conventions
2. Include warmup renders for stable measurements
3. Set appropriate thresholds based on component complexity
4. Add documentation for new metrics or test categories
5. Ensure tests are deterministic and don't depend on external factors

## Resources

- [React Performance Profiling](https://react.dev/reference/react/profiler)
- [Jest Performance Testing](https://jestjs.io/docs/testing-performance)
- [Web Performance Metrics](https://web.dev/metrics/)
- [React Testing Library Performance](https://testing-library.com/docs/guide-which-query/#performance)