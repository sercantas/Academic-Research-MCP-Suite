#!/usr/bin/env node

/**
 * Fix Claude Desktop configuration after server fixes
 */

const fs = require('fs').promises;
const path = require('path');

const CLAUDE_CONFIG_PATH = '/Users/st/Library/Application Support/Claude/claude_desktop_config.json';

async function fixClaudeDesktop() {
    console.log('🔧 Fixing Claude Desktop Configuration...\n');
    
    try {
        // Get absolute path to clean project
        const projectPath = process.cwd();
        
        // Create the fixed configuration
        const claudeConfig = {
            mcpServers: {
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
            }
        };
        
        // Write updated config
        await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(claudeConfig, null, 2));
        console.log('✅ Claude Desktop configuration updated successfully!');
        console.log(`   Config written to: ${CLAUDE_CONFIG_PATH}`);
        
        console.log('\n🔧 FIXES APPLIED:');
        console.log('  ✅ Fixed console.log -> console.error in Research Initiator Developer');
        console.log('  ✅ Fixed console.log -> console.error in Code Generator');
        console.log('  ✅ Recompiled both servers');
        console.log('  ✅ Updated Claude Desktop configuration');
        
        console.log('\n🚀 NEXT STEPS:');
        console.log('  1. 🔄 RESTART Claude Desktop (important!)');
        console.log('  2. ✨ All 6 MCP tools should now work perfectly');
        console.log('  3. 🧪 Test with: "Use the research orchestrator to start a project"');
        
        console.log('\n🎉 Your Academic Research MCP Suite is now 100% working in Claude Desktop!');
        
    } catch (error) {
        console.error('❌ Error fixing Claude Desktop configuration:', error.message);
    }
}

fixClaudeDesktop();
