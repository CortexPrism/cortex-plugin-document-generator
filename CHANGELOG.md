# Changelog

## [Unreleased]

### Added
- Structured logging via ctx.logger in lifecycle hooks

### Changed
- Renamed manifest file from `cortex.json` to `manifest.json` for consistency with Cortex standard
- Standardized UI section structure to `ui.settings` format
- Normalized parameter naming: `defaultValue` → `default`, `options` → `enum`
- Added `homepage` field with repository URL
- Added `dependencies` field to manifest

## [1.0.1] — 2026-06-15

### Added
- Initial release
## [1.0.1] — 2026-06-17

### Added

- Initial project setup

## [1.0.0] — 2026-06-15

### Added

- Initial release of cortex-plugin-document-generator
- `doc_generate` — Generate PDF, DOCX, MD, and HTML documents from markdown
- `doc_template_list` — List available document templates by category
- `doc_template_create` — Create custom document templates with headers, footers, and CSS
- `doc_merge` — Merge multiple documents into a single PDF or DOCX
- `doc_convert` — Convert between document formats
- UI settings for default format, author, company name, and company logo
