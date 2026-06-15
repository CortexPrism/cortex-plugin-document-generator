# Cortex Plugin: Document Generator

Generate polished PDFs, Word documents, Markdown reports with templates.

## Installation

```bash
cortex plugin install github:CortexPrism/cortex-plugin-document-generator
```

## Tools

### doc_generate
Generate a document from markdown content.
- `content` (string, required) — Markdown text content
- `format` (enum, required) — Output format: pdf, docx, md, html
- `title` (string, required) — Document title
- `template` (string, optional) — Template name to use
- `author` (string, optional) — Document author
- `include_toc` (boolean, default: true) — Include table of contents

### doc_template_list
List available document templates.
- `category` (string, optional) — Filter: report, proposal, letter, meeting_notes, resume

### doc_template_create
Create a custom document template.
- `name` (string, required) — Template name
- `category` (string, required) — Template category
- `header_html` (string, optional) — Custom header HTML
- `footer_html` (string, optional) — Custom footer HTML
- `css` (string, optional) — Custom CSS styles

### doc_merge
Merge multiple documents into one.
- `files` (string, required) — JSON array of file paths
- `output_format` (enum, required) — Output format: pdf, docx
- `output_path` (string, required) — Output file path

### doc_convert
Convert between document formats.
- `input_path` (string, required) — Input file path
- `output_format` (enum, required) — Target format: pdf, docx, md, html, txt
- `output_path` (string, optional) — Output file path

## Configuration

| Key | Type | Description |
|-----|------|-------------|
| `defaultFormat` | select | Default format: pdf, docx, md, html |
| `defaultAuthor` | text | Default document author name |
| `companyName` | text | Company name for headers |
| `companyLogo` | text | Company logo URL |

## Development

```bash
deno task test
deno fmt
deno lint
```

## License

MIT
