#!/bin/bash

# Compile All Academic Research MCP Suite Servers
echo "🔬 Compiling Complete Academic Research MCP Suite..."

# Create dist directory if it doesn't exist
mkdir -p dist

# List of all server files to compile (from src directory)
servers=(
    "src/research_initiator_developer_server.ts"
    "src/code_generator_v2.ts"
    "src/research_orchestrator.ts"
    "src/data_wrangler.ts"
    "src/code_executor.ts"
    "src/research_writer.ts"
)

# Compile each server individually
success_count=0
total_count=${#servers[@]}

for server in "${servers[@]}"; do
    echo "Compiling $server..."
    npx tsc "$server" --outDir ./dist --esModuleInterop --resolveJsonModule --skipLibCheck --target es2020 --module commonjs --strict false
    if [ $? -eq 0 ]; then
        echo "✅ Successfully compiled $server"
        ((success_count++))
    else
        echo "❌ Failed to compile $server"
    fi
    echo ""
done

echo "📊 Compilation Summary:"
echo "  ✅ Successful: $success_count/$total_count servers"
echo "  ❌ Failed: $((total_count - success_count))/$total_count servers"

if [ $success_count -eq $total_count ]; then
    echo "🎉 All servers compiled successfully!"
else
    echo "⚠️  Some servers failed to compile. Check errors above."
fi

echo ""
echo "📁 Compiled files in ./dist/:"
ls -la ./dist/*.js 2>/dev/null | head -10

echo ""
echo "🔧 Adding shebangs to compiled files..."
./scripts/add-shebangs.sh
