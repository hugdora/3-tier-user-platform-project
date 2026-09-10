module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.0.1"

  name = "${var.cluster_name}-vpc"

  cidr = "10.0.0.0/16"

  azs = [
    "${var.aws_region}a",
    "${var.aws_region}b"
  ]

  private_subnets = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  public_subnets = [
    "10.0.101.0/24",
    "10.0.102.0/24"
  ]

  map_public_ip_on_launch = true

  # Nodes live in private subnets, so they need NAT
  # to reach AWS services such as EKS, ECR and S3.
  # A single NAT gateway keeps QA costs lower.
  enable_nat_gateway = true
  single_nat_gateway = true

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Project     = "3-tier-user-platform"
    Environment = "qa"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = var.cluster_name
  kubernetes_version = "1.34"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # Keep the EKS control plane ENIs in the private subnets.
  control_plane_subnet_ids = module.vpc.private_subnets

  enable_cluster_creator_admin_permissions = true

  access_entries = {
    github_actions = {
      principal_arn = "arn:aws:iam::127486921697:role/GitHubActions-EKS-Deploy"

      policy_associations = {
        qa_admin = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSAdminPolicy"

          access_scope = {
            type       = "namespace"
            namespaces = ["qa"]
          }
        }
      }
    }
  }
  endpoint_public_access = true

  addons = {
    vpc-cni = {
      most_recent    = true
      before_compute = true
    }

    kube-proxy = {
      most_recent = true
    }

    coredns = {
      most_recent = true
    }
    # Add the EKS Pod Identity Agent
    eks-pod-identity-agent = {
      most_recent = true
    }

  }


  eks_managed_node_groups = {
    qa = {
      name = "qa-node-group"

      instance_types = ["t3.medium"]

      min_size     = 1
      max_size     = 1
      desired_size = 1

      subnet_ids = module.vpc.private_subnets

      iam_role_additional_policies = {
        AmazonSSMManagedInstanceCore = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
      }
    }
  }

  tags = {
    Project     = "3-tier-user-platform"
    Environment = "qa"
  }
}

