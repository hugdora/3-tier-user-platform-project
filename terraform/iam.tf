resource "aws_iam_role" "aws_load_balancer_controller" {
  name = "${var.cluster_name}-aws-load-balancer-controller"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "pods.eks.amazonaws.com"
        }

        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]
      }
    ]
  })

  tags = {
    Project     = "3-tier-user-platform"
    Environment = "qa"
  }
}

# Create the Pod Identity association
resource "aws_eks_pod_identity_association" "aws_load_balancer_controller" {
  cluster_name    = module.eks.cluster_name
  namespace       = "kube-system"
  service_account = "aws-load-balancer-controller"
  role_arn        = aws_iam_role.aws_load_balancer_controller.arn
}

# Add the controller permissions
resource "aws_iam_role_policy_attachment" "aws_load_balancer_controller" {
  role       = aws_iam_role.aws_load_balancer_controller.name
  policy_arn = "arn:aws:iam::127486921697:policy/AWSLoadBalancerControllerIAMPolicy"
}

# Add application IAM role with least-privilege access

resource "aws_iam_role" "application" {
  name = "${var.cluster_name}-application"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "pods.eks.amazonaws.com"
        }

        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]
      }
    ]
  })

  tags = {
    Project     = "3-tier-user-platform"
    Environment = "qa"
  }
}

resource "aws_iam_policy" "application_secrets" {
  name = "${var.cluster_name}-application-secrets"

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "secretsmanager:GetSecretValue"
        ]

        Resource = aws_secretsmanager_secret.database.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "application_secrets" {
  role       = aws_iam_role.application.name
  policy_arn = aws_iam_policy.application_secrets.arn
}

resource "aws_eks_pod_identity_association" "application" {
  cluster_name    = module.eks.cluster_name
  namespace       = "qa"
  service_account = "application"
  role_arn        = aws_iam_role.application.arn
}
# Add Production Pod Identity
resource "aws_eks_pod_identity_association" "application_prod" {
  cluster_name    = module.eks.cluster_name
  namespace       = "prod"
  service_account = "application"
  role_arn        = aws_iam_role.application.arn
}
