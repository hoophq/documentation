const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Configure directories
const connectionsDir = 'store/connections';
const connections = [];

// Load existing connections.json to check for documentationConfig
let existingConnections = [];
try {
  const connectionsJson = JSON.parse(fs.readFileSync('store/connections.json', 'utf8'));
  existingConnections = connectionsJson.connections || [];
} catch (error) {
  console.log('No existing connections.json found or error reading it:', error.message);
}

// Check if connections directory exists
if (!fs.existsSync(connectionsDir)) {
  console.error('Error: Connections directory not found:', connectionsDir);
  process.exit(1);
}

// Read all YAML files
const files = fs.readdirSync(connectionsDir).filter(file => file.endsWith('.yml'));

if (files.length === 0) {
  console.log('No YAML files found. Skipping processing.');
  process.exit(0);
}

// MDX template using reusable snippet
const createMDXContent = (connection) => {
  // Remove additionalInformation from the config passed to ConnectionTemplate
  const { additionalInformation, ...configForTemplate } = connection;
  
  return `---
title: "${connection.name}"
description: "${connection.description}"
category: "${connection.category}"
---

import { ConnectionTemplate } from '/snippets/connection-template.jsx';

<ConnectionTemplate config={${JSON.stringify(configForTemplate, null, 2)}} />

${additionalInformation ? `\n${additionalInformation}` : ''}
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

    // Add to connections list (exclude additionalInformation from JSON)
    const { additionalInformation, ...connectionForJson } = connection;
    connections.push(connectionForJson);

    // Only process connections that have documentation path configured
    if (connection.documentationConfig?.path) {
      let outputFile = `${connection.documentationConfig.path}.mdx`;

      console.log(`Processing file: ${outputFile}`);

      // Generate MDX using reusable snippet with custom content
      const mdxContent = createMDXContent(connection);
      
      // Ensure directory exists
      const outputDirPath = path.dirname(outputFile);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }
      
      fs.writeFileSync(outputFile, mdxContent);
    } else {
      // Check fallback in existing JSON for legacy support
      const existingConnection = existingConnections.find(c => c.id === connection.id);
      if (existingConnection?.documentationConfig?.path) {
        let outputFile = `${existingConnection.documentationConfig.path}.mdx`;

        console.log(`Processing legacy file: ${outputFile}`);

        // Generate MDX using reusable snippet with custom content
        const mdxContent = createMDXContent(connection);
        
        // Ensure directory exists
        const outputDirPath = path.dirname(outputFile);
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }
        
        fs.writeFileSync(outputFile, mdxContent);
      } else {
        console.log(`Skipping ${connection.id}: no documentationConfig.path specified`);
      }
    }
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
