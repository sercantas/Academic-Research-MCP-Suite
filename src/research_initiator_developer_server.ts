import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Define the input schema for the 'refine' tool based on API_CONTRACT_Version2.md
const RefineInputSchema = z.object({
  project_id: z.string(),
  prompt: z.string(),
  references: z.array(z.string()),
});

// Define the output schema for the 'refine' tool based on API_CONTRACT_Version2.md
const RefineOutputSchema = z.object({
  status: z.string(),
  refined_question: z.string(),
  hypotheses: z.array(z.string()),
  operational_definitions: z.record(z.string(), z.any()), // Using z.any() for simplicity, can be more specific
  lit_review_notes: z.string(),
  log: z.array(z.string()),
  errors: z.array(z.string()),
});

const server = new Server(
  {
    name: "academic-research-initiator-developer",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools: Tool[] = [
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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "refine") {
    try {
      const validatedArgs = RefineInputSchema.parse(args);
      const { project_id, prompt, references } = validatedArgs;

      // --- Mock Implementation ---
      // In a real scenario, this would involve calls to language models,
      // literature search tools (e.g., Context7, AI Research Assistant),
      // and knowledge graph lookups.

      const refined_question = `Refined version of: ${prompt} based on ${references.join(", ")}.`;
      const hypotheses = [`H1: ${prompt} is positively correlated with outcome X.`];
      const operational_definitions = {
        [prompt.substring(0,10).replace(/\s/g, "_")]: "Measured by survey score Y.",
        "outcome_X": "Measured by metric Z."
      };
      const lit_review_notes = `Initial literature review suggests strong support for exploring '${prompt}'. Key papers include ${references.join(', ')}.`;
      const log = [
        `Processing project_id: ${project_id}`,
        `Received prompt: ${prompt}`,
        `Received ${references.length} references.`,
        "Refined question and generated hypotheses.",
        "Operationalized concepts.",
        "Generated literature review notes."
      ];
      const errors: string[] = [];
      // --- End Mock Implementation ---

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
    } catch (error: any) {
      console.error("Error in 'refine' tool:", error);
      const errors = error instanceof z.ZodError ? error.errors.map(e => e.message) : [error.message];
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
              log: [`Error processing project_id: ${args.project_id}`],
              errors: errors,
            },
          },
        ],
      };
    }
  }

  throw new Error(`Tool not implemented: ${name}`);
});

const transport = new StdioServerTransport();
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
