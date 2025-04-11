variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "domains" {
  description = "List of domains allowed to use the Turnstile widget"
  type        = list(string)
}
