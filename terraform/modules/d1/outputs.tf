output "database_name" {
  description = "Name of the created D1 database"
  value       = cloudflare_d1_database.app_database.name
}

output "database_id" {
  description = "ID of the created D1 database"
  value       = cloudflare_d1_database.app_database.id
}
