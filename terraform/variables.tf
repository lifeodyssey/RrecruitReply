variable "cloudflare_api_token" {
  description = "Cloudflare API token with appropriate permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain"
  type        = string
}

variable "r2_bucket_name" {
  description = "Name of the R2 bucket for document storage"
  type        = string
  default     = "recruitreply-documents"
}

variable "d1_database_name" {
  description = "Name of the D1 database"
  type        = string
  default     = "recruitreply-db"
}

variable "kv_namespace_name" {
  description = "Name of the KV namespace for session management"
  type        = string
  default     = "recruitreply-sessions"
}

variable "pages_project_name" {
  description = "Name of the Cloudflare Pages project"
  type        = string
  default     = "recruitreply"
}

variable "production_branch" {
  description = "Git branch to use for production deployments"
  type        = string
  default     = "main"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "recruitreply.example.com"
}
