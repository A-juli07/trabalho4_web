# Instruções de Teste - Trabalho 4

**Aluna:** Ana Julia Vieira Pereira Andrade da Costa

Este documento contém instruções detalhadas para testar todas as defesas implementadas no Trabalho 4.

## Pré-requisitos

1. MongoDB rodando localmente ou string de conexão do Atlas configurada no `.env`
2. Dependências instaladas (`npm install`)
3. Servidor rodando (`node server.js`)

---

## Teste 1: Defesa Contra Força Bruta (Rate Limiting)

### Objetivo
Verificar que após 5 tentativas de login, a 6ª é bloqueada com HTTP 429.

### Passo a Passo

**Opção 1: Usando PowerShell**
```powershell
# Execute este comando 6 vezes consecutivas (em menos de 1 minuto):
for ($i=0; $i -lt 6; $i++) {
    $response = Invoke-WebRequest -Uri 'http://localhost:3030/login' -Method POST -Body @{
        email='teste@invalido.com'
        senha='senhaerrada'
    } -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "Tentativa $($i+1): Status = $($response.StatusCode)"
}
```

**Opção 2: Manualmente no navegador**
1. Acesse http://localhost:3030/login
2. Digite um email/senha inválidos
3. Clique em "Entrar" 6 vezes seguidas (rápido!)
4. Na 6ª tentativa você verá: "Muitas tentativas de login. Tente novamente em 1 minuto."

### Resultado Esperado
- Tentativas 1-5: Redirecionam para `/login?erro=usuario` ou `/login?erro=senha`
- Tentativa 6: HTTP 429 com mensagem de bloqueio
- Após 60 segundos: Voltará a aceitar tentativas

---

## Teste 2: Defesa Contra XSS

### Objetivo
Verificar que código JavaScript malicioso NÃO é executado quando inserido em campos de usuário.

### Passo a Passo

1. Acesse http://localhost:3030/users/new
2. Preencha o formulário com:
   - Nome: `<script>alert('XSS')</script>`
   - Cargo: `<img src=x onerror=alert('XSS')>`
   - Email: `teste@xss.com`
   - Senha: `senha123`
3. Clique em "Adicionar Usuário"
4. Faça login com `teste@xss.com` / `senha123`
5. Acesse http://localhost:3030/users

### Resultado Esperado
- O nome e cargo aparecem como **texto literal** na lista
- Você verá: `<script>alert('XSS')</script>` como texto (não executa)
- NENHUM alerta JavaScript é exibido no navegador
- Isso comprova que o EJS está fazendo escape automático com `<%= %>`

---

## Teste 3: Defesa Contra CSRF

### Objetivo
Verificar que requisições POST sem token CSRF são rejeitadas.

### Passo a Passo

**Opção 1: Usando curl (linha de comando)**
```bash
# Tente criar um usuário SEM o token CSRF:
curl -X POST http://localhost:3030/users \
  -d "nome_usuario=Hacker&cargo_usuario=Mal&email_usuario=hack@teste.com&senha_usuario=123456" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

**Opção 2: Usando PowerShell**
```powershell
Invoke-WebRequest -Uri 'http://localhost:3030/users' -Method POST -Body @{
    nome_usuario='Hacker'
    cargo_usuario='Mal'
    email_usuario='hack@teste.com'
    senha_usuario='123456'
} -UseBasicParsing
```

### Resultado Esperado
- Você receberá um erro **403 Forbidden** ou **"invalid csrf token"**
- Isso comprova que o middleware `csurf` está funcionando

**Verificação adicional:**
1. Acesse http://localhost:3030/users/new pelo navegador
2. Abra o Inspecionar Elemento (F12)
3. Na aba "Elements", procure por `<input type="hidden" name="_csrf"`
4. Você verá o token CSRF presente no formulário
5. Ao enviar pelo navegador, funciona porque o token é incluído automaticamente

---

## Teste 4: Proteção de HTTP Headers (Helmet)

### Objetivo
Verificar que headers de segurança estão presentes nas respostas HTTP.

### Passo a Passo

**Opção 1: Usando curl**
```bash
curl -I http://localhost:3030/
```

**Opção 2: Usando PowerShell**
```powershell
$response = Invoke-WebRequest -Uri 'http://localhost:3030/' -UseBasicParsing
$response.Headers
```

**Opção 3: No navegador**
1. Acesse http://localhost:3030/
2. Abra as Ferramentas do Desenvolvedor (F12)
3. Vá na aba "Network" (Rede)
4. Recarregue a página (F5)
5. Clique na primeira requisição
6. Vá na aba "Headers" (Cabeçalhos)
7. Procure por "Response Headers"

### Resultado Esperado
Você deve ver headers como:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 0
Content-Security-Policy: default-src 'self';...
```

Estes headers protegem contra diversos ataques (clickjacking, MIME sniffing, etc.)

---

## Teste 5: Proteção de SQL Injection

### Objetivo
Verificar que tentativas de SQL Injection são neutralizadas pelo Mongoose.

### Passo a Passo

1. Acesse http://localhost:3030/login
2. Tente fazer login com:
   - Email: `admin@teste.com' OR '1'='1`
   - Senha: `qualquercoisa' OR '1'='1`
3. Tente criar um usuário com nome: `'; DROP TABLE users; --`

### Resultado Esperado
- O login **falhará** (usuário não encontrado ou senha incorreta)
- O usuário será criado com o nome literal `'; DROP TABLE users; --`
- Nenhuma query maliciosa é executada no banco
- Isso porque Mongoose usa queries parametrizadas, não concatenação de strings

---

## Teste 6: Proteção de Credenciais (Variáveis de Ambiente)

### Objetivo
Verificar que informações sensíveis NÃO estão hardcoded no código.

### Passo a Passo

1. Abra o arquivo `server.js`
2. Procure por:
   - `process.env.SESSION_SECRET` (linha 41)
   - `process.env.MONGODB_URI` (linha 115)
3. Abra o arquivo `.env`
4. Verifique que estes valores estão definidos no `.env`, não no código

### Resultado Esperado
- As credenciais estão no `.env` (que está no `.gitignore`)
- O código usa `process.env.VARIAVEL` para acessá-las
- O arquivo `.env` NÃO deve ser commitado no Git

**Verificação:**
```bash
git status
```
O arquivo `.env` não deve aparecer na lista de arquivos para commit.

---

## Teste 7: Hash de Senhas (bcrypt)

### Objetivo
Verificar que senhas são armazenadas como hash, nunca em texto plano.

### Passo a Passo

1. Crie um usuário em http://localhost:3030/users/new
   - Nome: `Teste Hash`
   - Cargo: `Testador`
   - Email: `hash@teste.com`
   - Senha: `minhasenha123`

2. Acesse o MongoDB:
   ```bash
   # MongoDB local
   mongosh
   use projeto_mvc
   db.users.find({ email: 'hash@teste.com' })
   ```

   Ou use MongoDB Compass/Atlas para visualizar o documento.

### Resultado Esperado
- O campo `password` no banco NÃO será `minhasenha123`
- Você verá algo como: `$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Este é o hash bcrypt (irreversível)
- Mesmo você sabendo a senha, não consegue descobrir a original a partir do hash

---

## Checklist Final

Antes de entregar o trabalho, verifique:

- [ ] Todas as dependências estão em `package.json`
- [ ] Arquivo `.env` existe e tem valores corretos
- [ ] Arquivo `.env.example` existe como template
- [ ] `.gitignore` inclui `.env`
- [ ] README.md atualizado com seu nome e informações do trabalho
- [ ] Todos os 7 testes acima foram executados e passaram
- [ ] O servidor inicia sem erros (`node server.js`)
- [ ] É possível:
  - Criar usuário
  - Fazer login
  - Ver lista de usuários
  - Editar usuário
  - Excluir usuário
  - Fazer logout

---

## Problemas Comuns

### MongoDB não conecta
```
Erro ao conectar no MongoDB: connect ECONNREFUSED
```
**Solução:** Certifique-se que o MongoDB está rodando:
```bash
# Windows (PowerShell como administrador):
net start MongoDB
```

### Porta 3030 em uso
```
Error: listen EADDRINUSE: address already in use :::3030
```
**Solução:** Mude a porta no `.env`:
```
PORT=3031
```

### Erro de CSRF em todas as requisições
```
invalid csrf token
```
**Solução:** Certifique-se que o cookie de sessão está funcionando. Limpe os cookies do navegador e tente novamente.

---

**Boa sorte com a entrega do trabalho!**
