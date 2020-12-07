resource "aws_ecs_cluster" "server_cluster" {
  name = "holdem_cluster"
}

# Logs
locals {
  log_group_name = "holdem_server_logs"
}

resource "aws_cloudwatch_log_group" "server_task_log_group" {
  name              = local.log_group_name
  retention_in_days = 3
  tags              = local.tags
}

# IAM role assumed by running tasks. Allows holdem server to talk to other AWS services
# like elasticache, SQS, etc.
resource "aws_iam_role" "task_role" {
  name = "holdem_ecs_task_role"
  tags = local.tags
  assume_role_policy = templatefile("${path.module}/templates/assume_policy.json.tmpl", {
    service_name = "ecs-tasks.amazonaws.com"
  })
}

# IAM role allowing ECS to pull container images from ECR. This is just a simple role
# that attaches the built in AWS role.
resource "aws_iam_role" "execution_role" {
  name = "holdem_ecs_execution_role"
  tags = local.tags
  assume_role_policy = templatefile("${path.module}/templates/assume_policy.json.tmpl", {
    service_name = "ecs-tasks.amazonaws.com"
  })
}

resource "aws_iam_role_policy_attachment" "execution_role_attach" {
  role       = aws_iam_role.execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task definition
resource "aws_ecs_task_definition" "server_task_definition" {
  family                   = "holdem_servers"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  task_role_arn            = aws_iam_role.task_role.arn
  execution_role_arn       = aws_iam_role.execution_role.arn
  tags                     = local.tags

  container_definitions = templatefile("${path.module}/templates/container_definitions.json.tmpl", {
    repo_url       = var.repo_url
    image_tag      = var.image_tag
    log_group_name = local.log_group_name
    aws_region     = local.aws_region
    redis_url      = aws_elasticache_replication_group.redis_group.primary_endpoint_address
    mongo_username = var.db_app_username
    mongo_password = var.db_app_password
  })
}

# Service definition
resource "aws_ecs_service" "server_service" {
  name            = "holdem_server_service"
  cluster         = aws_ecs_cluster.server_cluster.id
  task_definition = aws_ecs_task_definition.server_task_definition.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  propagate_tags  = "SERVICE"
  tags            = local.tags

  load_balancer {
    target_group_arn = aws_lb_target_group.server_lb_target_group.arn
    container_name   = "holdem_server_container"
    container_port   = 80
  }

  network_configuration {
    subnets          = [for s in aws_subnet.public_subnet : s.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.public_http.id]
  }
}
