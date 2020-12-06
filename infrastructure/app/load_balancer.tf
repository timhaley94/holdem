resource "aws_lb" "server_lb" {
  name               = "holdem-server-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = module.vpc.public_subnets
  tags               = local.tags
}

resource "aws_lb_target_group" "server_lb_target_group" {
  name        = "holdem-server-target-group-${substr(uuid(), 0, 3)}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  tags        = local.tags

  health_check {
    protocol = "HTTP"
    path     = "/ping"
    port     = "traffic-port"
    matcher  = 200
  }

  # Random name and lifecycle settings suggested by:
  # https://stackoverflow.com/questions/57183814/error-deleting-target-group-resourceinuse-when-changing-target-ports-in-aws-thr
  lifecycle {
    create_before_destroy = true
    ignore_changes        = [name]
  }
}

resource "aws_lb_listener" "server_lb_listener" {
  load_balancer_arn = aws_lb.server_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.server_lb_target_group.arn
  }
}
