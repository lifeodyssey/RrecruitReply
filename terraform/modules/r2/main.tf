resource "cloudflare_r2_bucket" "document_storage" {
  account_id = var.account_id
  name       = var.bucket_name
  location   = var.location
}
