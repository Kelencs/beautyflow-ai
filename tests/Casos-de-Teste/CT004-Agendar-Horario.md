# CT004 — WF004 — AGE - Consultar Disponibilidade

**Objetivo:** Validar cálculo de disponibilidade cruzando serviço, profissional, regras e Calendar.

## Rastreabilidade

- **Workflow:** WF004
- **RF/RNF:** RF008
- **Caso de Uso:** UC002
- **User Story:** US002
- **Estado de evidência consolidada em 18/08/2026:** ⚪ Revalidar evidência consolidada

## Pré-condições

- SERVICOS/PROFISSIONAIS/DISPONIBILIDADES disponíveis.
- Calendar de teste configurado.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Disponibilidade | Data/serviço válidos com horário livre. | Retorna `OK` e `horarios[]`. | ☐ |
| 2 | Sem horários | Ocupar todos os slots válidos. | Retorna `SEM_HORARIOS`. | ☐ |
| 3 | Serviço inexistente | Informar serviço não encontrado. | Retorna `SERVICO_NAO_ENCONTRADO`. | ☐ |
| 4 | Data inválida | Informar data não tratável. | Retorna `DATA_INVALIDA`. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

