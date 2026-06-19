// deno-lint-ignore-file require-await
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { tools } from '../../mod.ts';
import type { PluginContext, ToolContext } from '../../types.ts';

// Mock PluginContext
const mockContext: PluginContext & ToolContext = {
  pluginId: 'cortex-plugin-document-generator',
  pluginDir: '/tmp/plugins/cortex-plugin-document-generator',
  state: {
    get: async () => null,
    set: async () => {},
    delete: async () => {},
    list: async () => ({}),
  },
  config: {
    get: async () => null,
    set: async () => {},
    getAll: async () => ({}),
  },
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  },
  host: {
    registerTool: () => {},
    unregisterTool: () => {},
  },
  sessionId: 'test-session',
  workingDir: '/tmp',
  agentId: 'test-agent',
  workspaceDir: '/tmp',
};

function findTool(name: string) {
  const tool = tools.find((t) => t.definition.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

Deno.test('tools array — exports all tools', () => {
  assertEquals(tools.length, 5);
  assertEquals(tools[0].definition.name, 'doc_generate');
  assertEquals(tools[1].definition.name, 'doc_template_list');
  assertEquals(tools[2].definition.name, 'doc_template_create');
  assertEquals(tools[3].definition.name, 'doc_merge');
  assertEquals(tools[4].definition.name, 'doc_convert');
});

Deno.test('doc_generate — rejects empty content', async () => {
  const tool = findTool('doc_generate');
  const result = await tool.execute({ 'content': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('doc_template_list — tool is defined with name and description', () => {
  const tool = findTool('doc_template_list');
  assertEquals(typeof tool.definition.description, 'string');
  assertEquals(tool.definition.description.length > 0, true);
});

Deno.test('doc_template_create — rejects empty name', async () => {
  const tool = findTool('doc_template_create');
  const result = await tool.execute({ 'name': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('doc_merge — rejects empty files', async () => {
  const tool = findTool('doc_merge');
  const result = await tool.execute({ 'files': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('doc_convert — rejects empty input_path', async () => {
  const tool = findTool('doc_convert');
  const result = await tool.execute({ 'input_path': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('all tools return durationMs', async () => {
  for (const tool of tools) {
    const args: Record<string, unknown> = {};
    const result = await tool.execute(args, mockContext);
    assertEquals(typeof result.durationMs, 'number');
    assertEquals(result.durationMs >= 0, true);
  }
});
