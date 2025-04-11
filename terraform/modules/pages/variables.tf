variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Name of the Pages project"
  type        = string
}

variable "production_branch" {
  description = "Git branch to use for production deployments"
  type        = string
  default     = "main"
}

variable "d1_database_binding" {
  description = "D1 database binding name"
  type        = string
  default     = ""
}

variable "r2_bucket_binding" {
  description = "R2 bucket binding name"
  type        = string
  default     = ""
}

variable "kv_namespace_binding" {
  description = "KV namespace binding name"
  type        = string
  default     = ""
}
