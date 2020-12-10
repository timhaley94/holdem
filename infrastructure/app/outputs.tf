output "redis_endpoint" {
  value = aws_elasticache_replication_group.redis_group.primary_endpoint_address
}

output "mongo_url" {
  value = mongodbatlas_cluster.db_cluster.srv_address
}

output "bastion_ip" {
  value = aws_instance.bastion_host.public_ip
}

output "security_group_id" {
  value = aws_security_group.server_task.id
}

output "atlas_project_id" {
  value = mongodbatlas_project.atlas_project.id
}
