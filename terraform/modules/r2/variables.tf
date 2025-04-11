variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "bucket_name" {
  description = "Name of the R2 bucket"
  type        = string
}

variable "location" {
  description = "Location for the R2 bucket"
  type        = string
  default     = "wnam" # Western North America
}
