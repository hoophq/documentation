#!/bin/bash

# Script to mark placeholder and duplicated files in the documentation structure
# This adds a prefix to the filename to make it easy to identify

# Mark placeholder files
echo "Marking placeholder files..."

# Learn section placeholders
touch documentation/learn/webapp/🆕_overview.mdx
touch documentation/learn/webapp/🆕_creating-connections.mdx
touch documentation/learn/webapp/🆕_managing-access.mdx
touch documentation/learn/webapp/🆕_monitoring-sessions.mdx
touch documentation/learn/features/reviews/🆕_command-reviews.mdx
touch documentation/learn/features/🆕_guardrails.mdx

# Concepts section placeholders
touch documentation/concepts/🆕_connection.mdx
touch documentation/concepts/🆕_security.mdx
touch documentation/concepts/🆕_network.mdx
touch documentation/concepts/🆕_deployment-options.mdx

# Technical Reference section placeholders
touch documentation/technical-reference/architecture/🆕_components.mdx
touch documentation/technical-reference/architecture/🆕_security-model.mdx
touch documentation/technical-reference/architecture/🆕_network-flow.mdx

# Mark duplicated files
echo "Marking duplicated files..."

# Create empty files with 📋 prefix to indicate duplicated content
touch documentation/concepts/📋_how-it-works.mdx
touch documentation/technical-reference/apis/📋_api-key-usage.mdx
touch documentation/technical-reference/apis/📋_webhooks-siem.mdx

echo "Done marking files. These are visual indicators only and don't affect the actual content files."
echo "The original files remain unchanged. These are just empty marker files to help identify status." 