#!/usr/bin/env node

/**
 * Update MCP configuration with all 6 Academic Research servers
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const execAsync = promisify(exec);

async function updateMCPConfig() {
    console.log('🔧 Updating MCP Configuration with Complete Academic Research Suite...\n');
    
    try {
        // Create .amazonq directory if it doesn't exist
        await fs.mkdir('.amazonq', { recursive: true });
        
        // Copy the config file to the expected location
        await fs.copyFile('./config/mcp-config.json', './.amazonq/mcp.json');
        console.log('📁 Created MCP config in \'.amazonq/mcp.json\'');
        
        // Import the complete configuration
        console.log('📥 Importing complete MCP configuration...');
        const { stdout, stderr } = await execAsync('q mcp import --file .amazonq/mcp.json --force workspace');
        
        if (stderr) {
            console.log('Import output:', stderr);
        }
        
        console.log('✅ MCP configuration updated successfully!\n');
        
        // List the configured servers
        console.log('📋 Listing configured MCP servers...');
        const { stdout: listOutput } = await execAsync('q mcp list');
        console.log(listOutput);
        
        console.log('🎉 Complete Academic Research MCP Suite is now configured!\n');
        
        console.log('🚀 Available MCP Tools in Q CLI:');
        console.log('  • academic-research-orchestrator___initiate');
        console.log('  • academic-research-initiator-developer___refine');
        console.log('  • academic-data-processor-wrangler___process');
        console.log('  • academic-code-generator___generate');
        console.log('  • academic-code-executor___run');
        console.log('  • academic-research-writer___compose');
        
        console.log('\n📖 Usage Examples:');
        console.log('  "Use academic-research-orchestrator___initiate to start a new research project"');
        console.log('  "Help me refine my research question using academic-research-initiator-developer___refine"');
        console.log('  "Generate analysis code with academic-code-generator___generate"');
        
        console.log('\n✨ Your complete Academic Research MCP Suite is ready to use!');
        
    } catch (error) {
        console.error('❌ Error updating MCP configuration:', error.message);
        console.log('\n🔧 Manual steps:');
        console.log('1. Run: q mcp import --file .amazonq/mcp.json --force workspace');
        console.log('2. Run: q mcp list (to verify)');
    }
}

updateMCPConfig();
