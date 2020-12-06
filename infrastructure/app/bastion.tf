data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# You connect with ssh ubuntu@<public ip4 address>
resource "aws_instance" "bastion_host" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  subnet_id                   = values(aws_subnet.public_subnet)[0].id
  vpc_security_group_ids      = [aws_security_group.public_ssh.id]
  key_name                    = var.ssh_key_name
  associate_public_ip_address = true
  tags                        = local.tags
}