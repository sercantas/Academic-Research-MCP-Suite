# Academic Research MCP Suite - Quick Reference

## Installation

```bash
# Global install
npm install -g academic-research-mcp-suite

# Or use with npx
npx academic-research-mcp-suite
```

## Configuration

### Claude Desktop
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "research": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-research-orchestrator"]
    }
  }
}
```

### Amazon Q CLI
```bash
q mcp add research npx academic-research-mcp-suite academic-research-orchestrator
```

## The 6 Servers

| Server | Purpose | Key Features |
|--------|---------|--------------|
| **Research Orchestrator** | Workflow coordination | Manages complete pipeline |
| **Research Initiator** | Question refinement | SMART criteria, hypotheses |
| **Data Processor** | Data cleaning | Quality analysis, outliers |
| **Code Generator** | Analysis scripts | 6+ statistical methods |
| **Code Executor** | Run scripts | Python, R, Node.js |
| **Research Writer** | Report generation | Publication-ready docs |

## Common Commands

### Complete Workflow
```
"Use the research orchestrator to study [topic] with data at [path]"
```

### Individual Tasks
```
"Refine my research question: [your question]"
"Process my dataset at [path]"
"Generate Python code for [analysis type]"
"Execute my analysis scripts"
"Write a research report from my results"
```

## Analysis Types Supported

- ✅ Descriptive Statistics & EDA
- ✅ Correlation Analysis (Pearson, Spearman)
- ✅ Linear Regression with Diagnostics
- ✅ T-tests (Independent, Paired)
- ✅ ANOVA (One-way, Two-way)
- ✅ Chi-square Tests
- ✅ Custom Analyses

## Output Files

| File Type | Description |
|-----------|-------------|
| `*_cleaned.csv` | Processed data |
| `*_quality_report.json` | Data quality metrics |
| `*_correlation_heatmap.png` | Correlation visualization |
| `*_distributions.png` | Variable distributions |
| `*_regression_diagnostics.png` | Model diagnostics |
| `*_research_report.md` | Final report |

## Data Requirements

### CSV Format
```csv
id,variable1,variable2,variable3
1,value1,value2,value3
2,value1,value2,value3
```

### Best Practices
- Use clear column names (no spaces)
- Include headers
- UTF-8 encoding
- Consistent data types per column

## Statistical Reporting

### Correlation
```
r = 0.54, p < 0.001
```

### Regression
```
β = 0.45, t(198) = 4.23, p < 0.001, R² = 0.32
```

### T-test
```
t(98) = 2.45, p = 0.016, d = 0.49
```

### ANOVA
```
F(2, 197) = 5.67, p = 0.004, η² = 0.054
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| File not found | Use absolute paths |
| Python not available | Install Python 3.8+ |
| Missing packages | `pip install pandas numpy scipy statsmodels matplotlib seaborn` |
| Timeout | Reduce dataset size or run manually |
| Invalid CSV | Check format, encoding, headers |

## Quick Tips

1. **Start with EDA** - Always explore data first
2. **Check assumptions** - Verify statistical test requirements
3. **Report effect sizes** - Not just p-values
4. **Document everything** - Keep all generated files
5. **Iterate** - Refine based on initial results

## Example Workflow

```
1. Prepare CSV data
2. Ask: "Study relationship between X and Y with data at ./data.csv"
3. Review refined question and hypotheses
4. Check data quality report
5. Examine generated visualizations
6. Read statistical results
7. Review final report
8. Iterate if needed
```

## File Structure

```
project/
├── data/
│   └── raw_data.csv
├── processed_data/
│   ├── proj_123_cleaned.csv
│   └── proj_123_quality_report.json
├── output/
│   ├── proj_123/
│   │   ├── 01_eda_proj_123.py
│   │   ├── 02_correlation_proj_123.py
│   │   └── ...
│   └── visualizations/
│       ├── correlation_heatmap.png
│       └── distributions.png
└── reports/
    └── proj_123_research_report.md
```

## Resources

- [Full Documentation](./README.md)
- [Usage Examples](./EXAMPLES.md)
- [API Reference](./docs/API_CONTRACT_Version2.md)
- [Changelog](./CHANGELOG.md)
- [Publishing Guide](./NPM_PUBLISHING_CHECKLIST.md)

## Support

- 📖 Read the docs
- 🐛 Report issues on GitHub
- 💡 Request features
- 🤝 Contribute code

## Version

Current: **1.0.0**

---

*Quick reference for Academic Research MCP Suite - Get started in minutes!* 🚀
