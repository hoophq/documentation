# Documentation File Status Guide

## Overview
This guide explains the file status marking system used in the Hoop.dev documentation restructuring project. We've implemented a visual system to help identify placeholder files that need content and duplicated files that exist in multiple locations.

## File Status Markers

### In the Filesystem
We've added marker files with special prefixes to help visually identify file status:

- **🆕_filename.mdx** - Indicates a placeholder file that needs content to be created
- **📋_filename.mdx** - Indicates a file that has been duplicated from another location

These marker files are empty and don't affect the actual content files. They exist alongside the real files purely as visual indicators.

### In the Documentation
In the `restructuring-summary.md` file, we use the following symbols to indicate file status:

- 🆕 **Placeholder** - New file that needs content
- 📋 **Duplicated** - Content duplicated from another location
- ✅ **Moved** - Existing content moved to new location

## Placeholder Files
The following files are placeholders that need content to be created:

### Learn Section
1. `learn/webapp/overview.mdx`
2. `learn/webapp/creating-connections.mdx`
3. `learn/webapp/managing-access.mdx`
4. `learn/webapp/monitoring-sessions.mdx`
5. `learn/features/reviews/command-reviews.mdx`
6. `learn/features/guardrails.mdx`

### Concepts Section
1. `concepts/connection.mdx`
2. `concepts/security.mdx`
3. `concepts/network.mdx`
4. `concepts/deployment-options.mdx`

### Technical Reference Section
1. `technical-reference/architecture/components.mdx`
2. `technical-reference/architecture/security-model.mdx`
3. `technical-reference/architecture/network-flow.mdx`

## Duplicated Files
The following files have been duplicated in multiple locations:

1. `learn/architecture.mdx` → duplicated to:
   - `concepts/how-it-works.mdx`
   - `technical-reference/architecture/overview.mdx`

2. `learn/api-key-usage.mdx` → duplicated to:
   - `learn/features/api-key-usage.mdx`
   - `technical-reference/apis/api-key-usage.mdx`

3. `learn/webhooks-siem.mdx` → duplicated to:
   - `learn/features/webhooks-siem.mdx`
   - `technical-reference/apis/webhooks-siem.mdx`

## Next Steps for Content Creation
1. Prioritize creating content for placeholder files
2. For duplicated files, decide whether to:
   - Keep identical content in multiple locations
   - Create specialized versions for each section
   - Use one canonical version and link to it from other locations

## Removing Markers
Once all placeholder files have been filled with content and decisions have been made about duplicated files, you can remove the marker files by running:

```bash
find documentation -name "🆕_*" -delete
find documentation -name "📋_*" -delete
``` 