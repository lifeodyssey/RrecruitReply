include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform/modules/d1"
}

# Module-specific inputs
inputs = {
  database_name = "recruitreply-db-${get_env("TF_VAR_environment", "dev")}"
}
