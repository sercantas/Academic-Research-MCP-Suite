#!/usr/bin/env node

/**
 * Configure Academic Research MCP Suite for both Claude Desktop and Amazon Q CLI
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const CLAUDE_CONFIG_PATH = '/Users/st/Library/Application Support/Claude/claude_desktop_config.json';

async function configureClaudeDesktop() {
    console.log('🤖 Configuring Claude Desktop...');
    
    try {
        // Read current Claude config
        let claudeConfig = {};
        try {
            const claudeConfigContent = await fs.readFile(CLAUDE_CONFIG_PATH, 'utf-8');
            claudeConfig = JSON.parse(claudeConfigContent);
        } catch (error) {
            console.log('   Creating new Claude Desktop config...');
        }
        
        // Get absolute path to clean project
        const projectPath = process.cwd();
        
        // Add our MCP servers to Claude config
        claudeConfig.mcpServers = {
            "academic-research-orchestrator": {
                "command": "node",
                "args": [`${projectPath}/dist/research_orchestrator.js`],
                "env": {
                    "RESEARCH_DATA_PATH": `${projectPath}/processed_data`,
                    "OUTPUT_PATH": `${projectPath}/output`
                }
            },
            "academic-research-initiator-developer": {
                "command": "node",
                "args": [`${projectPath}/dist/research_initiator_developer_server.js`],
                "env": {
                    "RESEARCH_DATA_PATH": `${projectPath}/processed_data`,
                    "OUTPUT_PATH": `${projectPath}/output`
                }
            },
            "academic-data-processor-wrangler": {
                "command": "node",
                "args": [`${projectPath}/dist/data_wrangler.js`],
                "env": {
                    "RESEARCH_DATA_PATH": `${projectPath}/processed_data`,
                    "OUTPUT_PATH": `${projectPath}/output`
                }
            },
            "academic-code-generator": {
                "command": "node",
                "args": [`${projectPath}/dist/code_generator_v2.js`],
                "env": {
                    "OUTPUT_PATH": `${projectPath}/output`
                }
            },
            "academic-code-executor": {
                "command": "node",
                "args": [`${projectPath}/dist/code_executor.js`],
                "env": {
                    "OUTPUT_PATH": `${projectPath}/output`
                }
            },
            "academic-research-writer": {
                "command": "node",
                "args": [`${projectPath}/dist/research_writer.js`],
                "env": {
                    "REPORTS_PATH": `${projectPath}/reports`,
                    "OUTPUT_PATH": `${projectPath}/output`
                }
            }
        };
        
        // Write updated config
        await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(claudeConfig, null, 2));
        console.log('   ✅ Claude Desktop configured successfully!');
        
    } catch (error) {
        console.log(`   ❌ Error configuring Claude Desktop: ${error.message}`);
    }
}

async function configureQCLI() {
    console.log('🔧 Configuring Amazon Q CLI...');
    
    try {
        // Create .amazonq directory if it doesn't exist
        await fs.mkdir('.amazonq', { recursive: true });
        
        // Copy the config file to the expected location
        await fs.copyFile('./config/mcp-config.json', './.amazonq/mcp.json');
        
        // Import the complete configuration
        const { stdout, stderr } = await execAsync('q mcp import --file .amazonq/mcp.json --force workspace');
        
        if (stderr && stderr.includes('Imported')) {
            console.log('   ✅ Amazon Q CLI configured successfully!');
        } else {
            console.log('   ⚠️  Q CLI configuration may need manual setup');
        }
        
    } catch (error) {
        console.log(`   ❌ Error configuring Q CLI: ${error.message}`);
        console.log('   💡 Try running: q mcp import --file .amazonq/mcp.json --force workspace');
    }
}

async function main() {
    console.log('🎉 CONFIGURING ACADEMIC RESEARCH MCP SUITE FOR ALL PLATFORMS');
    console.log('=' .repeat(65));
    console.log('');
    
    // Configure Claude Desktop
    await configureClaudeDesktop();
    console.log('');
    
    // Configure Q CLI
    await configureQCLI();
    console.log('');
    
    console.log('🎊 CONFIGURATION COMPLETE!');
    console.log('');
    console.log('🚀 Your Academic Research MCP Suite is now available in:');
    console.log('   • 🤖 Claude Desktop (restart Claude to see tools)');
    console.log('   • 🔧 Amazon Q CLI (available immediately)');
    console.log('');
    console.log('🔬 Available Tools in Both Platforms:');
    console.log('   • academic-research-orchestrator');
    console.log('   • academic-research-initiator-developer');
    console.log('   • academic-data-processor-wrangler');
    console.log('   • academic-code-generator');
    console.log('   • academic-code-executor');
    console.log('   • academic-research-writer');
    console.log('');
    console.log('💡 Usage Examples:');
    console.log('   "Use the research orchestrator to start a new research project"');
    console.log('   "Help me refine my research question with the initiator developer"');
    console.log('   "Generate analysis code for my productivity study"');
    console.log('');
    console.log('🎉 Happy researching across all platforms! 🔬✨');
}

main().catch(console.error);
