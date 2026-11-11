#!/bin/bash
# Bootstrap da instância: instala Docker e sobe a API.
# Na Fase 1 a imagem é construída a partir do repositório; na Fase 2 (CD)
# passará a ser baixada do ECR.
set -euxo pipefail

dnf update -y
dnf install -y docker git
systemctl enable --now docker

git clone https://github.com/Pedrolucasnunes/devops-na-pratica.git /opt/taskflow
cd /opt/taskflow
docker build -t taskflow-api:latest .
docker run -d --restart unless-stopped --name taskflow-api \
  -p 80:${app_port} -e PORT=${app_port} taskflow-api:latest
