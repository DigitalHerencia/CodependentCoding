# Performance Testing Framework

This directory contains performance tests and benchmarks for the ChatGPT Archive Utility.

## Test Types

### 1. Parsing Performance (`parsing.perf.ts`)
- Tests ZIP file parsing speed for various file sizes
- Measures memory usage during parsing
- Validates performance across different ChatGPT export formats

### 2. Search Performance (`search.perf.ts`)
- Benchmarks full-text search queries
- Tests filter combinations (date ranges, tags, etc.)
- Measures query response times for different dataset sizes

## Running Performance Tests

```bash
# Run all performance tests
npm run perf

# Run specific performance test
npm run perf:parsing
npm run perf:search

# Generate performance reports
npm run perf:report
```

## Performance Goals

Based on T019 requirements:

- **Parse Operations**: < 5 seconds for typical ChatGPT export ZIP files (< 50MB)
- **Search Queries**: < 200ms for basic text search
- **Filtered Search**: < 500ms for complex filter combinations
- **Memory Usage**: Stay under 512MB during parsing operations

## Benchmark Results

Results are automatically saved to `perf/results/` with timestamps for tracking performance over time.