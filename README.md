<<<<<<< HEAD
# AgroTech — Sistema de Gestão Pecuária Multi-Fazenda

Sistema web para gerenciamento de fazendas e lotes de animais, com autenticação segura e suporte a múltiplos usuários.

## Repositórios

| Repositório | Descrição |
|-------------|-----------|
| [`agrotech-cadastros`](./agrotech-cadastros) | Backend — Spring Boot (Auth + CRUDs) |
| [`agrotech-front`](./agrotech-front) | Frontend — React |
| [`agrotech-docker`](./agrotech-docker) | Infraestrutura — docker-compose (uso futuro) |

## Stack

- **Backend:** Java + Spring Boot + Spring Security + JWT
- **Frontend:** React (JavaScript)
- **Banco:** MySQL local (Hibernate ddl-auto=update)

## Como rodar (Sprint Inicial)

### Backend

```bash
cd agrotech-cadastros
./mvnw spring-boot:run
```

> Certifique-se que o MySQL está rodando na porta 3306. O banco `agrotech` é criado automaticamente.

### Frontend

```bash
cd agrotech-front
npm install
npm run dev
```

## Documentação

Veja [`SPEC.md`](./SPEC.md) para a especificação técnica completa do projeto.
=======
# AgroTech---Projeto-APS
>>>>>>> origin/main
