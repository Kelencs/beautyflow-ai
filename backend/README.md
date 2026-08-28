# BeautyFlow App — Backend

Backend do BeautyFlow App construído com **NestJS + TypeScript**.

Workspace: `@beautyflow/backend`.

O backend funciona como a fronteira entre o frontend, Supabase e, futuramente, os workflows n8n por meio do `APP-WF019`.

## Status

O backend não é mais apenas um scaffold do NestJS.

O `AppModule` registra atualmente módulos de domínio para:

- Auth;
- Agenda;
- Clientes;
- Serviços;
- Profissionais;
- Dashboard;
- Financeiro;
- Comunicação;
- Relatórios;
- Configurações;
- IA.

Também existe camada de banco/configuração utilizada pelo App.

## Responsabilidade arquitetural

O backend deve centralizar:

- autenticação;
- autorização;
- resolução de contexto do usuário/empresa;
- validação;
- regras de acesso;
- integração com Supabase;
- futura integração com `APP-WF019`;
- tratamento de erros;
- auditoria;
- isolamento multiempresa.

O frontend não deve acessar o n8n diretamente.

## Arquitetura alvo

```text
Next.js
  ↓
NestJS
  ├── Supabase
  ↓
APP-WF019
  ↓
Workflows n8n
```

## Desenvolvimento

Execute a partir da raiz do monorepo:

```bash
npm install
npm run dev:backend
```

API:

```text
http://localhost:3001
```

Para iniciar frontend e backend juntos:

```bash
npm run dev
```

## Scripts

```bash
npm run start:dev --workspace=@beautyflow/backend
npm run build --workspace=@beautyflow/backend
npm run lint --workspace=@beautyflow/backend
npm run test --workspace=@beautyflow/backend
```

## Dados e integração

O backend já representa os módulos do domínio do BeautyFlow, porém a integração operacional completa com WF001–WF018 permanece pendente.

O `APP-WF019` será o gateway responsável por permitir que o backend consuma operações do n8n sem expor webhooks diretamente ao navegador.

Enquanto essa integração não é concluída, alguns serviços podem utilizar dados mockados para validar contratos, interface e regras de autorização.

## Segurança

Princípios obrigatórios:

- nunca confiar em `id_empresa`, perfil ou escopo enviados livremente pelo cliente;
- resolver identidade e escopo server-side;
- aplicar autorização no backend;
- impedir acesso cross-tenant;
- não expor Supabase Secret/Service Role Key ao frontend;
- não expor chave do futuro gateway n8n;
- não versionar segredos;
- validar variáveis de ambiente.

## Próximas etapas

1. implementar `APP-WF019`;
2. integrar primeiro a Agenda como referência;
3. adicionar tratamento padronizado de timeout/erro;
4. registrar auditoria das operações;
5. substituir mocks gradualmente;
6. ampliar testes de integração;
7. realizar hardening de segurança e observabilidade antes de produção.
