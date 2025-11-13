# Modular-academic-researchflow-mcp
[![npm version](https://badge.fury.io/js/academic-research-mcp-suite.svg)](https://badge.fury.io/js/academic-research-mcp-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive **Model Context Protocol (MCP)** server suite for academic research workflow automation. Transform your research process from initial questions to publication-ready reports with AI-powered automation.

## 🎯 What is This?

The Academic Research MCP Suite provides **6 specialized AI servers** that work together to automate your entire research workflow:

- 🧠 **Question Refinement** → Transform vague ideas into testable hypotheses
- 🗃️ **Data Processing** → Clean and prepare datasets intelligently  
- 💻 **Code Generation** → Create statistical analysis scripts automatically
- ⚡ **Script Execution** → Run analyses in Python, R, or Node.js
- 📊 **Report Writing** → Generate publication-ready research documents
- 🎯 **Workflow Orchestration** → Coordinate the entire research pipeline

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g academic-research-mcp-suite

# Or use directly with npx (no installation needed)
npx academic-research-mcp-suite
```

### Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "academic-research-orchestrator": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-research-orchestrator"]
    },
    "academic-research-initiator": {
      "command": "npx", 
      "args": ["-y", "academic-research-mcp-suite", "academic-research-initiator"]
    },
    "academic-data-processor": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-data-processor"]
    },
    "academic-code-generator": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-code-generator"]
    },
    "academic-code-executor": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-code-executor"]
    },
    "academic-research-writer": {
      "command": "npx",
      "args": ["-y", "academic-research-mcp-suite", "academic-research-writer"]
    }
  }
}
```

### Usage with Amazon Q CLI

```bash
# Configure with Q CLI
q mcp add academic-research-orchestrator npx academic-research-mcp-suite academic-research-orchestrator
# ... repeat for other servers
```

## 🔬 The 6 Research Servers

### 1. 🎯 Research Orchestrator
**Coordinates complete research workflows**
- Manages the entire research pipeline
- Calls other servers automatically
- Tracks project progress and state

**Usage**: *"Use the research orchestrator to start a new research project on remote work productivity"*

### 2. 🧠 Research Initiator Developer  
**Refines research questions and develops hypotheses**
- Transforms vague research ideas into structured questions
- Develops testable hypotheses
- Creates operational definitions

**Usage**: *"Help me refine my research question about social media and mental health"*

### 3. 🗃️ Data Processor Wrangler
**Processes and cleans research data**
- Intelligent data cleaning and preparation
- Documents all processing decisions
- Handles multiple data formats

**Usage**: *"Process my survey data for analysis"*

### 4. 💻 Code Generator
**Generates statistical analysis scripts**
- Creates Python, R, and JavaScript code
- Implements appropriate statistical methods
- Provides exploratory data analysis

**Usage**: *"Generate Python code for correlation analysis between productivity and satisfaction"*

### 5. ⚡ Code Executor
**Executes analysis scripts safely**
- Runs Python, R, and Node.js scripts
- Captures outputs and logs
- Manages execution environments

**Usage**: *"Execute my statistical analysis scripts"*

### 6. 📊 Research Writer
**Composes comprehensive research reports**
- Generates publication-ready documents
- Synthesizes all research components
- Creates structured academic reports

**Usage**: *"Write a comprehensive research report from my analysis results"*

## 🔄 Complete Research Workflow

```mermaid
graph LR
    A[Research Idea] --> B[Question Refinement]
    B --> C[Data Processing]
    C --> D[Code Generation]
    D --> E[Script Execution]
    E --> F[Report Writing]
    F --> G[Publication-Ready Report]
```

**One Command Does It All:**
```
"Use the research orchestrator to conduct a complete study on [your topic] with data at [path]"
```

## 💡 Usage Examples

### Complete Workflow
```
"Use the research orchestrator to start a research project investigating the impact of remote work on employee productivity and job satisfaction, using my survey data at ./data/employee_survey.csv"
```

### Individual Tools
```
"Refine my research question: Does social media usage affect academic performance?"

"Process my dataset and prepare it for statistical analysis"

"Generate Python code for regression analysis with productivity as dependent variable"

"Execute my analysis scripts and capture the results"

"Write a comprehensive research report including methodology, results, and conclusions"
```

## 🛠️ Features

- ✅ **Complete Research Automation** - From question to publication
- ✅ **Multi-Language Support** - Python, R, Node.js code generation
- ✅ **Intelligent Data Processing** - Smart cleaning with decision logging
- ✅ **Statistical Analysis** - Appropriate methods for your research design
- ✅ **Publication-Ready Reports** - Structured academic documents
- ✅ **Claude Desktop Integration** - Natural conversation interface
- ✅ **Amazon Q CLI Support** - Command-line automation
- ✅ **Modular Architecture** - Use individual tools or complete workflow

## 📋 Requirements

- **Node.js** 18.0.0 or higher
- **Claude Desktop** or **Amazon Q CLI** (for MCP integration)
- **Python** (optional, for code execution)
- **R** (optional, for R script execution)

## 🔧 Development

```bash
# Clone and setup
git clone https://github.com/yourusername/academic-research-mcp-suite.git
cd academic-research-mcp-suite
npm install

# Build
npm run build

# Test
npm test

# Local development
npm run setup
```

## 📖 Documentation

- [API Documentation](./docs/API_CONTRACT_Version2.md)
- [Usage Guide](./docs/USAGE.md)
- [Complete Project Documentation](./docs/COMPLETE_PROJECT_SUCCESS.md)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🎉 Why Use This?

**Before**: Manual research workflows taking weeks or months
- ❌ Manual question refinement
- ❌ Time-consuming data cleaning  
- ❌ Writing analysis code from scratch
- ❌ Manual report compilation

**After**: Automated research pipeline in hours
- ✅ AI-powered question development
- ✅ Intelligent data processing
- ✅ Automatic code generation
- ✅ Publication-ready reports

## 🚀 Get Started Now

```bash
npx academic-research-mcp-suite
```

Transform your research workflow today! 🔬✨

---

*Academic Research MCP Suite - Revolutionizing research with AI automation*
