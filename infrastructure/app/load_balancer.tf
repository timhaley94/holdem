resource "aws_lb" "server_lb" {
  name               = "holdem-server-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.public_http.id]
  subnets            = [for s in aws_subnet.public_subnet : s.id]
  tags               = local.tags
}

resource "aws_lb_target_group" "server_lb_target_group" {
  name        = "holdem-server-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  tags        = local.tags

  health_check {
    protocol = "HTTP"
    path     = "/ping"
    port     = "traffic-port"
    matcher  = 200
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
