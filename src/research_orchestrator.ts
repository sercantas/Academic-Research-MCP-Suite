import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Define schemas based on API_CONTRACT_Version2.md
const InitiateInputSchema = z.object({
  project_title: z.string(),
  user_prompt: z.string(),
  references: z.array(z.string()),
  raw_data: z.string(),
});

const InitiateOutputSchema = z.object({
  status: z.string(),
  project_id: z.string(),
  workflow_stage: z.string(),
  next_steps: z.array(z.string()),
  errors: z.array(z.string()),
  log: z.array(z.string()),
});

// Project state management
interface ProjectState {
  project_id: string;
  project_title: string;
  user_prompt: string;
  references: string[];
  raw_data_path: string;
  refined_question?: string;
  hypotheses?: string[];
  operational_definitions?: Record<string, any>;
  lit_review_notes?: string;
  cleaned_data_path?: string;
  processing_log?: string[];
  decision_rationale?: string;
  analysis_scripts?: Record<string, string>;
  exploratory_findings?: string;
  execution_logs?: string[];
  output_files?: string[];
  research_report_path?: string;
  summary?: string;
  workflow_stage: string;
  errors: string[];
  log: string[];
}

// In-memory storage (replace with database in production)
const projects: Record<string, ProjectState> = {};

// Helper function to call other MCP servers
async function callMCPServer(serverName: string, toolName: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const command = `echo '${JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: params
      }
    })}' | mcp call ${serverName} ${toolName} '${JSON.stringify(params)}'`;

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Orchestrator: Error calling ${serverName}.${toolName}:`, error.message);
        reject(new Error(`Failed to call ${serverName}.${toolName}: ${error.message}`));
        return;
      }

      if (stderr) {
        console.error(`Orchestrator: stderr from ${serverName}.${toolName}:`, stderr);
      }

      try {
        // Parse the response - handle MCP CLI output format
        const outputLines = stdout.split('\n');
        let jsonResponse = "";
        
        // Find JSON response in output
        for (const line of outputLines) {
          if (line.trim().startsWith("{") && line.trim().endsWith("}")) {
            jsonResponse = line.trim();
            break;
          }
        }

        if (!jsonResponse) {
          console.error(`Orchestrator: No JSON found in response from ${serverName}.${toolName}`);
          reject(new Error(`No JSON response from ${serverName}.${toolName}`));
          return;
        }

        const result = JSON.parse(jsonResponse);
        resolve(result);
      } catch (parseError: any) {
        const sanitizedStdout = stdout.replace(/[\r\n]+/g, ' ');
        console.error(`Orchestrator: Failed to parse JSON from ${serverName}.${toolName}: ${parseError.message}. Raw stdout: ${sanitizedStdout}`);
        reject(new Error(`Failed to parse JSON from ${serverName}.${toolName}: ${parseError.message}`));
      }
    });
  });
}

// Generate unique project ID
function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Tool definitions
const tools: Tool[] = [
  {
    name: "initiate",
    description: "Initiates a new research project and coordinates the workflow",
    inputSchema: {
      type: "object",
      properties: {
        project_title: { type: "string", description: "Title of the research project" },
        user_prompt: { type: "string", description: "Initial research question or prompt" },
        references: { type: "array", items: { type: "string" }, description: "List of reference materials" },
        raw_data: { type: "string", description: "Path to raw data file" },
      },
      required: ["project_title", "user_prompt", "references", "raw_data"],
    },
  },
];

// Create and configure the server
const server = new Server(
  {
    name: "academic-research-orchestrator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "initiate") {
      // Validate input
      const validatedArgs = InitiateInputSchema.parse(args);
      
      // Create new project
      const projectId = generateProjectId();
      const project: ProjectState = {
        project_id: projectId,
        project_title: validatedArgs.project_title,
        user_prompt: validatedArgs.user_prompt,
        references: validatedArgs.references,
        raw_data_path: validatedArgs.raw_data,
        workflow_stage: "initiated",
        errors: [],
        log: [`Project ${projectId} initiated at ${new Date().toISOString()}`],
      };

      // Store project
      projects[projectId] = project;

      try {
        // Step 1: Call Research Initiator Developer
        project.log.push("Calling Research Initiator Developer...");
        const refineResult = await callMCPServer(
          "academic-research-initiator-developer",
          "refine",
          {
            project_id: projectId,
            prompt: validatedArgs.user_prompt,
            references: validatedArgs.references,
          }
        );

        if (refineResult.status === "success") {
          project.refined_question = refineResult.refined_question;
          project.hypotheses = refineResult.hypotheses;
          project.operational_definitions = refineResult.operational_definitions;
          project.lit_review_notes = refineResult.lit_review_notes;
          project.workflow_stage = "research_design_complete";
          project.log.push("Research design completed successfully");
        } else {
          project.errors.push("Research design failed: " + (refineResult.errors || []).join(", "));
        }

        // Step 2: Call Data Processor (if available)
        if (project.workflow_stage === "research_design_complete") {
          try {
            project.log.push("Calling Data Processor...");
            const processResult = await callMCPServer(
              "academic-data-processor-wrangler",
              "process",
              {
                project_id: projectId,
                refined_question: project.refined_question,
                hypotheses: project.hypotheses,
                operational_definitions: project.operational_definitions,
                raw_data: validatedArgs.raw_data,
              }
            );

            if (processResult.status === "success") {
              project.cleaned_data_path = processResult.cleaned_data;
              project.processing_log = processResult.processing_log;
              project.decision_rationale = processResult.decision_rationale;
              project.workflow_stage = "data_processing_complete";
              project.log.push("Data processing completed successfully");
            } else {
              project.errors.push("Data processing failed: " + (processResult.errors || []).join(", "));
            }
          } catch (error: any) {
            project.errors.push(`Data processor not available: ${error.message}`);
            project.log.push("Skipping data processing - server not available");
          }
        }

        // Step 3: Call Code Generator (if data processing succeeded or was skipped)
        if (project.workflow_stage === "data_processing_complete" || project.workflow_stage === "research_design_complete") {
          try {
            project.log.push("Calling Code Generator...");
            const generateResult = await callMCPServer(
              "academic-code-generator",
              "generate",
              {
                project_id: projectId,
                cleaned_data: project.cleaned_data_path || validatedArgs.raw_data,
                hypotheses: project.hypotheses,
                analysis_plan: "descriptive statistics, correlation analysis, hypothesis testing",
              }
            );

            if (generateResult.status === "success") {
              project.analysis_scripts = generateResult.analysis_scripts;
              project.exploratory_findings = generateResult.exploratory_findings;
              project.workflow_stage = "code_generation_complete";
              project.log.push("Code generation completed successfully");
            } else {
              project.errors.push("Code generation failed: " + (generateResult.errors || []).join(", "));
            }
          } catch (error: any) {
            project.errors.push(`Code generator not available: ${error.message}`);
          }
        }

        // Determine next steps
        const nextSteps: string[] = [];
        if (project.workflow_stage === "code_generation_complete") {
          nextSteps.push("Execute analysis scripts");
          nextSteps.push("Generate research report");
        } else if (project.workflow_stage === "data_processing_complete") {
          nextSteps.push("Generate analysis code");
        } else if (project.workflow_stage === "research_design_complete") {
          nextSteps.push("Process raw data");
          nextSteps.push("Generate analysis code");
        } else {
          nextSteps.push("Complete research design");
        }

        // Return response
        const response = {
          status: project.errors.length === 0 ? "success" : "partial_success",
          project_id: projectId,
          workflow_stage: project.workflow_stage,
          next_steps: nextSteps,
          errors: project.errors,
          log: project.log,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };

      } catch (error: any) {
        project.errors.push(`Workflow error: ${error.message}`);
        project.log.push(`Error occurred: ${error.message}`);

        const errorResponse = {
          status: "error",
          project_id: projectId,
          workflow_stage: project.workflow_stage,
          next_steps: ["Fix errors and retry"],
          errors: project.errors,
          log: project.log,
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(errorResponse, null, 2),
            },
          ],
        };
      }
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: "error",
            errors: [error.message],
            log: [`Error in ${name}: ${error.message}`],
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Research Orchestrator Server started and connected via STDIN/STDOUT.");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
