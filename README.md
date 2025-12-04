# Projeto MVC - Defesas Arquiteturais

**Aluna:** Ana Julia Vieira Pereira Andrade da Costa
**Disciplina:** DCC 704 – Arquitetura e Tecnologias de Sistemas WEB
**Professor:** Jean Bertrand
**Trabalho:** Trabalho 4 - Implementando Defesas Arquiteturais

Este é um projeto demonstrativo em Node.js usando Express, EJS e MongoDB (Mongoose). O objetivo é um CRUD de usuários com cadastro, login, sessão e proteção de rotas, com implementação de defesas contra vulnerabilidades críticas (XSS, CSRF, SQLi e Força Bruta).

## Resumo do Trabalho 4

Este trabalho implementa defesas arquiteturais essenciais contra as vulnerabilidades mais críticas em aplicações web:

### ✅ Tarefas Implementadas

#### 1. Setup Inicial
Todos os pacotes de segurança foram instalados:
- ✅ `helmet` - Proteção via HTTP Headers (CSP, X-Frame-Options, etc.)
- ✅ `csurf` - Tokens Anti-CSRF (Proteção contra falsificação de requisição)
- ✅ `express-rate-limit` - Limitação de requisições na rota de login
- ✅ `dotenv` - Proteção de credenciais via variáveis de ambiente

#### 2. Defesa Contra SQLi e XSS

**A. Prevenção de SQL Injection:**
- ✅ O projeto usa **Mongoose** em todas as operações de banco de dados
- ✅ Todas as queries são parametrizadas (não há concatenação de strings)
- ✅ Métodos usados: `find()`, `findOne()`, `findById()`, `create()`, `findByIdAndUpdate()`, `findByIdAndDelete()`
- 📄 Arquivos verificados: [controllers/userController.js](controllers/userController.js), [controllers/authController.js](controllers/authController.js)

**B. Prevenção de XSS:**
- ✅ Todas as views usam `<%= variavel %>` (com escape automático)
- ✅ Nenhuma view usa `<%- variavel %>` (raw HTML sem escape)
- 📄 Arquivos verificados: [views/login.ejs](views/login.ejs), [views/usersList.ejs](views/usersList.ejs), [views/formUsuario.ejs](views/formUsuario.ejs), [views/editUsuario.ejs](views/editUsuario.ejs), [views/perfil.ejs](views/perfil.ejs)

#### 3. Defesa Contra Força Bruta (Rate Limiting)

- ✅ Implementado no [server.js:66-76](server.js#L66-L76)
- ✅ Configuração: 5 tentativas por minuto na rota `POST /login`
- ✅ Na 6ª tentativa: retorna HTTP 429 com mensagem "Muitas tentativas de login. Tente novamente em 1 minuto."
- 📄 Teste: Faça 6 requisições POST para `/login` em menos de 60 segundos

#### 4. Hardening HTTP e Proteção de Credenciais

**A. Proteção de HTTP Headers (Helmet):**
- ✅ Implementado no [server.js:21](server.js#L21)
- ✅ Helmet aplicado ANTES de todas as rotas
- ✅ Headers protegidos: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, etc.

**B. Proteção de Credenciais (Variáveis de Ambiente):**
- ✅ Arquivo [.env](.env) criado com variáveis sensíveis
- ✅ Arquivo [.env.example](.env.example) disponível como template
- ✅ [.gitignore](.gitignore) configurado para NÃO comitar o `.env`
- ✅ Variáveis protegidas:
  - `SESSION_SECRET` - Chave de assinatura das sessões ([server.js:41](server.js#L41))
  - `MONGODB_URI` - String de conexão do MongoDB ([server.js:115](server.js#L115))

#### 5. Defesa Contra CSRF (Tokens)

- ✅ Middleware `csurf` configurado no [server.js:79-99](server.js#L79-L99)
- ✅ Token CSRF disponível em todas as views via `csrfToken`
- ✅ Exceção: `POST /login` não requer token CSRF (conforme especificação)
- ✅ Todas as outras rotas POST protegidas:
  - [views/formUsuario.ejs:15-17](views/formUsuario.ejs#L15-L17) - Criação de usuário
  - [views/editUsuario.ejs:16-18](views/editUsuario.ejs#L16-L18) - Edição de usuário
  - [views/usersList.ejs:32-34](views/usersList.ejs#L32-L34) - Exclusão de usuário
  - [views/perfil.ejs:12-14](views/perfil.ejs#L12-L14) - Logout

---

**Tecnologias**
- **Node.js / Express**: servidor e roteamento
- **EJS**: view engine (templates)
- **MongoDB / Mongoose**: persistência de dados
- **express-session**: sessões (login)
- **bcryptjs**: hashing de senhas
- **helmet**: hardening de HTTP headers
- **csurf**: proteção contra CSRF
- **express-rate-limit**: proteção contra força bruta
- **dotenv**: gerenciamento de variáveis de ambiente

**Estrutura principal**
- `server.js` - ponto de entrada, configurações de sessão e rotas
- `models/User.js` - esquema Mongoose do usuário
- `controllers/` - lógica da aplicação (`userController.js`, `authController.js`)
- `middleware/auth.js` - middleware `isAuth` para proteger rotas
- `views/` - templates EJS (`formUsuario.ejs`, `usersList.ejs`, `login.ejs`, `perfil.ejs`, `editUsuario.ejs`)

## Pré-requisitos
- Node.js (recomenda-se v16+)
- MongoDB rodando localmente ou uma URI do Atlas

Recomendações de segurança (instalações adicionais):
- `helmet` — para hardening de HTTP headers
- `express-rate-limit` — já usado para limitar tentativas de login
- `dotenv` — para carregar variáveis de ambiente (se ainda não estiver instalado)

## Instalação
1. Abra um terminal na pasta do projeto (`projeto-mvc`).
2. Instale dependências:

```powershell
npm install
```

3. Configure o arquivo de ambiente `.env` na raiz com as variáveis necessárias. Um arquivo `.env.example` está disponível como template. Copie-o para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

Exemplo de conteúdo do `.env`:

```
MONGODB_URI=mongodb://localhost:27017/projeto_mvc
PORT=3030
SESSION_SECRET=ana_julia_trabalho4_seguranca_web_2024_chave_forte
NODE_ENV=development
```

Observação: Se for usar MongoDB Atlas, substitua `MONGODB_URI` pela sua string de conexão.

## Como rodar

1. Certifique-se que o MongoDB está ativo (se local):

```powershell
# Em uma instalação padrão do MongoDB no Windows, iniciar o serviço (PowerShell como administrador):
net start MongoDB
# Ou execute o servidor mongod se estiver usando a instalação manual:
mongod --dbpath "C:\caminho\para\dados"
```

2. Execute o servidor Node:

```powershell
node server.js
```

O servidor iniciará na porta definida em `PORT` (padrão no `.env` é `3000`). Acesse `http://localhost:3000`.

## Rotas principais
- `GET /` - rota inicial (pode redirecionar para `/login` ou `/users`)
- `GET /login` - formulário de login
- `POST /login` - autenticação (cria sessão)
- `POST /logout` - finaliza sessão
- `GET /users` - lista de usuários (protegida por sessão)
- `GET /users/new` - formulário de cadastro
- `POST /users` - cria novo usuário (hash de senha)
- `GET /users/:id/edit` - formulário de edição (protegida)
- `POST /users/:id/update` - atualiza usuário (protegida)
- `POST /users/:id/delete` - exclui usuário (protegida)
- `GET /perfil` - página de perfil do usuário autenticado (protegida)

Observação: rotas que alteram dados usam o padrão POST para compatibilidade com formulários HTML.

## Autenticação e Sessões
- Ao criar um usuário, a senha é armazenada como hash usando `bcryptjs`.
- O login compara a senha enviada com o hash e, se válido, cria `req.session.userId` e `req.session.nome`.
- O middleware `isAuth` (em `middleware/auth.js`) protege rotas que exigem autenticação.

## Segurança — Proteção contra SQL Injection (SQLi) e XSS

- **Proteção contra SQLi (confirmação):** este projeto usa **Mongoose** para todas as operações de banco (`find`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`, etc.). Mongoose constrói consultas parametrizadas e não monta comandos SQL/MongoDB por concatenação de strings, então entradas do usuário são tratadas como parâmetros — isso previne os ataques clássicos de SQL Injection.

  - Verificação: o arquivo `controllers/userController.js` foi revisado e **não** contém concatenação manual de strings para formar consultas ao banco. Todas as operações usam métodos do Mongoose com parâmetros separados (por exemplo, `User.findById(id)`, `User.create({...})`, `User.find()`), portanto não há vetores óbvios de injeção por concatenação de queries.

  - Observação importante: evitar o uso de APIs que executam código ou consultas cru (ex.: `Model.collection.execCommand`, `$where` com strings, `eval`-like constructs) sem validação; essas rotas podem reintroduzir vetores de injeção se usadas incorretamente.

- **Proteção contra XSS (recomendações):** Cross-Site Scripting é uma classe diferente de ataque (inserção de scripts no HTML). Boas práticas para reduzir XSS:
  - Nas views EJS, use `\<%= ... %\>` (escape automático) ao exibir dados do usuário. Evite `\<%- ... %\>` que injeta HTML sem escapar, a menos que o conteúdo tenha sido devidamente sanitizado.
  - Sanitize inputs quando for necessário armazenar ou renderizar HTML (bibliotecas como `sanitize-html` ou validação no servidor com `express-validator`).
  - Considere Content Security Policy (CSP) em produção para mitigar execução de scripts injetados.

Essas medidas combinadas reduzem significativamente o risco de ataques SQLi e XSS no escopo deste projeto.

Verificação das Views (XSS):

- Foi verificadas todas as views em `views/` (`formUsuario.ejs`, `usersList.ejs`, `login.ejs`, `editUsuario.ejs`, `perfil.ejs`) e confirmei que **não** há uso de `\<%- ... %\>`. As variáveis de usuário são renderizadas com `\<%= ... %\>` (escape automático do EJS), portanto o output está sendo devidamente escapado por padrão.

  - Arquivos verificados: `formUsuario.ejs`, `usersList.ejs`, `login.ejs`, `editUsuario.ejs`, `perfil.ejs`.

Se desejar, posso automatizar a substituição de qualquer ocorrência de `\<%-` no projeto por `\<%=` ou sanitizar casos específicos, mas neste momento não há ocorrências que precisem ser alteradas.

## Proteção contra Força Bruta (Rate Limiting)

- Para proteger a rota de login contra ataques de força bruta, adicionamos suporte para aplicar um rate limiter no endpoint `POST /login`.
- Dependência necessária: `express-rate-limit`. Instale com:

```powershell
npm install express-rate-limit
```

- Configuração sugerida (já aplicada em `server.js`): janela de 1 minuto e máximo de 5 tentativas — a 6ª tentativa no mesmo minuto recebe HTTP `429` com a mensagem: `Muitas tentativas de login. Tente novamente em 1 minuto.`

Como testar (PowerShell):

```powershell
# Exemplo usando Invoke-WebRequest em PowerShell (substitua email e senha conforme necessário):
for ($i=0; $i -lt 6; $i++) { Invoke-WebRequest -Uri 'http://localhost:3030/login' -Method POST -Body @{ email='invalido@example.com'; senha='senhaerrada' } -UseBasicParsing -ErrorAction SilentlyContinue; Write-Host "Tentativa $($i+1) enviada" }
```

Ou com `curl` (Linux/macOS / Windows com curl instalado):

```bash
for i in 1 2 3 4 5 6; do curl -i -X POST -d "email=invalido@example.com&senha=senhaerrada" http://localhost:3030/login; echo "\n-- tentativa $i --\n"; done
```

Na 6ª requisição dentro de 60 segundos você deverá receber `HTTP/1.1 429` com a mensagem configurada.

## Proteção contra CSRF (Cross-Site Request Forgery)

- Implementamos o middleware `csurf` para proteger rotas POST contra CSRF. O token é gerado por sessão e disponibilizado nas views em `csrfToken`.
- Observação: por requisito, `POST /login` ficou como exceção (o middleware CSRF não é aplicado a esse endpoint). Todas as outras rotas POST exigem o campo oculto `_csrf` em formulários.

Como instalar a dependência:

```powershell
npm install csurf
```

Exemplo de campo oculto no formulário EJS:

```html
<input type="hidden" name="_csrf" value="<%= csrfToken %>" />
```

Teste rápido: tente submeter um formulário POST sem o campo `_csrf` — o servidor retornará erro 403.

## Logs úteis
- Há logs no servidor para eventos importantes:
  - Criação de usuário: imprime timestamp, email e id no terminal.
  - Login bem-sucedido: imprime timestamp, email, id e IP.

## Testes manuais recomendados
- Registrar um usuário em `GET /users/new` → `POST /users`.
- Fazer login em `GET /login` → `POST /login`.
- Acessar `GET /users` e `GET /perfil` (deverão estar acessíveis após login).
- Editar e excluir usuários para validar comportamento de CRUD.

## Vulnerabilidades mitigadas (lista e localizações)

Abaixo há um mapa objetivo das vulnerabilidades que foram mitigadas no projeto e em quais arquivos/trechos essas defesas foram aplicadas:

- **SQL Injection (SQLi):** mitigado pelo uso de Mongoose em `models/User.js` e nos controllers (`controllers/userController.js`, `controllers/authController.js`) — todas as operações ao banco usam métodos parametrizados (`find`, `findOne`, `create`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`).

- **Cross‑Site Scripting (XSS):** mitigado nas views usando escaping do EJS:
  - `views/usersList.ejs` — exibição de `user.nome` e `user.cargo` com `<%= ... %>` (escape automático).
  - `views/formUsuario.ejs`, `views/login.ejs`, `views/editUsuario.ejs`, `views/perfil.ejs` — todas usam `<%= ... %>` para saída de dados do usuário (sem uso inseguro de `<%- ... %>`).

- **Cross‑Site Request Forgery (CSRF):** mitigado em `server.js` com `csurf`; token `_csrf` exposto via `res.locals.csrfToken` e incluído como campo oculto nos formulários em `views/*` (ex.: `formUsuario.ejs`, `editUsuario.ejs`, `usersList.ejs`, `perfil.ejs`).

- **Força Bruta (Rate Limiting):** mitigado em `server.js` aplicando `express-rate-limit` na rota `POST /login` (limite: 5 tentativas por minuto; 6ª tentativa retorna 429).

- **Hardening de HTTP headers:** `server.js` — `helmet()` ativado para aplicar cabeçalhos de segurança (CSP, X-Frame-Options, X-XSS-Protection, etc.).

- **Sessões e cookies seguros:** `server.js` — cookie de sessão configurado com `httpOnly: true`, `sameSite: 'lax'` e `secure` dependente de `NODE_ENV=production`.

- **Proteção de credenciais (variáveis de ambiente):** `.env` e `.env.example` — `MONGODB_URI` e `SESSION_SECRET` movidos para variáveis de ambiente (evitar hardcode de segredos).

- **Hash de senhas:** `controllers/userController.js` — uso de `bcryptjs` para gerar hash antes de salvar senha (campo `password`).

- **Validação de IDs (ObjectId):** `controllers/userController.js` — validação com `mongoose.Types.ObjectId.isValid(id)` em endpoints que usam `:id` (`getEditUserForm`, `updateUser`, `deleteUser`).

- **Normalização de e‑mail:** `controllers/userController.js` e `controllers/authController.js` — `email = email.toLowerCase().trim()` antes de salvar/buscar para evitar duplicidade e problemas de correspondência por case/spaces.

- **Logout seguro:** `controllers/authController.js` — `res.clearCookie('connect.sid', { path: '/' })` para remover explicitamente o cookie de sessão.

- **Mensagens e logs:** handlers registram erros no servidor (console) e mensagens ao cliente foram mantidas genéricas quando apropriado para evitar vazamento de informações sensíveis.

Arquivo principal do projeto: `server.js`.
