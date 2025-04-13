# GitHub Actions Workflows for recruit-reply

This document outlines the GitHub Actions workflows configured for the recruit-reply project. These workflows automate the CI/CD pipeline, security scanning, and infrastructure management.

## Available Workflows

### 1. Next.js CI/CD (`nextjs.yml`)

This workflow handles the continuous integration and deployment of the Next.js application.

**Trigger Events:**
- Push to `main` branch (except changes to Terraform files and documentation)
- Pull requests targeting `main` branch (except changes to Terraform files and documentation)
- Manual trigger via workflow_dispatch

**Key Features:**
- Builds and tests the Next.js application
- Runs security audit on dependencies
- Performs vulnerability scanning with Snyk
- Deploys to Cloudflare Pages (only on merge to main)
- Uses artifact caching for faster builds

### 2. Terragrunt/Terraform Infrastructure (`terraform.yml`)

This workflow manages the infrastructure using Terraform and Terragrunt.

**Trigger Events:**
- Push to `main` branch (only when Terraform files are changed)
- Pull requests targeting `main` branch (only when Terraform files are changed)
- Manual trigger via workflow_dispatch

**Key Features:**
- Runs Terraform format checks
- Performs security scanning with TFLint and tfsec
- Posts plan to PR comments for review
- Applies changes automatically on merge to main
- Supports different environments (dev/prod)

### 3. Security Scanning (`security.yml`)

Dedicated workflow for comprehensive security scanning.

**Trigger Events:**
- Push to `main` branch
- Pull requests targeting `main` branch
- Weekly schedule (Sunday at midnight)
- Manual trigger via workflow_dispatch

**Key Features:**
- CodeQL analysis for JavaScript/TypeScript
- Dependency review on PRs
- Secret scanning with GitLeaks
- NPM audit and OWASP dependency checks
- Generates security reports as artifacts

### 4. PR Preview Environments (`preview.yml`)

Creates preview environments for pull requests.

**Trigger Events:**
- Pull request created, updated, or reopened (except changes to Terraform files and documentation)

**Key Features:**
- Builds and deploys a preview environment for each PR
- Adds a comment to the PR with the preview URL
- Uses branch-based deployments on Cloudflare Pages

## Required Secrets

To use these workflows, you need to add the following secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN`: API token with appropriate permissions for Pages and Workers
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_ZONE_ID`: The Zone ID for your domain
- `SNYK_TOKEN`: API token for Snyk (for dependency vulnerability scanning)
- `GITLEAKS_LICENSE`: License for GitLeaks (optional, for advanced features)

## Security Considerations

These workflows incorporate several security best practices:

1. **Least Privilege Principle**: Each workflow uses minimal GitHub permissions
2. **Dependency Scanning**: Multiple tools check for vulnerabilities
3. **Infrastructure as Code Security**: Terraform code is scanned for security issues
4. **Secret Scanning**: Prevents accidental commit of secrets
5. **NPM Audit**: Checks for vulnerabilities in npm packages
6. **CodeQL Analysis**: Static code analysis to find security issues

## How to Use

### Running a Workflow Manually

1. Navigate to the Actions tab in the GitHub repository
2. Select the desired workflow
3. Click "Run workflow"
4. Select the branch
5. Click "Run workflow" button

### Creating a New Deployment

Simply merge a PR to the `main` branch. The `nextjs.yml` workflow will automatically:
1. Build and test the application
2. Deploy to Cloudflare Pages

### Getting a Preview Environment

When you create or update a pull request, the `preview.yml` workflow will automatically:
1. Build the application with the changes
2. Deploy to a preview environment on Cloudflare Pages
3. Add a comment to your PR with the preview URL

### Infrastructure Changes

When making changes to Terraform or Terragrunt files:
1. Create a PR with your changes
2. The `terraform.yml` workflow will run a plan and post it as a comment
3. Review the plan in the PR comment
4. Once approved and merged to `main`, changes will be applied automatically 