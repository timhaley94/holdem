resource "aws_security_group" "public_ssh" {
  name   = "holdem-allow-public-ssh"
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

resource "aws_security_group" "public_http" {
  name   = "holdem-allow-public-ssh"
  vpc_id = aws_vpc.main.id

  ingress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}

resource "aws_security_group" "private_redis" {
  name   = "holdem-allow-private-redis"
  vpc_id = aws_vpc.main.id

  ingress {
    cidr_blocks = values(local.subnets.public)
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = [local.cidr_blocks.internet]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
}