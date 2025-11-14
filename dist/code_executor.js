"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
// Define schemas based on API_CONTRACT_Version2.md
const RunInputSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    scripts: zod_1.z.record(zod_1.z.string()), // filename -> code content
    data: zod_1.z.string(), // path to data file
    environment: zod_1.z.string().optional().default("python"), // python, r, node
});
const RunOutputSchema = zod_1.z.object({
    status: zod_1.z.string(),
    execution_logs: zod_1.z.array(zod_1.z.string()),
    output_files: zod_1.z.array(zod_1.z.string()),
    errors: zod_1.z.array(zod_1.z.string()),
    log: zod_1.z.array(zod_1.z.string()),
});
// Tool definitions
const tools = [
    {
        name: "run",
        description: "Executes analysis scripts in a specified environment",
        inputSchema: {
            type: "object",
            properties: {
                project_id: { type: "string", description: "Unique project identifier" },
                scripts: {
                    type: "object",
                    description: "Map of filename to script content",
                    additionalProperties: { type: "string" }
                },
                data: { type: "string", description: "Path to data file for analysis" },
                environment: {
                    type: "string",
                    description: "Execution environment (python, r, node)",
                    enum: ["python", "r", "node"],
                    default: "python"
                },
            },
            required: ["project_id", "scripts", "data"],
        },
    },
];
// Helper functions
async function createWorkingDirectory(projectId) {
    const workDir = path.join("./output", projectId);
    await fs.mkdir(workDir, { recursive: true });
    return workDir;
}
async function writeScriptFile(workDir, filename, content) {
    const scriptPath = path.join(workDir, filename);
    await fs.writeFile(scriptPath, content, 'utf-8');
    return scriptPath;
}
async function executePythonScript(scriptPath, dataPath, workDir) {
    try {
        // Check if Python is available
        await execAsync('python --version');
    }
    catch {
        try {
            await execAsync('python3 --version');
        }
        catch {
            throw new Error('Python is not available in the system');
        }
    }
    // Execute the script
    const pythonCmd = await execAsync('python --version').then(() => 'python').catch(() => 'python3');
    const { stdout, stderr } = await execAsync(`cd "${workDir}" && ${pythonCmd} "${path.basename(scriptPath)}"`, {
        timeout: 60000, // 1 minute timeout
    });
    // Find output files created in the working directory
    const files = await fs.readdir(workDir);
    const outputFiles = files
        .filter(file => file !== path.basename(scriptPath) && !file.endsWith('.py'))
        .map(file => path.join(workDir, file));
    return { stdout, stderr, outputFiles };
}
async function executeRScript(scriptPath, dataPath, workDir) {
    try {
        await execAsync('Rscript --version');
    }
    catch {
        throw new Error('R is not available in the system');
    }
    const { stdout, stderr } = await execAsync(`cd "${workDir}" && Rscript "${path.basename(scriptPath)}"`, {
        timeout: 60000,
    });
    const files = await fs.readdir(workDir);
    const outputFiles = files
        .filter(file => file !== path.basename(scriptPath) && !file.endsWith('.R'))
        .map(file => path.join(workDir, file));
    return { stdout, stderr, outputFiles };
}
async function executeNodeScript(scriptPath, dataPath, workDir) {
    const { stdout, stderr } = await execAsync(`cd "${workDir}" && node "${path.basename(scriptPath)}"`, {
        timeout: 60000,
    });
    const files = await fs.readdir(workDir);
    const outputFiles = files
        .filter(file => file !== path.basename(scriptPath) && !file.endsWith('.js'))
        .map(file => path.join(workDir, file));
    return { stdout, stderr, outputFiles };
}
// Create and configure the server
const server = new index_js_1.Server({
    name: "academic-code-executor",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Handle tool listing
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return { tools };
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const serverLogs = [];
    try {
        if (name === "run") {
            serverLogs.push(`Starting code execution for project: ${args.project_id}`);
            // Validate input
            const validatedArgs = RunInputSchema.parse(args);
            serverLogs.push("Input validation successful");
            // Create working directory
            const workDir = await createWorkingDirectory(validatedArgs.project_id);
            serverLogs.push(`Created working directory: ${workDir}`);
            const executionLogs = [];
            const outputFiles = [];
            const errors = [];
            // Process each script
            for (const [filename, content] of Object.entries(validatedArgs.scripts)) {
                try {
                    serverLogs.push(`Processing script: ${filename}`);
                    // Write script to file
                    const scriptPath = await writeScriptFile(workDir, filename, content);
                    executionLogs.push(`Created script file: ${filename}`);
                    // Determine execution method based on file extension or environment
                    let result;
                    if (validatedArgs.environment === "python" || filename.endsWith('.py')) {
                        result = await executePythonScript(scriptPath, validatedArgs.data, workDir);
                        executionLogs.push(`Executed Python script: ${filename}`);
                    }
                    else if (validatedArgs.environment === "r" || filename.endsWith('.R')) {
                        result = await executeRScript(scriptPath, validatedArgs.data, workDir);
                        executionLogs.push(`Executed R script: ${filename}`);
                    }
                    else if (validatedArgs.environment === "node" || filename.endsWith('.js')) {
                        result = await executeNodeScript(scriptPath, validatedArgs.data, workDir);
                        executionLogs.push(`Executed Node.js script: ${filename}`);
                    }
                    else {
                        // Default to Python
                        result = await executePythonScript(scriptPath, validatedArgs.data, workDir);
                        executionLogs.push(`Executed script as Python: ${filename}`);
                    }
                    // Log execution results
                    if (result.stdout) {
                        executionLogs.push(`STDOUT from ${filename}:`);
                        executionLogs.push(result.stdout);
                    }
                    if (result.stderr) {
                        executionLogs.push(`STDERR from ${filename}:`);
                        executionLogs.push(result.stderr);
                    }
                    // Collect output files
                    outputFiles.push(...result.outputFiles);
                }
                catch (error) {
                    const errorMsg = `Failed to execute ${filename}: ${error.message}`;
                    errors.push(errorMsg);
                    executionLogs.push(errorMsg);
                    serverLogs.push(errorMsg);
                }
            }
            // Create execution summary
            const summaryPath = path.join(workDir, 'execution_summary.txt');
            const summary = `Execution Summary for Project: ${validatedArgs.project_id}
Timestamp: ${new Date().toISOString()}
Environment: ${validatedArgs.environment}
Data File: ${validatedArgs.data}

Scripts Executed:
${Object.keys(validatedArgs.scripts).map(f => `- ${f}`).join('\n')}

Output Files Generated:
${outputFiles.map(f => `- ${f}`).join('\n')}

Execution Logs:
${executionLogs.join('\n')}

${errors.length > 0 ? `Errors:\n${errors.join('\n')}` : 'No errors occurred.'}`;
            await fs.writeFile(summaryPath, summary, 'utf-8');
            outputFiles.push(summaryPath);
            serverLogs.push(`Execution completed. Generated ${outputFiles.length} output files.`);
            const response = {
                status: errors.length === 0 ? "success" : "partial_success",
                execution_logs: executionLogs,
                output_files: outputFiles,
                errors: errors,
                log: serverLogs,
            };
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response, null, 2),
                    },
                ],
            };
        }
        throw new Error(`Unknown tool: ${name}`);
    }
    catch (error) {
        serverLogs.push(`Error in '${name}' tool: ${error.message}`);
        const errMessages = error instanceof zod_1.z.ZodError ? error.errors.map(e => e.message) : [error.message];
        const errorResponse = {
            status: "error",
            execution_logs: [],
            output_files: [],
            errors: errMessages,
            log: serverLogs,
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(errorResponse, null, 2),
                },
            ],
            isError: true,
        };
    }
});
// Start the server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Code Executor Server started and connected via STDIN/STDOUT.");
}
main().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
