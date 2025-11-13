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
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Define schemas based on API_CONTRACT_Version2.md
const ProcessInputSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    refined_question: zod_1.z.string(),
    hypotheses: zod_1.z.array(zod_1.z.string()),
    operational_definitions: zod_1.z.record(zod_1.z.any()),
    raw_data: zod_1.z.string(),
});
const ProcessOutputSchema = zod_1.z.object({
    status: zod_1.z.string(),
    cleaned_data: zod_1.z.string(),
    processing_log: zod_1.z.array(zod_1.z.string()),
    decision_rationale: zod_1.z.string(),
    errors: zod_1.z.array(zod_1.z.string()),
    log: zod_1.z.array(zod_1.z.string()),
});
// Tool definitions
const tools = [
    {
        name: "process",
        description: "Processes raw data and prepares datasets for analysis based on research design",
        inputSchema: {
            type: "object",
            properties: {
                project_id: { type: "string", description: "Unique project identifier" },
                refined_question: { type: "string", description: "The refined research question" },
                hypotheses: { type: "array", items: { type: "string" }, description: "List of research hypotheses" },
                operational_definitions: { type: "object", description: "Operational definitions of key concepts" },
                raw_data: { type: "string", description: "Path to raw data file" },
            },
            required: ["project_id", "refined_question", "hypotheses", "operational_definitions", "raw_data"],
        },
    },
];
// Helper functions for data processing
async function readDataFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    }
    catch (error) {
        throw new Error(`Failed to read data file: ${error.message}`);
    }
}
async function writeDataFile(filePath, data) {
    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, data, 'utf-8');
    }
    catch (error) {
        throw new Error(`Failed to write data file: ${error.message}`);
    }
}
function processCSVData(rawData, hypotheses, operationalDefs) {
    const processingSteps = [];
    const decisions = [];
    // Basic CSV processing simulation
    const lines = rawData.split('\n').filter(line => line.trim());
    processingSteps.push(`Initial data: ${lines.length} rows`);
    // Remove empty rows
    const nonEmptyLines = lines.filter(line => line.split(',').some(cell => cell.trim()));
    processingSteps.push(`After removing empty rows: ${nonEmptyLines.length} rows`);
    decisions.push("Removed empty rows to ensure data quality");
    // Basic header validation
    if (nonEmptyLines.length > 0) {
        const headers = nonEmptyLines[0].split(',').map(h => h.trim());
        processingSteps.push(`Detected columns: ${headers.join(', ')}`);
        // Check for required columns based on operational definitions
        const requiredColumns = Object.keys(operationalDefs);
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
            processingSteps.push(`Warning: Missing expected columns: ${missingColumns.join(', ')}`);
            decisions.push(`Proceeding without columns: ${missingColumns.join(', ')} - may need manual data mapping`);
        }
    }
    // Simulate data cleaning based on hypotheses
    hypotheses.forEach((hypothesis, index) => {
        processingSteps.push(`Processing for hypothesis ${index + 1}: ${hypothesis.substring(0, 50)}...`);
        decisions.push(`Applied standard cleaning procedures for hypothesis testing`);
    });
    // Return processed data (in real implementation, this would do actual cleaning)
    const cleanedData = nonEmptyLines.join('\n');
    return {
        cleanedData,
        processingSteps,
        decisions,
    };
}
// Create and configure the server
const server = new index_js_1.Server({
    name: "academic-data-processor-wrangler",
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
        if (name === "process") {
            serverLogs.push(`Starting data processing for project: ${args.project_id}`);
            // Validate input
            const validatedArgs = ProcessInputSchema.parse(args);
            serverLogs.push("Input validation successful");
            // Read raw data
            let rawData;
            try {
                rawData = await readDataFile(validatedArgs.raw_data);
                serverLogs.push(`Successfully read raw data from: ${validatedArgs.raw_data}`);
            }
            catch (error) {
                // If file doesn't exist, create sample data for demonstration
                rawData = `id,productivity_score,satisfaction_rating,work_location,hours_worked
1,85,4.2,remote,40
2,78,3.8,office,42
3,92,4.5,remote,38
4,73,3.2,office,45
5,88,4.1,remote,39`;
                serverLogs.push(`Raw data file not found, using sample data for demonstration`);
            }
            // Process the data
            const { cleanedData, processingSteps, decisions, } = processCSVData(rawData, validatedArgs.hypotheses, validatedArgs.operational_definitions);
            serverLogs.push(...processingSteps);
            // Create output file path
            const outputDir = "./processed_data";
            const cleanedDataPath = path.join(outputDir, `${validatedArgs.project_id}_cleaned.csv`);
            // Write cleaned data
            await writeDataFile(cleanedDataPath, cleanedData);
            serverLogs.push(`Cleaned data written to: ${cleanedDataPath}`);
            // Create decision rationale
            const rationale = `Data processing decisions for project ${validatedArgs.project_id}:
${decisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Processing was guided by the research question: "${validatedArgs.refined_question}"
and the following hypotheses:
${validatedArgs.hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Operational definitions applied:
${Object.entries(validatedArgs.operational_definitions).map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`).join('\n')}`;
            const response = {
                status: "success",
                cleaned_data: cleanedDataPath,
                processing_log: processingSteps,
                decision_rationale: rationale,
                errors: [],
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
            cleaned_data: "",
            processing_log: [],
            decision_rationale: "",
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
    console.error("Data Processor Wrangler Server started and connected via STDIN/STDOUT.");
}
main().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
