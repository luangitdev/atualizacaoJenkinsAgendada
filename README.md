# Agendador Jenkins

Sistema sofisticado para agendamento de chamadas API do Jenkins com interface web moderna.

## Funcionalidades

- ✅ Agendamento de jobs Jenkins com data e hora específicas
- ✅ Interface web moderna e responsiva
- ✅ Gestão completa de jobs (criar, editar, excluir)
- ✅ Integração direta com API do Jenkins
- ✅ Histórico de execuções
- ✅ Campos configuráveis conforme seu comando curl

## Estrutura do Projeto

```
agendaAtualizacao/
├── app.py                 # Backend Flask
├── models.py             # Modelos de banco de dados
├── requirements.txt      # Dependências Python
├── package.json          # Dependências Frontend
├── vite.config.js        # Configuração Vite
├── index.html            # HTML principal
├── src/
│   ├── main.jsx          # Entry point React
│   ├── App.jsx           # Componente principal
│   ├── index.css         # Estilos globais
│   └── components/
│       ├── JobForm.jsx   # Formulário de agendamento
│       └── JobList.jsx   # Lista de jobs
└── README.md
```

## Configuração e Instalação

### 1. Instalar dependências Python

```bash
pip install -r requirements.txt
```

### 2. Instalar dependências Node.js (Frontend)

```bash
npm install
```

### 3. Executar a aplicação

**Backend (Flask):**
```bash
python app.py
```
O backend estará disponível em: http://localhost:5000

**Frontend (React):**
```bash
npm run dev
```
O frontend estará disponível em: http://localhost:3000

## Como Usar

1. **Acesse a interface web** em http://localhost:3000
2. **Clique em "Novo Agendamento"**
3. **Preencha os campos:**
   - Nome da Aplicação
   - Versão 
   - Servidor Alvo
   - Branch
   - Data e Hora do agendamento
   - URL do Jenkins
   - Usuário e Token do Jenkins
4. **Configure as opções:** Pular Clone / Pular Build
5. **Clique em Agendar**

## Campos do Formulário

Os campos correspondem aos parâmetros do seu comando curl:

| Campo | Correspondência no curl |
|-------|-------------------------|
| `app_name` | `--data "APP_NAME=app"` |
| `version` | `--data "VERSION=1.0"` |
| `target_server` | `--data "TARGET_SERVER=server_name"` |
| `app_branch` | `--data "APP_BRANCH=main"` |
| `skip_clone` | `--data "SKIP_CLONE=true"` |
| `skip_build` | `--data "SKIP_BUILD=false"` |
| `jenkins_url` | URL base do Jenkins |
| `jenkins_user` | `--user "seu_usuario"` |
| `jenkins_token` | `--user "sua_senha"` |

## API Endpoints

- `GET /api/jobs` - Listar todos os jobs
- `POST /api/jobs` - Criar novo job
- `GET /api/jobs/<id>` - Obter job específico
- `PUT /api/jobs/<id>` - Atualizar job
- `DELETE /api/jobs/<id>` - Excluir job
- `GET /api/health` - Health check

## Banco de Dados

O sistema utiliza SQLite com três tabelas principais:

1. `scheduled_jobs` - Jobs agendados
2. `job_history` - Histórico de execuções
3. `users` - Autenticação (para futuras implementações)

## Segurança

- Credenciais do Jenkins são armazenadas no banco (em produção, considerar criptografia)
- CORS habilitado para o frontend
- Rate limiting básico implementado
- Validação de campos no backend

## Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Criptografia das credenciais do Jenkins
- [ ] Notificações por email
- [ ] Logs detalhados de execução
- [ ] Dashboard com métricas
- [ ] API mais robusta com documentação Swagger

## Troubleshooting

**Problema:** Erro de CORS
**Solução:** Verifique se o backend está rodando na porta 5000

**Problema:** Jobs não executam
**Solução:** Verifique as credenciais do Jenkins e a URL

**Problema:** Frontend não carrega
**Solução:** Execute `npm install` e `npm run dev`