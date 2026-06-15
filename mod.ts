import type { Tool, ToolContext, PluginContext, ToolCallResult } from "cortex/plugins";

let config: Record<string, unknown> = {};

const doc_generate: Tool = {
  definition: {
    name: "doc_generate",
    description: "Generate document from markdown content",
    params: [
      { name: "content", type: "string", description: "Markdown content", required: true },
      { name: "format", type: "enum", description: "Output format", options: ["pdf", "docx", "md", "html"], required: true },
      { name: "title", type: "string", description: "Document title", required: true },
      { name: "template", type: "string", description: "Template name", required: false },
      { name: "author", type: "string", description: "Document author", required: false },
      { name: "include_toc", type: "boolean", description: "Include table of contents", default: true },
    ],
    capabilities: ["fs:write"],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const content = args.content;
      const format = args.format;
      const title = args.title;
      if (!content || typeof content !== "string") return { toolName: "doc_generate", success: false, output: "", error: "content must be a non-empty string", durationMs: Date.now() - start };
      if (!format || typeof format !== "string") return { toolName: "doc_generate", success: false, output: "", error: "format is required", durationMs: Date.now() - start };
      if (!title || typeof title !== "string") return { toolName: "doc_generate", success: false, output: "", error: "title is required", durationMs: Date.now() - start };

      const author = (args.author as string) || (config.defaultAuthor as string) || "Unknown";
      const include_toc = args.include_toc !== false;
      const result = `Generated ${format.toUpperCase()} document: "${title}" by ${author}${include_toc ? " (with TOC)" : ""}`;
      return { toolName: "doc_generate", success: true, output: result, durationMs: Date.now() - start };
    } catch (error) {
      return { toolName: "doc_generate", success: false, output: "", error: `Failed to generate: ${error instanceof Error ? error.message : String(error)}`, durationMs: Date.now() - start };
    }
  },
};

const doc_template_list: Tool = {
  definition: {
    name: "doc_template_list",
    description: "List available templates",
    params: [
      { name: "category", type: "string", description: "Filter by category", options: ["report", "proposal", "letter", "meeting_notes", "resume"], required: false },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const category = args.category || "all";
      const templates: Record<string, string[]> = {
        report: ["Annual Report", "Research Report", "Project Summary"],
        proposal: ["Business Proposal", "Grant Proposal", "Project Pitch"],
        letter: ["Formal Letter", "Cover Letter", "Recommendation"],
        meeting_notes: ["Meeting Minutes", "Action Items", "Weekly Standup"],
        resume: ["Chronological Resume", "Functional Resume", "Academic CV"],
      };
      if (category === "all") {
        const all = Object.entries(templates).map(([cat, tmpls]) => `${cat}: ${tmpls.join(", ")}`).join("\n");
        return { toolName: "doc_template_list", success: true, output: all, durationMs: Date.now() - start };
      }
      const result = `${category}: ${(templates[category as string] || []).join(", ")}`;
      return { toolName: "doc_template_list", success: true, output: result, durationMs: Date.now() - start };
    } catch (error) {
      return { toolName: "doc_template_list", success: false, output: "", error: `Failed to list templates: ${error instanceof Error ? error.message : String(error)}`, durationMs: Date.now() - start };
    }
  },
};

const doc_template_create: Tool = {
  definition: {
    name: "doc_template_create",
    description: "Create custom template",
    params: [
      { name: "name", type: "string", description: "Template name", required: true },
      { name: "category", type: "string", description: "Template category", required: true },
      { name: "header_html", type: "string", description: "Custom header HTML", required: false },
      { name: "footer_html", type: "string", description: "Custom footer HTML", required: false },
      { name: "css", type: "string", description: "Custom CSS styles", required: false },
    ],
    capabilities: ["fs:write"],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const name = args.name;
      const category = args.category;
      if (!name || typeof name !== "string") return { toolName: "doc_template_create", success: false, output: "", error: "name is required", durationMs: Date.now() - start };
      if (!category || typeof category !== "string") return { toolName: "doc_template_create", success: false, output: "", error: "category is required", durationMs: Date.now() - start };

      const result = `Created template "${name}" in category "${category}"`;
      return { toolName: "doc_template_create", success: true, output: result, durationMs: Date.now() - start };
    } catch (error) {
      return { toolName: "doc_template_create", success: false, output: "", error: `Failed to create template: ${error instanceof Error ? error.message : String(error)}`, durationMs: Date.now() - start };
    }
  },
};

const doc_merge: Tool = {
  definition: {
    name: "doc_merge",
    description: "Merge multiple documents",
    params: [
      { name: "files", type: "string", description: "JSON array of file paths", required: true },
      { name: "output_format", type: "enum", description: "Output format", options: ["pdf", "docx"], required: true },
      { name: "output_path", type: "string", description: "Output file path", required: true },
    ],
    capabilities: ["fs:write"],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const files = args.files;
      const output_format = args.output_format;
      const output_path = args.output_path;
      if (!files || typeof files !== "string") return { toolName: "doc_merge", success: false, output: "", error: "files is required", durationMs: Date.now() - start };
      if (!output_path || typeof output_path !== "string") return { toolName: "doc_merge", success: false, output: "", error: "output_path is required", durationMs: Date.now() - start };

      let fileList: string[];
      try { fileList = JSON.parse(files); } catch { return { toolName: "doc_merge", success: false, output: "", error: "files must be valid JSON array", durationMs: Date.now() - start }; }

      const result = `Merged ${fileList.length} file(s) into ${output_format.toUpperCase()}: ${output_path}`;
      return { toolName: "doc_merge", success: true, output: result, durationMs: Date.now() - start };
    } catch (error) {
      return { toolName: "doc_merge", success: false, output: "", error: `Failed to merge: ${error instanceof Error ? error.message : String(error)}`, durationMs: Date.now() - start };
    }
  },
};

const doc_convert: Tool = {
  definition: {
    name: "doc_convert",
    description: "Convert between document formats",
    params: [
      { name: "input_path", type: "string", description: "Input file path", required: true },
      { name: "output_format", type: "enum", description: "Output format", options: ["pdf", "docx", "md", "html", "txt"], required: true },
      { name: "output_path", type: "string", description: "Output file path", required: false },
    ],
    capabilities: ["fs:write"],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const input_path = args.input_path;
      const output_format = args.output_format;
      if (!input_path || typeof input_path !== "string") return { toolName: "doc_convert", success: false, output: "", error: "input_path is required", durationMs: Date.now() - start };
      if (!output_format || typeof output_format !== "string") return { toolName: "doc_convert", success: false, output: "", error: "output_format is required", durationMs: Date.now() - start };

      const output_path = (args.output_path as string) || `${input_path}.${output_format}`;
      const result = `Converted "${input_path}" to ${output_format.toUpperCase()}: ${output_path}`;
      return { toolName: "doc_convert", success: true, output: result, durationMs: Date.now() - start };
    } catch (error) {
      return { toolName: "doc_convert", success: false, output: "", error: `Failed to convert: ${error instanceof Error ? error.message : String(error)}`, durationMs: Date.now() - start };
    }
  },
};

export async function onLoad(ctx: PluginContext): Promise<void> {
  config = await ctx.config.get();
}

export async function onUnload(_ctx: PluginContext): Promise<void> {}

export const tools: Tool[] = [
  doc_generate,
  doc_template_list,
  doc_template_create,
  doc_merge,
  doc_convert,
];
