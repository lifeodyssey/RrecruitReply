# RecruitReply Terragrunt Configuration

This directory contains Terragrunt configuration for provisioning the Cloudflare infrastructure required for the RecruitReply application.

## What is Terragrunt?

Terragrunt is a thin wrapper around Terraform that provides extra tools for working with multiple Terraform modules. It helps keep your Terraform code DRY (Don't Repeat Yourself) by allowing you to define common configurations once and reuse them across modules.

## Resources Created

- **R2 Bucket**: For document storage
- **D1 Database**: For structured data storage
- **KV Namespace**: For session management
- **Pages Project**: For hosting the Next.js application
- **DNS Configuration**: For custom domain setup

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or later)
- [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/install/) (v0.45.0 or later)
- Cloudflare account with:
  - API token with appropriate permissions
  - Account ID
  - Zone ID (if using custom domain)

## Directory Structure

```
terragrunt/
├── terragrunt.hcl       # Root configuration with common settings
├── env.yaml             # Environment-specific variables
├── r2/                  # R2 bucket configuration
├── d1/                  # D1 database configuration
├── kv/                  # KV namespace configuration
├── pages/               # Pages project configuration
└── dns/                 # DNS configuration
```

## Getting Started

1. Update `env.yaml` with your Cloudflare credentials and desired configuration.

2. Set the Cloudflare API token as an environment variable:

```bash
export TF_VAR_cloudflare_api_token=your-api-token
export TF_VAR_environment=dev  # or prod, staging, etc.
```

3. Initialize and apply all modules:

```bash
cd terragrunt
terragrunt run-all init
terragrunt run-all plan
terragrunt run-all apply
```

4. Or apply individual modules:

```bash
cd terragrunt/r2
terragrunt apply
```

## Module Dependencies

- **pages**: Depends on r2, d1, and kv
- **dns**: Depends on pages

Terragrunt automatically handles these dependencies and applies the modules in the correct order.

## Environment Support

The configuration supports multiple environments (dev, staging, prod) through:

1. Environment-specific variables in `env.yaml`
2. Environment variable `TF_VAR_environment`
3. Resource naming that includes the environment

## Notes

- The Cloudflare API token needs permissions for R2, D1, KV, Pages, and DNS (if using custom domain).
- For production use, uncomment and configure the remote state section in the root terragrunt.hcl file.
- The Pages project requires connection to a GitHub repository, which should be done manually after creating the project.
