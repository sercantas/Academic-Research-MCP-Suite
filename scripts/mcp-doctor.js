#!/usr/bin/env node
'use strict';

const { execFileSync, spawn } = require('child_process');

const SERVERS = [
  { name: 'academic-research-orchestrator', bin: 'academic-research-orchestrator' },
  { name: 'academic-research-initiator',    bin: 'academic-research-initiator' },
  { name: 'academic-data-processor',        bin: 'academic-data-processor' },
  { name: 'academic-code-generator',        bin: 'academic-code-generator' },
  { name: 'academic-code-executor',         bin: 'academic-code-executor' },
  { name: 'academic-research-writer',       bin: 'academic-research-writer' },
];

const INIT_MSG = JSON.stringify({
  jsonrpc: '2.0', id: 1, method: 'initialize',
  params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'mcp-doctor', version: '1.0' } }
}) + '\n';

const TOOLS_MSG = JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n';

function checkBinary(bin) {
  try { execFileSync('which', [bin], { stdio: 'pipe' }); return true; }
  catch { return false; }
}

function probe(bin) {
  return new Promise((resolve) => {
    const start = Date.now();
    const proc = spawn(bin, [], { stdio: ['pipe', 'pipe', 'pipe'] });
    let buf = '';
    let result = { initialized: false, tools: [], latencyMs: null, error: null };

    const done = () => {
      result.latencyMs = Date.now() - start;
      try { proc.kill(); } catch {}
      resolve(result);
    };

    const timer = setTimeout(done, 5000);

    proc.stdout.on('data', chunk => {
      buf += chunk.toString();
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 1 && msg.result) {
            result.initialized = true;
            proc.stdin.write(TOOLS_MSG);
          }
          if (msg.id === 2 && msg.result?.tools) {
            result.tools = msg.result.tools.map(t => t.name);
            clearTimeout(timer);
            done();
          }
        } catch {}
      }
    });

    proc.on('error', err => { result.error = err.message; clearTimeout(timer); done(); });

    setTimeout(() => proc.stdin.write(INIT_MSG), 100);
  });
}

async function main() {
  console.log('\n🩺 MCP Doctor — Academic Research Suite\n' + '─'.repeat(50));
  let passed = 0;

  for (const { name, bin } of SERVERS) {
    process.stdout.write(`  ${name}\n`);

    if (!checkBinary(bin)) {
      console.log(`    ❌ binary not found on PATH\n`);
      continue;
    }

    const r = await probe(bin);

    if (r.error) {
      console.log(`    ❌ error: ${r.error}\n`);
    } else if (!r.initialized) {
      console.log(`    ❌ MCP handshake failed (timeout)\n`);
    } else if (r.tools.length === 0) {
      console.log(`    ⚠️  initialized but no tools listed  [${r.latencyMs}ms]\n`);
    } else {
      console.log(`    ✅ tools: ${r.tools.join(', ')}  [${r.latencyMs}ms]\n`);
      passed++;
    }
  }

  console.log('─'.repeat(50));
  console.log(`  ${passed}/${SERVERS.length} servers healthy\n`);
  process.exit(passed === SERVERS.length ? 0 : 1);
}

main();
