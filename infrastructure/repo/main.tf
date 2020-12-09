terraform {
  backend "s3" {
    bucket = "holdem-tf-state"
    key    = "repo-tf-state"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  required_version = ">= 0.14"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

resource "aws_ecr_repository" "image_repo" {
  name                 = "holdem_app"
  image_tag_mutability = "MUTABLE"

  tags = {
    app = "Holdem"
    IaC = "Terraform"
  }
}
