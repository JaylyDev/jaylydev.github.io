#!/usr/bin/env node

/**
 * Demonstration script for writing files to a branch
 * This script shows how to programmatically create files
 */

import fs from 'fs';
import path from 'path';

function writeFileDemo() {
  const timestamp = new Date().toISOString();
  const demoContent = {
    message: "This file was written programmatically",
    timestamp: timestamp,
    branch: process.env.GITHUB_HEAD_REF || "current-branch",
    repository: "JaylyDev/jaylydev.github.io",
    capabilities: [
      "Create new files",
      "Write content to files",
      "Generate dynamic content",
      "Commit changes to git"
    ]
  };

  const outputDir = path.join(process.cwd(), 'tmp');
  const outputFile = path.join(outputDir, 'demo-output.json');

  // Ensure tmp directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the demonstration file
  fs.writeFileSync(outputFile, JSON.stringify(demoContent, null, 2));
  
  console.log('✅ File writing demonstration completed!');
  console.log(`📄 Created file: ${outputFile}`);
  console.log(`📅 Timestamp: ${timestamp}`);
  console.log('📝 Content:', JSON.stringify(demoContent, null, 2));

  return outputFile;
}

// Run the demonstration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileDemo();
}

export { writeFileDemo };