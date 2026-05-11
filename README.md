# Academic Research MCP Suite

[![npm version](https://badge.fury.io/js/academic-research-mcp-suite.svg)](https://badge.fury.io/js/academic-research-mcp-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Academic Research MCP Suite is a set of six specialized Model Context Protocol (MCP) servers that automate the full academic research pipeline — from refining a vague research question to generating a publication-ready report. Each server handles a distinct stage of the workflow: question development, data processing, code generation, script execution, and report writing, with an orchestrator that coordinates the entire sequence. The suite integrates with all major AI clients (Claude Desktop, Claude Code, Cursor, Gemini CLI, Kiro CLI, and Google's Antigravity IDE) and is designed to be installed once and used everywhere.

---

## The 6 Servers

| Binary | Role |
|---|---|
| `academic-research-orchestrator` | Coordinates the full pipeline end-to-end |
| `academic-research-initiator` | Refines research questions into testable hypotheses |
| `academic-data-processor` | Cleans and prepares datasets |
| `academic-code-generator` | Generates statistical analysis scripts (Python, R, JS) |
| `academic-code-executor` | Runs analysis scripts and captures output |
| `academic-research-writer` | Composes structured academic reports (APA / ASA / generic) |

---

## Step 1 — Install

```bash
npm install -g academic-research-mcp-suite
```

Requires Node.js 18+.

---

## Step 2 — Verify the installation

```bash
academic-mcp-doctor
```

This checks that all 6 server binaries are on your PATH, completes the MCP handshake with each one, and confirms their tools are exposed. You should see `6/6 servers healthy`.

---

## Step 3 — Configure your AI clients

```bash
academic-mcp-configure
```

This generates the correct MCP config for every supported client automatically:

| Client | Config file |
|---|---|
| Kiro CLI | `~/.kiro/settings/mcp.json` |
| Claude Code | `~/.claude/settings.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Cursor | `~/.cursor/mcp.json` |
| Gemini CLI | `~/.gemini/settings.json` |
| Antigravity (Google IDE) | `~/.gemini/antigravity/mcp_config.json` |

The command merges safely — it will not overwrite other MCP servers you already have configured.

**Restart Claude Desktop and Cursor** after running this command.

---

## Step 4 — Use it

Once configured, talk to any supported AI client naturally:

```
"Use the research orchestrator to run a complete study on remote work
 and employee productivity using my survey data at ./data/survey.csv"
```

Or use individual servers for specific tasks:

```
"Refine my research question: does social media usage affect academic performance?"
"Process my dataset and prepare it for statistical analysis"
"Generate Python code for a regression analysis"
"Execute my analysis scripts and capture the results"
"Write a research report from my analysis results"
```

The writer server accepts an optional `style` parameter (`"generic"`, `"apa"`, or `"asa"`) and a `references` array. Pass `style: "asa"` for sociology papers (front-loaded theory sections, ASA heading labels) or `style: "apa"` for quantitative/psych conventions. Any references you supply are rendered as a numbered list; bare "Firstname Lastname" entries are automatically flipped to "Lastname, Firstname." format.

---

## Workflow

```
Research Idea
    → Initiator   (refine question + hypotheses)
    → Processor   (clean data)
    → Generator   (write analysis code)
    → Executor    (run scripts)
    → Writer      (compose report)
    → Publication-ready output
```

The Orchestrator can run this entire sequence in a single prompt.

---

## Manual client configuration

If you prefer to configure clients manually instead of using `academic-mcp-configure`, add this block to your client's MCP config file:

```json
{
  "mcpServers": {
    "academic-research-orchestrator": { "command": "academic-research-orchestrator" },
    "academic-research-initiator":    { "command": "academic-research-initiator" },
    "academic-data-processor":        { "command": "academic-data-processor" },
    "academic-code-generator":        { "command": "academic-code-generator" },
    "academic-code-executor":         { "command": "academic-code-executor" },
    "academic-research-writer":       { "command": "academic-research-writer" }
  }
}
```

---

## Development

```bash
git clone https://github.com/sercantas/Academic-Research-MCP-Suite.git
cd Academic-Research-MCP-Suite
npm install
npm run build
npm test
```

---

## Requirements

- Node.js 18+
- One or more supported AI clients (see Step 3)
- Python or R (optional — only needed if you use the code executor with those languages)

---

## License

MIT
