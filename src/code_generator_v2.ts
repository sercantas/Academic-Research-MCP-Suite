import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
// import { get_library_docs, resolve_library_id } from "@upstash/context7-mcp"; // Example for context tool
// import { run_node_code, run_python_code } from "@mcp/code"; // Example for code execution tool
// import { write_file } from "@mcp/fs"; // Example for file system tool

// Define the input schema for the 'generate' tool based on API_CONTRACT_Version2.md
const GenerateInputSchema = z.object({
  project_id: z.string(),
  cleaned_data: z.string(), // Filepath to cleaned data
  hypotheses: z.array(z.string()),
  analysis_plan: z.array(z.string()), // List of analysis types or steps
});

// Define the output schema for the 'generate' tool based on API_CONTRACT_Version2.md
const GenerateOutputSchema = z.object({
  status: z.string(),
  analysis_scripts: z.record(z.string(), z.string()), // filename: code_string
  exploratory_findings: z.object({
    description: z.string(),
    outliers: z.string().optional(), // Made optional as per example
  }),
  log: z.array(z.string()),
  errors: z.array(z.string()),
});

const server = new Server(
  {
    name: "academic-code-generator", // Updated name
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
    name: "generate", // Matches the endpoint /code-generator/generate
    description: "Generates analysis scripts based on the analysis plan and hypotheses.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string" },
        cleaned_data: { type: "string" },
        hypotheses: { type: "array", items: { type: "string" } },
        analysis_plan: { type: "array", items: { type: "string" } },
      },
      required: ["project_id", "cleaned_data", "hypotheses", "analysis_plan"],
    },
    outputSchema: {
        type: "object",
        properties: {
            status: { type: "string" },
            analysis_scripts: { type: "object", additionalProperties: { type: "string" } },
            exploratory_findings: {
                type: "object",
                properties: {
                    description: { type: "string" },
                    outliers: { type: "string" },
                },
                required: ["description"]
            },
            log: { type: "array", items: { type: "string" } },
            errors: { type: "array", items: { type: "string" } },
        },
        required: ["status", "analysis_scripts", "exploratory_findings", "log", "errors"],
    }
  },
  // Other tools like 'test_code_segments' or 'debug_and_fix' could be retained if needed,
  // but they are not part of the primary API contract endpoint being implemented here.
  // For now, focusing on the main 'generate' tool.
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const serverLogs: string[] = [];

  if (name === "generate") {
    try {
      serverLogs.push(`Processing 'generate' request for project_id: ${args.project_id}`);
      const validatedArgs = GenerateInputSchema.parse(args);
      const {
        project_id,
        cleaned_data,
        hypotheses,
        analysis_plan,
      } = validatedArgs;

      const analysis_scripts: Record<string, string> = {};
      const errors: string[] = [];

      // --- Mock Script Generation Logic ---
      // This would typically involve more sophisticated generation, potentially using LLMs
      // or template-based approaches, considering the hypotheses and analysis plan.

      serverLogs.push(`Generating scripts for analysis plan: ${analysis_plan.join(", ")}`);

      for (const analysisStep of analysis_plan) {
        let scriptContent = "";
        let scriptFilename = "";

        if (analysisStep.toLowerCase().includes("descriptive statistics") || analysisStep.toLowerCase().includes("eda")) {
          scriptFilename = `eda_${project_id}.py`;
          scriptContent = `import pandas as pd\n\n`;
          scriptContent += `# Load the cleaned dataset\n`;
          scriptContent += `df = pd.read_csv("${cleaned_data}")\n\n`;
          scriptContent += `# Display basic descriptive statistics\n`;
          scriptContent += `print("--- Descriptive Statistics ---")\n`;
          scriptContent += `print(df.describe(include='all'))\n\n`;
          scriptContent += `# Example: Check for missing values summary\n`;
          scriptContent += `print("\\n--- Missing Values Summary ---")\n`;
          scriptContent += `print(df.isnull().sum())\n\n`;
          // Could add more EDA steps like value counts for categorical, histograms for numerical etc.
          // Hypotheses might guide which variables to focus on.
          if (hypotheses.length > 0) {
            scriptContent += `# Consider focusing EDA on variables related to hypotheses: ${hypotheses.join(", ")}\n`;
          }
          serverLogs.push(`Generated Python EDA script: ${scriptFilename}`);

        } else if (analysisStep.toLowerCase().includes("regression")) {
          scriptFilename = `regression_${project_id}.py`;
          // Basic template, assuming first hypothesis is primary for regression
          const primaryHypothesis = hypotheses[0] || "dependent_var ~ independent_var1 + independent_var2";
          // Inferring vars from hypothesis is complex; here it's a placeholder.
          // A real implementation would parse variables from hypotheses or require them explicitly.
          const parts = primaryHypothesis.split("~");
          const depVar = parts[0]?.split(" ")[0]?.trim() || "Y"; // Highly simplified
          const indVars = parts[1]?.trim() || "X1 + X2";

          scriptContent = `import pandas as pd\n`;
          scriptContent += `import statsmodels.formula.api as smf\n\n`;
          scriptContent += `# Load the cleaned dataset\n`;
          scriptContent += `df = pd.read_csv("${cleaned_data}")\n\n`;
          scriptContent += `# Fit the regression model based on hypothesis: ${primaryHypothesis}\n`;
          scriptContent += `# Note: Ensure columns '${depVar}' and those in '${indVars}' exist and are numeric.\n`;
          scriptContent += `try:\n`;
          scriptContent += `    model = smf.ols(formula='${depVar} ~ ${indVars}', data=df).fit()\n`;
          scriptContent += `    print("\\n--- Regression Model Summary ---")\n`;
          scriptContent += `    print(model.summary())\n`;
          scriptContent += `except Exception as e:\n`;
          scriptContent += `    print(f"Error fitting regression model: {e}")\n`;
          serverLogs.push(`Generated Python regression script: ${scriptFilename}`);

        } else {
          scriptFilename = `custom_analysis_${analysisStep.replace(/\s+/g, "_")}_${project_id}.py`;
          scriptContent = `# Custom analysis script for: ${analysisStep}\n`;
          scriptContent += `# Based on hypotheses: ${hypotheses.join(", ")}\n`;
          scriptContent += `# Using data from: ${cleaned_data}\n\n`;
          scriptContent += `print("Script for '${analysisStep}' needs to be implemented.")\n`;
          serverLogs.push(`Generated placeholder Python script for: ${analysisStep}`);
        }
        analysis_scripts[scriptFilename] = scriptContent;
      }

      // Mock exploratory findings
      const exploratory_findings = {
        description: `Initial EDA on ${cleaned_data} suggests data is ready for analysis. Key variables checked.`,
        // Outliers might be detected by the EDA script itself if it's more sophisticated.
        // For this mock, we'll add a generic note.
        outliers: "Outlier detection was part of the EDA script. Check script output for details.",
      };
      if (analysis_plan.some(step => step.toLowerCase().includes("outlier"))) {
        exploratory_findings.description += " Outlier detection explicitly requested.";
      }

      serverLogs.push("Script generation and exploratory findings summary completed.");
      // --- End Mock Script Generation Logic ---

      const output = {
        status: errors.length > 0 ? "error" : "success",
        analysis_scripts,
        exploratory_findings,
        log: serverLogs,
        errors,
      };

      GenerateOutputSchema.parse(output); // Validate output

      return {
        content: [{ type: "json", json: output }],
      };
    } catch (error: any) {
      console.error("Error in 'generate' tool:", error);
      const errMessages = error instanceof z.ZodError ? error.errors.map(e => e.message) : [error.message];
      return {
        content: [
          {
            type: "json",
            json: {
              status: "error",
              analysis_scripts: {},
              exploratory_findings: { description: "Error during script generation." },
              log: serverLogs.length > 0 ? serverLogs : [`Error processing 'generate' request for project_id: ${args.project_id}`],
              errors: errMessages,
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
  console.error("Code Generator Server started and connected via STDIN/STDOUT.");
});

// To run this server:
// 1. Ensure you have the MCP SDK and Zod installed:
//    npm install @modelcontextprotocol/sdk zod
// 2. Compile this TypeScript file to JavaScript:
//    npx tsc code_generator_v2.ts --resolveJsonModule --esModuleInterop
// 3. Run the compiled JavaScript file:
//    node code_generator_v2.js

// Example MCP CLI call (ensure 'cleaned_example_data.csv' exists or adjust path):
// mcp call academic-code-generator generate '{
//   "project_id": "test005",
//   "cleaned_data": "cleaned_example_data.csv",
//   "hypotheses": ["H1: VariableA positively affects VariableB", "H2: VariableC moderates H1"],
//   "analysis_plan": ["Descriptive statistics", "Linear regression for H1"]
// }'
// Create a dummy cleaned_example_data.csv for testing:
// echo "VariableA,VariableB,VariableC\n1,10,0.5\n2,12,0.3\n3,15,0.6\n4,18,0.2" > cleaned_example_data.csv
