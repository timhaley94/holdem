output "website_endpoint" {
  value = "${aws_s3_bucket.app_bucket.website_endpoint}"
}
