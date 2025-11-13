#!/usr/bin/env node

/**
 * Comprehensive test script for all Academic Research MCP Suite servers
 */

const { spawn } = require('child_process');
const path = require('path');

async function testMCPServer(serverPath, serverName) {
    console.log(`🧪 Testing ${serverName}...`);
    
    return new Promise((resolve) => {
        const server = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        let output = '';
        let errorOutput = '';
        
        server.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        server.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        server.on('close', (code) => {
            // Check if server started successfully
            if (errorOutput.includes('started and connected') || 
                output.includes('"result"') || 
                output.includes('capabilities')) {
                console.log(`✅ ${serverName} is working correctly`);
                resolve(true);
            } else {
                console.log(`❌ ${serverName} may have issues`);
                if (errorOutput && !errorOutput.includes('started and connected')) {
                    console.log(`   Error: ${errorOutput.substring(0, 100)}...`);
                }
                resolve(false);
            }
        });
        
        // Send initialize request
        const initRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: {
                    name: "test-client",
                    version: "1.0.0"
                }
            }
        };
        
        server.stdin.write(JSON.stringify(initRequest) + '\n');
        
        // Give server time to respond
        setTimeout(() => {
            server.kill();
        }, 3000);
    });
}

async function runAllTests() {
    console.log('🔬 Academic Research MCP Suite - Complete Server Testing\n');
    
    const servers = [
        ['./dist/research_initiator_developer_server.js', 'Research Initiator Developer'],
        ['./dist/code_generator_v2.js', 'Code Generator'],
        ['./dist/research_orchestrator.js', 'Research Orchestrator'],
        ['./dist/data_wrangler.js', 'Data Processor Wrangler'],
        ['./dist/code_executor.js', 'Code Executor'],
        ['./dist/research_writer.js', 'Research Writer']
    ];
    
    let successCount = 0;
    const results = [];
    
    for (const [serverPath, serverName] of servers) {
        const success = await testMCPServer(serverPath, serverName);
        results.push({ name: serverName, success });
        if (success) successCount++;
        console.log(''); // Add spacing
    }
    
    // Summary
    console.log('📊 Test Results Summary:');
    console.log('=' .repeat(50));
    
    results.forEach(({ name, success }) => {
        console.log(`${success ? '✅' : '❌'} ${name}`);
    });
    
    console.log('');
    console.log(`🎯 Overall Success Rate: ${successCount}/${servers.length} servers (${Math.round(successCount/servers.length*100)}%)`);
    
    if (successCount === servers.length) {
        console.log('🎉 All servers are working correctly!');
        console.log('\n🚀 Ready to configure with Q CLI:');
        console.log('   Run: node scripts/setup-mcp.js');
    } else {
        console.log(`⚠️  ${servers.length - successCount} server(s) need attention.`);
    }
    
    return successCount === servers.length;
}

runAllTests().catch(console.error);
