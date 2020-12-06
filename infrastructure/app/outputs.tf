output "redis_endpoint" {
  value = aws_elasticache_replication_group.redis_group.primary_endpoint_address
}

output "mongo_url" {
  value = mongodbatlas_cluster.db_cluster.srv_address
}

output "bastion_ip" {
  value = aws_instance.bastion_host.public_ip
}
