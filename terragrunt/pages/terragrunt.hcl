include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform/modules/pages"
}

# Dependencies
dependency "r2" {
  config_path = "../r2"
}

dependency "d1" {
  config_path = "../d1"
}

dependency "kv" {
  config_path = "../kv"
}

# Module-specific inputs
inputs = {
  project_name      = "recruitreply-${get_env("TF_VAR_environment", "dev")}"
  production_branch = "main"
  
  # Bindings from dependencies
  r2_bucket_binding  = dependency.r2.outputs.bucket_name
  d1_database_binding = dependency.d1.outputs.database_id
  kv_namespace_binding = dependency.kv.outputs.namespace_id
}
