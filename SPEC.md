# SPEC — AgroTech: Sistema de Gestão Pecuária Multi-Fazenda

> **Status:** Em desenvolvimento — Sprints Iniciais  
> **Última atualização:** 2026-10-07  
> **Fonte de requisitos:** `REQUISITOS-SPRINT-INICIAL.md`

---

## 1. Visão Geral do Projeto

O AgroTech é um sistema web de gestão pecuária voltado para produtores rurais que precisam gerenciar múltiplas fazendas e seus respectivos lotes de animais. Nesta fase inicial (sprints 1 e 2), o foco é estabelecer a base da aplicação: autenticação segura e os primeiros CRUDs operacionais (Fazenda × Lote).

### 1.1 Objetivo das Sprints Iniciais

| Sprint | Objetivo |
|--------|----------|
| Sprint 1 | Sistema de autenticação completo (registro + login + JWT) |
| Sprint 2 | CRUD de Fazenda e Lote com frontend React integrado |

---

## 2. Repositórios e Estrutura de Diretórios

O projeto é dividido em 3 repositórios Git independentes:

```
AgroTech/
├── agrotech-cadastros/     ← Backend: Spring Boot (Auth + CRUDs)
├── agrotech-front/         ← Frontend: React
└── agrotech-docker/        ← Infraestrutura: docker-compose + Dockerfiles
```

### 2.1 Detalhamento por Repositório

#### `agrotech-cadastros` (Backend — Spring Boot)

```
agrotech-cadastros/
├── src/
│   └── main/
│       ├── java/com/agrotech/cadastros/
│       │   ├── AgroTechCadastrosApplication.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── FazendaController.java
│       │   │   └── LoteController.java
│       │   ├── dto/
│       │   │   ├── RegistroRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── TokenResponse.java
│       │   │   ├── FazendaRequest.java
│       │   │   ├── FazendaResponse.java
│       │   │   ├── LoteRequest.java
│       │   │   └── LoteResponse.java
│       │   ├── entity/
│       │   │   ├── Usuario.java
│       │   │   ├── Fazenda.java
│       │   │   └── Lote.java
│       │   ├── repository/
│       │   │   ├── UsuarioRepository.java
│       │   │   ├── FazendaRepository.java
│       │   │   └── LoteRepository.java
│       │   ├── security/
│       │   │   ├── JwtTokenProvider.java
│       │   │   └── JwtAuthenticationFilter.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── FazendaService.java
│       │       └── LoteService.java
│       └── resources/
│           └── application.properties
├── pom.xml
└── .gitignore
```

#### `agrotech-front` (Frontend — React)

```
agrotech-front/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── api.js                  ← funções fetch/axios centralizadas
│   ├── components/
│   │   ├── PrivateRoute.jsx        ← rota protegida (exige token)
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── MinhasFazendas.jsx      ← lista + criar fazenda
│   │   └── FazendaDetalhe.jsx      ← detalhe + CRUD de lotes
│   ├── context/
│   │   └── AuthContext.jsx         ← estado global de autenticação + token
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── .gitignore
```

#### `agrotech-docker` (Infraestrutura)

```
agrotech-docker/
├── docker-compose.yml
├── backend/
│   └── Dockerfile
├── frontend/
│   └── Dockerfile
└── README.md
```

> **Nota desta fase:** o backend roda localmente conectado ao MySQL já instalado na máquina. O repositório `agrotech-docker` existe para uso futuro — não precisa estar funcional agora.

---

## 3. Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React (JavaScript, sem TypeScript) |
| Backend | Java 17+ + Spring Boot 3.x |
| Autenticação | Spring Security + JWT |
| Banco de dados | MySQL (local, via JPA/Hibernate) |
| ORM | Hibernate (ddl-auto=update) |
| Versionamento | Git + GitHub |

---

## 4. Configuração do Banco de Dados

### 4.1 `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/agrotech?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=AgroTechAPS
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

> ⚠️ **Atenção:** não subir este arquivo com a senha real em repositório público. Antes do push, substituir a senha por `${DB_PASSWORD}` e usar variável de ambiente.

### 4.2 Dependência MySQL no `pom.xml`

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 4.3 Schema de Referência (gerado automaticamente pelo Hibernate)

```sql
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE fazenda (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255),
    dono_id BIGINT NOT NULL,
    FOREIGN KEY (dono_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

CREATE TABLE lote (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fazenda_id BIGINT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    quantidade INT,
    tipo VARCHAR(100),
    pasto VARCHAR(100),
    FOREIGN KEY (fazenda_id) REFERENCES fazenda(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

### 4.4 Diagrama de Relacionamentos

```
usuario (1) ──────< fazenda (N)
                       fazenda (1) ──────< lote (N)
```

- Um `usuario` pode ser dono de N `fazendas`
- Uma `fazenda` contém N `lotes`
- Ao deletar uma `fazenda`, seus `lotes` são removidos em cascata

---

## 5. Sprint 1 — Sistema de Autenticação

### 5.1 Regras de Negócio

- Registro exige `nome`, `email` (único) e `senha`
- Senha armazenada como hash com `BCryptPasswordEncoder` — **nunca em texto puro**
- Login com credenciais inválidas retorna `401` sem indicar qual campo está errado (evita enumeração de usuários)
- Login com sucesso retorna um token JWT válido
- Toda rota protegida valida o JWT via filtro do Spring Security

### 5.2 Entidade `Usuario`

```java
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    // getters, setters, construtores
}
```

| Campo | Tipo | Observação |
|-------|------|-----------|
| id | Long | PK, auto-incremento |
| nome | String | obrigatório |
| email | String | único, obrigatório |
| senhaHash | String | nunca retornar na API |
| criadoEm | LocalDateTime | preenchido automaticamente |

### 5.3 Classes Backend (Sprint 1)

| Classe | Responsabilidade |
|--------|-----------------|
| `UsuarioRepository` | `JpaRepository<Usuario, Long>` + `findByEmail(String email)` |
| `AuthService` | `registrar(RegistroRequest)`, `login(LoginRequest)`, geração/validação de JWT |
| `AuthController` | Expõe os endpoints de autenticação |
| `SecurityConfig` | Configuração do Spring Security (filtro JWT, rotas públicas vs protegidas) |
| `JwtTokenProvider` | Gera e valida tokens JWT |

### 5.4 DTOs (Sprint 1)

```java
// Entrada
RegistroRequest  { String nome, String email, String senha }
LoginRequest     { String email, String senha }

// Saída
TokenResponse    { String token, String tipo = "Bearer", LocalDateTime expiraEm }
```

### 5.5 Endpoints (Sprint 1)

| Método | Rota | Body | Resposta Sucesso | Resposta Erro |
|--------|------|------|-----------------|--------------|
| POST | `/auth/registro` | `{ nome, email, senha }` | `201` + dados do usuário (sem senha) | `409` e-mail já existe · `400` validação |
| POST | `/auth/login` | `{ email, senha }` | `200` + `{ token }` | `401` credenciais inválidas |
| GET | `/auth/me` | — (JWT no header) | `200` + dados do usuário | `401` sem token |

### 5.6 Critérios de Aceite (Sprint 1)

- [ ] Registro com e-mail já existente → `409` com mensagem clara
- [ ] Registro com campos faltando → `400` com detalhe de validação por campo
- [ ] Login com senha errada → `401`, sem indicar se o e-mail existe
- [ ] Login correto → JWT válido no corpo da resposta
- [ ] `GET /auth/me` só responde com token válido no header `Authorization: Bearer <token>`
- [ ] `GET /auth/me` sem token → `401`

---

## 6. Sprint 2 — CRUD Fazenda × Lote

### 6.1 Regras de Negócio

- Todas as rotas exigem JWT válido (usuário autenticado)
- Nesta fase, qualquer usuário autenticado pode operar os CRUDs (sem restrição por papel/dono — vem na sprint seguinte)
- Ao criar uma fazenda, `dono` é automaticamente o usuário do token JWT
- Lote deve sempre estar vinculado a uma fazenda existente
- Remover uma fazenda remove seus lotes em cascata

### 6.2 Entidade `Fazenda`

```java
@Entity
@Table(name = "fazenda")
public class Fazenda {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String localizacao;

    @ManyToOne
    @JoinColumn(name = "dono_id", nullable = false)
    private Usuario dono;

    @OneToMany(mappedBy = "fazenda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lote> lotes = new ArrayList<>();

    // getters, setters, construtores
}
```

| Campo | Tipo | Observação |
|-------|------|-----------|
| id | Long | PK |
| nome | String | obrigatório |
| localizacao | String | opcional (texto livre) |
| dono | Usuario | FK → `usuario.id` |

### 6.3 Entidade `Lote`

```java
@Entity
@Table(name = "lote")
public class Lote {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fazenda_id", nullable = false)
    private Fazenda fazenda;

    @Column(nullable = false)
    private String nome;

    private Integer quantidade;
    private String tipo;
    private String pasto;

    // getters, setters, construtores
}
```

| Campo | Tipo | Observação |
|-------|------|-----------|
| id | Long | PK |
| fazenda | Fazenda | FK → `fazenda.id` |
| nome | String | obrigatório (ex: "Lote A — Novilhas") |
| quantidade | Integer | número de animais |
| tipo | String | ex: "novilhas", "engorda", "matrizes" |
| pasto | String | identificação do piquete/pasto |

### 6.4 Classes Backend (Sprint 2)

| Classe | Responsabilidade |
|--------|-----------------|
| `FazendaRepository` | `JpaRepository<Fazenda, Long>` + `findByDonoId(Long donoId)` |
| `LoteRepository` | `JpaRepository<Lote, Long>` + `findByFazendaId(Long fazendaId)` |
| `FazendaService` | Regras de negócio de Fazenda (validações, associação de dono) |
| `LoteService` | Regras de negócio de Lote (validar fazenda existente, etc.) |
| `FazendaController` | Endpoints REST de Fazenda |
| `LoteController` | Endpoints REST de Lote |

### 6.5 DTOs (Sprint 2)

```java
// Fazenda
FazendaRequest   { String nome, String localizacao }
FazendaResponse  { Long id, String nome, String localizacao, int totalLotes }

// Lote
LoteRequest      { Long fazendaId, String nome, Integer quantidade, String tipo, String pasto }
LoteResponse     { Long id, String nome, Integer quantidade, String tipo, String pasto, Long fazendaId }
```

### 6.6 Endpoints — Fazenda

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/fazendas` | Cria fazenda (dono = usuário autenticado) | JWT |
| GET | `/fazendas` | Lista fazendas do usuário autenticado | JWT |
| GET | `/fazendas/{id}` | Detalhe de uma fazenda | JWT |
| PUT | `/fazendas/{id}` | Atualiza fazenda | JWT |
| DELETE | `/fazendas/{id}` | Remove fazenda (e lotes em cascata) | JWT |

### 6.7 Endpoints — Lote

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/fazendas/{fazendaId}/lotes` | Cria lote dentro de uma fazenda | JWT |
| GET | `/fazendas/{fazendaId}/lotes` | Lista lotes de uma fazenda | JWT |
| GET | `/lotes/{id}` | Detalhe de um lote | JWT |
| PUT | `/lotes/{id}` | Atualiza lote | JWT |
| DELETE | `/lotes/{id}` | Remove lote | JWT |

### 6.8 Frontend React (Sprint 2)

#### Telas

| Tela | Rota React | Descrição |
|------|-----------|-----------|
| Login | `/login` | Formulário de login, salva token no estado global |
| Registro | `/registro` | Formulário de cadastro |
| Minhas Fazendas | `/fazendas` | Lista de fazendas + botão criar |
| Fazenda Detalhe | `/fazendas/:id` | Detalhe da fazenda + lista de lotes + CRUD de lotes |

#### Padrões de implementação

- Estado de autenticação e token gerenciado via `AuthContext` (React Context)
- Token armazenado **em memória/estado** — não usar `localStorage` por segurança
- Chamadas HTTP via `fetch` ou `axios`, enviando JWT no header: `Authorization: Bearer <token>`
- Formulários controlados por `useState`
- `PrivateRoute` redireciona para `/login` se não houver token

### 6.9 Critérios de Aceite (Sprint 2)

- [ ] CRUD completo de Fazenda funcionando ponta a ponta (front + back)
- [ ] CRUD completo de Lote funcionando, sempre vinculado a uma fazenda existente
- [ ] Criar lote com `fazendaId` inexistente → `404`
- [ ] Remover fazenda remove lotes em cascata (comportamento documentado)
- [ ] Todas as rotas retornam `401` sem JWT válido

---

## 7. Ordem de Implementação

```
1. Configurar projeto Spring Boot (pom.xml + application.properties)
2. Criar entidade Usuario + UsuarioRepository
3. Implementar JwtTokenProvider
4. Implementar AuthService + AuthController
5. Configurar SecurityConfig
6. ✅ Testar endpoints de auth (Postman/HTTPie)
7. Criar entidades Fazenda e Lote
8. Criar Repositories + Services + Controllers de Fazenda e Lote
9. ✅ Testar endpoints de Fazenda e Lote
10. Criar projeto React (Vite ou CRA)
11. Implementar AuthContext + PrivateRoute
12. Implementar telas de Login e Registro
13. Implementar telas de Fazenda e Lote
14. ✅ Testar fluxo completo ponta a ponta
```

---

## 8. Fora do Escopo Atual (Roadmap Futuro)

Não implementar nas sprints iniciais sem solicitação explícita:

- Tabela `usuario_fazenda` com papéis (Dono / Administrador / Operador / Consultor)
- Matriz de permissões por papel aplicada no backend
- Hierarquia de criação de conta (Dono cria Admin; Admin solicita Operador)
- Dashboards por papel
- IA copiloto (consulta em linguagem natural, preenchimento assistido)
- Rastreamento em tempo real (WebSocket + mapa)
- Registro de venda de lote
- Migration com Flyway (entra quando o projeto amadurecer)
- Dockerização funcional (repositório existe, mas implementação é futura)

---

## 9. Observações de Segurança

1. **Senha:** sempre hashear com `BCryptPasswordEncoder` antes de persistir
2. **JWT:** nunca expor a chave secreta no código; usar variável de ambiente
3. **Enumeração de usuários:** login inválido sempre retorna `401` com mensagem genérica
4. **application.properties:** não subir com credenciais reais em repositório público — usar `${DB_PASSWORD}`
5. **Token no frontend:** armazenar em memória (estado React), não em `localStorage`
