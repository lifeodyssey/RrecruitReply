locals {
  # Load environment variables
  env_vars = yamldecode(file(find_in_parent_folders("env.yaml")))
  
  # Extract common variables
  cloudflare_account_id = local.env_vars.cloudflare_account_id
  cloudflare_zone_id    = local.env_vars.cloudflare_zone_id
  project_name          = local.env_vars.project_name
  environment           = local.env_vars.environment
}

# Generate provider configuration for all child modules
generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
EOF
}

# Generate backend configuration for all child modules
# Uncomment this when you're ready to use remote state
# remote_state {
#   backend = "s3"
#   config = {
#     bucket         = "${local.project_name}-terraform-state"
#     key            = "${path_relative_to_include()}/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "${local.project_name}-terraform-locks"
#   }
#   generate = {
#     path      = "backend.tf"
#     if_exists = "overwrite_terragrunt"
#   }
# }

# Define inputs that are common to all modules
inputs = {
  cloudflare_account_id = local.cloudflare_account_id
  cloudflare_zone_id    = local.cloudflare_zone_id
  project_name          = local.project_name
  environment           = local.environment
}
