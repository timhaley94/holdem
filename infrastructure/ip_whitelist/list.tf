data "aws_network_interfaces" "server_task_network_interfaces" {
  filter {
    name   = "group-id"
    values = [var.security_group_id]
  }
}

locals {
  task_eni_ids = tolist(data.aws_network_interfaces.server_task_network_interfaces.ids)
}

data "aws_network_interface" "server_task_network_interface" {
  for_each = zipmap(local.task_eni_ids, local.task_eni_ids)
  id       = each.value
}

locals {
  task_eni_associations = [
    for eni in values(data.aws_network_interface.server_task_network_interface) :
    lookup(eni, "association", [])
  ]

  task_ip_addresses = [
    for assoc in flatten(local.task_eni_associations) :
    assoc.public_ip
  ]
}

resource "mongodbatlas_project_ip_whitelist" "server_task_ip" {
  for_each   = zipmap(local.task_ip_addresses, local.task_ip_addresses)
  project_id = var.atlas_project_id
  ip_address = each.value
  comment    = "IP address for holdem server"
}
