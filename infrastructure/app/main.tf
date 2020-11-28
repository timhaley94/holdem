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

    archive = {
      source  = "hashicorp/archive"
      version = "~> 1.3.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "~> 1.4.0"
    }

    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "0.7.0"
    }
  }

  required_version = ">= 0.13"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

provider "mongodbatlas" {}
