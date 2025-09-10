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

// Function to extract custom content from existing files
const extractCustomContent = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return '';
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Find the ConnectionTemplate component and get everything after it
    let templateEndIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('<ConnectionTemplate') && line.includes('/>')) {
        // Single line component
        templateEndIndex = i;
        break;
      } else if (line.includes('<ConnectionTemplate')) {
        // Multi-line component - find the closing />
        for (let j = i; j < lines.length; j++) {
          if (lines[j].includes('/>')) {
            templateEndIndex = j;
            break;
          }
        }
        break;
      }
    }
    
    if (templateEndIndex !== -1 && templateEndIndex < lines.length - 1) {
      return '\n' + lines.slice(templateEndIndex + 1).join('\n').trimEnd();
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

${connection.additionalInformation ? `\n${connection.additionalInformation}` : ''}
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
      let customContent = '';
      let outputFile = `${connection.documentationConfig.path}.mdx`;

      customContent = extractCustomContent(outputFile);
      console.log(`Processing file: ${outputFile}`);

      // Generate MDX using reusable snippet with custom content
      const mdxContent = createMDXContent(connection, customContent);
      
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
        let customContent = '';
        let outputFile = `${existingConnection.documentationConfig.path}.mdx`;

        customContent = extractCustomContent(outputFile);
        console.log(`Processing legacy file: ${outputFile}`);

        // Generate MDX using reusable snippet with custom content
        const mdxContent = createMDXContent(connection, customContent);
        
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
