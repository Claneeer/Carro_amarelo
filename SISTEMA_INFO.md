# Sistema Carro Amarelo - Documentação

## 📋 Descrição
Sistema web responsivo para gerenciamento interno de vendas de carros, desenvolvido seguindo princípios da ISO/IEC 15408 para segurança da informação.

## 🚀 Status do Sistema
✅ **FUNCIONANDO PERFEITAMENTE NO DOCKER**

### Serviços Ativos:
- ✅ Backend (FastAPI) - Porta 8001
- ✅ Frontend (React) - Porta 3000  
- ✅ MongoDB - Porta 27017
- ✅ Nginx Proxy

## 🔐 Credenciais de Acesso
```
Email: joao@carroamarelo.com
Senha: senha123
```

*Todos os funcionários do sistema usam a mesma senha: `senha123`*

## 📊 Funcionalidades Implementadas

### 1. Sistema de Autenticação
- ✅ Login com JWT (JSON Web Tokens)
- ✅ Sessão persistente com localStorage
- ✅ Logout com limpeza de sessão
- ✅ Proteção de rotas

### 2. Dashboard
- ✅ Estatísticas em tempo real:
  - Total de carros (disponíveis + vendidos)
  - Carros disponíveis para venda
  - Carros vendidos
  - Total em vendas (R$)
  - Total de clientes
  - Total de funcionários
- ✅ Gráficos de vendas por modelo
- ✅ Gráficos de vendas por marca

### 3. Gestão de Carros
- ✅ Cadastro de carros com:
  - Modelo: Coupe, Compacto, SUV, Esportivo
  - Marca: Ford, GMC, Toyota, Volkswagen
  - Cor: Vermelho, Preto, Branco, Cinza
  - Preço (R$)
  - Portas (2 ou 4)
  - Status (disponível/vendido)
- ✅ Edição de carros
- ✅ Exclusão de carros
- ✅ Filtros por status
- ✅ Busca por modelo, marca ou cor

### 4. Gestão de Clientes
- ✅ Cadastro completo: nome, CPF, telefone, email, endereço
- ✅ Edição de clientes
- ✅ Exclusão de clientes
- ✅ Busca por nome, email ou CPF

### 5. Gestão de Funcionários
- ✅ Cadastro: nome, cargo, email, salário, senha
- ✅ Edição (com opção de alterar senha)
- ✅ Exclusão de funcionários
- ✅ Busca por nome, email ou cargo
- ✅ Senhas criptografadas com bcrypt

### 6. Gestão de Vendas
- ✅ Registro de vendas vinculando:
  - Carro disponível
  - Cliente
  - Funcionário vendedor
  - Valor da venda
  - Data/hora automática
- ✅ Atualização automática do status do carro para "vendido"
- ✅ Validações:
  - Não permite vender carro já vendido
  - Verifica existência de carro, cliente e funcionário
- ✅ Exclusão de vendas (reverte status do carro)
- ✅ Histórico completo de vendas

## 🛡️ Segurança (ISO/IEC 15408)

### Implementações de Segurança:
1. **Autenticação e Autorização**
   - JWT com expiração de 24 horas
   - Tokens em cabeçalhos HTTP Authorization
   - Validação de token em todas as requisições protegidas

2. **Criptografia de Dados**
   - Senhas hash com bcrypt (algoritmo seguro)
   - Nunca armazenamos senhas em texto plano

3. **Validação de Dados**
   - Pydantic no backend para validação de tipos
   - Validação de email com EmailStr
   - Validação de campos obrigatórios

4. **Logs e Auditoria**
   - Logging configurado para todas operações
   - Timestamps UTC em todas as transações
   - Rastreabilidade de vendas por funcionário

5. **CORS Configurado**
   - Controle de origens permitidas
   - Headers e métodos configurados

## 🎨 Design

### Paleta de Cores:
- Background: Gradiente azul escuro (#1a1a2e → #16213e)
- Accent: Amarelo/ouro (#fbbf24 → #f59e0b)
- Glass morphism com backdrop blur

### Fontes:
- Headings: Space Grotesk
- Body: Inter

### Recursos de UX:
- ✅ Design moderno e profissional
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Menu hamburguer no mobile
- ✅ Animações suaves (fadeIn, slideIn)
- ✅ Hover effects em cards e botões
- ✅ Toast notifications (sonner)
- ✅ Ícones Lucide React
- ✅ Componentes shadcn/ui

## 📦 Dados de Teste (Seed)

O banco de dados foi populado com:
- 10 funcionários (cargos variados)
- 20 clientes
- 30 carros (10 modelos × 3 variações)
- 15 vendas realizadas

## 🔧 Tecnologias

### Backend:
- FastAPI (Python)
- Motor (MongoDB async driver)
- Pydantic (validação)
- JWT + bcrypt (autenticação)
- Passlib (hash de senhas)

### Frontend:
- React 19
- React Router DOM v7
- Axios (HTTP client)
- Tailwind CSS
- shadcn/ui components
- Lucide React (ícones)
- Sonner (toast notifications)
- date-fns (formatação de datas)

### Banco de Dados:
- MongoDB

## 📝 Logs

### Logs Importantes:
Os warnings nos logs são **NORMAIS** e **NÃO AFETAM** o funcionamento:

1. **Backend**: Warning do bcrypt sobre `__about__` - é um aviso interno, bcrypt funciona perfeitamente
2. **Frontend**: Deprecation warnings do webpack - são avisos de futuras versões, tudo funciona

### Como verificar logs:
```bash
# Backend
tail -f /var/log/supervisor/backend.err.log

# Frontend  
tail -f /var/log/supervisor/frontend.err.log

# Status dos serviços
sudo supervisorctl status
```

## 🧪 Testes Realizados

✅ Login com credenciais válidas
✅ Dashboard carrega estatísticas corretas
✅ CRUD completo de carros
✅ CRUD completo de clientes
✅ CRUD completo de funcionários
✅ Registro de vendas
✅ Validações de negócio
✅ Responsividade mobile
✅ Navegação entre páginas
✅ API endpoints funcionando

## 🌐 URLs

- **Frontend**: https://carro-amarelo.preview.emergentagent.com
- **API Backend**: https://carro-amarelo.preview.emergentagent.com/api

## 📌 Endpoints API

### Autenticação:
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Carros:
- `GET /api/carros` - Listar carros
- `POST /api/carros` - Criar carro
- `PUT /api/carros/{id}` - Atualizar carro
- `DELETE /api/carros/{id}` - Deletar carro

### Clientes:
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/{id}` - Atualizar cliente
- `DELETE /api/clientes/{id}` - Deletar cliente

### Funcionários:
- `GET /api/funcionarios` - Listar funcionários
- `POST /api/funcionarios` - Criar funcionário
- `PUT /api/funcionarios/{id}` - Atualizar funcionário
- `DELETE /api/funcionarios/{id}` - Deletar funcionário

### Vendas:
- `GET /api/vendas` - Listar vendas
- `POST /api/vendas` - Registrar venda
- `DELETE /api/vendas/{id}` - Deletar venda

### Dashboard:
- `GET /api/dashboard/stats` - Estatísticas gerais

## 🎯 Conclusão

O sistema **Carro Amarelo** está **100% funcional** no ambiente Docker, com todas as funcionalidades implementadas, testadas e validadas. Os warnings nos logs são apenas avisos de deprecação que não afetam o funcionamento do sistema.
