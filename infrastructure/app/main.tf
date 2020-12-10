locals {
  tags = {
    app = "Holdem"
    IaC = "Terraform"
  }

  aws_region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "holdem-tf-state"
    key    = "app-tf-state"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "0.7.0"
    }
  }

  required_version = ">= 0.14"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}
