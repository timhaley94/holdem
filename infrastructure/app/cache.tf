resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "holdem-cache-subnet-group"
  subnet_ids = module.vpc.elasticache_subnets
}

resource "aws_elasticache_replication_group" "redis_group" {
  engine                        = "redis"
  engine_version                = "5.0.3"
  automatic_failover_enabled    = true
  availability_zones            = module.vpc.azs
  replication_group_id          = "holdem-cache-replication-group"
  replication_group_description = "Redis cluster for holdem"
  node_type                     = "cache.t2.micro"
  number_cache_clusters         = 2
  parameter_group_name          = "default.redis5.0"
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.redis_subnet_group.name
}