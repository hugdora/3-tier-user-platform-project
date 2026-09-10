# Secrets Manager secret container
resource "aws_secretsmanager_secret" "database" {
  name                    = "${var.cluster_name}/database"
  recovery_window_in_days = 30

  tags = {
    Project     = "3-tier-user-platform"
    Environment = "qa"
  }
}

# Initial secret value
resource "aws_secretsmanager_secret_version" "database" {
  secret_id = aws_secretsmanager_secret.database.id

  secret_string = jsonencode({
    MYSQL_ROOT_PASSWORD = var.db_root_password
    MYSQL_DATABASE      = var.db_name
    MYSQL_USER          = var.db_user
    MYSQL_PASSWORD      = var.db_password
    DATABASE_URL        = "mysql://${var.db_user}:${var.db_password}@mysql:3306/${var.db_name}"
  })
}