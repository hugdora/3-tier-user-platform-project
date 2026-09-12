variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "3-tier-user-platform-eks"
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  sensitive   = true
}

variable "db_user" {
  description = "MySQL application user"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "MySQL application password"
  type        = string
  sensitive   = true
}
variable "db_root_password" {
  description = "MySQL root password"
  type        = string
  sensitive   = true
}