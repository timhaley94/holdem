output "website_endpoint" {
  value = aws_s3_bucket.app_bucket.website_endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.redis_group.primary_endpoint_address
}