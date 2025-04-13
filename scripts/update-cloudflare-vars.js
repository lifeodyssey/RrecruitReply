#!/usr/bin/env node

/**
 * Script to update Cloudflare Pages environment variables from Terraform outputs
 * This script is used in the GitHub Actions workflow to automatically configure
 * the Next.js application with values from the infrastructure deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration from environment variables
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const PROJECT_NAME = process.env.PROJECT_NAME || 'recruitreply';
const ENV_FILE_PATH = process.env.ENV_FILE_PATH || 'tf_outputs.env';

// Validate required environment variables
if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
  console.error('Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables are required');
  process.exit(1);
}

// Check if environment file exists
if (!fs.existsSync(ENV_FILE_PATH)) {
  console.warn(`Warning: Environment file ${ENV_FILE_PATH} not found. Skipping environment variables update.`);
  process.exit(0);
}

/**
 * Parse environment file to extract variables
 * @param {string} filePath - Path to the environment file
 * @returns {object} - Object containing environment variables
 */
function parseEnvFile(filePath) {
  const envVars = {};
  const content = fs.readFileSync(filePath, 'utf8');
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes if present
      envVars[`NEXT_PUBLIC_${key}`] = value;
    }
  });
  
  return envVars;
}

/**
 * Update Cloudflare Pages environment variables using Wrangler
 * @param {object} envVars - Object containing environment variables to set
 */
async function updateCloudflareVars(envVars) {
  console.log(`Updating Cloudflare Pages environment variables for project ${PROJECT_NAME}...`);
  
  // Create temp JSON file for environment variables
  const tempFilePath = path.join(process.cwd(), 'cloudflare_env_vars.json');
  fs.writeFileSync(tempFilePath, JSON.stringify(envVars, null, 2));
  
  try {
    // Use wrangler to update environment variables
    const command = `npx wrangler pages deployment-variable set ${PROJECT_NAME} --json @${tempFilePath}`;
    console.log(`Running: ${command}`);
    
    const result = execSync(command, {
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN,
        CLOUDFLARE_ACCOUNT_ID
      }
    });
    
    console.log('Environment variables updated successfully!');
    console.log(result.toString());
  } catch (error) {
    console.error('Error updating environment variables:', error.message);
    process.exit(1);
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

// Main function
(async () => {
  try {
    const envVars = parseEnvFile(ENV_FILE_PATH);
    console.log(`Found ${Object.keys(envVars).length} environment variables to update`);
    
    // Add timestamp for tracking when variables were last updated
    envVars.NEXT_PUBLIC_INFRA_UPDATED_AT = new Date().toISOString();
    
    await updateCloudflareVars(envVars);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})(); 