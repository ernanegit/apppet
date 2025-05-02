# PetCondo Server

Backend para o aplicativo de gerenciamento de pets em condomínios.

## Descrição

Este servidor fornece uma API RESTful para o aplicativo PetCondo, permitindo gerenciar cadastros de pets, vacinas, incidentes relacionados a pets e um sistema de chat entre moradores do condomínio.

## Tecnologias Utilizadas

- Node.js
- Express.js
- MySQL
- JWT para autenticação
- Multer para upload de arquivos
- bcrypt para criptografia de senhas

## Requisitos

- Node.js 14.x ou superior
- MySQL 5.7 ou superior

## Instalação

1. Clone o repositório:
   `ash
   git clone https://seu-repositorio/pet-condo-server.git
   cd pet-condo-server
   `

2. Instale as dependências:
   `ash
   npm install
   `

3. Configure o banco de dados:
   `ash
   # Crie o banco de dados e tabelas
   mysql -u seu_usuario -p < database.sql
   `

4. Configure o arquivo .env:
   `
   # Renomeie o arquivo .env.example para .env e edite as configurações
   cp .env.example .env
   `

5. Inicie o servidor:
   `ash
   # Modo desenvolvimento
   npm run dev
   
   # Modo produção
   npm start
   `

## Estrutura do Projeto

- /config - Configurações do banco de dados e outras configurações
- /controllers - Lógica de negócios da aplicação
- /middleware - Middlewares para autenticação e outras funções
- /routes - Rotas da API
- /uploads - Diretório para armazenar arquivos enviados pelos usuários

## Endpoints da API

### Autenticação

- POST /api/auth/register - Registrar novo usuário
- POST /api/auth/login - Login de usuário
- GET /api/auth/profile - Obter perfil do usuário autenticado

### Pets

- GET /api/pets - Listar todos os pets
- GET /api/pets?ownerId=1 - Listar pets de um usuário específico
- GET /api/pets/:id - Obter detalhes de um pet
- POST /api/pets - Adicionar um novo pet
- PUT /api/pets/:id - Atualizar informações de um pet
- DELETE /api/pets/:id - Remover um pet

### Incidentes

- GET /api/incidents - Listar todos os incidentes
- POST /api/incidents - Reportar um novo incidente
- PUT /api/incidents/:id/status - Atualizar status de um incidente

### Chat

- GET /api/chat - Obter mensagens do chat
- POST /api/chat - Enviar uma nova mensagem

### Notificações

- POST /api/notifications/token - Registrar token para notificações push
- DELETE /api/notifications/token - Remover token de notificações

## Licença

Este projeto está licenciado sob a licença MIT.
