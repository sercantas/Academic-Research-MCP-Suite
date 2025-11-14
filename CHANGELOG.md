# Changelog

All notable changes to the Academic Research MCP Suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-13

### Added

#### Research Initiator Developer Server
- **Enhanced Question Refinement**: SMART criteria validation for research questions
- **Variable Extraction**: Automatic identification of key variables from research prompts
- **Comprehensive Hypothesis Generation**: Null and alternative hypotheses with directional options
- **Detailed Operational Definitions**: Includes measurement scales, reliability, and validity considerations
- **Literature Review Synthesis**: Structured literature review notes with theoretical frameworks

#### Data Processor Wrangler
- **Advanced Data Quality Analysis**: Comprehensive quality reporting with missing data analysis
- **Data Type Inference**: Automatic detection of numeric, categorical, date, and boolean types
- **Outlier Detection**: IQR-based outlier identification for numeric variables
- **Missing Data Handling**: Multiple strategies including listwise deletion and imputation
- **Duplicate Detection**: Automatic identification and removal of duplicate rows
- **Quality Report Generation**: JSON format data quality reports with detailed statistics

#### Code Generator
- **Expanded Analysis Templates**: 
  - Comprehensive EDA with visualizations
  - Correlation analysis (Pearson and Spearman)
  - Multiple regression with diagnostics
  - T-tests with effect sizes (Cohen's d)
  - ANOVA for multi-group comparisons
  - Chi-square tests for categorical data
- **Enhanced Code Quality**: 
  - Proper error handling in all scripts
  - Statistical assumptions testing
  - Visualization generation (matplotlib, seaborn)
  - Results export to CSV and PNG formats
- **Script Numbering**: Sequential numbering for organized workflow execution

#### Code Executor
- **Multi-Environment Support**: Python, R, and Node.js execution
- **Execution Summary**: Comprehensive logs with stdout/stderr capture
- **Output File Management**: Automatic collection of generated files
- **Error Diagnostics**: Detailed error messages with troubleshooting hints

#### Research Writer
- **Structured Report Generation**: 
  - Executive summary
  - Literature review
  - Methodology section
  - Results and findings
  - Discussion and conclusions
  - References section
- **Markdown Output**: Clean, readable markdown format
- **Automatic Timestamps**: Project tracking with generation dates

#### Research Orchestrator
- **Sequential Workflow Execution**: Coordinates all 6 servers
- **Error Handling**: Graceful degradation with partial success reporting
- **Progress Tracking**: Detailed logging of workflow stages
- **Next Steps Guidance**: Intelligent suggestions for workflow continuation

### Changed
- Updated all servers to use enhanced validation with Zod schemas
- Improved error messages across all servers
- Enhanced logging for better debugging and traceability
- Standardized response formats across all servers

### Fixed
- TypeScript strict mode compatibility issues
- Undefined args handling in error cases
- Path resolution for cross-platform compatibility
- Missing data handling edge cases

### Technical Improvements
- All servers pass comprehensive tests (100% success rate)
- TypeScript compilation with zero errors
- Proper MCP SDK integration
- Stdio transport for Claude Desktop and Amazon Q CLI compatibility

## [0.9.0] - 2024-11-12

### Added
- Initial implementation of 6 MCP servers
- Basic API contracts and interfaces
- Compilation and testing scripts
- README and documentation

### Known Issues
- Limited data quality analysis
- Basic code generation templates
- Mock implementations in some servers

---

## Upgrade Guide

### From 0.9.0 to 1.0.0

The 1.0.0 release includes significant enhancements to all servers. No breaking changes to the API contracts, but responses now include much more detailed information.

**What's New:**
1. Research questions are now refined using SMART criteria
2. Data quality reports are automatically generated
3. Analysis scripts include comprehensive statistical tests
4. All scripts generate visualizations automatically
5. Reports are more structured and detailed

**Migration Steps:**
1. Rebuild the project: `npm run build`
2. Test all servers: `npm test`
3. Update MCP configuration if needed
4. Review new output formats and adjust downstream processes

**New Output Files:**
- `{project_id}_quality_report.json` - Data quality analysis
- `{project_id}_correlation_heatmap.png` - Correlation visualization
- `{project_id}_distributions.png` - Variable distributions
- `{project_id}_regression_diagnostics.png` - Regression diagnostics
- `{project_id}_scatter_plots.png` - Scatter plot matrix

---

## Future Roadmap

### Version 1.1.0 (Planned)
- [ ] Persistent project state with SQLite
- [ ] Resume from failure points
- [ ] Parallel execution for independent steps
- [ ] Interactive HTML reports
- [ ] PDF export via Pandoc

### Version 1.2.0 (Planned)
- [ ] Advanced statistical methods (SEM, multilevel models)
- [ ] Machine learning integration
- [ ] Time series analysis
- [ ] Bayesian statistics support
- [ ] R script generation

### Version 2.0.0 (Future)
- [ ] Web-based dashboard
- [ ] Real-time collaboration
- [ ] Cloud storage integration
- [ ] API for external integrations
- [ ] Plugin system for custom analyses
