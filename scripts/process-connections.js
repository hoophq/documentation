const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Configure directories
const connectionsDir = 'store/connections';
const outputDir = 'connections';
const connections = [];

// Check if connections directory exists
if (!fs.existsSync(connectionsDir)) {
  console.error('Error: Connections directory not found:', connectionsDir);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all YAML files
const files = fs.readdirSync(connectionsDir).filter(file => file.endsWith('.yml'));

if (files.length === 0) {
  console.log('No YAML files found. Skipping processing.');
  process.exit(0);
}

// MDX template using reusable snippet
const createMDXContent = connection => {
  return `---
title: "${connection.name}"
description: "${connection.description}"
category: "${connection.category}"
---

import ConnectionTemplate from '/snippets/ConnectionTemplate.mdx';

<ConnectionTemplate config={${JSON.stringify(connection, null, 2)}} />
`;
};

// Process each file
files.forEach(file => {
  try {
    const filePath = path.join(connectionsDir, file);
    const yamlContent = fs.readFileSync(filePath, 'utf8');
    const connection = yaml.load(yamlContent);

    // Validate basic structure
    if (!connection.id || !connection.name) {
      console.warn(`Warning: File ${file} does not have valid ID or name. Skipping...`);
      return;
    }

    // Add to connections list
    connections.push(connection);

    // Generate MDX using reusable snippet
    const mdxContent = createMDXContent(connection);
    const outputFile = path.join(outputDir, `${connection.id}.mdx`);
    fs.writeFileSync(outputFile, mdxContent);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Update consolidated JSON
const jsonOutput = {
  connections: connections.sort((a, b) => a.name.localeCompare(b.name))
};

try {
  fs.writeFileSync('store/connections.json', JSON.stringify(jsonOutput, null, 2));
} catch (error) {
  console.error('Error updating JSON:', error.message);
  process.exit(1);
}

console.log(`Processing completed: ${connections.length} connections processed.`);
