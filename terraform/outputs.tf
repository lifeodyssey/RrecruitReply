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
