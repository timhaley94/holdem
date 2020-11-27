locals {
  cidr_blocks = {
    vpc         = "10.0.0.0/16"
    public      = ["10.0.1.0/24", "10.0.2.0/24"]
    elasticache = ["10.0.201.0/24", "10.0.202.0/24"]
  }
}

locals {
  nacls = {
    # Let the private subnets talk to the elasticache subnets
    elasticache = [
      for block in local.cidr_blocks.public :
      {
        rule_number = 100 + index(local.cidr_blocks.public, block)
        rule_action = "allow"
        from_port   = 6379
        to_port     = 6379
        protocol    = "tcp"
        cidr_block  = block
      }
    ]
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.44.0"

  name = "holdem-vpc"
  cidr = local.cidr_blocks.vpc

  azs                 = ["us-east-2a", "us-east-2b"]
  public_subnets      = local.cidr_blocks.public
  elasticache_subnets = local.cidr_blocks.elasticache

  enable_nat_gateway = false
  enable_vpn_gateway = false

  elasticache_dedicated_network_acl = true
  elasticache_inbound_acl_rules     = local.nacls.elasticache
  elasticache_outbound_acl_rules    = local.nacls.elasticache

  tags = local.tags
}
