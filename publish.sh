#!/bin/bash

# Academic Research MCP Suite - Publishing Helper Script
# This script helps you publish to npm step by step

set -e  # Exit on error

echo "🔬 Academic Research MCP Suite - Publishing Helper"
echo "=================================================="
echo ""

# Check if package.json has been updated
if grep -q "YOUR NAME HERE" package.json || grep -q "yourusername" package.json; then
    echo "⚠️  WARNING: Please update package.json first!"
    echo ""
    echo "Update these fields:"
    echo "  - author.name"
    echo "  - author.email"
    echo "  - repository.url (with your GitHub username)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Step 1: Building project..."
npm run build

echo ""
echo "✅ Step 2: Running tests..."
npm test

echo ""
echo "✅ Step 3: Checking npm login status..."
if npm whoami > /dev/null 2>&1; then
    echo "✅ Logged in as: $(npm whoami)"
else
    echo "❌ Not logged in to npm"
    echo ""
    echo "Please run: npm login"
    exit 1
fi

echo ""
echo "✅ Step 4: Dry run - checking what will be published..."
npm publish --dry-run

echo ""
echo "=================================================="
echo "📦 Ready to publish!"
echo "=================================================="
echo ""
echo "Package: academic-research-mcp-suite"
echo "Version: 1.0.0"
echo ""
read -p "Do you want to publish now? (yes/no): " answer

if [ "$answer" = "yes" ]; then
    echo ""
    echo "🚀 Publishing to npm..."
    npm publish
    
    echo ""
    echo "🎉 SUCCESS! Package published!"
    echo ""
    echo "Next steps:"
    echo "1. Create GitHub release: https://github.com/YOUR_USERNAME/academic-research-mcp-suite/releases/new"
    echo "2. Tag: v1.0.0"
    echo "3. Add npm badges to README"
    echo "4. Share the news!"
    echo ""
    echo "View your package: https://www.npmjs.com/package/academic-research-mcp-suite"
else
    echo ""
    echo "Publishing cancelled. Run this script again when ready."
fi
