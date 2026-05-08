#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ── Canonical server definitions ─────────────────────────────────────────────
const SERVERS = {
  'academic-research-orchestrator': { command: 'academic-research-orchestrator' },
  'academic-research-initiator':    { command: 'academic-research-initiator' },
  'academic-data-processor':        { command: 'academic-data-processor' },
  'academic-code-generator':        { command: 'academic-code-generator' },
  'academic-code-executor':         { command: 'academic-code-executor' },
  'academic-research-writer':       { command: 'academic-research-writer' },
};

// Gemini/Antigravity need absolute paths since they may not inherit full PATH
function withAbsPath(servers) {
  const { execFileSync } = require('child_process');
  const result = {};
  for (const [name, cfg] of Object.entries(servers)) {
    try {
      const abs = execFileSync('which', [cfg.command], { stdio: 'pipe' }).toString().trim();
      result[name] = { ...cfg, command: abs };
    } catch {
      result[name] = cfg; // fall back to bare name
    }
  }
  return result;
}

// ── Client targets ────────────────────────────────────────────────────────────
const HOME = os.homedir();

const TARGETS = [
  {
    name: 'Kiro CLI',
    file: path.join(HOME, '.kiro/settings/mcp.json'),
    wrap: servers => ({ mcpServers: servers }),
    servers: SERVERS,
  },
  {
    name: 'Claude Code',
    file: path.join(HOME, '.claude/settings.json'),
    wrap: servers => ({ mcpServers: servers }),
    servers: SERVERS,
  },
  {
    name: 'Cursor',
    file: path.join(HOME, '.cursor/mcp.json'),
    wrap: servers => ({ mcpServers: servers }),
    servers: SERVERS,
  },
  {
    name: 'Claude Desktop',
    file: path.join(HOME, 'Library/Application Support/Claude/claude_desktop_config.json'),
    wrap: servers => ({ mcpServers: servers }),
    servers: SERVERS,
    merge: true, // preserve existing non-suite entries
  },
  {
    name: 'Gemini CLI',
    file: path.join(HOME, '.gemini/settings.json'),
    wrap: servers => ({ mcpServers: servers }),
    servers: withAbsPath(SERVERS),
    merge: true, // preserve theme/auth settings
  },
  {
    name: 'Antigravity (Google IDE)',
    file: path.join(HOME, '.gemini/antigravity/mcp_config.json'),
    wrap: servers => ({ mcpServers: servers }),
    servers: withAbsPath(SERVERS),
  },
];

// ── Writer ────────────────────────────────────────────────────────────────────
function writeConfig(target) {
  const { name, file, wrap, servers, merge } = target;
  fs.mkdirSync(path.dirname(file), { recursive: true });

  let existing = {};
  if (merge && fs.existsSync(file)) {
    try { existing = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  }

  // For merge targets: keep non-suite keys in mcpServers, replace suite keys
  const existingServers = existing.mcpServers || {};
  const nonSuiteServers = Object.fromEntries(
    Object.entries(existingServers).filter(([k]) => !Object.keys(SERVERS).includes(k))
  );

  const newConfig = merge
    ? { ...existing, ...wrap({ ...nonSuiteServers, ...servers }) }
    : wrap(servers);

  fs.writeFileSync(file, JSON.stringify(newConfig, null, 2) + '\n');
  console.log(`  ✅ ${name}\n     ${file}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('\n🔧 Academic Research MCP Suite — Config Generator\n' + '─'.repeat(50));

let ok = 0;
for (const target of TARGETS) {
  try {
    writeConfig(target);
    ok++;
  } catch (err) {
    console.log(`  ❌ ${target.name}: ${err.message}`);
  }
}

console.log('─'.repeat(50));
console.log(`  ${ok}/${TARGETS.length} clients configured\n`);
console.log('  Restart Claude Desktop and Cursor to pick up changes.\n');
process.exit(ok === TARGETS.length ? 0 : 1);
