locals {
  cidr_blocks = {
    vpc           = "10.0.0.0/16"
    internet      = "0.0.0.0/0"
    ipv6_internet = "::/0"
  }

  subnets = {
    public = {
      "us-east-1a" : "10.0.1.0/24"
      "us-east-1b" : "10.0.2.0/24"
    }

    cache = {
      "us-east-1a" : "10.0.201.0/24"
      "us-east-1b" : "10.0.202.0/24"
    }
  }
}

resource "aws_vpc" "main" {
  cidr_block = local.cidr_blocks.vpc
  tags       = local.tags
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = local.tags
}

# Public subnets
resource "aws_subnet" "public_subnet" {
  for_each          = local.subnets.public
  vpc_id            = aws_vpc.main.id
  availability_zone = each.key
  cidr_block        = each.value
  tags              = local.tags
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id
  tags   = local.tags

  route {
    cidr_block = local.cidr_blocks.internet
    gateway_id = aws_internet_gateway.main.id
  }

  route {
    ipv6_cidr_block = local.cidr_blocks.ipv6_internet
    gateway_id      = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "public_route_table_association" {
  for_each       = aws_subnet.public_subnet
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public_route_table.id
}

# Cache subnets
resource "aws_subnet" "cache_subnet" {
  for_each          = local.subnets.cache
  vpc_id            = aws_vpc.main.id
  availability_zone = each.key
  cidr_block        = each.value
  tags              = local.tags
}
