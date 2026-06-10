# Unifor TCC Connect - Backend

## Responsável

**Nicolas Castro Ribeiro**

Módulos desenvolvidos:

* Controllers
* Services
* Routes
* Documentação Swagger
* Regras de Negócio

---

# Visão Geral

O backend do Unifor TCC Connect foi desenvolvido utilizando:

* Node.js
* Express.js
* Swagger (OpenAPI)

A arquitetura foi organizada em camadas para facilitar manutenção, testes e futura integração com banco de dados.

Estrutura:

src/

├── controllers/

├── services/

├── repositories/

├── routes/

├── middlewares/

└── server.js

---

# Arquitetura

## Controller Layer

Responsável por:

* Receber requisições HTTP
* Chamar Services
* Retornar Responses

Arquivo principal:

* ticketController.js

---

## Service Layer

Responsável por:

* Regras de negócio
* Validações
* Controle do fluxo de revisão

Arquivo principal:

* ticketService.js

---

## Repository Layer

Responsável por:

* Persistência de dados

Atualmente utiliza armazenamento em memória:

```js
this.tickets = []
```

Esta camada foi isolada propositalmente para permitir futura substituição por banco de dados sem alterar Services ou Controllers.

Arquivo:

* ticketRepository.js

---

# Endpoints Disponíveis

## Listar Tickets

GET

/api/tickets

---

## Buscar Ticket

GET

/api/tickets/:id

---

## Criar Ticket

POST

/api/tickets

Body:

```json
{
  "titulo": "Meu TCC",
  "descricao": "Primeira submissão",
  "tema": "Inteligência Artificial",
  "curso": "Ciência da Computação",
  "aluno": "Nicolas"
}
```

---

## Atualizar Status

PATCH

/api/tickets/:id/status

Body:

```json
{
  "status": "EM_CORRECAO"
}
```

Status válidos:

* PENDENTE
* EM_CORRECAO
* AJUSTES_NECESSARIOS
* APROVADO
* FECHADO

---

## Atribuir Bibliotecário

PATCH

/api/tickets/:id/assign

Body:

```json
{
  "bibliotecario": "Maria"
}
```

---

## Adicionar Feedback

POST

/api/tickets/:id/feedback

Body:

```json
{
  "bibliotecario": "Maria",
  "comentario": "Corrigir referências ABNT."
}
```

---

## Excluir Ticket

DELETE

/api/tickets/:id

---

# Regras de Negócio Implementadas

## Ticket

* Título obrigatório
* Ticket deve existir
* Status válido obrigatório
* Não é permitido alterar ticket fechado
* Não é permitido repetir o status atual

---

## Aluno

* Um aluno não pode possuir dois tickets em andamento simultaneamente

Status considerados em andamento:

* PENDENTE
* EM_CORRECAO
* AJUSTES_NECESSARIOS

---

## Feedback

* Bibliotecário obrigatório
* Comentário obrigatório
* Não é permitido adicionar feedback em ticket fechado

---

## Histórico

Cada alteração de status gera automaticamente um registro:

```json
{
  "status": "EM_CORRECAO",
  "data": "2026-06-10T18:00:00Z"
}
```

---

## Controle de Versão

Cada novo feedback incrementa automaticamente:

```json
"versao": 1
```

↓

```json
"versao": 2
```

↓

```json
"versao": 3
```

---

## Bibliotecário Responsável

Cada ticket pode possuir um responsável:

```json
{
  "bibliotecarioResponsavel": "Maria"
}
```

---

# Estrutura do Ticket

Exemplo:

```json
{
  "id": 123,

  "titulo": "TCC IA",

  "descricao": "Primeira submissão",

  "tema": "Inteligência Artificial",

  "curso": "Ciência da Computação",

  "aluno": "Nicolas",

  "status": "PENDENTE",

  "versao": 1,

  "bibliotecarioResponsavel": "Maria",

  "feedbacks": [],

  "historico": [],

  "createdAt": "2026-06-10T18:00:00Z"
}
```

---

# Swagger

Disponível em:

http://localhost:3000/api-docs

Permite:

* Visualizar endpoints
* Visualizar parâmetros
* Visualizar request bodies
* Testar endpoints

---

# Guia para Integração com Banco de Dados

IMPORTANTE:

Controllers e Services NÃO devem ser alterados.

A integração deve ocorrer APENAS na camada Repository.

---

## Implementação Atual

ticketRepository.js

Utiliza:

```js
this.tickets = []
```

---

## Implementação Recomendada

MySQL + Prisma

Exemplo:

```js
findAll() {
  return prisma.ticket.findMany()
}
```

```js
findById(id) {
  return prisma.ticket.findUnique({
    where: { id }
  })
}
```

```js
create(ticket) {
  return prisma.ticket.create({
    data: ticket
  })
}
```

```js
update(id, data) {
  return prisma.ticket.update({
    where: { id },
    data
  })
}
```

```js
delete(id) {
  return prisma.ticket.delete({
    where: { id }
  })
}
```

Nenhuma regra de negócio precisa ser reescrita.

---

# Modelo de Banco Recomendado

Tabela Ticket

* id
* titulo
* descricao
* tema
* curso
* aluno
* status
* versao
* bibliotecarioResponsavel
* createdAt

Tabela Feedback

* id
* ticketId
* bibliotecario
* comentario
* createdAt

Tabela HistoricoStatus

* id
* ticketId
* status
* data

---

# Guia para Integração JWT

Atualmente não existe autenticação.

Recomendação:

Middleware:

```js
authMiddleware.js
```

Exemplo:

```js
function auth(req, res, next) {
  next()
}
```

Posteriormente substituir por:

```js
jsonwebtoken
```

---

## Fluxo Recomendado

Login

↓

Gera JWT

↓

Frontend armazena token

↓

Token enviado:

```http
Authorization: Bearer TOKEN
```

↓

Middleware valida token

↓

Libera acesso

---

# Possíveis Perfis

ALUNO

* Criar ticket
* Consultar ticket

BIBLIOTECARIO

* Alterar status
* Atribuir responsável
* Adicionar feedback

ADMIN

* Controle total

---

# Melhorias Futuras

* JWT
* Refresh Token
* Banco MySQL
* Prisma ORM
* Upload de PDF
* Armazenamento S3/Firebase
* Histórico de versões do documento
* Notificações por e-mail
* Dashboard administrativo
* Logs de auditoria
* Testes automatizados
* Docker

---

# Status da Implementação

Controllers: Concluído

Services: Concluído

Routes: Concluído

Swagger: Concluído

Regras de Negócio: Concluído

Pronto para integração com banco de dados e autenticação.
