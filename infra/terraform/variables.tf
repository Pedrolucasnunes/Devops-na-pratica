variable "aws_region" {
  description = "Região AWS onde a infraestrutura será criada"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nome do projeto (usado como prefixo dos recursos)"
  type        = string
  default     = "taskflow"
}

variable "environment" {
  description = "Ambiente (dev, staging ou prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment deve ser dev, staging ou prod."
  }
}

variable "vpc_cidr" {
  description = "Bloco CIDR da VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDRs das subnets públicas (uma por zona de disponibilidade)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "instance_type" {
  description = "Tipo da instância EC2 (t3.micro está no Free Tier)"
  type        = string
  default     = "t3.micro"
}

variable "app_port" {
  description = "Porta em que a API escuta"
  type        = number
  default     = 3000
}

variable "ssh_allowed_cidr" {
  description = "CIDR autorizado a acessar a instância via SSH (use seu IP/32)"
  type        = string
  default     = "127.0.0.1/32"
}
