# BeautyFlow App — Frontend

Frontend do BeautyFlow App construído com **Next.js (App Router) + TypeScript + Tailwind CSS**.

Workspace: `@beautyflow/frontend`.

Arquitetura do projeto: consulte a documentação em `docs/`.

## Status

O frontend não é mais apenas um scaffold.

Atualmente possui estrutura autenticada e módulos de interface para:

- Dashboard;
- Agenda;
- Clientes;
- Serviços;
- Profissionais;
- Financeiro;
- Comunicação;
- Relatórios;
- IA;
- Configurações.

Também existe landing page pública do BeautyFlow.

Parte das funcionalidades ainda trabalha com dados de demonstração/mock enquanto a integração operacional com o n8n via `APP-WF019` não é concluída.

## Autenticação e autorização

O App utiliza Supabase na camada de autenticação.

A interface pode ocultar ou restringir itens por perfil, porém **a UI não deve ser considerada barreira de segurança**. A autorização efetiva deve permanecer no backend NestJS.

## Desenvolvimento

Execute a partir da raiz do monorepo:

```bash
npm install
npm run dev:frontend
```

Frontend:

```text
http://localhost:3000
```

Para iniciar frontend e backend juntos:

```bash
npm run dev
```

## Scripts

A partir da raiz:

```bash
npm run dev:frontend
npm run build --workspace=@beautyflow/frontend
npm run lint --workspace=@beautyflow/frontend
```

## Integração com backend

O frontend deve consumir o backend NestJS.

Arquitetura esperada:

```text
Next.js
  ↓
NestJS
  ↓
Supabase / APP-WF019
```

O navegador não deve chamar webhooks n8n diretamente.

## Próximas etapas

- conectar telas aos dados operacionais reais;
- substituir mocks de forma progressiva;
- consolidar estados de loading, vazio e erro;
- ampliar testes automatizados;
- validar comportamento por perfil;
- preparar ambiente de demonstração e produção.
