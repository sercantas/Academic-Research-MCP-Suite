# Academic Research MCP Suite - Usage Guide

## Quick Start

1. **Setup**: Run the setup script
   ```bash
   ./setup-mcp-suite.sh
   ```

2. **Test Servers**: Verify servers are working
   ```bash
   node test-mcp-servers.js
   ```

3. **Add to Q CLI**: Add the MCP configuration to your Q CLI
   ```bash
   q mcp import .amazonq/mcp.json
   ```

## Available MCP Servers

### 1. Academic Research Initiator Developer
- **Server Name**: `academic-research-initiator-developer`
- **Tool**: `refine`
- **Purpose**: Refines research questions and develops hypotheses

**Example Usage**:
```bash
# In Q CLI chat, the server will be available as a tool
# You can call: academic-research-initiator-developer___refine
```

### 2. Academic Code Generator  
- **Server Name**: `academic-code-generator`
- **Tool**: `generate`
- **Purpose**: Generates analysis scripts based on research design

## Manual Server Testing

To test a server manually:

```bash
# Start the server
node dist/research_initiator_developer_server.js

# In another terminal, send MCP requests
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/research_initiator_developer_server.js
```

## Project Structure

```
academic-research-mcp-suite/
├── dist/                          # Compiled JavaScript files
├── .amazonq/mcp.json             # MCP configuration
├── reports/                      # Generated reports
├── processed_data/               # Processed datasets
├── output/                       # Analysis outputs
├── API_CONTRACT_Version2.md      # API specifications
└── README.md                     # Project documentation
```

## Troubleshooting

1. **Compilation Errors**: Some servers have syntax issues and need manual fixes
2. **Missing Dependencies**: Run `npm install` to ensure all packages are installed
3. **Path Issues**: Ensure all paths in mcp.json are absolute paths

## Next Steps

1. Fix remaining server compilation issues
2. Implement proper error handling
3. Add comprehensive testing
4. Create example workflows
