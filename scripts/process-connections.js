const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Configure directories
const connectionsDir = 'store/connections';
const outputDir = 'connections';
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

// Function to extract custom content from existing files
const extractCustomContent = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return '';
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Find where the standard sections end (look for Connection Setup, Usage, etc.)
    const customSectionMarkers = [
      '## Connection Setup',
      '## Connection Usage', 
      '## Known Issues',
      '## Examples',
      '## Advanced Configuration',
      '## Troubleshooting'
    ];
    
    let customStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (customSectionMarkers.some(marker => line.startsWith(marker))) {
        customStartIndex = i;
        break;
      }
    }
    
    if (customStartIndex !== -1) {
      return '\n' + lines.slice(customStartIndex).join('\n');
    }
    
    return '';
  } catch (error) {
    console.warn(`Error extracting custom content from ${filePath}:`, error.message);
    return '';
  }
};

// MDX template using reusable snippet
const createMDXContent = (connection, customContent = '') => {
  return `---
title: "${connection.name}"
description: "${connection.description}"
category: "${connection.category}"
---

import { ConnectionTemplate } from '/snippets/connection-template.jsx';

<ConnectionTemplate config={${JSON.stringify(connection, null, 2)}} />${customContent}
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

    // Check if this connection has existing documentation (from YAML or JSON)
    let customContent = '';
    let outputFile;

    if (connection.documentationConfig?.path) {
      // Use documentation path from YAML file
      const existingFilePath = `${connection.documentationConfig.path}.mdx`;
      customContent = extractCustomContent(existingFilePath);
      outputFile = existingFilePath;
      console.log(`Updating existing file: ${outputFile}`);
    } else {
      // Check fallback in existing JSON
      const existingConnection = existingConnections.find(c => c.id === connection.id);
      if (existingConnection?.documentationConfig?.path) {
        const existingFilePath = `${existingConnection.documentationConfig.path}.mdx`;
        customContent = extractCustomContent(existingFilePath);
        outputFile = existingFilePath;
        console.log(`Updating existing file: ${outputFile}`);
      } else {
        // Create new file in connections directory
        outputFile = path.join(outputDir, `${connection.id}.mdx`);
        console.log(`Creating new file: ${outputFile}`);
      }
    }

    // Generate MDX using reusable snippet with custom content
    const mdxContent = createMDXContent(connection, customContent);
    
    // Ensure directory exists
    const outputDirPath = path.dirname(outputFile);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }
    
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
