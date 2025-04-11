output "bucket_name" {
  description = "Name of the created R2 bucket"
  value       = cloudflare_r2_bucket.document_storage.name
}

output "bucket_id" {
  description = "ID of the created R2 bucket"
  value       = cloudflare_r2_bucket.document_storage.id
}
