resource "aws_s3_bucket" "app_bucket" {
  bucket        = "poker-frontend-app"
  acl           = "public-read"
  force_destroy = true
  policy        = file("${path.module}/policies/bucket_policy.json")

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = local.tags
}

