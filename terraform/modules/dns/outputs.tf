output "domain" {
  description = "Domain configured for the application"
  value       = var.domain_name
}

output "cname_record" {
  description = "CNAME record created for the application"
  value       = cloudflare_record.app.hostname
}
