# TaskFlow API — DevOps na Prática (PUCRS)

![CI](https://github.com/Pedrolucasnunes/devops-na-pratica/actions/workflows/ci.yml/badge.svg)

Projeto da disciplina **DevOps na Prática** — Fase 1: Configuração e Automação Inicial.
Autor: **Pedro Lucas Fonseca Nunes**

A TaskFlow é uma API REST de gerenciamento de tarefas (Node.js + Express), usada como
base para aplicar Integração Contínua, Entrega Contínua e Infraestrutura como Código.

## Estrutura

```
.
├── .github/workflows/ci.yml   # Pipeline de CI (GitHub Actions)
├── src/                       # Código da API
├── tests/                     # Testes unitários e de integração (Jest + Supertest)
├── infra/terraform/           # Infraestrutura como Código (AWS)
├── Dockerfile                 # Imagem de produção
└── eslint.config.js           # Regras de lint
```

## Rodando localmente

```bash
npm install
npm start              # http://localhost:3000/health
npm run lint
npm test
npm run test:coverage  # exige cobertura mínima de 80%
```

### Endpoints

| Método | Rota          | Descrição                                   |
|--------|---------------|---------------------------------------------|
| GET    | /health       | Health check                                |
| GET    | /tasks        | Lista tarefas (filtro opcional `?status=`)  |
| GET    | /tasks/:id    | Busca uma tarefa                            |
| POST   | /tasks        | Cria tarefa (`title`, `description`, `status`) |
| PUT    | /tasks/:id    | Atualiza tarefa                             |
| DELETE | /tasks/:id    | Remove tarefa                               |

Status válidos: `pendente`, `em_andamento`, `concluida`.

## Pipeline de CI

Executado em todo `push` e `pull request` para `main` e `develop`:

1. **Lint** — ESLint
2. **Testes** — Jest em matriz Node 20 e 22, com cobertura mínima de 80% e relatório publicado como artefato
3. **Build** — build da imagem Docker + smoke test no `/health`
4. **Terraform** — `fmt -check`, `init` e `validate` dos scripts de infraestrutura

## Infraestrutura como Código (Terraform / AWS)

Recursos provisionados em `infra/terraform`:

- VPC `10.0.0.0/16` com 2 subnets públicas em zonas diferentes, Internet Gateway e tabela de rotas
- Security Group (HTTP 80 aberto, SSH 22 restrito a um IP)
- Instância EC2 `t3.micro` (Amazon Linux 2023, IMDSv2, disco criptografado) que instala Docker e sobe a API via `user_data`
- Repositório ECR (scan de vulnerabilidades no push e retenção das 10 últimas imagens)
- Papel IAM com acesso de leitura ao ECR e SSM
- Log group no CloudWatch

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # ajuste seu IP
terraform init
terraform plan
terraform apply
terraform destroy   # para não gerar custos
```
