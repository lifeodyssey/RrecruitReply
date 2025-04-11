resource "cloudflare_pages_project" "app" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = var.production_branch
  
  build_config {
    build_command       = "npm run build"
    destination_dir     = ".next"
    root_dir            = ""
    web_analytics_tag   = "recruitreply"
    web_analytics_token = "recruitreply-analytics"
  }
  
  deployment_configs {
    preview {
      environment_variables = {
        NODE_VERSION = "18.18.0"
        APP_ENV      = "preview"
      }
      compatibility_date    = "2023-11-21"
      compatibility_flags   = ["nodejs_compat"]
      d1_databases = {
        DB = var.d1_database_binding
      }
      r2_buckets = {
        DOCUMENTS = var.r2_bucket_binding
      }
      kv_namespaces = {
        SESSIONS = var.kv_namespace_binding
      }
    }
    
    production {
      environment_variables = {
        NODE_VERSION = "18.18.0"
        APP_ENV      = "production"
      }
      compatibility_date    = "2023-11-21"
      compatibility_flags   = ["nodejs_compat"]
      d1_databases = {
        DB = var.d1_database_binding
      }
      r2_buckets = {
        DOCUMENTS = var.r2_bucket_binding
      }
      kv_namespaces = {
        SESSIONS = var.kv_namespace_binding
      }
    }
  }
}
