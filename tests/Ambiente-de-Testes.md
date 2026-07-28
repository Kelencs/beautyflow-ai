# Ambiente de Testes

**Projeto:** BeautyFlow AI

**Documento:** Ambiente de Testes

**Código:** TEST003

**Versão:** 1.0

**Data:** 28/07/2026

**Autor:** Product Owner

**Status:** Em elaboração

---

# Histórico de Alterações

| Versão | Data | Responsável | Alteração |
|---------|------|-------------|-----------|
| 1.0 | 28/07/2026 | Product Owner | Criação inicial |

---

# Sumário

1. Objetivo
2. Escopo
3. Referências
4. Ambientes
5. Arquitetura dos Ambientes
6. Infraestrutura
7. Configuração do n8n
8. Configuração do WhatsApp Cloud API
9. Configuração do Google Calendar
10. Configuração do Google Sheets
11. Configuração da Inteligência Artificial
12. Banco de Dados
13. Credenciais
14. Variáveis de Ambiente
15. Dados de Teste
16. Usuários de Teste
17. Procedimento de Inicialização
18. Procedimento de Encerramento
19. Backup
20. Monitoramento
21. Restrições
22. Checklist
23. Aprovação

---

# 1. Objetivo

Este documento descreve os ambientes utilizados para desenvolvimento, homologação e produção do BeautyFlow AI.

O objetivo é garantir que todos os membros da equipe utilizem configurações padronizadas durante o desenvolvimento e execução dos testes.

---

# 2. Escopo

Este documento contempla:

- Infraestrutura
- Workflows n8n
- WhatsApp Cloud API
- Google Calendar
- Google Sheets
- Inteligência Artificial
- Dashboard
- Banco de Dados
- Credenciais
- Variáveis de Ambiente

---

# 3. Referências

Este documento está relacionado aos seguintes artefatos:

- Documento de Visão
- Arquitetura
- Plano de Testes
- Estratégia de Testes
- Workflows n8n
- Manual de Implantação
- Manual Operacional

---

# 4. Ambientes

O projeto utiliza três ambientes independentes.

| Ambiente | Objetivo |
|-----------|----------|
| Desenvolvimento (DEV) | Implementação e testes locais |
| Homologação (HML) | Validação funcional e testes de aceitação |
| Produção (PRD) | Operação oficial do sistema |

---

# 5. Arquitetura dos Ambientes

```text
                Internet
                    │
                    ▼
        WhatsApp Cloud API
                    │
                    ▼
              Webhook n8n
                    │
                    ▼
             BeautyFlow AI
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
 Google Calendar  Google Sheets  OpenAI
```

---

# 6. Infraestrutura

## Ambiente de Desenvolvimento

| Item | Valor |
|------|--------|
| Sistema Operacional | Windows 11 / Linux |
| n8n | Última versão estável |
| Node.js | LTS |
| Docker | Opcional |
| VS Code | Recomendado |
| Git | Obrigatório |

---

## Ambiente de Homologação

| Item | Valor |
|------|--------|
| Servidor | Cloud |
| HTTPS | Obrigatório |
| Backup | Diário |
| Monitoramento | Ativo |

---

## Ambiente de Produção

| Item | Valor |
|------|--------|
| Servidor Cloud | ✔ |
| HTTPS | ✔ |
| Backup Automático | ✔ |
| Firewall | ✔ |
| Monitoramento | ✔ |
| Logs Centralizados | ✔ |

---

# 7. Configuração do n8n

Versão recomendada:

```
Última versão estável
```

Componentes obrigatórios:

- Webhook
- HTTP Request
- Execute Workflow
- Google Calendar
- Google Sheets
- Code
- IF
- Switch
- Set
- Merge
- Wait

Todos os workflows deverão estar versionados no Git.

---

# 8. Configuração do WhatsApp Cloud API

Itens necessários:

- Meta Business Account
- Aplicação Meta
- Número WhatsApp Business
- Access Token
- Verify Token
- Webhook

Eventos monitorados:

- messages
- statuses

---

# 9. Configuração do Google Calendar

Será utilizada uma agenda exclusiva para testes.

Exemplo:

```
beautyflow-hml@gmail.com
```

Calendário:

```
BeautyFlow-Testes
```

Permissões:

- Leitura
- Escrita
- Atualização
- Exclusão

---

# 10. Configuração do Google Sheets

Planilhas recomendadas:

| Planilha | Finalidade |
|-----------|------------|
| Clientes | Cadastro |
| Agendamentos | Agenda |
| Logs | Auditoria |
| Configurações | Parâmetros |

---

# 11. Configuração da Inteligência Artificial

Modelo utilizado:

```
GPT
```

Funções:

- Classificação de intenção
- Interpretação de mensagens
- Geração de respostas
- Contextualização da conversa

A chave de API nunca deverá ser armazenada no repositório Git.

---

# 12. Banco de Dados

Caso seja utilizado banco de dados:

| Item | Valor |
|------|--------|
| Banco | PostgreSQL |
| Ambiente | Homologação |
| Backup | Diário |

Caso o projeto utilize Google Sheets, este item servirá apenas como referência futura.

---

# 13. Credenciais

Todas as credenciais deverão ser armazenadas no Gerenciador de Credenciais do n8n.

Nunca armazenar:

- Tokens
- Senhas
- Chaves
- Secrets

em arquivos do projeto.

---

# 14. Variáveis de Ambiente

Exemplo:

```env
APP_ENV=development

N8N_HOST=https://seudominio.com

META_VERIFY_TOKEN=xxxxxxxx

META_ACCESS_TOKEN=xxxxxxxx

GOOGLE_CALENDAR_ID=xxxxxxxx

GOOGLE_SHEET_ID=xxxxxxxx

OPENAI_API_KEY=xxxxxxxx
```

Nenhum arquivo `.env` deverá ser enviado ao GitHub.

---

# 15. Dados de Teste

Clientes fictícios:

| Nome | Telefone |
|-------|-----------|
| Maria Oliveira | 5511999999999 |
| Ana Souza | 5511988888888 |
| Juliana Martins | 5511977777777 |

Horários disponíveis:

- Segunda
- Terça
- Quarta
- Quinta
- Sexta

Serviços:

- Manicure
- Pedicure
- Alongamento
- Spa dos Pés

---

# 16. Usuários de Teste

| Perfil | Objetivo |
|----------|----------|
| Cliente | Simular atendimento |
| Profissional | Gerenciar agenda |
| Proprietário | Gerenciar empresa |
| Administrador | Configurar sistema |

---

# 17. Procedimento de Inicialização

Antes dos testes verificar:

- Servidor ativo
- n8n ativo
- Webhooks publicados
- Credenciais válidas
- APIs disponíveis
- Google Calendar conectado
- Google Sheets conectado

---

# 18. Procedimento de Encerramento

Após os testes:

- Exportar logs
- Salvar evidências
- Registrar defeitos
- Encerrar workflows temporários
- Remover dados de teste quando necessário

---

# 19. Backup

Backup obrigatório de:

- Workflows n8n
- Planilhas Google
- Banco de Dados (quando utilizado)
- Configurações

Periodicidade:

- Diário

Retenção:

- 30 dias

---

# 20. Monitoramento

Itens monitorados:

- Disponibilidade do servidor
- Tempo de resposta
- Falhas de integração
- Erros de workflow
- Logs do n8n
- APIs externas

---

# 21. Restrições

Não utilizar:

- Dados reais de clientes
- Telefones reais sem autorização
- Credenciais de produção em homologação
- Tokens de produção em ambiente de desenvolvimento

Todos os testes deverão utilizar dados fictícios.

---

# 22. Checklist

## Ambiente

- [ ] Servidor disponível
- [ ] HTTPS ativo
- [ ] DNS configurado

## n8n

- [ ] Workflows publicados
- [ ] Credenciais válidas
- [ ] Logs funcionando

## WhatsApp

- [ ] Número conectado
- [ ] Webhook ativo
- [ ] Verify Token válido

## Google

- [ ] Calendar conectado
- [ ] Sheets conectado

## IA

- [ ] API configurada
- [ ] Modelo disponível

## Testes

- [ ] Dados de teste carregados
- [ ] Usuários criados
- [ ] Evidências configuradas

---

# 23. Aprovação

| Papel | Responsável | Assinatura |
|--------|-------------|------------|
| Product Owner | __________________ | __________________ |
| Desenvolvedor | __________________ | __________________ |
| QA | __________________ | __________________ |
| Administrador | __________________ | __________________ |

---

## Anexo A — Estrutura dos Ambientes

```text
Desenvolvimento
        │
        ▼
Homologação
        │
        ▼
Produção
```

---

## Anexo B — Componentes Externos

| Sistema | Tipo |
|----------|------|
| WhatsApp Cloud API | API |
| Google Calendar | API |
| Google Sheets | API |
| OpenAI | API |
| n8n | Automação |

---

## Anexo C — Diretórios Relacionados

```text
09-n8n/
10-Testes/
11-Deploy/
12-Operacao/
13-Anexos/
```

---

**Fim do Documento**
