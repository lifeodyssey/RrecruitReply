resource "cloudflare_turnstile_widget" "recruit_reply" {
  account_id = var.account_id
  name       = "${var.project_name}-widget"
  domains    = var.domains
  mode       = "managed"
}

output "site_key" {
  value = cloudflare_turnstile_widget.recruit_reply.site_key
}

output "secret_key" {
  value     = cloudflare_turnstile_widget.recruit_reply.secret_key
  sensitive = true
}
