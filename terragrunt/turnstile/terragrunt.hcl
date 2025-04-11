include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform/modules/turnstile"
}

# Module-specific inputs
inputs = {
  project_name = "recruitreply-${get_env("TF_VAR_environment", "dev")}"
  domains      = ["recruitreply.example.com", "*.recruitreply.example.com"]
}
