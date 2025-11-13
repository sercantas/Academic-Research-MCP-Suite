 # Academic Research MCP Suite — API Contracts

## General Guidelines

- **All endpoints use JSON for request/response bodies.**
- **Every response includes a `status` and optional `errors` field.**
- **All methods are POST unless otherwise noted.**
- **All requests/response payloads include a `project_id` for traceability.**
- **Logging and error details are returned in each response as needed.**

---

## 1. Research Orchestrator

### Initiate Project

**POST /orchestrator/initiate**

```json
{
  "project_title": "Social Media and Academic Performance",
  "user_prompt": "How does social media use affect college students’ academic performance?",
  "references": ["paper1.pdf", "paper2.pdf"],
  "raw_data": "raw_data.csv"
}
```

**Response:**

```json
{
  "status": "success",
  "project_id": "123",
  "message": "Project initialized."
}
```

---

## 2. Research Initiator-Developer

### Refine Question

**POST /initiator/refine**

```json
{
  "project_id": "123",
  "prompt": "...",
  "references": ["paper1.pdf", "paper2.pdf"]
}
```

**Response:**

```json
{
  "status": "success",
  "refined_question": "...",
  "hypotheses": ["H1: ..."],
  "operational_definitions": {...},
  "lit_review_notes": "...",
  "log": ["Read 2 sources", "Framed hypothesis using Smith et al. (2020)"],
  "errors": []
}
```

---

## 3. Data Processor-Wrangler

### Process Data

**POST /data-processor/process**

```json
{
  "project_id": "123",
  "refined_question": "...",
  "hypotheses": ["H1: ..."],
  "operational_definitions": {...},
  "raw_data": "raw_data.csv"
}
```

**Response:**

```json
{
  "status": "success",
  "cleaned_data": "cleaned_data.csv",
  "processing_log": [
    "Removed NAs from GPA column",
    "Imputed missing social media hours"
  ],
  "decision_rationale": [
    "Dropped records with >30% missing data",
    "Imputed missing values with median"
  ],
  "errors": []
}
```

---

## 4. Code Generator

### Generate Analysis Scripts

**POST /code-generator/generate**

```json
{
  "project_id": "123",
  "cleaned_data": "cleaned_data.csv",
  "hypotheses": ["H1: ..."],
  "analysis_plan": [
    "Descriptive statistics of GPA and social media use",
    "Linear regression: GPA ~ social_media_use"
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "analysis_scripts": {
    "eda.py": "...python code...",
    "regression.py": "...python code..."
  },
  "exploratory_findings": {
    "description": "GPA mean=3.1, SD=0.4; Social media usage mean=14h/week...",
    "outliers": "2 students reported >80h/week"
  },
  "log": ["Generated EDA code", "Noted outliers in social media use"],
  "errors": []
}
```

---

## 5. Code Executor

### Run Analysis Scripts

**POST /code-executor/run**

```json
{
  "project_id": "123",
  "scripts": {
    "eda.py": "...",
    "regression.py": "..."
  },
  "data": "cleaned_data.csv",
  "environment": {
    "python_version": "3.10",
    "packages": ["pandas", "statsmodels"]
  }
}
```

**Response:**

```json
{
  "status": "success",
  "execution_logs": [
    "EDA completed. Results in eda_results.csv",
    "Regression completed. Results in regression_results.csv"
  ],
  "output_files": [
    "eda_results.csv",
    "regression_results.csv"
  ],
  "errors": []
}
```

---

## 6. Research Writer

### Compose Research Report

**POST /research-writer/compose**

```json
{
  "project_id": "123",
  "refined_question": "...",
  "hypotheses": ["H1: ..."],
  "lit_review_notes": "...",
  "processing_log": [...],
  "analysis_scripts": {...},
  "results": {
    "eda": "eda_results.csv",
    "regression": "regression_results.csv"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "research_report": "final_report.docx",
  "summary": "Social media use negatively correlated with GPA (r=-0.34, p<0.01)...",
  "log": ["Synthesized report", "Embedded figures"],
  "errors": []
}
```

---

## Error Handling & Logging

All responses MUST include:

- `status`: `"success"` or `"error"`
- `errors`: List of error messages or an empty list
- `log`: (optional) List of stepwise logs for traceability

**Error Example:**

```json
{
  "status": "error",
  "errors": [
    "File 'raw_data.csv' not found",
    "Reference 'paper2.pdf' unreadable"
  ],
  "log": ["Started processing", "Failed to load data"]
}
```

---

## 7. Test Scenario — Exploratory Analysis Step

**Test: Orchestrator requests EDA script from Code Generator, and Code Executor runs it.**

### Code Generator Call

```json
POST /code-generator/generate
{
  "project_id": "test001",
  "cleaned_data": "test_data.csv",
  "hypotheses": ["H1: More social media use predicts lower GPA"],
  "analysis_plan": ["Descriptive statistics", "Detect GPA outliers"]
}
```

**Code Generator Response:**

```json
{
  "status": "success",
  "analysis_scripts": {
    "eda.py": "import pandas as pd\ndf = pd.read_csv('test_data.csv')\nprint(df.describe())"
  },
  "exploratory_findings": {
    "description": "GPA mean=2.8, SD=0.5",
    "outliers": "1 student with GPA < 1.0"
  },
  "log": ["EDA script generated"],
  "errors": []
}
```

### Code Executor Call

```json
POST /code-executor/run
{
  "project_id": "test001",
  "scripts": {
    "eda.py": "import pandas as pd\ndf = pd.read_csv('test_data.csv')\nprint(df.describe())"
  },
  "data": "test_data.csv",
  "environment": {
    "python_version": "3.10",
    "packages": ["pandas"]
  }
}
```

**Code Executor Response:**

```json
{
  "status": "success",
  "execution_logs": ["EDA completed, output: eda_results.csv"],
  "output_files": ["eda_results.csv"],
  "errors": []
}
```

---

*These contracts and conventions will ensure robust, traceable, and easily debuggable communication between all modules in your MCP suite.*