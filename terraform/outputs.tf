output "r2_bucket_name" {
  description = "Name of the created R2 bucket"
  value       = module.r2_storage.bucket_name
}

output "r2_bucket_id" {
  description = "ID of the created R2 bucket"
  value       = module.r2_storage.bucket_id
}

output "d1_database_name" {
  description = "Name of the created D1 database"
  value       = module.d1_database.database_name
}

output "d1_database_id" {
  description = "ID of the created D1 database"
  value       = module.d1_database.database_id
}

output "kv_namespace_id" {
  description = "ID of the created KV namespace"
  value       = cloudflare_workers_kv_namespace.session_store.id
}

output "pages_project_name" {
  description = "Name of the created Pages project"
  value       = module.pages_project.project_name
}

output "pages_project_url" {
  description = "URL of the Pages project"
  value       = module.pages_project.project_url
}

output "domain_url" {
  description = "URL of the configured domain"
  value       = "https://${var.domain_name}"
}

output "api_endpoint" {
  description = "API endpoint URL for the application"
  value       = "https://api.${var.domain_name}"
}

output "cloudflare_account_id" {
  description = "Cloudflare account ID"
  value       = var.cloudflare_account_id
}

output "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain"
  value       = var.cloudflare_zone_id
}

output "environment_name" {
  description = "Current deployment environment (prod/dev)"
  value       = "prod"
}

output "app_version" {
  description = "Application version from deployment"
  value       = formatdate("YYYYMMDDhhmmss", timestamp())
}
