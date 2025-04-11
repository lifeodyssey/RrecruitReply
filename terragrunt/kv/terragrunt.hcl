include "root" {
  path = find_in_parent_folders()
}

# Define the Terraform code that will be applied
terraform {
  source = "${find_in_parent_folders("terraform_modules")}/kv"
}

# Module-specific inputs
inputs = {
  namespace_name = "recruitreply-sessions-${get_env("TF_VAR_environment", "dev")}"
}
