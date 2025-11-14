# Academic Research MCP Suite - Usage Examples

## Table of Contents
1. [Quick Start](#quick-start)
2. [Complete Workflow Example](#complete-workflow-example)
3. [Individual Server Examples](#individual-server-examples)
4. [Advanced Use Cases](#advanced-use-cases)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Installation
```bash
# Global installation
npm install -g academic-research-mcp-suite

# Or use with npx (no installation needed)
npx academic-research-mcp-suite
```

### Configure with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "academic-research": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-research-orchestrator"]
    }
  }
}
```

---

## Complete Workflow Example

### Scenario: Studying Remote Work Impact on Productivity

**Step 1: Start with the Orchestrator**

In Claude Desktop:
```
I want to conduct research on how remote work affects employee productivity 
and job satisfaction. I have survey data from 200 employees in a CSV file 
at ./data/employee_survey.csv
```

The orchestrator will:
1. Refine your research question
2. Generate hypotheses
3. Process your data
4. Generate analysis code
5. Provide next steps

**Step 2: Review Refined Question**

The Research Initiator will transform your vague idea into:
```
Research Question: How does remote work arrangement (independent variable) 
affect employee productivity and job satisfaction (dependent variables) 
among knowledge workers?

Hypotheses:
H0: There is no significant relationship between remote work and productivity.
H1: Remote work has a significant positive effect on productivity.
H2: There is a significant relationship between remote work and job satisfaction.
H3: Work-life balance moderates the relationship between remote work and productivity.

Operational Definitions:
- remote_work: Measured by work location (remote/hybrid/office)
- productivity: Measured via self-reported productivity score (1-10 scale)
- job_satisfaction: Measured via validated job satisfaction scale
```

**Step 3: Data Processing**

The Data Processor will:
- Analyze data quality (missing values, outliers, duplicates)
- Clean the dataset
- Generate a quality report
- Prepare data for analysis

Output:
```
Data Quality Report:
- 200 rows, 8 columns
- Missing data: 2.5% average
- 3 duplicate rows removed
- 5 outliers detected in productivity_score
- All variables properly typed
```

**Step 4: Code Generation**

The Code Generator creates:
```python
# 01_eda_proj_123.py - Exploratory Data Analysis
# 02_correlation_proj_123.py - Correlation Analysis
# 03_regression_proj_123.py - Regression Analysis
# 04_ttest_proj_123.py - T-tests for group comparisons
```

**Step 5: Execute Analysis**

The Code Executor runs all scripts and generates:
- Statistical results
- Visualizations (correlation heatmaps, scatter plots, distributions)
- Diagnostic plots
- Results CSV files

**Step 6: Generate Report**

The Research Writer compiles everything into a comprehensive report:
```markdown
# Research Report: Remote Work Impact on Productivity

## Executive Summary
This study investigated the relationship between remote work arrangements 
and employee productivity among 197 knowledge workers...

## Results
- Remote workers showed 15% higher productivity (M=7.8, SD=1.2) compared 
  to office workers (M=6.8, SD=1.4), t(195)=4.23, p<0.001, d=0.76
- Strong positive correlation between remote work and job satisfaction 
  (r=0.54, p<0.001)
...
```

---

## Individual Server Examples

### 1. Research Initiator Developer

**Example 1: Refining a Vague Question**

Input:
```json
{
  "project_id": "study001",
  "prompt": "Does social media affect students?",
  "references": ["smith2023.pdf", "jones2022.pdf"]
}
```

Output:
```json
{
  "status": "success",
  "refined_question": "How does daily social media usage time (independent variable) affect academic performance (GPA) among college students (measured quantitatively)?",
  "hypotheses": [
    "H0: There is no significant relationship between social media usage and GPA.",
    "H1: Social media usage has a significant negative effect on GPA.",
    "H2: There is a significant relationship between social media usage and GPA."
  ],
  "operational_definitions": {
    "social_media_usage": {
      "concept": "social media usage",
      "measurement": "Independent variable - measured via validated instrument/scale",
      "scale_type": "interval/ratio",
      "data_source": "Survey questionnaire / Observational data"
    },
    "gpa": {
      "concept": "gpa",
      "measurement": "Dependent variable - measured via outcome metric",
      "scale_type": "interval/ratio"
    }
  }
}
```

**Example 2: Complex Research Question**

Input:
```
"Investigate the moderating effect of age on the relationship between 
exercise frequency and mental health outcomes in adults"
```

Output includes:
- Refined question with clear IV, DV, and moderator
- Multiple hypotheses including interaction effects
- Operational definitions for all variables
- Literature review framework

### 2. Data Processor Wrangler

**Example 1: Basic Data Cleaning**

Input CSV:
```csv
id,age,income,satisfaction
1,25,50000,4.5
2,30,,3.8
3,28,60000,4.2
4,,,
5,35,75000,4.8
```

Output:
```json
{
  "status": "success",
  "cleaned_data": "./processed_data/study001_cleaned.csv",
  "processing_log": [
    "Initial data: 5 rows",
    "After removing empty rows: 4 rows",
    "Column 'income' has 20.0% missing values",
    "Removed 1 rows with missing values",
    "Data prepared for hypothesis testing"
  ],
  "decision_rationale": "Applied listwise deletion for missing data..."
}
```

**Example 2: Outlier Detection**

For a dataset with extreme values:
```
Column 'income' has 2 outliers detected
Outliers in 'income' will be flagged but retained for analysis
```

### 3. Code Generator

**Example 1: Generate EDA Script**

Input:
```json
{
  "project_id": "study001",
  "cleaned_data": "./processed_data/study001_cleaned.csv",
  "hypotheses": ["H1: Income predicts satisfaction"],
  "analysis_plan": ["Descriptive statistics", "Exploratory data analysis"]
}
```

Output includes a comprehensive Python script with:
- Data loading and validation
- Descriptive statistics
- Missing value analysis
- Distribution plots
- Correlation heatmap
- Outlier detection

**Example 2: Generate Regression Analysis**

Input:
```json
{
  "analysis_plan": ["Linear regression"]
}
```

Output includes:
- Model fitting with statsmodels
- Coefficient interpretation
- R-squared and adjusted R-squared
- Residual diagnostics
- Assumption testing (normality, homoscedasticity)
- Diagnostic plots

### 4. Code Executor

**Example 1: Execute Python Scripts**

Input:
```json
{
  "project_id": "study001",
  "scripts": {
    "analysis.py": "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.describe())"
  },
  "data": "./processed_data/study001_cleaned.csv",
  "environment": "python"
}
```

Output:
```json
{
  "status": "success",
  "execution_logs": [
    "Created script file: analysis.py",
    "Executed Python script: analysis.py",
    "STDOUT from analysis.py:",
    "       age      income  satisfaction",
    "count  4.0    4.000000      4.000000",
    "mean  29.5  61250.000000      4.325000",
    "..."
  ],
  "output_files": [
    "./output/study001/analysis.py",
    "./output/study001/execution_summary.txt"
  ]
}
```

### 5. Research Writer

**Example 1: Generate Complete Report**

Input:
```json
{
  "project_id": "study001",
  "refined_question": "How does income affect job satisfaction?",
  "hypotheses": ["H1: Income positively predicts satisfaction"],
  "results": "Regression analysis showed significant positive relationship (β=0.45, p<0.001)",
  "lit_review_notes": "Previous research suggests...",
  "methodology": "Quantitative survey design with 200 participants",
  "data_description": "Cross-sectional survey data from employees"
}
```

Output: A comprehensive markdown report with:
- Executive summary
- Literature review
- Methodology
- Results with statistical details
- Discussion and implications
- Limitations
- Future research directions
- References

---

## Advanced Use Cases

### Use Case 1: Iterative Analysis

**Scenario**: Initial analysis reveals unexpected patterns

```
Step 1: Run initial EDA
Step 2: Discover outliers
Step 3: Re-run data processor with outlier handling
Step 4: Generate new analysis code
Step 5: Compare results
```

### Use Case 2: Multiple Dependent Variables

**Scenario**: Studying effects on multiple outcomes

```python
# The code generator can create MANOVA scripts
analysis_plan = [
    "Descriptive statistics",
    "MANOVA for multiple dependent variables",
    "Post-hoc tests"
]
```

### Use Case 3: Longitudinal Data

**Scenario**: Time series or repeated measures

```python
# Request time series analysis
analysis_plan = [
    "Time series decomposition",
    "Trend analysis",
    "Repeated measures ANOVA"
]
```

### Use Case 4: Mixed Methods Research

**Scenario**: Combining quantitative and qualitative data

```
1. Use Data Processor for quantitative data
2. Use Code Generator for statistical analysis
3. Manually add qualitative findings
4. Use Research Writer to integrate both
```

---

## Troubleshooting

### Issue 1: Data File Not Found

**Error**: `Failed to read data file: ENOENT`

**Solution**:
```bash
# Use absolute paths
/Users/username/data/survey.csv

# Or relative paths from project root
./data/survey.csv
```

### Issue 2: Python Not Available

**Error**: `Python is not available in the system`

**Solution**:
```bash
# Install Python
brew install python  # macOS
# or download from python.org

# Verify installation
python --version
```

### Issue 3: Missing Dependencies

**Error**: `ModuleNotFoundError: No module named 'pandas'`

**Solution**:
```bash
# Install required packages
pip install pandas numpy scipy statsmodels matplotlib seaborn

# Or use requirements file
pip install -r requirements.txt
```

### Issue 4: Script Execution Timeout

**Error**: `Execution timeout after 60 seconds`

**Solution**:
- Reduce dataset size
- Simplify analysis
- Run scripts manually for long-running analyses

### Issue 5: Invalid CSV Format

**Error**: `Error parsing CSV: unexpected format`

**Solution**:
- Ensure CSV has headers
- Check for proper comma separation
- Remove special characters
- Use UTF-8 encoding

---

## Best Practices

### 1. Data Preparation
- Clean your data before uploading
- Use consistent column names (no spaces)
- Include a data dictionary
- Document any preprocessing steps

### 2. Research Design
- Start with clear research questions
- Define variables operationally
- Consider confounding variables
- Plan your analysis strategy

### 3. Analysis Workflow
- Always start with EDA
- Check assumptions before statistical tests
- Use appropriate tests for your data type
- Report effect sizes, not just p-values

### 4. Reporting
- Include all relevant statistics
- Report confidence intervals
- Discuss limitations
- Provide practical implications

### 5. Reproducibility
- Save all generated scripts
- Document your workflow
- Keep raw data unchanged
- Version control your analysis

---

## Sample Datasets

### Example 1: Employee Survey
```csv
employee_id,age,department,remote_work,productivity_score,satisfaction_score,years_experience
1,28,Engineering,Yes,8.5,4.2,3
2,35,Marketing,No,7.2,3.8,7
3,42,Sales,Hybrid,8.0,4.5,12
...
```

### Example 2: Student Performance
```csv
student_id,gpa,study_hours,social_media_hours,sleep_hours,stress_level
1,3.8,25,2,7,3
2,3.2,15,5,6,4
3,3.9,30,1,8,2
...
```

### Example 3: Customer Satisfaction
```csv
customer_id,age,purchase_amount,satisfaction,loyalty_score,support_interactions
1,34,250.50,4,8,2
2,28,180.00,5,9,1
3,45,420.75,3,6,5
...
```

---

## Next Steps

1. **Try the Quick Start** - Get familiar with basic functionality
2. **Run Complete Workflow** - Experience the full research pipeline
3. **Experiment with Individual Servers** - Understand each component
4. **Customize for Your Needs** - Adapt to your specific research
5. **Share Your Experience** - Contribute examples and feedback

For more help:
- Check the [API Documentation](./docs/API_CONTRACT_Version2.md)
- Review the [README](./README.md)
- Open an issue on [GitHub](https://github.com/yourusername/academic-research-mcp-suite/issues)
