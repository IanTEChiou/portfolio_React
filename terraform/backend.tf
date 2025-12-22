terraform {
  backend "s3" {
    bucket         = "ian-tfstate-eu-west-2"
    key            = "terraform-admin/terraform.tfstate"
    region         = "eu-west-2"

    encrypt        = true
  }
}