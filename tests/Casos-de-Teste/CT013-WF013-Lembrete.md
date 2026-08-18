
# CT013 — WF013 — COM - Lembrete

**Objetivo:** Validar lembretes de 24h/2h, elegibilidade e idempotência.

## Rastreabilidade

- **Workflow:** WF013
- **RF/RNF:** RF014
- **Caso de Uso:** UC007
- **User Story:** US007
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- Empresa com WhatsApp configurado.
- Agendamentos/clientes/profissionais/serviços sintéticos.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Janela 24h | Agendamento entre 22–26h. | Seleciona lembrete de 24h. | ☐ |
| 2 | Janela 2h | Agendamento entre 1–3h. | Seleciona lembrete de 2h. | ☐ |
| 3 | Já enviado | LEMBRETES possui sucesso para agendamento+tipo. | Não reenvia. | ☐ |
| 4 | Falha anterior | Registro anterior falhou. | Nova tentativa continua permitida. | ☐ |
| 5 | Erro de busca | Forçar falha Sheets. | Retorna `ERRO_LEMBRETE`. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
