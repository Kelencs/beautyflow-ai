# Requisitos Funcionais

**Sincronização:** 18/08/2026

| ID | Requisito | Status | Implementação |
|---|---|---|---|
| RF001 | Receber mensagens via WhatsApp | Implementado | WF001 |
| RF002 | Identificar cliente | Implementado | WF002 |
| RF003 | Cadastrar novo cliente | Implementado | WF002 → WF008 |
| RF004 | Atualizar cadastro do cliente | Implementado | WF009 |
| RF005 | Informar serviços | Parcial | WF002 |
| RF006 | Informar preços | Parcial | WF002 |
| RF007 | Informar duração | Parcial | WF002 |
| RF008 | Consultar disponibilidade | Implementado | WF004 |
| RF009 | Criar agendamento | Implementado | WF005 |
| RF010 | Enviar confirmação do agendamento | Implementado | WF005 → WF012 |
| RF011 | Reagendar atendimento | Implementado com gap | WF006 |
| RF012 | Cancelar atendimento | Implementado | WF007 |
| RF013 | Consultar próximo agendamento | Backlog | — |
| RF014 | Enviar lembretes | Parcial | WF013 → WF012 |
| RF015 | Registrar agendamentos | Implementado | WF005 |
| RF016 | Registrar cancelamentos | Implementado | WF007 |
| RF017 | Identificar cliente VIP | Pendente de decisão | — |
| RF018 | Consultar histórico do cliente | Backlog | — |
| RF019 | Enviar campanhas genéricas | Backlog / parcial | WF015 cobre apenas reengajamento |
| RF020 | Responder FAQ com IA | Parcial | WF002 |
| RF021 | Registrar pagamento | Implementado | WF010 |
| RF022 | Executar cobrança automática | Implementado | WF011 → WF012 |
| RF023 | Enviar pesquisa pós-atendimento | Parcial | WF014 → WF012 |
| RF024 | Reengajar cliente inativo | Parcial | WF015 → WF012 |
| RF025 | Registrar resposta da avaliação | Backlog | — |

## Notas de escopo

- RF005–RF007/RF020: a IA existe, mas dados de negócio não devem ser descritos como consulta estruturada quando a ferramenta não estiver explícita.
- RF011: RN014 permanece como gap.
- RF014/RF023/RF024: lógica existe, mas WF013–WF015 são subworkflows e dependem de orquestração.
- RF017: regra de VIP precisa de decisão única.
- RF019: follow-up não equivale a motor genérico de campanhas.
- RF025: WF014 envia a pesquisa; captura da resposta ainda é backlog.

## Regra
Funcionalidade implementada sem requisito deve gerar RF novo; requisito sem implementação permanece Backlog/Gap, não deve ser apagado.
