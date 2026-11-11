output "vpc_id" {
  description = "ID da VPC criada"
  value       = aws_vpc.main.id
}

output "instance_id" {
  description = "ID da instância EC2 da aplicação"
  value       = aws_instance.app.id
}

output "app_url" {
  description = "URL pública da API"
  value       = "http://${aws_instance.app.public_dns}"
}

output "health_check_url" {
  description = "Endpoint de health check"
  value       = "http://${aws_instance.app.public_dns}/health"
}

output "ecr_repository_url" {
  description = "URL do repositório ECR para push das imagens"
  value       = aws_ecr_repository.app.repository_url
}
