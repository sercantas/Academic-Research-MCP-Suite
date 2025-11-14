"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
// Helper functions for enhanced research question refinement
function extractVariables(prompt) {
    const variables = [];
    // Common research variable patterns
    const patterns = [
        /\b(effect|impact|influence|relationship|correlation|association)\s+(?:of|between)\s+([^and,\.]+?)(?:\s+and\s+([^,\.]+?))?(?:\s+on\s+([^,\.]+?))?/gi,
        /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:affects?|influences?|predicts?|determines?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    ];
    patterns.forEach(pattern => {
        const matches = prompt.matchAll(pattern);
        for (const match of matches) {
            for (let i = 1; i < match.length; i++) {
                if (match[i] && match[i].trim().length > 2) {
                    const variable = match[i].trim().replace(/\s+/g, '_').toLowerCase();
                    if (!variables.includes(variable)) {
                        variables.push(variable);
                    }
                }
            }
        }
    });
    // If no variables found, extract key nouns
    if (variables.length === 0) {
        const words = prompt.split(/\s+/);
        const meaningfulWords = words.filter(w => w.length > 4 && !/^(what|how|why|does|the|and|or|but)$/i.test(w));
        variables.push(...meaningfulWords.slice(0, 3).map(w => w.toLowerCase()));
    }
    return variables.slice(0, 5); // Limit to 5 key variables
}
function refineQuestion(prompt, variables) {
    // Apply SMART criteria to refine the question
    let refined = prompt;
    // Make it specific
    if (!prompt.includes('?')) {
        refined = `How does ${variables[0] || 'the independent variable'} affect ${variables[1] || 'the dependent variable'}?`;
    }
    // Add measurability context
    if (!refined.toLowerCase().includes('measure') && !refined.toLowerCase().includes('assess')) {
        refined = refined.replace('?', ' (measured quantitatively)?');
    }
    // Ensure it's research-focused
    if (!refined.toLowerCase().match(/\b(relationship|effect|impact|influence|correlation|difference|association)\b/)) {
        refined = `What is the relationship between ${variables.join(' and ')}? ${refined}`;
    }
    return refined;
}
function generateHypotheses(prompt, variables, references) {
    const hypotheses = [];
    // Generate null hypothesis
    if (variables.length >= 2) {
        hypotheses.push(`H0 (Null): There is no significant relationship between ${variables[0]} and ${variables[1]}.`);
        // Generate alternative hypothesis (directional)
        hypotheses.push(`H1 (Alternative): ${variables[0]} has a significant positive effect on ${variables[1]}.`);
        // Generate alternative hypothesis (non-directional)
        hypotheses.push(`H2 (Alternative): There is a significant relationship between ${variables[0]} and ${variables[1]}.`);
    }
    else {
        hypotheses.push(`H0 (Null): The observed pattern in ${prompt} is due to chance.`);
        hypotheses.push(`H1 (Alternative): The observed pattern in ${prompt} is statistically significant.`);
    }
    // Add moderator/mediator hypotheses if multiple variables
    if (variables.length >= 3) {
        hypotheses.push(`H3 (Moderator): ${variables[2]} moderates the relationship between ${variables[0]} and ${variables[1]}.`);
    }
    return hypotheses;
}
function createOperationalDefinitions(variables, prompt) {
    const definitions = {};
    variables.forEach((variable, index) => {
        const cleanVar = variable.replace(/_/g, ' ');
        definitions[variable] = {
            concept: cleanVar,
            measurement: index === 0 ? "Independent variable - measured via validated instrument/scale" :
                index === 1 ? "Dependent variable - measured via outcome metric" :
                    "Control/moderator variable - measured via survey/observation",
            scale_type: index < 2 ? "interval/ratio" : "nominal/ordinal",
            data_source: "Survey questionnaire / Observational data / Existing records",
            reliability: "Cronbach's alpha > 0.70 (for multi-item scales)",
            validity: "Content validity established through expert review"
        };
    });
    return definitions;
}
function generateLiteratureReview(prompt, references, variables) {
    const review = `
# Literature Review Notes

## Research Context
The research question "${prompt}" addresses an important gap in the existing literature. 
This study builds upon previous work examining ${variables.join(', ')}.

## Key Theoretical Frameworks
- Relevant theories that inform this research include established frameworks in the field
- Previous studies have examined similar relationships with varying methodologies
- The current study extends this work by ${references.length > 0 ? `incorporating insights from ${references.length} key references` : 'providing new empirical evidence'}

## Referenced Works
${references.map((ref, i) => `${i + 1}. ${ref} - Provides foundational understanding of key concepts`).join('\n')}

## Research Gap
While existing literature has explored related topics, there remains a need for:
- More rigorous empirical testing of the relationship between ${variables[0]} and ${variables[1]}
- Better operational definitions of key constructs
- Consideration of potential moderating/mediating factors

## Hypotheses Justification
The proposed hypotheses are grounded in:
- Theoretical frameworks from the literature
- Empirical findings from previous studies
- Logical reasoning about the relationships between variables

## Methodological Considerations
Based on the literature review:
- Quantitative methods are appropriate for testing the hypotheses
- Sample size should be adequate for statistical power (N > 30 minimum, ideally N > 100)
- Control variables should be included to account for confounding factors
- Validated measurement instruments should be used where available
`;
    return review.trim();
}
// Define the input schema for the 'refine' tool based on API_CONTRACT_Version2.md
const RefineInputSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    prompt: zod_1.z.string(),
    references: zod_1.z.array(zod_1.z.string()),
});
// Define the output schema for the 'refine' tool based on API_CONTRACT_Version2.md
const RefineOutputSchema = zod_1.z.object({
    status: zod_1.z.string(),
    refined_question: zod_1.z.string(),
    hypotheses: zod_1.z.array(zod_1.z.string()),
    operational_definitions: zod_1.z.record(zod_1.z.string(), zod_1.z.any()), // Using z.any() for simplicity, can be more specific
    lit_review_notes: zod_1.z.string(),
    log: zod_1.z.array(zod_1.z.string()),
    errors: zod_1.z.array(zod_1.z.string()),
});
const server = new index_js_1.Server({
    name: "academic-research-initiator-developer",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
const tools = [
    {
        name: "refine", // Matches the endpoint /initiator/refine
        description: "Refines research questions, develops hypotheses, and operationalizes concepts.",
        inputSchema: {
            type: "object",
            properties: {
                project_id: { type: "string" },
                prompt: { type: "string" },
                references: { type: "array", items: { type: "string" } },
            },
            required: ["project_id", "prompt", "references"],
        },
        outputSchema: {
            type: "object",
            properties: {
                status: { type: "string" },
                refined_question: { type: "string" },
                hypotheses: { type: "array", items: { type: "string" } },
                operational_definitions: { type: "object" },
                lit_review_notes: { type: "string" },
                log: { type: "array", items: { type: "string" } },
                errors: { type: "array", items: { type: "string" } },
            },
            required: ["status", "refined_question", "hypotheses", "operational_definitions", "lit_review_notes", "log", "errors"],
        }
    },
];
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return { tools };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "refine") {
        try {
            const validatedArgs = RefineInputSchema.parse(args);
            const { project_id, prompt, references } = validatedArgs;
            // --- Enhanced Implementation ---
            const log = [];
            const errors = [];
            log.push(`Processing project_id: ${project_id}`);
            log.push(`Received prompt: ${prompt}`);
            log.push(`Received ${references.length} references.`);
            // Step 1: Analyze and refine the research question
            log.push("Analyzing research question structure...");
            // Check if question is specific enough
            const isSpecific = prompt.length > 20 && (prompt.includes('?') || prompt.toLowerCase().includes('how') || prompt.toLowerCase().includes('what') || prompt.toLowerCase().includes('why'));
            if (!isSpecific) {
                log.push("Warning: Research question may need more specificity");
            }
            // Identify key variables from the prompt
            const variables = extractVariables(prompt);
            log.push(`Identified ${variables.length} key variables: ${variables.join(', ')}`);
            // Refine the question with SMART criteria
            const refined_question = refineQuestion(prompt, variables);
            log.push("Applied SMART criteria to refine question");
            // Step 2: Generate comprehensive hypotheses
            log.push("Generating hypotheses...");
            const hypotheses = generateHypotheses(prompt, variables, references);
            log.push(`Generated ${hypotheses.length} hypotheses (null and alternative)`);
            // Step 3: Create operational definitions
            log.push("Creating operational definitions...");
            const operational_definitions = createOperationalDefinitions(variables, prompt);
            log.push(`Operationalized ${Object.keys(operational_definitions).length} concepts`);
            // Step 4: Generate literature review notes
            log.push("Synthesizing literature review notes...");
            const lit_review_notes = generateLiteratureReview(prompt, references, variables);
            log.push("Literature review synthesis complete");
            // --- End Enhanced Implementation ---
            const output = {
                status: "success",
                refined_question,
                hypotheses,
                operational_definitions,
                lit_review_notes,
                log,
                errors,
            };
            RefineOutputSchema.parse(output); // Validate output before sending
            return {
                content: [
                    {
                        type: "json", // MCP SDK expects content to be an array of objects with type and text/json
                        json: output,
                    },
                ],
            };
        }
        catch (error) {
            console.error("Error in 'refine' tool:", error);
            const errors = error instanceof zod_1.z.ZodError ? error.errors.map(e => e.message) : [error.message];
            return {
                content: [
                    {
                        type: "json",
                        json: {
                            status: "error",
                            refined_question: "",
                            hypotheses: [],
                            operational_definitions: {},
                            lit_review_notes: "",
                            log: [`Error processing project_id: ${args?.project_id || 'unknown'}`],
                            errors: errors,
                        },
                    },
                ],
            };
        }
    }
    throw new Error(`Tool not implemented: ${name}`);
});
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport).then(() => {
    console.error("Research Initiator Developer Server started and connected via STDIN/STDOUT.");
});
// To run this server:
// 1. Ensure you have the MCP SDK and Zod installed:
//    npm install @modelcontextprotocol/sdk zod
// 2. Compile this TypeScript file to JavaScript:
//    npx tsc research_initiator_developer_server.ts
// 3. Run the compiled JavaScript file:
//    node research_initiator_developer_server.js
// Example MCP CLI call (after server is running):
// mcp call academic-research-initiator-developer refine '{"project_id": "test001", "prompt": "How does climate change affect coffee production?", "references": ["smith2023.pdf", "jones2022.pdf"]}'
