locals {
  cidr_blocks = {
    vpc         = "10.0.0.0/16"
    public      = ["10.0.1.0/24", "10.0.2.0/24"]
    private     = ["10.0.101.0/24", "10.0.102.0/24"]
    elasticache = ["10.0.201.0/24", "10.0.202.0/24"]
  }
}

locals {
  nacls = {
    # Let the internet talk to the public subnets
    public = [
      {
        rule_number = 100
        rule_action = "allow"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_block  = "0.0.0.0/0"
      }
    ]

    # Let the public subnets talk to the private subnets
    private = [
      for block in local.cidr_blocks.public :
      {
        rule_number = 100 + index(local.cidr_blocks.public, block)
        rule_action = "allow"
        from_port   = 8080
        to_port     = 8080
        protocol    = "tcp"
        cidr_block  = block
      }
    ]

    # Let the private subnets talk to the elasticache subnets
    elasticache = [
      for block in local.cidr_blocks.private :
      {
        rule_number = 100 + index(local.cidr_blocks.private, block)
        rule_action = "allow"
        from_port   = 5000
        to_port     = 5000
        protocol    = "tcp"
        cidr_block  = block
      }
    ]
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.44.0"

  name = "poker-app-vpc"
  cidr = local.cidr_blocks.vpc

  azs                 = ["us-east-2a", "us-east-2b"]
  public_subnets      = local.cidr_blocks.public
  private_subnets     = local.cidr_blocks.private
  elasticache_subnets = local.cidr_blocks.elasticache

  enable_nat_gateway = true
  enable_vpn_gateway = false

  public_dedicated_network_acl      = true
  private_dedicated_network_acl     = true
  elasticache_dedicated_network_acl = true

  public_inbound_acl_rules       = local.nacls.public
  public_outbound_acl_rules      = local.nacls.public
  private_inbound_acl_rules      = local.nacls.private
  private_outbound_acl_rules     = local.nacls.private
  elasticache_inbound_acl_rules  = local.nacls.elasticache
  elasticache_outbound_acl_rules = local.nacls.elasticache

  tags = local.tags
}
