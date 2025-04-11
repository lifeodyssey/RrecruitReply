resource "cloudflare_d1_database" "app_database" {
  account_id = var.account_id
  name       = var.database_name
}
