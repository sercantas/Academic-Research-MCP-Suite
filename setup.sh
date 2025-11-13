#!/bin/bash

# Academic Research MCP Suite - Setup Script
echo "🔬 Setting up Academic Research MCP Suite..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p reports processed_data output

# Compile TypeScript files
echo "🔨 Compiling TypeScript servers..."
./scripts/compile.sh

# Test all servers
echo "🧪 Testing MCP servers..."
node scripts/test.js

# Setup MCP configuration
echo "⚙️ Setting up MCP configuration..."
node scripts/setup-mcp.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Your Academic Research MCP Suite is ready to use!"
echo ""
echo "📖 Next steps:"
echo "  1. Open Amazon Q CLI"
echo "  2. Try: 'Use academic-research-orchestrator___initiate to start a research project'"
echo "  3. Check docs/ for detailed usage instructions"
echo ""
echo "🎉 Happy researching!"
