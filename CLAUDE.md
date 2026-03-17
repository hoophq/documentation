# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Hoop.dev documentation site built with Mintlify. The docs cover a secure access gateway product that provides data masking, session recording, access controls, and audit logging for database and infrastructure access.

## Commands

```bash
# Development server (runs on http://localhost:3000/docs)
npm run dev

# Build production docs
npm run build

# Process connection YAML templates into MDX files
npm run process-connections
```

## Architecture

### Connection Template System

Connection quickstart pages are **auto-generated** from YAML templates:

1. **Source**: `store/connections/*.yml` (30+ templates)
2. **Script**: `scripts/process-connections.js` processes YAML → MDX
3. **Output**: `quickstart/*/` directories (databases, cloud-services, etc.)
4. **Catalog**: `store/connections.json` (consolidated JSON)

**Do not edit quickstart MDX files directly** - they are overwritten when the script runs. Edit the YAML templates instead.

### Key Configuration

- `docs.json` - Mintlify config: navigation structure, theme, external links, analytics
- Navigation is **manual** - new pages must be added to `docs.json` navigation array

### Content Structure

| Directory | Purpose |
|-----------|---------|
| `learn/features/` | Feature documentation (AI masking, reviews, guardrails, etc.) |
| `setup/` | Deployment (Docker, K8s, AWS) and configuration guides |
| `clients/` | CLI and Web App documentation |
| `integrations/` | Third-party integrations (Slack, Teams, Jira) |
| `quickstart/` | Auto-generated connection guides |
| `snippets/` | Reusable MDX components |
| `store/connections/` | YAML source templates for connections |

### Reusable Components

- `snippets/connection-template.jsx` - Renders connection features table
- `snippets/catalog.jsx` - Resource catalog component
- `snippets/LearnPrerequisites.mdx` - Standard prerequisites block

## CI/CD

GitHub Actions workflow (`.github/workflows/process-connections.yml`) automatically:
- Runs `process-connections` when YAML files in `store/connections/` change
- Commits generated MDX and JSON back to the repository

## Mintlify-Specific Notes

- Uses MDX with Mintlify components (`<Steps>`, `<Card>`, `<CardGroup>`, `<Frame>`, `<Note>`, `<Warning>`, etc.)
- Images go in `images/` with light/dark mode variants where needed
- API reference is generated from OpenAPI spec at `https://use.hoop.dev/api/openapiv3.json`
