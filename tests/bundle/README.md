# Bundle Size Analysis

This directory contains comprehensive bundle size analysis tests for the design system components. These tests monitor component bundle sizes, track tree-shaking effectiveness, and prevent size regressions.

## Overview

The bundle analysis system provides:

- **Individual component size tracking** for Button, Input, Card, and Label components
- **Design system total size monitoring** with configurable budgets
- **Theme provider and utilities analysis** to track supporting code impact
- **Import structure analysis** to identify dependency optimization opportunities
- **Size regression detection** with baseline comparison and automated alerts
- **Comprehensive reporting** with recommendations for optimization

## Files

- `size-analysis.test.ts` - Main test suite with bundle analysis logic
- `analysis-report.json` - Latest analysis report with detailed metrics
- `baseline.json` - Baseline sizes for regression detection
- `README.md` - This documentation file

## Running Tests

### Basic Analysis
```bash
# Run bundle size analysis
npm run test:bundle

# Run with watch mode for development
npm run test:bundle:watch

# Run build and analysis together
npm run analyze:bundle
```

### CI/CD Integration
The tests are designed to run in CI/CD pipelines and will fail if:
- Any component exceeds its size budget
- Bundle size increases beyond acceptable thresholds (15% regression)
- Import structure becomes problematic

## Size Budgets

Current size budgets (raw file sizes):

| Component | Warning | Maximum | Current Status |
|-----------|---------|---------|----------------|
| Button | 12KB | 15KB | ✅ 10.9KB |
| Input | 15KB | 18KB | ⚠️ 15.4KB |
| Card | 10KB | 12KB | ⚠️ 9.9KB |
| Label | 1.5KB | 2KB | ✅ 741B |
| Design System Total | 40KB | 50KB | ✅ 37.3KB |
| Theme Provider | 20KB | 25KB | ✅ 17.3KB |
| Utils | 20KB | 25KB | ✅ 18.1KB |

## Current Metrics

Based on the latest analysis:

- **Total Source Code**: 72.7KB (2,883 lines)
- **Compression Ratio**: 3.82:1 (excellent gzip compression)
- **Total Complexity**: 145 (reasonable)
- **External Dependencies**: 3 (minimal)

### Component Breakdown

- **Button**: 10.9KB (408 lines, complexity: 8)
- **Input**: 15.4KB (630 lines, complexity: 17) ⚠️ *Approaching limit*
- **Card**: 9.9KB (469 lines, complexity: 7) ⚠️ *Approaching limit*
- **Label**: 741B (24 lines, complexity: 0)

## Recommendations

Current optimization recommendations:

1. **Consider optimizing Input component** - Size approaching budget limit
2. **Consider splitting Input component** - File is getting large (630 lines)
3. **Consider optimizing Card component** - Size approaching budget limit

## Analysis Features

### File Size Analysis
- Raw and gzipped sizes for accurate network impact assessment
- Line count and complexity scoring for maintainability metrics
- MD5 checksums for change detection

### Import Structure Analysis
- External vs internal dependency tracking
- Import count optimization suggestions
- Simplified circular dependency detection

### Regression Detection
- Baseline comparison with configurable thresholds
- Automatic baseline updates after validation
- Historical tracking with timestamps

### Performance Budgets
- Configurable size limits per component
- Warning thresholds to catch issues early
- Automatic CI/CD integration for quality gates

## Integration with Development Workflow

### Pre-commit Hooks
Consider adding bundle analysis to pre-commit hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run analyze:bundle"
    }
  }
}
```

### CI/CD Pipeline
The tests integrate with CI/CD systems:

```yaml
# Example GitHub Actions step
- name: Bundle Size Analysis
  run: npm run test:bundle
```

### Development Monitoring
Use watch mode during development:

```bash
npm run test:bundle:watch
```

## Understanding the Output

### Test Results
- ✅ **PASS**: Component within budget
- ⚠️ **WARNING**: Approaching size limit
- ❌ **FAIL**: Exceeds maximum budget

### Reports
- `analysis-report.json`: Complete analysis with metrics and recommendations
- `baseline.json`: Reference sizes for regression detection
- Console output: Real-time analysis with formatted metrics

## Customization

### Adjusting Budgets
Edit size budgets in `size-analysis.test.ts`:

```typescript
const SIZE_BUDGETS = {
  button: {
    max: 15000,   // Maximum size in bytes
    warn: 12000,  // Warning threshold
  },
  // ... other components
};
```

### Adding New Components
1. Add component to the analysis arrays
2. Set appropriate size budgets
3. Update documentation

### Regression Thresholds
Adjust regression sensitivity:

```typescript
const regressionThreshold = 0.15; // 15% increase triggers failure
```

## Troubleshooting

### Common Issues

1. **Tests failing after component changes**: Expected - review size impact
2. **Baseline not updating**: Check file permissions on `baseline.json`
3. **False circular dependencies**: Currently disabled due to detection limitations

### Performance Impact

The analysis adds ~2 seconds to test execution time and requires:
- File system access for component analysis
- Gzip compression for accurate size calculation
- JSON file operations for baseline tracking

## Future Enhancements

Potential improvements for production use:

1. **Production bundle analysis** with webpack integration
2. **Tree-shaking effectiveness** measurement with actual bundlers
3. **Chunk analysis** for code splitting optimization
4. **Dynamic import** impact assessment
5. **Runtime bundle size** monitoring in real applications

---

**Last Updated**: 2025-09-13
**Version**: 1.0.0
**Compatibility**: Node.js 18+, Jest 29+