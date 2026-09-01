# App — WF019

> **Sincronização:** 2026-08-31
> **Fonte de verdade:** JSON desta pasta.

## Objetivo

Camada de integração entre o backend NestJS do BeautyFlow App e os dados operacionais do
n8n — nunca um endpoint do App chamando WF001–WF018 diretamente, nunca o browser
conhecendo n8n. Ver `docs/09-arquitetura/` para o desenho completo aprovado.

## Workflows

| ID | Função | `active` no JSON |
|---|---|---|
| WF019 | Gateway App (Fase 2: `clientes.listar` + `servicos.listar`) | `false` |

## Dependências

```text
WF019 (não chama nenhum WF001–WF018)
```

WF019 é deliberadamente isolado do pipeline conversacional (WF001→WF002→WF003→...). Lê
`CLIENTES`/`SERVICOS` diretamente via Google Sheets, com o mesmo credential já usado
pelos demais workflows (`Google Sheets account`) — não uma credencial nova.

## Integrações diretas

- Google Sheets (`CLIENTES`, `SERVICOS`; leitura filtrada por `ID_EMPRESA`).
- Nenhuma integração com WhatsApp, Gemini, Google Calendar ou Google Drive.

## WF019 — Gateway App

Responsabilidades:

- autenticar a chamada via Header Auth do próprio Webhook (`X-BeautyFlow-Gateway-Key`),
  antes de qualquer acesso a dado;
- validar o envelope de requisição (`operacao`/`idEmpresa`/`requestId`/`dados`);
- rejeitar operação desconhecida com `INVALID_OPERATION` (só `clientes.listar` e
  `servicos.listar` existem);
- rotear por `SWITCH - Operação` para o branch correspondente;
- filtrar `CLIENTES`/`SERVICOS` por `ID_EMPRESA` (defesa em profundidade — o NestJS já
  filtra por tenant antes de chamar o gateway, mas o próprio workflow nunca confia
  cegamente nisso);
- normalizar a linha do Sheets para um shape de integração mínimo, sem `ID_EMPRESA` nem
  colunas técnicas;
- devolver um envelope padrão `{ok, data|error, meta:{requestId}}`.

### Comportamentos atuais conhecidos (gaps documentados, não corrigidos aqui)

- A aba `CLIENTES`, sozinha, não tem coluna para "próximo atendimento" nem totais de
  atendimento/gasto — esses campos do contrato público `Cliente` do App usam `null`
  (nunca `0`/`[]` fabricado) pelo NestJS quando a fonte é `n8n`.
- `historico` de `GET /clientes/:id` fica `null` no modo `n8n` — dependeria de
  `AGENDAMENTOS`, fora de escopo.
- A aba `SERVICOS` **tem** coluna `DESCRICAO` (corrigido — uma premissa anterior de que
  não existia estava errada) e `servicos.listar` já mapeia `Servico.descricao` a partir
  dela (`null` só quando realmente vazia/ausente, nunca fabricada). `CATEGORIA`,
  `TEMPO_INTERVALO_MIN`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` existem na aba real mas
  não fazem parte do contrato público `Servico` — decisão de escopo, não lidas por
  `servicos.listar`.
- O fallback `EMP001`, o Google Calendar fixo por instância e o descompasso de
  vocabulário de status de `AGENDAMENTOS` (documentados na auditoria arquitetural
  anterior) **não são tocados por este workflow** e continuam como pendências futuras.

## Regras

- nunca aceitar `idEmpresa` de uma fonte que não seja o NestJS já autenticado;
- nunca devolver segredo, token, `phone_number_id`, credencial ou payload bruto do Sheets;
- nunca cair silenciosamente em nenhum "modo mock" — esse conceito existe só do lado
  NestJS (`DATA_SOURCE_CLIENTES`/`DATA_SOURCE_SERVICOS`), não aqui;
- qualquer operação nova exige atualizar `SWITCH - Operação`, `OPERACOES_SUPORTADAS` em
  `CODE - Validar Envelope`, e o fluxo real — nunca só documentar uma operação que o JSON
  não implementa.

## Documentação

- `n8n/documentacao/app/`
- `docs/09-arquitetura/`
