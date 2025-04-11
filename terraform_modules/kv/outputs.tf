output "namespace_id" {
  description = "ID of the created KV namespace"
  value       = cloudflare_workers_kv_namespace.session_store.id
}

output "namespace_name" {
  description = "Name of the created KV namespace"
  value       = cloudflare_workers_kv_namespace.session_store.title
}
