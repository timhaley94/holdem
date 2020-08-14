resource "aws_ecr_repository" "image_repo" {
  name                 = "poker_app"
  image_tag_mutability = "MUTABLE"
  tags                 = local.tags
}
