output "image_repo_url" {
  value = "${aws_ecr_repository.image_repo.repository_url}"
}

output "website_endpoint" {
  value = "${aws_s3_bucket.app_bucket.website_endpoint}"
}
