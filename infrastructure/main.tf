terraform {
  backend "s3" {
    bucket = "poker-app-tf-state"
    key    = "tf-state"
    region = "us-east-2"
  }
}

provider "aws" {
  profile = "default"
  region  = "us-east-2"
}

resource "aws_s3_bucket" "app_bucket" {
  bucket        = "poker-frontend-app"
  acl           = "public-read"
  force_destroy = true
  policy        = file("${path.module}/bucket_policy.json")

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_ecr_repository" "image_repo" {
  name                 = "poker_app"
  image_tag_mutability = "IMMUTABLE"
}

output "image_repo_url" {
  value = "${aws_ecr_repository.image_repo.repository_url}"
}

output "website_endpoint" {
  value = "${aws_s3_bucket.app_bucket.website_endpoint}"
}
