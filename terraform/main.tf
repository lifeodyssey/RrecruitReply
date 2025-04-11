terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  # Uncomment this block when you're ready to use Terraform Cloud or S3 backend
  # backend "s3" {
  #   bucket = "recruitreply-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# R2 Storage Bucket
module "r2_storage" {
  source = "./modules/r2"
  
  bucket_name = var.r2_bucket_name
  account_id  = var.cloudflare_account_id
}

# D1 Database
module "d1_database" {
  source = "./modules/d1"
  
  database_name = var.d1_database_name
  account_id    = var.cloudflare_account_id
}

# KV Namespace
resource "cloudflare_workers_kv_namespace" "session_store" {
  title      = var.kv_namespace_name
  account_id = var.cloudflare_account_id
}

# Pages Project
module "pages_project" {
  source = "./modules/pages"
  
  project_name = var.pages_project_name
  account_id   = var.cloudflare_account_id
  production_branch = var.production_branch
}

# DNS Configuration
module "dns_config" {
  source = "./modules/dns"
  
  domain_name = var.domain_name
  account_id  = var.cloudflare_account_id
  zone_id     = var.cloudflare_zone_id
  pages_project_name = var.pages_project_name
}
