resource "cloudflare_record" "app" {
  zone_id = var.zone_id
  name    = var.subdomain
  value   = "${var.pages_project_name}.pages.dev"
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

# SSL/TLS Configuration
resource "cloudflare_zone_settings_override" "app_zone_settings" {
  zone_id = var.zone_id
  
  settings {
    ssl = "strict"
    always_use_https = "on"
    min_tls_version = "1.2"
    tls_1_3 = "on"
    automatic_https_rewrites = "on"
    universal_ssl = "on"
  }
}
