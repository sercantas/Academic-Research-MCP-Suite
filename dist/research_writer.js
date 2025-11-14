#!/usr/bin/env node
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
const ComposeInputSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    refined_question: zod_1.z.string(),
    hypotheses: zod_1.z.array(zod_1.z.string()),
    results: zod_1.z.string(),
    lit_review_notes: zod_1.z.string().optional(),
    methodology: zod_1.z.string().optional(),
    data_description: zod_1.z.string().optional(),
});
const ComposeOutputSchema = zod_1.z.object({
    status: zod_1.z.string(),
    research_report: zod_1.z.string(),
    summary: zod_1.z.string(),
    errors: zod_1.z.array(zod_1.z.string()),
    log: zod_1.z.array(zod_1.z.string()),
});
// Tool definitions
const tools = [
    {
        name: "compose",
        description: "Composes a final research report by synthesizing all project components",
        inputSchema: {
            type: "object",
            properties: {
                project_id: { type: "string", description: "Unique project identifier" },
                refined_question: { type: "string", description: "The refined research question" },
                hypotheses: { type: "array", items: { type: "string" }, description: "List of research hypotheses" },
                results: { type: "string", description: "Analysis results and findings" },
                lit_review_notes: { type: "string", description: "Literature review notes" },
                methodology: { type: "string", description: "Research methodology description" },
                data_description: { type: "string", description: "Description of data used" },
            },
            required: ["project_id", "refined_question", "hypotheses", "results"],
        },
    },
];
// Helper functions for report generation
function generateExecutiveSummary(question, hypotheses, results) {
    return `## Executive Summary

This research study investigated: "${question}"

**Key Hypotheses Tested:**
${hypotheses.map((h, i) => `${i + 1}. ${h}`).join('\n')}

**Main Findings:**
${results.substring(0, 500)}${results.length > 500 ? '...' : ''}

The study provides valuable insights into the research question and offers evidence-based conclusions for further consideration.`;
}
function generateMethodologySection(methodology, dataDescription) {
    return `## Methodology

${methodology || `This study employed a quantitative research approach with statistical analysis of the collected data. The methodology was designed to test the stated hypotheses through appropriate analytical techniques.`}

### Data Description
${dataDescription || `The dataset used in this analysis was processed and cleaned according to research best practices. Data quality checks were performed to ensure reliability of the results.`}

### Analytical Approach
Statistical analyses were conducted to test each hypothesis, including descriptive statistics, correlation analysis, and appropriate inferential tests based on the data characteristics and research questions.`;
}
function generateResultsSection(results, hypotheses) {
    return `## Results and Findings

### Statistical Analysis Results
${results}

### Hypothesis Testing Summary
${hypotheses.map((h, i) => `
**Hypothesis ${i + 1}:** ${h}
- Analysis conducted using appropriate statistical methods
- Results interpreted in context of research question
- Implications discussed below
`).join('\n')}

### Key Insights
The analysis reveals important patterns and relationships in the data that contribute to our understanding of the research question. Detailed statistical outputs and visualizations support these findings.`;
}
function generateLiteratureReview(litReviewNotes) {
    return `## Literature Review

${litReviewNotes || `The existing literature provides important context for this research. Previous studies have explored related questions and established theoretical frameworks that inform our approach. This study builds upon established research while contributing new insights to the field.`}

### Theoretical Framework
The research is grounded in established theoretical perspectives that guide the interpretation of findings and their implications for practice and future research.`;
}
function generateDiscussionAndConclusions(question, results) {
    return `## Discussion and Conclusions

### Interpretation of Findings
The results of this study provide important insights into the research question: "${question}"

The statistical analysis reveals patterns that contribute to our understanding of the underlying phenomena. These findings have both theoretical and practical implications.

### Limitations
As with all research, this study has certain limitations that should be considered when interpreting the results:
- Sample characteristics and generalizability
- Methodological constraints
- Data collection limitations

### Implications for Practice
The findings suggest several practical applications and recommendations for stakeholders in the field.

### Future Research Directions
This study opens several avenues for future investigation:
- Replication with different populations
- Longitudinal studies to examine changes over time
- Exploration of additional variables and relationships

### Conclusion
This research contributes valuable evidence to the field and provides a foundation for continued investigation of these important questions.`;
}
function generateReferences() {
    return `## References

*Note: In a complete research report, this section would include full citations of all sources referenced in the literature review and methodology sections. References should follow appropriate academic citation style (APA, MLA, etc.).*

1. [Literature sources would be listed here]
2. [Methodology references would be included]
3. [Statistical analysis references as appropriate]`;
}
async function createReportFile(projectId, content) {
    const reportsDir = "./reports";
    await fs.mkdir(reportsDir, { recursive: true });
    const filename = `${projectId}_research_report.md`;
    const filepath = path.join(reportsDir, filename);
    await fs.writeFile(filepath, content, 'utf-8');
    return filepath;
}
// Create and configure the server
const server = new index_js_1.Server({
    name: "academic-research-writer",
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
        if (name === "compose") {
            serverLogs.push(`Starting report composition for project: ${args.project_id}`);
            // Validate input
            const validatedArgs = ComposeInputSchema.parse(args);
            serverLogs.push("Input validation successful");
            // Generate report sections
            serverLogs.push("Generating executive summary...");
            const executiveSummary = generateExecutiveSummary(validatedArgs.refined_question, validatedArgs.hypotheses, validatedArgs.results);
            serverLogs.push("Generating literature review...");
            const literatureReview = generateLiteratureReview(validatedArgs.lit_review_notes);
            serverLogs.push("Generating methodology section...");
            const methodology = generateMethodologySection(validatedArgs.methodology, validatedArgs.data_description);
            serverLogs.push("Generating results section...");
            const resultsSection = generateResultsSection(validatedArgs.results, validatedArgs.hypotheses);
            serverLogs.push("Generating discussion and conclusions...");
            const discussion = generateDiscussionAndConclusions(validatedArgs.refined_question, validatedArgs.results);
            serverLogs.push("Generating references...");
            const references = generateReferences();
            // Compile full report
            const fullReport = `# Research Report: ${validatedArgs.refined_question}

**Project ID:** ${validatedArgs.project_id}  
**Generated:** ${new Date().toISOString()}

${executiveSummary}

${literatureReview}

${methodology}

${resultsSection}

${discussion}

${references}

---
*This report was generated by the Academic Research MCP Suite*`;
            // Save report to file
            serverLogs.push("Saving report to file...");
            const reportPath = await createReportFile(validatedArgs.project_id, fullReport);
            serverLogs.push(`Report saved to: ${reportPath}`);
            // Generate summary
            const summary = `Research report completed for project ${validatedArgs.project_id}. The report addresses the research question "${validatedArgs.refined_question}" and includes analysis of ${validatedArgs.hypotheses.length} hypotheses. The comprehensive report covers literature review, methodology, results, and conclusions with practical implications for the field.`;
            const response = {
                status: "success",
                research_report: reportPath,
                summary: summary,
                errors: [],
                log: serverLogs,
            };
            // Validate output
            ComposeOutputSchema.parse(response);
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
            research_report: "",
            summary: "",
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
    console.error("Research Writer Server started and connected via STDIN/STDOUT.");
}
main().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
