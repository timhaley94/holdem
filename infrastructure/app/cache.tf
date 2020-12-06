resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "holdem-cache-subnet-group"
  subnet_ids = [for s in aws_subnet.cache_subnet : s.id]
}

resource "aws_elasticache_replication_group" "redis_group" {
  availability_zones = keys(local.subnets.cache)
  subnet_group_name  = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids = [aws_security_group.private_redis.id]

  engine                     = "redis"
  engine_version             = "5.0.3"
  parameter_group_name       = "default.redis5.0"
  automatic_failover_enabled = true
  port                       = 6379

  replication_group_id          = "holdem-cache-replication-group"
  replication_group_description = "Redis cluster for holdem"
  node_type                     = "cache.t2.micro"
  number_cache_clusters         = 2
}
