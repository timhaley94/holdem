# The IP whitelist module needs these as inputs
resource "local_file" "output_file" {
  filename = "output.txt"
  content = templatefile("${path.module}/templates/output_file.txt.tmpl", {
    security_group_id = aws_security_group.server_task.id
    atlas_project_id  = mongodbatlas_project.atlas_project.id
  })
}