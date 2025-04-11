# RecruitReply Terraform Configuration

This directory contains Terraform configuration for provisioning the Cloudflare infrastructure required for the RecruitReply application.

## Resources Created

- **R2 Bucket**: For document storage
- **D1 Database**: For structured data storage
- **KV Namespace**: For session management
- **Pages Project**: For hosting the Next.js application
- **DNS Configuration**: For custom domain setup

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or later)
- Cloudflare account with:
  - API token with appropriate permissions
  - Account ID
  - Zone ID (if using custom domain)

## Getting Started

1. Copy `terraform.tfvars.example` to `terraform.tfvars` and fill in your Cloudflare credentials:

```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` with your Cloudflare credentials and desired configuration.

3. Initialize Terraform:

```bash
terraform init
```

4. Plan the deployment:

```bash
terraform plan
```

5. Apply the configuration:

```bash
terraform apply
```

## Module Structure

- **r2**: R2 bucket for document storage
- **d1**: D1 database for structured data
- **pages**: Pages project for application hosting
- **dns**: DNS configuration for custom domain

## Variables

See `variables.tf` for a complete list of configurable variables.

## Outputs

After applying the configuration, Terraform will output:

- R2 bucket name and ID
- D1 database name and ID
- KV namespace ID
- Pages project name and URL
- Domain URL

## Notes

- The Cloudflare API token needs permissions for R2, D1, KV, Pages, and DNS (if using custom domain).
- For production use, consider using Terraform Cloud or an S3 backend for state management.
- The Pages project requires connection to a GitHub repository, which should be done manually after creating the project.
