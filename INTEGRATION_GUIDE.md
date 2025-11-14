# Academic Research MCP Suite - Integration Guide

## Overview

This guide explains how the 6 MCP servers integrate and communicate with each other to create a seamless research workflow.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  Research Orchestrator                       │
│              (Workflow Coordination Layer)                   │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Research   │    │     Data     │    │     Code     │
│  Initiator   │───▶│  Processor   │───▶│  Generator   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        │                   │                   ▼
        │                   │            ┌──────────────┐
        │                   │            │     Code     │
        │                   │            │   Executor   │
        │                   │            └──────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Research   │
                    │    Writer    │
                    └──────────────┘
```

---

## Data Flow

### 1. Research Question → Refined Design

**Flow:** User → Orchestrator → Research Initiator

**Input:**
```json
{
  "project_title": "Remote Work Study",
  "user_prompt": "Does remote work affect productivity?",
  "references": ["paper1.pdf", "paper2.pdf"]
}
```

**Processing:**
1. Orchestrator receives user request
2. Calls Research Initiator with prompt
3. Research Initiator:
   - Extracts variables
   - Applies SMART criteria
   - Generates hypotheses
   - Creates operational definitions
   - Synthesizes literature review

**Output:**
```json
{
  "refined_question": "How does remote work arrangement affect employee productivity?",
  "hypotheses": [
    "H0: No significant relationship",
    "H1: Positive effect on productivity",
    "H2: Significant relationship exists"
  ],
  "operational_definitions": {
    "remote_work": {
      "measurement": "Work location (remote/hybrid/office)",
      "scale_type": "nominal"
    },
    "productivity": {
      "measurement": "Self-reported score (1-10)",
      "scale_type": "interval"
    }
  }
}
```

**Feedback Loop:**
- If question is too vague → Request more specificity
- If variables unclear → Suggest clarifications
- If hypotheses weak → Recommend refinements

---

### 2. Raw Data → Clean Data

**Flow:** Orchestrator → Data Processor

**Input:**
```json
{
  "project_id": "proj_123",
  "refined_question": "...",
  "hypotheses": [...],
  "operational_definitions": {...},
  "raw_data": "./data/survey.csv"
}
```

**Processing:**
1. Data Processor receives data path
2. Reads and parses CSV
3. Analyzes data quality:
   - Missing values
   - Outliers
   - Duplicates
   - Data types
4. Applies cleaning procedures
5. Generates quality report

**Output:**
```json
{
  "cleaned_data": "./processed_data/proj_123_cleaned.csv",
  "processing_log": [
    "Initial data: 200 rows",
    "Removed 3 duplicate rows",
    "Removed 5 rows with missing values",
    "Final data: 192 rows"
  ],
  "decision_rationale": "Applied listwise deletion...",
  "quality_report": {
    "totalRows": 192,
    "missingPercentage": {...},
    "outliers": {...}
  }
}
```

**Feedback Loop:**
- If data quality poor → Recommend data collection improvements
- If missing data high → Suggest imputation strategies
- If outliers detected → Flag for review

---

### 3. Clean Data → Analysis Scripts

**Flow:** Orchestrator → Code Generator

**Input:**
```json
{
  "project_id": "proj_123",
  "cleaned_data": "./processed_data/proj_123_cleaned.csv",
  "hypotheses": [...],
  "analysis_plan": [
    "Descriptive statistics",
    "Correlation analysis",
    "Linear regression"
  ]
}
```

**Processing:**
1. Code Generator receives requirements
2. Determines appropriate statistical methods
3. Generates Python scripts:
   - EDA with visualizations
   - Correlation analysis
   - Regression with diagnostics
4. Includes error handling
5. Adds visualization code

**Output:**
```json
{
  "analysis_scripts": {
    "01_eda_proj_123.py": "import pandas as pd...",
    "02_correlation_proj_123.py": "import scipy...",
    "03_regression_proj_123.py": "import statsmodels..."
  },
  "exploratory_findings": {
    "description": "Data appears normally distributed...",
    "outliers": "3 outliers detected in productivity"
  }
}
```

**Feedback Loop:**
- If data types incompatible → Suggest transformations
- If assumptions violated → Recommend alternative tests
- If sample size small → Warn about power

---

### 4. Scripts → Results

**Flow:** Orchestrator → Code Executor

**Input:**
```json
{
  "project_id": "proj_123",
  "scripts": {
    "01_eda_proj_123.py": "...",
    "02_correlation_proj_123.py": "...",
    "03_regression_proj_123.py": "..."
  },
  "data": "./processed_data/proj_123_cleaned.csv",
  "environment": "python"
}
```

**Processing:**
1. Code Executor receives scripts
2. Creates working directory
3. Writes scripts to files
4. Executes each script:
   - Captures stdout/stderr
   - Collects output files
   - Logs execution details
5. Generates execution summary

**Output:**
```json
{
  "execution_logs": [
    "Executed Python script: 01_eda_proj_123.py",
    "STDOUT: Descriptive Statistics...",
    "Generated: correlation_heatmap.png",
    "Executed Python script: 02_correlation_proj_123.py",
    "STDOUT: Pearson r = 0.54, p < 0.001"
  ],
  "output_files": [
    "./output/proj_123/correlation_heatmap.png",
    "./output/proj_123/distributions.png",
    "./output/proj_123/regression_results.csv"
  ]
}
```

**Feedback Loop:**
- If execution fails → Return error to Code Generator
- If results unexpected → Flag for review
- If visualizations missing → Regenerate code

---

### 5. All Components → Research Report

**Flow:** Orchestrator → Research Writer

**Input:**
```json
{
  "project_id": "proj_123",
  "refined_question": "...",
  "hypotheses": [...],
  "results": "Regression analysis showed β=0.45, p<0.001...",
  "lit_review_notes": "...",
  "methodology": "...",
  "data_description": "..."
}
```

**Processing:**
1. Research Writer receives all components
2. Generates report sections:
   - Executive summary
   - Literature review
   - Methodology
   - Results
   - Discussion
   - Conclusions
3. Formats with proper citations
4. Includes statistical details
5. Saves as markdown

**Output:**
```json
{
  "research_report": "./reports/proj_123_research_report.md",
  "summary": "Study found significant positive relationship (r=0.54, p<0.001)..."
}
```

**Feedback Loop:**
- If results unclear → Request clarification
- If statistics missing → Pull from execution logs
- If format issues → Regenerate sections

---

## Integration Patterns

### Pattern 1: Sequential Pipeline

```
User Input → Initiator → Processor → Generator → Executor → Writer → Report
```

**Use Case:** Complete research workflow  
**Coordination:** Orchestrator manages sequence  
**Error Handling:** Stop on critical errors, continue on warnings

### Pattern 2: Iterative Refinement

```
User Input → Initiator → Review → Refine → Initiator → ...
```

**Use Case:** Question refinement  
**Coordination:** User-driven iteration  
**Error Handling:** Allow multiple attempts

### Pattern 3: Parallel Processing

```
                    ┌─→ Generator (EDA) ─┐
Processor → Data ───┼─→ Generator (Corr) ─┼─→ Executor
                    └─→ Generator (Reg) ──┘
```

**Use Case:** Multiple analyses  
**Coordination:** Orchestrator manages parallel tasks  
**Error Handling:** Partial success allowed

### Pattern 4: Feedback Loop

```
Generator → Executor → Error → Generator (retry) → Executor
```

**Use Case:** Code debugging  
**Coordination:** Automatic retry with fixes  
**Error Handling:** Max 3 retries

---

## Communication Protocols

### Request Format

All servers accept JSON-RPC 2.0 format:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {
      "param1": "value1",
      "param2": "value2"
    }
  }
}
```

### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"status\": \"success\", ...}"
      }
    ]
  }
}
```

### Error Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Error description",
    "data": {
      "details": "..."
    }
  }
}
```

---

## State Management

### Project State

The Orchestrator maintains project state:

```typescript
interface ProjectState {
  project_id: string;
  project_title: string;
  workflow_stage: string;
  refined_question?: string;
  hypotheses?: string[];
  cleaned_data_path?: string;
  analysis_scripts?: Record<string, string>;
  execution_logs?: string[];
  research_report_path?: string;
  errors: string[];
  log: string[];
}
```

### State Transitions

```
initiated → research_design_complete → data_processing_complete 
→ code_generation_complete → execution_complete → report_complete
```

### State Persistence

Currently in-memory (future: SQLite database)

---

## Error Handling Strategy

### Error Types

1. **Validation Errors** - Invalid input format
2. **Processing Errors** - Data processing failures
3. **Execution Errors** - Script execution failures
4. **System Errors** - File I/O, permissions

### Error Propagation

```
Server Error → Orchestrator → User
     ↓
  Log Error
     ↓
Attempt Recovery
     ↓
Continue or Stop
```

### Recovery Strategies

1. **Retry** - For transient failures
2. **Skip** - For optional steps
3. **Fallback** - Use alternative method
4. **Stop** - For critical failures

---

## Performance Optimization

### Caching

- Cache processed data
- Reuse generated scripts
- Store execution results

### Parallel Execution

- Run independent analyses in parallel
- Generate multiple visualizations simultaneously
- Execute non-dependent scripts concurrently

### Resource Management

- Limit memory usage
- Set execution timeouts
- Clean up temporary files

---

## Testing Integration

### Unit Tests

Test each server independently:

```bash
npm test
```

### Integration Tests

Test server communication:

```javascript
// Test Orchestrator → Initiator
const result = await orchestrator.call('initiate', {...});
expect(result.status).toBe('success');
```

### End-to-End Tests

Test complete workflow:

```javascript
// Test full pipeline
const report = await runCompleteWorkflow({
  prompt: "...",
  data: "..."
});
expect(report).toContain('Research Report');
```

---

## Monitoring & Logging

### Log Levels

- **DEBUG** - Detailed execution info
- **INFO** - General progress updates
- **WARN** - Non-critical issues
- **ERROR** - Critical failures

### Log Format

```
[2024-11-13 17:00:00] [INFO] [Orchestrator] Starting workflow for proj_123
[2024-11-13 17:00:01] [INFO] [Initiator] Refining question...
[2024-11-13 17:00:02] [INFO] [Initiator] Generated 3 hypotheses
[2024-11-13 17:00:03] [INFO] [Processor] Processing data...
```

### Metrics

- Execution time per server
- Success/failure rates
- Data quality scores
- User satisfaction

---

## Best Practices

### For Developers

1. **Validate inputs** - Use Zod schemas
2. **Handle errors gracefully** - Try-catch blocks
3. **Log extensively** - Track all operations
4. **Test thoroughly** - Unit and integration tests
5. **Document clearly** - Code comments and docs

### For Users

1. **Start simple** - Use orchestrator for complete workflow
2. **Review outputs** - Check each step's results
3. **Iterate** - Refine based on initial results
4. **Document** - Keep track of decisions
5. **Backup** - Save all generated files

---

## Troubleshooting Integration Issues

### Issue: Server Not Responding

**Symptoms:** Timeout or no response  
**Diagnosis:** Check server status, logs  
**Solution:** Restart server, check configuration

### Issue: Data Not Passing Between Servers

**Symptoms:** Empty or incorrect data  
**Diagnosis:** Check file paths, permissions  
**Solution:** Use absolute paths, verify file existence

### Issue: Inconsistent Results

**Symptoms:** Different results on reruns  
**Diagnosis:** Check for randomness, caching  
**Solution:** Set random seeds, clear cache

---

## Future Enhancements

### Planned Improvements

1. **Persistent State** - SQLite database
2. **Real-time Updates** - WebSocket communication
3. **Distributed Execution** - Cloud-based processing
4. **Advanced Caching** - Redis integration
5. **API Gateway** - RESTful API layer

---

## Conclusion

The Academic Research MCP Suite's integration architecture provides a robust, flexible, and extensible framework for research automation. The modular design allows each server to function independently while seamlessly coordinating through the orchestrator for complete workflows.

**Key Integration Features:**
- ✅ Modular architecture
- ✅ Clear data flow
- ✅ Robust error handling
- ✅ Comprehensive logging
- ✅ Flexible coordination

For more information, see:
- [API Documentation](./docs/API_CONTRACT_Version2.md)
- [Usage Examples](./EXAMPLES.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

*Integration Guide for Academic Research MCP Suite v1.0.0* 🔗
