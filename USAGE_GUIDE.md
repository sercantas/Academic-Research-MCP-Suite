# Academic Research MCP Suite - Usage Guide

## Installation

### Global Installation (Recommended)
```bash
npm install -g academic-research-mcp-suite
```

This installs all 6 MCP servers as global commands.

### Local Installation
```bash
npm install academic-research-mcp-suite
```

## Running MCP Servers

### Method 1: Global Commands (After Global Install)

Once installed globally, you can run each server directly:

```bash
# Research Orchestrator
academic-research-orchestrator

# Research Initiator
academic-research-initiator

# Data Processor
academic-data-processor

# Code Generator
academic-code-generator

# Code Executor
academic-code-executor

# Research Writer
academic-research-writer
```

### Method 2: Direct Execution (Local Development)

If you're developing locally, run the compiled files from the `dist/` directory:

```bash
# From project root
node dist/research_orchestrator.js
node dist/research_initiator_developer_server.js
node dist/data_wrangler.js
node dist/code_generator_v2.js
node dist/code_executor.js
node dist/research_writer.js
```

Or with npx:

```bash
npx -y ./dist/data_wrangler.js
```

### Method 3: Via npx (Without Installation)

**Note:** This doesn't work directly with the package name because npm needs to know which server to run. Use global installation instead.

## Configuration for AI Assistants

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "academic-research-orchestrator": {
      "command": "academic-research-orchestrator"
    },
    "academic-research-initiator": {
      "command": "academic-research-initiator"
    },
    "academic-data-processor": {
      "command": "academic-data-processor"
    },
    "academic-code-generator": {
      "command": "academic-code-generator"
    },
    "academic-code-executor": {
      "command": "academic-code-executor"
    },
    "academic-research-writer": {
      "command": "academic-research-writer"
    }
  }
}
```

**Prerequisites:**
1. Install the package globally: `npm install -g academic-research-mcp-suite`
2. Restart Claude Desktop

### Amazon Q CLI

```bash
# Add each server
q mcp add academic-research-orchestrator academic-research-orchestrator
q mcp add academic-research-initiator academic-research-initiator
q mcp add academic-data-processor academic-data-processor
q mcp add academic-code-generator academic-code-generator
q mcp add academic-code-executor academic-code-executor
q mcp add academic-research-writer academic-research-writer

# List configured servers
q mcp list
```

### Kiro IDE

Add to `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "academic-research-orchestrator": {
      "command": "academic-research-orchestrator"
    },
    "academic-research-initiator": {
      "command": "academic-research-initiator"
    },
    "academic-data-processor": {
      "command": "academic-data-processor"
    },
    "academic-code-generator": {
      "command": "academic-code-generator"
    },
    "academic-code-executor": {
      "command": "academic-code-executor"
    },
    "academic-research-writer": {
      "command": "academic-research-writer"
    }
  }
}
```

## Understanding the Architecture

### Source vs Distribution

- **`src/`** - TypeScript source code (for development)
- **`dist/`** - Compiled JavaScript (for execution)

When you run `npm run build`, TypeScript files in `src/` are compiled to JavaScript in `dist/`.

### Why Global Installation?

MCP servers need to be accessible from anywhere on your system. Global installation:
1. Adds commands to your PATH
2. Makes them available to Claude Desktop, Amazon Q, etc.
3. Allows running from any directory

### The 6 Servers

| Command | Purpose | Input | Output |
|---------|---------|-------|--------|
| `academic-research-orchestrator` | Coordinates workflow | Research question, data | Complete pipeline |
| `academic-research-initiator` | Refines questions | Vague prompt | Hypotheses, definitions |
| `academic-data-processor` | Cleans data | Raw CSV | Clean CSV, quality report |
| `academic-code-generator` | Creates analysis code | Data, hypotheses | Python/R scripts |
| `academic-code-executor` | Runs scripts | Scripts, data | Results, visualizations |
| `academic-research-writer` | Generates reports | All components | Publication-ready report |

## Testing Your Installation

### 1. Check Global Installation

```bash
which academic-research-orchestrator
# Should output: /usr/local/bin/academic-research-orchestrator (or similar)
```

### 2. Test a Server

```bash
# This should start the server (it will wait for input via STDIN)
academic-data-processor
# Press Ctrl+C to exit
```

### 3. Check in Claude Desktop

1. Open Claude Desktop
2. Start a new conversation
3. Type: "List available MCP tools"
4. You should see tools from all 6 servers

## Troubleshooting

### "command not found"

**Problem:** Global commands not found

**Solution:**
```bash
# Reinstall globally
npm install -g academic-research-mcp-suite

# Check npm global bin path
npm config get prefix

# Make sure it's in your PATH
echo $PATH
```

### "could not determine executable to run"

**Problem:** Trying to run package name directly

**Solution:** Use the specific server commands:
```bash
# ❌ Wrong
npx academic-research-mcp-suite

# ✅ Correct
academic-research-orchestrator
```

### Claude Desktop not seeing servers

**Problem:** Servers not configured or not installed

**Solution:**
1. Install globally: `npm install -g academic-research-mcp-suite`
2. Update config file with correct paths
3. Restart Claude Desktop
4. Check Claude Desktop logs for errors

### Servers start but don't respond

**Problem:** MCP communication issue

**Solution:**
- Servers communicate via STDIN/STDOUT
- They're designed to be called by MCP clients (Claude, Q, etc.)
- Don't expect interactive terminal output
- Check logs in the AI assistant for errors

## Development Workflow

### 1. Make Changes
Edit files in `src/`

### 2. Build
```bash
npm run build
```

This compiles TypeScript and adds shebangs automatically.

### 3. Test
```bash
npm test
```

### 4. Test Locally
```bash
node dist/research_orchestrator.js
```

### 5. Publish
```bash
npm version patch  # or minor, or major
npm publish
```

## Best Practices

1. **Always install globally** for use with AI assistants
2. **Use specific server commands** (not package name)
3. **Check shebangs** are present in dist/ files
4. **Test after building** before publishing
5. **Update config files** when paths change

## Quick Reference

```bash
# Install
npm install -g academic-research-mcp-suite

# Run a server
academic-research-orchestrator

# Check installation
which academic-research-orchestrator

# Update
npm update -g academic-research-mcp-suite

# Uninstall
npm uninstall -g academic-research-mcp-suite
```

## Support

- **Documentation:** See README.md and EXAMPLES.md
- **Issues:** https://github.com/sercantas/academic-research-mcp-suite/issues
- **npm:** https://www.npmjs.com/package/academic-research-mcp-suite

---

*Academic Research MCP Suite - Making research automation accessible to everyone* 🔬✨
