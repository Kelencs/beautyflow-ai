# Regras de Negócio

**Numeração global:** RN001–RN065  
**Sincronização:** 18/08/2026

| ID | Regra | Definição |
|---|---|---|
| RN001 | Agenda configurável | Dias de atendimento devem vir das disponibilidades configuradas. |
| RN002 | Horários configuráveis | Faixas de atendimento devem respeitar a configuração operacional. |
| RN003 | Não oferecer horário inválido | Fora da disponibilidade não pode ser oferecido/confirmado. |
| RN004 | Dia sem disponibilidade | Dia sem faixa ativa não recebe novo horário. |
| RN005 | Feriados/bloqueios especiais | Devem bloquear horários quando a feature estiver implementada/configurada. |
| RN006 | Um intervalo, um atendimento | Impedir conflito de ocupação. |
| RN007 | Sem sobreposição | Agendamentos não podem se sobrepor. |
| RN008 | Duração por serviço | Duração do serviço participa do cálculo. |
| RN009 | Intervalo por serviço | Usar `TEMPO_INTERVALO_MIN` configurado, não valor global fixo. |
| RN010 | Consultar antes de confirmar | Disponibilidade deve ser validada antes da criação. |
| RN011 | Antecedência de cancelamento | Usar `TEMPO_CANCELAMENTO_MIN` da empresa. |
| RN012 | Liberar horário cancelado | Cancelado não deve continuar bloqueando como atendimento ativo. |
| RN013 | Motivo do cancelamento | Persistir quando informado. |
| RN014 | Máximo de um reagendamento | Regra de produto mantida como gap até implementação/decisão. |
| RN015 | Reagendamento atualiza registros | Novo horário deve substituir o estado operacional anterior. |
| RN016 | Cadastro de cliente | Cliente novo pode ser criado pelo WF008. |
| RN017 | Atualização parcial | Campos não informados devem ser preservados. |
| RN018 | Primeiro atendimento real | Não confundir cadastro/primeiro contato com atendimento efetivamente realizado. |
| RN019 | Último atendimento real | Para inatividade, considerar histórico real de agendamentos. |
| RN020 | Quantidade de atendimentos | Deve contar atendimentos reais conforme regra formal futura. |
| RN021 | VIP | Critério pendente de decisão única. |
| RN022 | Prioridade VIP | Backlog dependente da RN021. |
| RN023 | Linguagem cordial | Comunicação clara e profissional. |
| RN024 | Não inventar preço | IA deve sinalizar ausência de dado oficial. |
| RN025 | Não inventar horário | IA deve consultar ferramenta. |
| RN026 | Ferramenta antes de confirmar agenda | Dados dinâmicos devem vir da operação. |
| RN027 | Escalonamento humano | Backlog/estratégia do canal quando a IA não puder resolver. |
| RN028 | Criar evento de agenda | Agendamento confirmado deve refletir no Calendar conforme fluxo. |
| RN029 | Atualizar evento no reagendamento | Deve refletir mudança; manter cobertura técnica. |
| RN030 | Refletir cancelamento | Calendar/registro devem refletir cancelamento. |
| RN031 | Persistir agendamento | Registrar no repositório operacional. |
| RN032 | Persistir cancelamento | Registrar status/motivo/dados aplicáveis. |
| RN033 | Registrar comunicações | MENSAGENS/LOGS e tabelas específicas devem preservar tentativas relevantes. |
| RN034 | Lembrete 24h | WF013 avalia a janela técnica próxima de 24h. |
| RN035 | Lembrete 2h | WF013 avalia a janela técnica próxima de 2h. |
| RN036 | Pesquisa pós-atendimento | WF014 envia pesquisa; captura da resposta é outra feature. |
| RN037 | Marketing com consentimento | Follow-up exige autorização; origem do consentimento deve ser confiável. |
| RN038 | IA usa informação oficial | Não usar memória/modelo como fonte de dado operacional. |
| RN039 | Consultar dados dinâmicos | Agenda/financeiro/cliente devem vir de fonte oficial. |
| RN040 | Nunca confirmar sem disponibilidade | Confirmação de horário exige validação. |
| RN041 | Pagamento > 0 | Valor deve ser numérico e positivo. |
| RN042 | Não pagar cancelado | Pagamento não deve ser registrado para agendamento cancelado. |
| RN043 | Pagamento transacional | Cada pagamento legítimo é uma transação histórica. |
| RN044 | Não exceder total devido | Pagamento acumulado não pode ultrapassar o total. |
| RN045 | Estado financeiro por saldo | Saldo >0 = parcial; saldo 0 = pago. |
| RN046 | Cobrança usa estado mais recente | Histórico antigo não pode gerar cobrança se depois houve quitação. |
| RN047 | Cobrar saldo pendente | Somente saldo positivo é elegível. |
| RN048 | Cobrar apenas pendente | Mensagem usa valor pendente. |
| RN049 | 24h entre cobranças | Intervalo mínimo por agendamento. |
| RN050 | Máximo 3 cobranças | Limite por ciclo/agendamento. |
| RN051 | Janela 09h–18h | Cobrança automática somente nessa janela técnica atual. |
| RN052 | Pesquisa 1h–4h | Elegibilidade técnica atual do WF014. |
| RN053 | Idempotência da pesquisa | Pesquisa ENVIADA bloqueia duplicidade. |
| RN054 | Dados relacionados da pesquisa | Cliente/profissional/serviço/configuração devem existir. |
| RN055 | Cliente elegível para follow-up | ATIVO + `ACEITA_MARKETING=SIM`. |
| RN056 | Último atendimento pelo histórico | Derivar de agendamentos passados não cancelados. |
| RN057 | Agendamento futuro bloqueia | Não reengajar quem já tem atendimento futuro. |
| RN058 | Tentativa 1 | 30–33 dias. |
| RN059 | Tentativa 2 | 45–48 dias. |
| RN060 | Máximo 2 follow-ups | Por ciclo de inatividade. |
| RN061 | Idempotência de follow-up | Empresa + cliente + último atendimento + tentativa. |
| RN062 | Backup integral | WF016 cria cópia da planilha. |
| RN063 | Retenção de backup | Backups antigos elegíveis >30 dias após sucesso do atual. |
| RN064 | Logger sem recursão | Falha do WF017 não chama o próprio WF017. |
| RN065 | Retenção de logs | WF018 remove LOGS elegíveis >90 dias. |

## Gaps explícitos
- RN014: não considerar cumprida sem evidência de controle de quantidade no WF006.
- RN018/RN019: revisar semântica dos campos preenchidos no cadastro.
- RN021: definir VIP.
- RN037: revisar a obtenção de consentimento no cadastro.

UCs e USs apenas referenciam estes IDs; não criam RNs locais.
