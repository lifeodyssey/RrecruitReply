resource "cloudflare_workers_kv_namespace" "session_store" {
  title      = var.namespace_name
  account_id = var.cloudflare_account_id
}
