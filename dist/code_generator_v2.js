"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
// Script generation helper functions
function generateEDAScript(dataPath, hypotheses, projectId) {
    return `#!/usr/bin/env python3
"""
Exploratory Data Analysis Script
Project: ${projectId}
Generated: ${new Date().toISOString()}
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Set visualization style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

print("="*60)
print("EXPLORATORY DATA ANALYSIS")
print("="*60)

# Load data
print("\\nLoading data from: ${dataPath}")
try:
    df = pd.read_csv("${dataPath}")
    print(f"✓ Data loaded successfully: {df.shape[0]} rows, {df.shape[1]} columns")
except Exception as e:
    print(f"✗ Error loading data: {e}")
    exit(1)

# Basic information
print("\\n" + "="*60)
print("DATA STRUCTURE")
print("="*60)
print(df.info())

# Descriptive statistics
print("\\n" + "="*60)
print("DESCRIPTIVE STATISTICS")
print("="*60)
print(df.describe(include='all'))

# Missing values analysis
print("\\n" + "="*60)
print("MISSING VALUES ANALYSIS")
print("="*60)
missing = df.isnull().sum()
missing_pct = (missing / len(df)) * 100
missing_df = pd.DataFrame({
    'Missing Count': missing,
    'Percentage': missing_pct
})
print(missing_df[missing_df['Missing Count'] > 0])

# Data types
print("\\n" + "="*60)
print("DATA TYPES")
print("="*60)
print(df.dtypes)

# Numeric columns analysis
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
if numeric_cols:
    print("\\n" + "="*60)
    print("NUMERIC VARIABLES DISTRIBUTION")
    print("="*60)
    
    for col in numeric_cols:
        print(f"\\n{col}:")
        print(f"  Mean: {df[col].mean():.2f}")
        print(f"  Median: {df[col].median():.2f}")
        print(f"  Std Dev: {df[col].std():.2f}")
        print(f"  Min: {df[col].min():.2f}")
        print(f"  Max: {df[col].max():.2f}")
        print(f"  Skewness: {df[col].skew():.2f}")
        print(f"  Kurtosis: {df[col].kurtosis():.2f}")
        
        # Outlier detection using IQR
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        outliers = df[(df[col] < Q1 - 1.5*IQR) | (df[col] > Q3 + 1.5*IQR)]
        print(f"  Outliers (IQR method): {len(outliers)} ({len(outliers)/len(df)*100:.1f}%)")

# Categorical columns analysis
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
if categorical_cols:
    print("\\n" + "="*60)
    print("CATEGORICAL VARIABLES DISTRIBUTION")
    print("="*60)
    
    for col in categorical_cols:
        print(f"\\n{col}:")
        print(df[col].value_counts())
        print(f"  Unique values: {df[col].nunique()}")

# Correlation analysis for numeric variables
if len(numeric_cols) > 1:
    print("\\n" + "="*60)
    print("CORRELATION MATRIX")
    print("="*60)
    correlation_matrix = df[numeric_cols].corr()
    print(correlation_matrix)
    
    # Save correlation heatmap
    plt.figure(figsize=(10, 8))
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, 
                square=True, linewidths=1, cbar_kws={"shrink": 0.8})
    plt.title('Correlation Heatmap')
    plt.tight_layout()
    plt.savefig('output/${projectId}_correlation_heatmap.png', dpi=300, bbox_inches='tight')
    print("\\n✓ Correlation heatmap saved to: output/${projectId}_correlation_heatmap.png")

# Distribution plots for numeric variables
if numeric_cols:
    n_cols = min(3, len(numeric_cols))
    n_rows = (len(numeric_cols) + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 5*n_rows))
    axes = axes.flatten() if len(numeric_cols) > 1 else [axes]
    
    for idx, col in enumerate(numeric_cols):
        axes[idx].hist(df[col].dropna(), bins=30, edgecolor='black', alpha=0.7)
        axes[idx].set_title(f'Distribution of {col}')
        axes[idx].set_xlabel(col)
        axes[idx].set_ylabel('Frequency')
    
    # Hide empty subplots
    for idx in range(len(numeric_cols), len(axes)):
        axes[idx].set_visible(False)
    
    plt.tight_layout()
    plt.savefig('output/${projectId}_distributions.png', dpi=300, bbox_inches='tight')
    print("✓ Distribution plots saved to: output/${projectId}_distributions.png")

print("\\n" + "="*60)
print("EDA COMPLETE")
print("="*60)
print("\\nHypotheses to be tested:")
${hypotheses.map((h, i) => `print("${i + 1}. ${h.replace(/"/g, '\\"')}")`).join('\n')}
`;
}
function generateCorrelationScript(dataPath, hypotheses, projectId) {
    return `#!/usr/bin/env python3
"""
Correlation Analysis Script
Project: ${projectId}
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

print("="*60)
print("CORRELATION ANALYSIS")
print("="*60)

# Load data
df = pd.read_csv("${dataPath}")
print(f"\\nData loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Select numeric columns
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
print(f"\\nNumeric columns for correlation analysis: {', '.join(numeric_cols)}")

if len(numeric_cols) < 2:
    print("\\n✗ Error: Need at least 2 numeric columns for correlation analysis")
    exit(1)

# Pearson correlation
print("\\n" + "="*60)
print("PEARSON CORRELATION (parametric)")
print("="*60)
for i in range(len(numeric_cols)):
    for j in range(i+1, len(numeric_cols)):
        col1, col2 = numeric_cols[i], numeric_cols[j]
        r, p = stats.pearsonr(df[col1].dropna(), df[col2].dropna())
        sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
        print(f"{col1} <-> {col2}: r = {r:.3f}, p = {p:.4f} {sig}")

# Spearman correlation (non-parametric)
print("\\n" + "="*60)
print("SPEARMAN CORRELATION (non-parametric)")
print("="*60)
for i in range(len(numeric_cols)):
    for j in range(i+1, len(numeric_cols)):
        col1, col2 = numeric_cols[i], numeric_cols[j]
        rho, p = stats.spearmanr(df[col1].dropna(), df[col2].dropna())
        sig = "***" if p < 0.001 else "**" if p < 0.01 else "*" if p < 0.05 else "ns"
        print(f"{col1} <-> {col2}: ρ = {rho:.3f}, p = {p:.4f} {sig}")

# Scatter plots for significant correlations
print("\\n" + "="*60)
print("GENERATING SCATTER PLOTS")
print("="*60)

n_pairs = len(numeric_cols) * (len(numeric_cols) - 1) // 2
n_cols = min(3, n_pairs)
n_rows = (n_pairs + n_cols - 1) // n_cols

fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 5*n_rows))
axes = axes.flatten() if n_pairs > 1 else [axes]

plot_idx = 0
for i in range(len(numeric_cols)):
    for j in range(i+1, len(numeric_cols)):
        col1, col2 = numeric_cols[i], numeric_cols[j]
        r, p = stats.pearsonr(df[col1].dropna(), df[col2].dropna())
        
        axes[plot_idx].scatter(df[col1], df[col2], alpha=0.5)
        axes[plot_idx].set_xlabel(col1)
        axes[plot_idx].set_ylabel(col2)
        axes[plot_idx].set_title(f'{col1} vs {col2}\\nr = {r:.3f}, p = {p:.4f}')
        
        # Add regression line
        z = np.polyfit(df[col1].dropna(), df[col2].dropna(), 1)
        p_line = np.poly1d(z)
        axes[plot_idx].plot(df[col1], p_line(df[col1]), "r--", alpha=0.8)
        
        plot_idx += 1

plt.tight_layout()
plt.savefig('output/${projectId}_scatter_plots.png', dpi=300, bbox_inches='tight')
print("\\n✓ Scatter plots saved to: output/${projectId}_scatter_plots.png")

print("\\n" + "="*60)
print("CORRELATION ANALYSIS COMPLETE")
print("="*60)
`;
}
function generateRegressionScript(dataPath, hypotheses, projectId) {
    return `#!/usr/bin/env python3
"""
Regression Analysis Script
Project: ${projectId}
"""

import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

print("="*60)
print("REGRESSION ANALYSIS")
print("="*60)

# Load data
df = pd.read_csv("${dataPath}")
print(f"\\nData loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Get numeric columns
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
print(f"\\nNumeric columns: {', '.join(numeric_cols)}")

if len(numeric_cols) < 2:
    print("\\n✗ Error: Need at least 2 numeric columns for regression")
    exit(1)

# Assume first column is dependent variable, rest are independent
# In practice, this should be specified based on hypotheses
dependent_var = numeric_cols[0]
independent_vars = numeric_cols[1:]

print(f"\\nDependent variable: {dependent_var}")
print(f"Independent variables: {', '.join(independent_vars)}")

# Build regression formula
formula = f"{dependent_var} ~ {' + '.join(independent_vars)}"
print(f"\\nRegression formula: {formula}")

# Fit the model
print("\\n" + "="*60)
print("MODEL FITTING")
print("="*60)

try:
    model = smf.ols(formula=formula, data=df).fit()
    print(model.summary())
    
    # Model diagnostics
    print("\\n" + "="*60)
    print("MODEL DIAGNOSTICS")
    print("="*60)
    
    # R-squared
    print(f"\\nR-squared: {model.rsquared:.4f}")
    print(f"Adjusted R-squared: {model.rsquared_adj:.4f}")
    print(f"F-statistic: {model.fvalue:.4f}, p-value: {model.f_pvalue:.4e}")
    
    # Coefficients with confidence intervals
    print("\\n" + "="*60)
    print("COEFFICIENTS AND CONFIDENCE INTERVALS")
    print("="*60)
    conf_int = model.conf_int()
    coef_df = pd.DataFrame({
        'Coefficient': model.params,
        'Std Error': model.bse,
        't-value': model.tvalues,
        'p-value': model.pvalues,
        '95% CI Lower': conf_int[0],
        '95% CI Upper': conf_int[1]
    })
    print(coef_df)
    
    # Residual analysis
    print("\\n" + "="*60)
    print("RESIDUAL ANALYSIS")
    print("="*60)
    
    residuals = model.resid
    fitted = model.fittedvalues
    
    # Test for normality of residuals
    _, p_normality = stats.shapiro(residuals)
    print(f"Shapiro-Wilk test for normality: p = {p_normality:.4f}")
    if p_normality > 0.05:
        print("  ✓ Residuals appear normally distributed")
    else:
        print("  ✗ Warning: Residuals may not be normally distributed")
    
    # Test for homoscedasticity
    from statsmodels.stats.diagnostic import het_breuschpagan
    _, p_hetero, _, _ = het_breuschpagan(residuals, model.model.exog)
    print(f"\\nBreusch-Pagan test for homoscedasticity: p = {p_hetero:.4f}")
    if p_hetero > 0.05:
        print("  ✓ Homoscedasticity assumption met")
    else:
        print("  ✗ Warning: Heteroscedasticity detected")
    
    # Diagnostic plots
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # Residuals vs Fitted
    axes[0, 0].scatter(fitted, residuals, alpha=0.5)
    axes[0, 0].axhline(y=0, color='r', linestyle='--')
    axes[0, 0].set_xlabel('Fitted values')
    axes[0, 0].set_ylabel('Residuals')
    axes[0, 0].set_title('Residuals vs Fitted')
    
    # Q-Q plot
    stats.probplot(residuals, dist="norm", plot=axes[0, 1])
    axes[0, 1].set_title('Normal Q-Q Plot')
    
    # Scale-Location plot
    standardized_resid = np.sqrt(np.abs(residuals / residuals.std()))
    axes[1, 0].scatter(fitted, standardized_resid, alpha=0.5)
    axes[1, 0].set_xlabel('Fitted values')
    axes[1, 0].set_ylabel('√|Standardized residuals|')
    axes[1, 0].set_title('Scale-Location Plot')
    
    # Residuals histogram
    axes[1, 1].hist(residuals, bins=30, edgecolor='black', alpha=0.7)
    axes[1, 1].set_xlabel('Residuals')
    axes[1, 1].set_ylabel('Frequency')
    axes[1, 1].set_title('Histogram of Residuals')
    
    plt.tight_layout()
    plt.savefig('output/${projectId}_regression_diagnostics.png', dpi=300, bbox_inches='tight')
    print("\\n✓ Diagnostic plots saved to: output/${projectId}_regression_diagnostics.png")
    
    # Save results
    results_df = pd.DataFrame({
        'Fitted': fitted,
        'Residuals': residuals,
        'Actual': df[dependent_var]
    })
    results_df.to_csv('output/${projectId}_regression_results.csv', index=False)
    print("✓ Results saved to: output/${projectId}_regression_results.csv")
    
except Exception as e:
    print(f"\\n✗ Error fitting regression model: {e}")
    print("\\nPlease check:")
    print("  - All variables are numeric")
    print("  - No missing values in the data")
    print("  - Variable names match column names in the dataset")

print("\\n" + "="*60)
print("REGRESSION ANALYSIS COMPLETE")
print("="*60)
`;
}
function generateTTestScript(dataPath, hypotheses, projectId) {
    return `#!/usr/bin/env python3
"""
T-Test Analysis Script
Project: ${projectId}
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

print("="*60)
print("T-TEST ANALYSIS")
print("="*60)

# Load data
df = pd.read_csv("${dataPath}")
print(f"\\nData loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Get numeric and categorical columns
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

print(f"\\nNumeric columns: {', '.join(numeric_cols)}")
print(f"Categorical columns: {', '.join(categorical_cols)}")

# Perform t-tests for each numeric variable by each categorical variable
for cat_col in categorical_cols:
    unique_values = df[cat_col].unique()
    
    if len(unique_values) == 2:  # Only for binary categorical variables
        print(f"\\n{'='*60}")
        print(f"T-TESTS FOR: {cat_col}")
        print(f"Groups: {unique_values[0]} vs {unique_values[1]}")
        print(f"{'='*60}")
        
        group1 = df[df[cat_col] == unique_values[0]]
        group2 = df[df[cat_col] == unique_values[1]]
        
        for num_col in numeric_cols:
            data1 = group1[num_col].dropna()
            data2 = group2[num_col].dropna()
            
            if len(data1) > 0 and len(data2) > 0:
                # Independent samples t-test
                t_stat, p_value = stats.ttest_ind(data1, data2)
                
                # Effect size (Cohen's d)
                pooled_std = np.sqrt(((len(data1)-1)*data1.std()**2 + (len(data2)-1)*data2.std()**2) / (len(data1)+len(data2)-2))
                cohens_d = (data1.mean() - data2.mean()) / pooled_std
                
                print(f"\\n{num_col}:")
                print(f"  {unique_values[0]}: M = {data1.mean():.2f}, SD = {data1.std():.2f}, N = {len(data1)}")
                print(f"  {unique_values[1]}: M = {data2.mean():.2f}, SD = {data2.std():.2f}, N = {len(data2)}")
                print(f"  t({len(data1)+len(data2)-2}) = {t_stat:.3f}, p = {p_value:.4f}")
                print(f"  Cohen's d = {cohens_d:.3f}")
                
                if p_value < 0.001:
                    print(f"  *** Highly significant difference")
                elif p_value < 0.01:
                    print(f"  ** Significant difference")
                elif p_value < 0.05:
                    print(f"  * Significant difference")
                else:
                    print(f"  ns (not significant)")

print("\\n" + "="*60)
print("T-TEST ANALYSIS COMPLETE")
print("="*60)
`;
}
function generateANOVAScript(dataPath, hypotheses, projectId) {
    return `#!/usr/bin/env python3
"""
ANOVA Analysis Script
Project: ${projectId}
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

print("="*60)
print("ANOVA ANALYSIS")
print("="*60)

# Load data
df = pd.read_csv("${dataPath}")
print(f"\\nData loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Get numeric and categorical columns
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

# Perform one-way ANOVA for each combination
for cat_col in categorical_cols:
    unique_values = df[cat_col].unique()
    
    if len(unique_values) >= 3:  # ANOVA for 3+ groups
        print(f"\\n{'='*60}")
        print(f"ONE-WAY ANOVA FOR: {cat_col}")
        print(f"Groups: {', '.join(map(str, unique_values))}")
        print(f"{'='*60}")
        
        for num_col in numeric_cols:
            groups = [df[df[cat_col] == val][num_col].dropna() for val in unique_values]
            
            if all(len(g) > 0 for g in groups):
                # One-way ANOVA
                f_stat, p_value = stats.f_oneway(*groups)
                
                print(f"\\n{num_col}:")
                for i, val in enumerate(unique_values):
                    print(f"  {val}: M = {groups[i].mean():.2f}, SD = {groups[i].std():.2f}, N = {len(groups[i])}")
                print(f"  F({len(groups)-1}, {sum(len(g) for g in groups)-len(groups)}) = {f_stat:.3f}, p = {p_value:.4f}")
                
                if p_value < 0.05:
                    print(f"  * Significant difference between groups")
                else:
                    print(f"  ns (not significant)")

print("\\n" + "="*60)
print("ANOVA ANALYSIS COMPLETE")
print("="*60)
`;
}
function generateChiSquareScript(dataPath, hypotheses, projectId) {
    return `#!/usr/bin/env python3
"""
Chi-Square Test Script
Project: ${projectId}
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

print("="*60)
print("CHI-SQUARE TEST ANALYSIS")
print("="*60)

# Load data
df = pd.read_csv("${dataPath}")
print(f"\\nData loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Get categorical columns
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

if len(categorical_cols) < 2:
    print("\\n✗ Error: Need at least 2 categorical columns for chi-square test")
    exit(1)

# Perform chi-square tests for all pairs of categorical variables
for i in range(len(categorical_cols)):
    for j in range(i+1, len(categorical_cols)):
        col1, col2 = categorical_cols[i], categorical_cols[j]
        
        print(f"\\n{'='*60}")
        print(f"CHI-SQUARE TEST: {col1} vs {col2}")
        print(f"{'='*60}")
        
        # Create contingency table
        contingency_table = pd.crosstab(df[col1], df[col2])
        print(f"\\nContingency Table:")
        print(contingency_table)
        
        # Perform chi-square test
        chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)
        
        print(f"\\nChi-square statistic: {chi2:.3f}")
        print(f"Degrees of freedom: {dof}")
        print(f"P-value: {p_value:.4f}")
        
        # Cramér's V (effect size)
        n = contingency_table.sum().sum()
        min_dim = min(contingency_table.shape[0], contingency_table.shape[1]) - 1
        cramers_v = np.sqrt(chi2 / (n * min_dim))
        print(f"Cramér's V: {cramers_v:.3f}")
        
        if p_value < 0.001:
            print(f"*** Highly significant association")
        elif p_value < 0.01:
            print(f"** Significant association")
        elif p_value < 0.05:
            print(f"* Significant association")
        else:
            print(f"ns (no significant association)")

print("\\n" + "="*60)
print("CHI-SQUARE ANALYSIS COMPLETE")
print("="*60)
`;
}
function generateCustomScript(dataPath, hypotheses, analysisType, projectId) {
    return `#!/usr/bin/env python3
"""
Custom Analysis Script: ${analysisType}
Project: ${projectId}
"""

import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

print("="*60)
print("CUSTOM ANALYSIS: ${analysisType}")
print("="*60)

# Load data
df = pd.read_csv("${dataPath}")
print(f"\\nData loaded: {df.shape[0]} rows, {df.shape[1]} columns")
print(f"\\nColumns: {', '.join(df.columns)}")

# Hypotheses being tested:
${hypotheses.map((h, i) => `print("${i + 1}. ${h.replace(/"/g, '\\"')}")`).join('\n')}

print("\\n" + "="*60)
print("IMPLEMENT YOUR CUSTOM ANALYSIS HERE")
print("="*60)
print("\\nThis is a template script for: ${analysisType}")
print("Please customize the analysis based on your specific needs.")

# Example: Basic data exploration
print("\\nData summary:")
print(df.describe())

print("\\n" + "="*60)
print("CUSTOM ANALYSIS COMPLETE")
print("="*60)
`;
}
// Define the input schema for the 'generate' tool based on API_CONTRACT_Version2.md
const GenerateInputSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    cleaned_data: zod_1.z.string(), // Filepath to cleaned data
    hypotheses: zod_1.z.array(zod_1.z.string()),
    analysis_plan: zod_1.z.array(zod_1.z.string()), // List of analysis types or steps
});
// Define the output schema for the 'generate' tool based on API_CONTRACT_Version2.md
const GenerateOutputSchema = zod_1.z.object({
    status: zod_1.z.string(),
    analysis_scripts: zod_1.z.record(zod_1.z.string(), zod_1.z.string()), // filename: code_string
    exploratory_findings: zod_1.z.object({
        description: zod_1.z.string(),
        outliers: zod_1.z.string().optional(), // Made optional as per example
    }),
    log: zod_1.z.array(zod_1.z.string()),
    errors: zod_1.z.array(zod_1.z.string()),
});
const server = new index_js_1.Server({
    name: "academic-code-generator", // Updated name
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
const tools = [
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
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return { tools };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const serverLogs = [];
    if (name === "generate") {
        try {
            serverLogs.push(`Processing 'generate' request for project_id: ${args?.project_id || 'unknown'}`);
            const validatedArgs = GenerateInputSchema.parse(args);
            const { project_id, cleaned_data, hypotheses, analysis_plan, } = validatedArgs;
            const analysis_scripts = {};
            const errors = [];
            // --- Mock Script Generation Logic ---
            // This would typically involve more sophisticated generation, potentially using LLMs
            // or template-based approaches, considering the hypotheses and analysis plan.
            serverLogs.push(`Generating scripts for analysis plan: ${analysis_plan.join(", ")}`);
            for (const analysisStep of analysis_plan) {
                let scriptContent = "";
                let scriptFilename = "";
                const stepLower = analysisStep.toLowerCase();
                if (stepLower.includes("descriptive") || stepLower.includes("eda") || stepLower.includes("exploratory")) {
                    scriptFilename = `01_eda_${project_id}.py`;
                    scriptContent = generateEDAScript(cleaned_data, hypotheses, project_id);
                    serverLogs.push(`Generated comprehensive Python EDA script: ${scriptFilename}`);
                }
                else if (stepLower.includes("correlation")) {
                    scriptFilename = `02_correlation_${project_id}.py`;
                    scriptContent = generateCorrelationScript(cleaned_data, hypotheses, project_id);
                    serverLogs.push(`Generated correlation analysis script: ${scriptFilename}`);
                }
                else if (stepLower.includes("regression") || stepLower.includes("linear model")) {
                    scriptFilename = `03_regression_${project_id}.py`;
                    scriptContent = generateRegressionScript(cleaned_data, hypotheses, project_id);
                    serverLogs.push(`Generated regression analysis script: ${scriptFilename}`);
                }
                else if (stepLower.includes("t-test") || stepLower.includes("ttest")) {
                    scriptFilename = `04_ttest_${project_id}.py`;
                    scriptContent = generateTTestScript(cleaned_data, hypotheses, project_id);
                    serverLogs.push(`Generated t-test script: ${scriptFilename}`);
                }
                else if (stepLower.includes("anova")) {
                    scriptFilename = `05_anova_${project_id}.py`;
                    scriptContent = generateANOVAScript(cleaned_data, hypotheses, project_id);
                    serverLogs.push(`Generated ANOVA script: ${scriptFilename}`);
                }
                else if (stepLower.includes("chi-square") || stepLower.includes("chi square")) {
                    scriptFilename = `06_chisquare_${project_id}.py`;
                    scriptContent = generateChiSquareScript(cleaned_data, hypotheses, project_id);
                    serverLogs.push(`Generated chi-square test script: ${scriptFilename}`);
                }
                else {
                    scriptFilename = `custom_${analysisStep.replace(/\s+/g, "_")}_${project_id}.py`;
                    scriptContent = generateCustomScript(cleaned_data, hypotheses, analysisStep, project_id);
                    serverLogs.push(`Generated custom analysis script for: ${analysisStep}`);
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
        }
        catch (error) {
            console.error("Error in 'generate' tool:", error);
            const errMessages = error instanceof zod_1.z.ZodError ? error.errors.map(e => e.message) : [error.message];
            return {
                content: [
                    {
                        type: "json",
                        json: {
                            status: "error",
                            analysis_scripts: {},
                            exploratory_findings: { description: "Error during script generation." },
                            log: serverLogs.length > 0 ? serverLogs : [`Error processing 'generate' request for project_id: ${args?.project_id || 'unknown'}`],
                            errors: errMessages,
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
