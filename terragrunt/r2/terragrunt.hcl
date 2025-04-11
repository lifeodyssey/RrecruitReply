include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform/modules/r2"
}

# Module-specific inputs
inputs = {
  bucket_name = "recruitreply-documents-${get_env("TF_VAR_environment", "dev")}"
  location    = "wnam" # Western North America
}
