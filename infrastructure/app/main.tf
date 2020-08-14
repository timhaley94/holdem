terraform {
  backend "s3" {
    bucket = "poker-app-tf-state"
    key    = "tf-state"
    region = "us-east-2"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 1.3.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "~> 1.4.0"
    }
  }

  required_version = ">= 0.13"
}

provider "aws" {
  profile = "default"
  region  = "us-east-2"
}

locals {
  tags = {
    app = "Poker"
    IaC = "Terraform"
  }
}