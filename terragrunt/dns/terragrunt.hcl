include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../terraform/modules/dns"
}

# Dependencies
dependency "pages" {
  config_path = "../pages"
}

# Module-specific inputs
inputs = {
  domain_name        = "recruitreply-${get_env("TF_VAR_environment", "dev")}.example.com"
  subdomain          = "@"
  pages_project_name = dependency.pages.outputs.project_name
}
