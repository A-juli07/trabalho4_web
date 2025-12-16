# Projeto MVC - Defesas Arquiteturais

**Aluna:** Ana Julia Vieira Pereira Andrade da Costa
**Disciplina:** DCC 704 – Arquitetura e Tecnologias de Sistemas WEB
**Professor:** Jean Bertrand
**Trabalho:** Trabalho 4 - Implementando Defesas Arquiteturais

## Sobre o Projeto

Sistema CRUD de usuários desenvolvido em Node.js com Express, EJS e MongoDB, implementando defesas contra vulnerabilidades críticas: XSS, CSRF, SQL Injection e Força Bruta.

## Defesas Implementadas

### 1. Proteção HTTP Headers (Helmet)
- Configurado em `server.js`
- Headers de segurança: CSP, X-Frame-Options, X-Content-Type-Options

### 2. Proteção CSRF
- Tokens em todos os formulários
- Middleware `csurf` configurado
- Exceção: rota de login

### 3. Rate Limiting
- Limite de 5 tentativas por minuto no login
- Proteção contra força bruta

### 4. Prevenção SQL Injection
- Mongoose com queries parametrizadas
- Sem concatenação de strings

### 5. Prevenção XSS
- EJS com escape automático (`<%= %>`)
- Todas as views protegidas

### 6. Proteção de Credenciais
- Variáveis de ambiente (`.env`)
- Senhas com hash bcrypt
- `.gitignore` configurado

## Vulnerabilidades Mitigadas (Aula 19)

### SQL Injection (SQLi)
- **Mitigação:** Queries parametrizadas com Mongoose
- **Localização:**
  - `models/User.js` - Schema com validações
  - `controllers/userController.js` - Uso de `User.find()`, `User.findById()`, `User.create()`
  - `controllers/authController.js` - Uso de `User.findOne({ email })`
- **Técnica:** Mongoose separa dados de comandos, impedindo injeção SQL

### Cross-Site Scripting (XSS)
- **Mitigação:** Output escaping automático do EJS
- **Localização:**
  - `views/login.ejs` - `<%= query.erro %>` (linha 23)
  - `views/usersList.ejs` - `<%= user.nome %>`, `<%= user.cargo %>`, `<%= user.email %>` (linhas 39-42)
  - `views/formUsuario.ejs` - `<%= query.erro %>` (linha 23)
  - `views/editUsuario.ejs` - `<%= user.nome %>`, `<%= user.cargo %>`, `<%= user.email %>` (linhas 13, 29, 42, 53)
  - `views/perfil.ejs` - `<%= nome %>` (linhas 13, 25)
- **Técnica:** Uso de `<%= %>` ao invés de `<%- %>` para escapar HTML

### Cross-Site Request Forgery (CSRF)
- **Mitigação:** Tokens CSRF em formulários
- **Localização:**
  - `server.js` - Middleware `csurf` (linhas 79-99)
  - `views/formUsuario.ejs` - `<input type="hidden" name="_csrf">` (linha 30)
  - `views/editUsuario.ejs` - `<input type="hidden" name="_csrf">` (linha 19)
  - `views/usersList.ejs` - `<input type="hidden" name="_csrf">` (linha 56)
  - `views/perfil.ejs` - `<input type="hidden" name="_csrf">` (linha 36)
- **Técnica:** Token único por sessão validado no servidor

### Ataques de Força Bruta
- **Mitigação:** Rate limiting na rota de login
- **Localização:** `server.js` (linhas 66-76)
- **Configuração:** Máximo 5 tentativas por minuto
- **Técnica:** Middleware `express-rate-limit` retorna HTTP 429 após limite

### Broken Access Control (BAC)
- **Mitigação:** Middleware de autenticação
- **Localização:**
  - `middleware/auth.js` - Função `isAuth`
  - `server.js` - Proteção de rotas com `isAuth` (linhas 104-112)
- **Técnica:** Verificação de `req.session.userId` antes de acessar recursos protegidos

### Hardening HTTP
- **Mitigação:** Headers de segurança com Helmet
- **Localização:** `server.js` (linha 21)
- **Headers configurados:**
  - Content-Security-Policy (CSP)
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
- **Técnica:** Middleware `helmet()` aplicado antes das rotas

### Exposição de Credenciais
- **Mitigação:** Variáveis de ambiente
- **Localização:**
  - `.env` - Arquivo com credenciais (não versionado)
  - `.env.example` - Template público
  - `.gitignore` - Proteção do arquivo `.env` (linha 2)
  - `server.js` - Uso de `process.env.MONGODB_URI` e `process.env.SESSION_SECRET`
- **Técnica:** Separação de código e configuração sensível

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env`:
```bash
cp .env.example .env
```

3. Edite o `.env` com suas configurações:
```
MONGODB_URI=mongodb://localhost:27017/projeto_mvc
PORT=3030
SESSION_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

## Como Executar

0. Testando:
```bash
npm test
```

2. Inicie o MongoDB:
```bash
net start MongoDB
```

2. Execute o servidor:
```bash
node server.js
```

3. Acesse: `http://localhost:3030`

