resource "aws_security_group" "bastion" {
  name   = "holdem-bastion-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}

resource "aws_security_group" "alb" {
  name   = "holdem-alb-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}

resource "aws_security_group" "server_task" {
  name   = "holdem-server-task-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    security_groups = [aws_security_group.alb.id]
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
  }

  egress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}

resource "aws_security_group" "redis" {
  name   = "holdem-redis-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    security_groups = [aws_security_group.server_task.id]
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
  }

  egress {
    cidr_blocks = values(local.subnets.public)
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}