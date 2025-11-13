#!/bin/bash

# Prepare Academic Research MCP Suite for NPM Publishing
echo "📦 Preparing Academic Research MCP Suite for NPM..."

# Compile all servers first
echo "🔨 Compiling servers..."
./scripts/compile.sh

# Add shebang lines to all compiled servers
echo "🔧 Adding shebang lines for NPM binaries..."

servers=(
    "dist/research_orchestrator.js"
    "dist/research_initiator_developer_server.js"
    "dist/data_wrangler.js"
    "dist/code_generator_v2.js"
    "dist/code_executor.js"
    "dist/research_writer.js"
)

for server in "${servers[@]}"; do
    if [ -f "$server" ]; then
        echo "  Adding shebang to $server..."
        # Create temporary file with shebang
        echo "#!/usr/bin/env node" > temp_file
        cat "$server" >> temp_file
        mv temp_file "$server"
        chmod +x "$server"
        echo "  ✅ $server is now executable"
    else
        echo "  ❌ $server not found"
    fi
done

# Test all servers
echo "🧪 Testing servers..."
node scripts/test.js

# Create NPM-ready configuration examples
echo "📋 Creating NPM configuration examples..."

cat > npm-mcp-config-example.json << 'EOF'
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
EOF

echo "✅ NPM preparation complete!"
echo ""
echo "📊 NPM Package Summary:"
echo "  Package name: academic-research-mcp-suite"
echo "  Version: 1.0.0"
echo "  Binaries: 6 MCP servers"
echo "  Files included: src/, dist/, docs/, config/, scripts/"
echo ""
echo "🚀 Ready for NPM publishing!"
echo ""
echo "📖 Next steps:"
echo "  1. Update author info in package.json"
echo "  2. Create GitHub repository"
echo "  3. Test locally: npm pack"
echo "  4. Publish: npm publish"
echo ""
echo "💡 Users will install with:"
echo "  npm install -g academic-research-mcp-suite"
echo "  or use directly with npx"
