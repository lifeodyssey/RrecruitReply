# Terraform to Next.js Integration via GitHub Actions

This document explains how the recruit-reply application automatically receives configuration from Cloudflare infrastructure provisioned via Terraform.

## Overview

The integration flow is as follows:

1. Terraform manages infrastructure on Cloudflare (using Terragrunt)
2. Terraform outputs are captured and stored as artifacts in GitHub Actions
3. The Next.js application build process retrieves these outputs
4. Configuration is automatically injected into Cloudflare Pages environment variables
5. Next.js application uses these environment variables at runtime

This approach follows trunk-based development principles by ensuring that infrastructure and application changes are coordinated and automatically deployed from the main branch.

## How It Works

### 1. Terraform Outputs

In your Terraform modules, define outputs for values that need to be consumed by the Next.js application:

```terraform
output "api_endpoint" {
  value       = cloudflare_worker.api.url
  description = "The URL of the API worker"
}

output "database_id" {
  value       = cloudflare_d1_database.main.id
  description = "The ID of the D1 database"
}
```

### 2. GitHub Actions Workflow

The integration is handled by three GitHub Actions workflows:

1. **Terraform Workflow** (`terraform.yml`): 
   - Manages infrastructure
   - Outputs terraform values to a file
   - Stores the file as an artifact

2. **Next.js Workflow** (`nextjs.yml`):
   - Builds and deploys the Next.js application
   - Downloads terraform outputs
   - Updates Cloudflare Pages environment variables
   - Deploys to Cloudflare Pages

3. **Workflow Coordination**:
   - The Next.js workflow runs when the Terraform workflow completes
   - This ensures the application is built with the latest infrastructure values

### 3. Accessing Values in Next.js

In your Next.js application, you can access these values through environment variables:

```typescript
// Example of accessing Terraform outputs in Next.js
const apiEndpoint = process.env.NEXT_PUBLIC_api_endpoint || '';
const databaseId = process.env.NEXT_PUBLIC_database_id || '';
```

## Benefits

1. **Zero Manual Configuration**: No need to manually update environment variables
2. **Infrastructure as Code**: All configuration is tracked in version control
3. **Automatic Synchronization**: Application is always in sync with infrastructure
4. **Secure**: No long-lived API tokens in environment variables
5. **Trunk-Based Development**: Changes are always deployed from main branch
6. **Testability**: PR previews reflect the current production infrastructure

## Troubleshooting

If your Next.js application isn't receiving the correct configuration:

1. Check the Terraform workflow run to ensure outputs were generated
2. Verify the Next.js workflow was triggered after the Terraform workflow completed
3. Check the `update-cloudflare-vars.js` script output for any errors
4. Confirm that outputs are properly formatted in your Terraform modules
5. Verify that Cloudflare Pages is using the environment variables

## Security Considerations

1. Terraform outputs are stored as GitHub artifacts with a short retention period
2. Only public configuration is exposed to the Next.js application as `NEXT_PUBLIC_*` variables
3. Sensitive values should be stored as Cloudflare secrets, not Terraform outputs
4. GitHub Actions permissions follow the principle of least privilege

## Example: Adding a New Configuration Value

1. Add the output to your Terraform module:
   ```terraform
   output "new_config_value" {
     value = "some_value"
   }
   ```

2. Deploy the infrastructure change (merge to main)
3. The Next.js workflow will automatically:
   - Get the new output
   - Add it as `NEXT_PUBLIC_new_config_value` to Cloudflare Pages
   - Build and deploy the updated application

4. Access in your Next.js code:
   ```typescript
   const newValue = process.env.NEXT_PUBLIC_new_config_value || 'default';
   ``` 