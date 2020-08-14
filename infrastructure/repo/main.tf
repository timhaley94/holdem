terraform {
  backend "s3" {
    bucket = "poker-app-tf-state"
    key    = "repo-tf-state"
    region = "us-east-2"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }

  required_version = ">= 0.13"
}

provider "aws" {
  profile = "default"
  region  = "us-east-2"
}

resource "aws_ecr_repository" "image_repo" {
  name                 = "poker_app"
  image_tag_mutability = "MUTABLE"

  tags = {
    app = "Poker"
    IaC = "Terraform"
  }
}
