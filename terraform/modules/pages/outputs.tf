output "project_name" {
  description = "Name of the created Pages project"
  value       = cloudflare_pages_project.app.name
}

output "project_url" {
  description = "URL of the Pages project"
  value       = cloudflare_pages_project.app.subdomain
}
