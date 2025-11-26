# 🚗 Carro Amarelo - Sistema de Gerenciamento de Vendas

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Sistema web responsivo para gerenciamento interno de vendas de carros, desenvolvido com foco em segurança (ISO/IEC 15408) e usabilidade.

[Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Uso](#-uso) • [API](#-api-endpoints) • [Segurança](#-segurança)

</div>

---

## 📋 Sobre o Projeto

O **Carro Amarelo** é um sistema completo de gerenciamento para concessionárias que permite:

- 🔐 Autenticação segura com JWT
- 🚘 Gestão completa de carros (estoque)
- 👥 Cadastro de clientes e funcionários
- 💰 Registro e controle de vendas
- 📊 Dashboard com estatísticas em tempo real
- 🎨 Interface moderna e responsiva

## ✨ Funcionalidades

### Autenticação & Segurança
- ✅ Login com JWT (JSON Web Tokens)
- ✅ Senhas criptografadas com bcrypt
- ✅ Proteção de rotas e validação de tokens
- ✅ Sessão persistente com localStorage
- ✅ Logs de auditoria

### Dashboard
- 📊 Estatísticas em tempo real:
  - Total de carros (disponíveis + vendidos)
  - Valor total em vendas (R$)
  - Total de clientes e funcionários
- 📈 Gráficos de vendas por modelo e marca

### Gestão de Carros
- ➕ Cadastro completo (modelo, marca, cor, preço, portas)
- ✏️ Edição e exclusão de veículos
- 🔍 Filtros por status (disponível/vendido)
- 🔎 Busca por modelo, marca ou cor
- **Categorias:**
  - **Modelos:** Coupe, Compacto, SUV, Esportivo
  - **Marcas:** Ford, GMC, Toyota, Volkswagen
  - **Cores:** Vermelho, Preto, Branco, Cinza
  - **Portas:** 2 ou 4

### Gestão de Clientes
- 👤 Cadastro completo (nome, CPF, telefone, email, endereço)
- ✏️ Edição e exclusão
- 🔍 Busca por nome, email ou CPF

### Gestão de Funcionários
- 👨‍💼 Cadastro (nome, cargo, email, salário, senha)
- ✏️ Edição (com opção de alterar senha)
- 🗑️ Exclusão de funcionários
- 🔍 Busca por nome, email ou cargo

### Gestão de Vendas
- 🛒 Registro de vendas vinculando:
  - Carro disponível
  - Cliente
  - Funcionário vendedor
  - Valor e data/hora
- ✅ Atualização automática de status do carro
- 🚫 Validações (não permite vender carro já vendido)
- 🗑️ Exclusão de vendas (reverte status do carro)

## 🛠 Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Motor** - Driver async do MongoDB
- **Pydantic** - Validação de dados
- **JWT** - Autenticação com tokens
- **bcrypt** - Criptografia de senhas
- **Python 3.11+**

### Frontend
- **React 19** - Biblioteca JavaScript
- **React Router DOM v7** - Roteamento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **Sonner** - Toast notifications
- **date-fns** - Formatação de datas

### Database
- **MongoDB** - Banco de dados NoSQL

## 🚀 Instalação

### Pré-requisitos

- Docker e Docker Compose (recomendado)
- OU Node.js 18+ e Python 3.11+ e MongoDB

### Opção 1: Docker (Recomendado)

O sistema já está configurado e rodando no Docker:

```bash
# Verificar status dos serviços
sudo supervisorctl status

# Reiniciar serviços se necessário
sudo supervisorctl restart backend frontend
```

### Opção 2: Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd carro-amarelo
```

2. **Configure o Backend**
```bash
cd backend
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Popule o banco de dados
python seed_data.py
```

3. **Configure o Frontend**
```bash
cd frontend
yarn install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL do backend
```

4. **Inicie os serviços**

Terminal 1 (Backend):
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
yarn start
```

## 🎯 Uso

### Credenciais de Acesso

**Usuário Administrador:**
```
Email: joao@carroamarelo.com
Senha: senha123
```

> 💡 **Nota:** Todos os funcionários seed usam a senha `senha123`

### URLs

- **Frontend:** https://carro-amarelo.preview.emergentagent.com
- **API Backend:** https://carro-amarelo.preview.emergentagent.com/api

### Fluxo Básico de Uso

1. **Login:** Acesse a aplicação e faça login
2. **Dashboard:** Visualize as estatísticas gerais
3. **Cadastre Carros:** Adicione veículos ao estoque
4. **Cadastre Clientes:** Registre os compradores
5. **Registre Vendas:** Vincule carro + cliente + vendedor
6. **Acompanhe:** Monitore vendas e estoque pelo dashboard

## 📡 API Endpoints

### Autenticação
```http
POST   /api/auth/login      # Login
GET    /api/auth/me         # Dados do usuário logado
```

### Carros
```http
GET    /api/carros          # Listar carros
POST   /api/carros          # Criar carro
PUT    /api/carros/{id}     # Atualizar carro
DELETE /api/carros/{id}     # Deletar carro
```

### Clientes
```http
GET    /api/clientes        # Listar clientes
POST   /api/clientes        # Criar cliente
PUT    /api/clientes/{id}   # Atualizar cliente
DELETE /api/clientes/{id}   # Deletar cliente
```

### Funcionários
```http
GET    /api/funcionarios    # Listar funcionários
POST   /api/funcionarios    # Criar funcionário
PUT    /api/funcionarios/{id}  # Atualizar funcionário
DELETE /api/funcionarios/{id}  # Deletar funcionário
```

### Vendas
```http
GET    /api/vendas          # Listar vendas
POST   /api/vendas          # Registrar venda
DELETE /api/vendas/{id}     # Deletar venda
```

### Dashboard
```http
GET    /api/dashboard/stats # Estatísticas gerais
```

### Exemplo de Uso da API

```bash
# 1. Login
TOKEN=$(curl -X POST https://carro-amarelo.preview.emergentagent.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@carroamarelo.com","senha":"senha123"}' \
  | jq -r '.token')

# 2. Listar carros
curl -X GET https://carro-amarelo.preview.emergentagent.com/api/carros \
  -H "Authorization: Bearer $TOKEN"

# 3. Criar um carro
curl -X POST https://carro-amarelo.preview.emergentagent.com/api/carros \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modelo": "SUV",
    "marca": "Toyota",
    "cor": "Branco",
    "preco": 150000.00,
    "portas": 4
  }'
```

## 🛡️ Segurança

O sistema foi desenvolvido seguindo princípios da **ISO/IEC 15408** para segurança da informação:

### Implementações de Segurança

1. **Autenticação Robusta**
   - JWT com expiração de 24 horas
   - Tokens em cabeçalhos HTTP Authorization
   - Validação de token em todas as requisições protegidas

2. **Criptografia**
   - Senhas hash com bcrypt (algoritmo seguro)
   - Nunca armazena senhas em texto plano
   - Salt único para cada senha

3. **Validação de Dados**
   - Pydantic para validação de tipos no backend
   - Validação de email com EmailStr
   - Validação de campos obrigatórios
   - Sanitização de inputs

4. **Auditoria**
   - Logging de todas operações
   - Timestamps UTC em todas transações
   - Rastreabilidade de vendas por funcionário

5. **CORS Configurado**
   - Controle de origens permitidas
   - Headers e métodos específicos

## 📦 Estrutura do Projeto

```
carro-amarelo/
├── backend/
│   ├── server.py              # Aplicação FastAPI
│   ├── seed_data.py           # Script para popular BD
│   ├── requirements.txt       # Dependências Python
│   └── .env                   # Variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Carros.js
│   │   │   ├── Clientes.js
│   │   │   ├── Funcionarios.js
│   │   │   └── Vendas.js
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── Layout.js
│   │   │   └── ui/           # Componentes shadcn/ui
│   │   ├── App.js            # Componente principal
│   │   └── App.css           # Estilos globais
│   ├── package.json          # Dependências Node
│   └── .env                  # Variáveis de ambiente
├── tests/                    # Testes automatizados
├── SISTEMA_INFO.md          # Documentação detalhada
└── README.md                # Este arquivo
```

## 🎨 Design

### Paleta de Cores
- **Background:** Gradiente azul escuro (#1a1a2e → #16213e)
- **Accent:** Amarelo/ouro (#fbbf24 → #f59e0b)
- **Cards:** Glass morphism com backdrop blur

### Tipografia
- **Headings:** Space Grotesk (moderno e geométrico)
- **Body:** Inter (legível e profissional)

### Recursos de UX
- ✅ Design moderno e profissional
- ✅ Totalmente responsivo (mobile-first)
- ✅ Menu hamburguer no mobile
- ✅ Animações suaves
- ✅ Hover effects
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 📊 Dados de Teste

O sistema vem com dados de teste pré-carregados:

- **10 funcionários** com cargos variados
- **20 clientes** com dados completos
- **30 carros** em diferentes modelos e cores
- **15 vendas** já realizadas

Para repovoar o banco de dados:

```bash
cd backend
python seed_data.py
```

## 🔧 Troubleshooting

### Serviços não iniciam

```bash
# Verificar status
sudo supervisorctl status

# Reiniciar todos os serviços
sudo supervisorctl restart all

# Ver logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log
```

### Warnings nos Logs

Os seguintes warnings são **NORMAIS** e não afetam o funcionamento:

- **bcrypt warning:** Aviso sobre versão do módulo (funcional)
- **webpack deprecation:** Avisos de futuras versões (funcional)

### Erro de Conexão com MongoDB

```bash
# Verificar se MongoDB está rodando
sudo supervisorctl status mongodb

# Reiniciar MongoDB
sudo supervisorctl restart mongodb
```

## 📝 Logs

### Localização dos Logs

```bash
# Backend
/var/log/supervisor/backend.err.log
/var/log/supervisor/backend.out.log

# Frontend
/var/log/supervisor/frontend.err.log
/var/log/supervisor/frontend.out.log

# MongoDB
/var/log/supervisor/mongodb.err.log
```

## 🧪 Testes

Os seguintes testes foram validados:

✅ Login com credenciais válidas/inválidas
✅ Dashboard carrega estatísticas corretas
✅ CRUD completo de carros
✅ CRUD completo de clientes
✅ CRUD completo de funcionários
✅ Registro de vendas com validações
✅ Atualização de status de carros
✅ Navegação entre páginas
✅ Responsividade mobile
✅ API endpoints funcionando

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando [Emergent](https://emergent.sh)

---

<div align="center">

**[⬆ Voltar ao topo](#-carro-amarelo---sistema-de-gerenciamento-de-vendas)**

</div>
