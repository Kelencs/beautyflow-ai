# Matriz de Rastreabilidade — BeautyFlow AI

**Projeto:** BeautyFlow AI  
**Documento:** Requirements Traceability Matrix (RTM)  
**Código:** TEST002  
**Versão:** 3.0  
**Data:** 18/08/2026  
**Status:** Ativa e sincronizada com a documentação 3.0

---

## Histórico de Alterações

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 28/07/2026 | Criação inicial com REQ001–REQ010 e WF001–WF010. |
| 2.0 | 18/08/2026 | Expansão preliminar para WF001–WF018. |
| 3.0 | 18/08/2026 | Sincronização final com RF001–RF025, RNF001–RNF020, RN001–RN065, UC001–UC016, US001–US016 e CT001–CT018. |

---

## 1. Objetivo

Garantir rastreabilidade bidirecional entre intenção de produto, regras, implementação e validação.

A cadeia oficial do BeautyFlow é:

```text
Visão / Backlog
      ↓
RF / RNF
      ↓
RN global
      ↓
UC
      ↓
US
      ↓
WF / BeautyFlow App
      ↓
CT
      ↓
Evidência
```

A matriz não considera um item "coberto" apenas porque existe um workflow. Requisitos em **Backlog**, **Parcial**, **Pendente de decisão** ou **Gap** permanecem explicitamente com lacunas até que a implementação e a evidência correspondentes existam.

---

## 2. Fontes oficiais

| Tema | Fonte |
|---|---|
| Requisitos Funcionais | `docs/02-requisitos-funcionais/README.md` |
| Requisitos Não Funcionais | `docs/03-requisitos-nao-funcionais/README.md` |
| Regras de Negócio | `docs/04-regras-de-negocio/README.md` |
| Casos de Uso | `docs/06-casos-de-uso/` |
| User Stories | `docs/07-user-stories/` |
| Product Backlog | `docs/08-product-backlog/` |
| Arquitetura | `docs/09-arquitetura/` |
| Workflows | `n8n/workflows/` |
| Documentação dos Workflows | `n8n/documentacao/` |
| Casos de Teste | `tests/Casos-de-Teste/` |
| Evidências | `tests/Evidencias/` |

---

## 3. Legenda de status

| Status | Significado |
|---|---|
| ✅ Implementado / Validado | Implementação/evidência suficiente para o escopo declarado. |
| 🟡 Parcial | Parte da funcionalidade ou validação permanece pendente. |
| ⚪ Revalidar | Não há evidência consolidada suficiente na matriz para declarar aprovação. |
| Backlog | Requisito válido sem implementação atual. |
| Gap | Implementação diverge de requisito/regra conhecida. |
| Pendente de decisão | Falta decisão formal de produto. |
| Planejado | Arquitetura/feature aprovada, ainda não implementada. |

---

# 4. Matriz — Requisitos Funcionais

| RF | Requisito | UC | US | Implementação | CT | Status |
|---|---|---|---|---|---|---|
| RF001 | Receber mensagens via WhatsApp | — | — | WF001 | CT001 | Implementado |
| RF002 | Identificar cliente | UC001, UC008 | US001, US008 | WF002 | CT002 | Implementado |
| RF003 | Cadastrar novo cliente | UC008 | US008 | WF002 → WF008 | CT008 | Implementado |
| RF004 | Atualizar cadastro do cliente | UC009 | US009 | WF009 | CT009 | Implementado |
| RF005 | Informar serviços | UC005 | US005 | WF002 | CT002 | Parcial |
| RF006 | Informar preços | UC005 | US005 | WF002 | CT002 | Parcial |
| RF007 | Informar duração | UC005 | US005 | WF002 | CT002 | Parcial |
| RF008 | Consultar disponibilidade | UC002 | US002 | WF004 | CT004 | Implementado |
| RF009 | Criar agendamento | UC001 | US001 | WF005 | CT005 | Implementado |
| RF010 | Enviar confirmação do agendamento | UC006 | US006 | WF005 → WF012 | CT012 | Implementado |
| RF011 | Reagendar atendimento | UC003 | US003 | WF006 | CT006 | Implementado com gap RN014 |
| RF012 | Cancelar atendimento | UC004 | US004 | WF007 | CT007 | Implementado |
| RF013 | Consultar próximo agendamento | — | — | — | — | Backlog |
| RF014 | Enviar lembretes | UC007 | US007 | WF013 → WF012 | CT013 | Parcial — depende de orquestração |
| RF015 | Registrar agendamentos | UC001 | US001 | WF005 | CT005 | Implementado |
| RF016 | Registrar cancelamentos | UC004 | US004 | WF007 | CT007 | Implementado |
| RF017 | Identificar cliente VIP | — | — | — | — | Pendente de decisão |
| RF018 | Consultar histórico do cliente | UC010 | US010 | App futuro | — | Backlog |
| RF019 | Enviar campanhas genéricas | UC016 (somente reengajamento) | US016 (somente reengajamento) | WF015 cobre apenas follow-up | CT015 | Backlog / parcial |
| RF020 | Responder FAQ com IA | UC005 | US005 | WF002 | CT002 | Parcial |
| RF021 | Registrar pagamento | UC013 | US013 | WF010 | CT010 | Implementado |
| RF022 | Executar cobrança automática | UC014 | US014 | WF011 → WF012 | CT011 | Implementado |
| RF023 | Enviar pesquisa pós-atendimento | UC015 | US015 | WF014 → WF012 | CT014 | Parcial — depende de orquestração |
| RF024 | Reengajar cliente inativo | UC016 | US016 | WF015 → WF012 | CT015 | Parcial — depende de orquestração |
| RF025 | Registrar resposta da avaliação | UC012 | US012 | — | — | Backlog |


### Cobertura funcional

- RFs documentados: **25/25**.
- RFs com implementação completa declarada: **12**.
- RF implementado com gap: **1** (`RF011`).
- RFs parciais: **7** (`RF005`, `RF006`, `RF007`, `RF014`, `RF020`, `RF023`, `RF024`).
- Backlog puro: **3** (`RF013`, `RF018`, `RF025`).
- Pendente de decisão: **1** (`RF017`).
- Backlog/parcial: **1** (`RF019`).

---

# 5. Matriz — Requisitos Não Funcionais

| RNF | Tema | Implementação/Componente | Validação | Estado |
|---|---|---|---|---|
| RNF001 | Desempenho | WFs síncronos / App futuro | Testes de carga/performance | Parcial / meta contínua |
| RNF002 | Disponibilidade | App futuro + integrações | Monitoramento futuro | Planejado |
| RNF003 | Observabilidade | WF017 + saídas dos WFs | CT017 + evidências | Implementado parcialmente |
| RNF004 | Backup | WF016 | CT016 | Implementado |
| RNF005 | Transporte seguro | HTTPS/TLS das plataformas | Testes de segurança | Dependente de ambiente |
| RNF006 | Autenticação | BeautyFlow App | Testes de autenticação | Planejado |
| RNF007 | Multiempresa | WFs com ID_EMPRESA + App | Testes de isolamento | Gap/hardening necessário |
| RNF008 | Segredos | n8n Credentials + backend futuro | Testes de segurança | Prática obrigatória |
| RNF009 | Logs de erro | WF017 + tratamento local | CT017 | Implementado parcialmente |
| RNF010 | Responsividade | Frontend App | UAT/mobile | Planejado |
| RNF011 | Privacidade/LGPD | WFs + App | Testes de segurança/aceite | Parcial / contínuo |
| RNF012 | Idempotência | WF008, WF011, WF013, WF014, WF015 | CT008, CT011, CT013–CT015 | Implementado nos fluxos aplicáveis |
| RNF013 | Retry limitado | Integrações / App futuro | Testes de API | Parcial |
| RNF014 | Auditoria | WF017 + auditoria_app futura | CT017 + testes App | Parcial |
| RNF015 | Integridade | WFs com múltiplas integrações | CTs funcionais + erro técnico | Parcial / contínuo |
| RNF016 | Autorização por papel | Backend App | Testes de permissões | Planejado |
| RNF017 | Recuperação | WFs idempotentes + App | Regressão/reexecução | Parcial |
| RNF018 | Escalabilidade | App + hardening n8n | Carga/multiempresa | Planejado / gap atual |
| RNF019 | Manutenibilidade | Git + docs + tests | Auditoria documental | Implementado como processo |
| RNF020 | Acessibilidade | Frontend App | UAT/acessibilidade | Planejado |


> RNFs descrevem metas e restrições. Nem todos devem possuir UC/US próprios. Para requisitos de plataforma, a rastreabilidade pode terminar em arquitetura, código, CT técnico e evidência.

---

# 6. Matriz — Regras de Negócio

| RN | Regra | Implementação | CT | Estado |
|---|---|---|---|---|
| RN001 | Agenda configurável | WF004 | CT004 | Implementado |
| RN002 | Horários configuráveis | WF004 | CT004 | Implementado |
| RN003 | Não oferecer horário inválido | WF004 | CT004 | Implementado |
| RN004 | Dia sem disponibilidade | WF004 | CT004 | Implementado |
| RN005 | Feriados/bloqueios especiais | — | — | Backlog/Gap |
| RN006 | Um intervalo, um atendimento | WF004/WF005 | CT004/CT005 | Implementado |
| RN007 | Sem sobreposição | WF004/WF005 | CT004/CT005 | Implementado |
| RN008 | Duração por serviço | WF004 | CT004 | Implementado |
| RN009 | Intervalo por serviço | WF004 | CT004 | Implementado |
| RN010 | Consultar antes de confirmar | WF004/WF005 | CT004/CT005 | Implementado |
| RN011 | Antecedência de cancelamento | WF007 | CT007 | Implementado |
| RN012 | Liberar horário cancelado | WF007 | CT007 | Implementado no fluxo |
| RN013 | Motivo do cancelamento | WF007 | CT007 | Implementado quando informado |
| RN014 | Máximo de um reagendamento | WF006 | CT006 | Gap de implementação |
| RN015 | Reagendamento atualiza registros | WF006 | CT006 | Implementação a validar |
| RN016 | Cadastro de cliente | WF008 | CT008 | Implementado |
| RN017 | Atualização parcial | WF009 | CT009 | Implementado |
| RN018 | Primeiro atendimento real | WF008 | CT008 | Gap semântico |
| RN019 | Último atendimento real | WF015 / histórico AGENDAMENTOS | CT015 | Gap semântico no cadastro; follow-up usa histórico |
| RN020 | Quantidade de atendimentos | — | — | A validar |
| RN021 | VIP | — | — | Pendente de decisão |
| RN022 | Prioridade VIP | — | — | Backlog |
| RN023 | Linguagem cordial | WF002/WF012 | CT002/CT012 | Regra de atendimento |
| RN024 | Não inventar preço | WF002 | CT002 | Regra obrigatória / parcial |
| RN025 | Não inventar horário | WF002/WF004 | CT002/CT004 | Implementado como princípio |
| RN026 | Ferramenta antes de confirmar agenda | WF003/WF004/WF005 | CT003/CT004/CT005 | Implementado |
| RN027 | Escalonamento humano | — | — | Backlog/Parcial |
| RN028 | Criar evento de agenda | WF005 | CT005 | Implementado |
| RN029 | Atualizar evento no reagendamento | WF006 | CT006 | Implementação a validar |
| RN030 | Refletir cancelamento | WF007 | CT007 | Implementado no fluxo |
| RN031 | Persistir agendamento | WF005 | CT005 | Implementado |
| RN032 | Persistir cancelamento | WF007 | CT007 | Implementado |
| RN033 | Registrar comunicações | WF012/WF017 | CT012/CT017 | Implementado parcialmente |
| RN034 | Lembrete 24h | WF013 | CT013 | Implementado como subworkflow |
| RN035 | Lembrete 2h | WF013 | CT013 | Implementado como subworkflow |
| RN036 | Pesquisa pós-atendimento | WF014 | CT014 | Parcial — emissão implementada |
| RN037 | Marketing com consentimento | WF015 / origem no WF008 | CT015/CT008 | Implementado com gap de origem do consentimento |
| RN038 | IA usa informação oficial | WF002 | CT002 | Regra obrigatória / parcial |
| RN039 | Consultar dados dinâmicos | WF002 + WFs de domínio | CT002 + CTs de domínio | Implementado por domínio |
| RN040 | Nunca confirmar sem disponibilidade | WF004/WF005 | CT004/CT005 | Implementado |
| RN041 | Pagamento > 0 | WF010 | CT010 | Implementado |
| RN042 | Não pagar cancelado | WF010 | CT010 | Implementado |
| RN043 | Pagamento transacional | WF010 | CT010 | Implementado |
| RN044 | Não exceder total devido | WF010 | CT010 | Implementado |
| RN045 | Estado financeiro por saldo | WF010 | CT010 | Implementado |
| RN046 | Cobrança usa estado mais recente | WF011 | CT011 | Implementado |
| RN047 | Cobrar saldo pendente | WF011 | CT011 | Implementado |
| RN048 | Cobrar apenas pendente | WF011 | CT011 | Implementado |
| RN049 | 24h entre cobranças | WF011 | CT011 | Implementado |
| RN050 | Máximo 3 cobranças | WF011 | CT011 | Implementado |
| RN051 | Janela 09h–18h | WF011 | CT011 | Implementado |
| RN052 | Pesquisa 1h–4h | WF014 | CT014 | Implementado |
| RN053 | Idempotência da pesquisa | WF014 | CT014 | Implementado |
| RN054 | Dados relacionados da pesquisa | WF014 | CT014 | Implementado |
| RN055 | Cliente elegível para follow-up | WF015 | CT015 | Implementado |
| RN056 | Último atendimento pelo histórico | WF015 | CT015 | Implementado |
| RN057 | Agendamento futuro bloqueia | WF015 | CT015 | Implementado |
| RN058 | Tentativa 1 | WF015 | CT015 | Implementado |
| RN059 | Tentativa 2 | WF015 | CT015 | Implementado |
| RN060 | Máximo 2 follow-ups | WF015 | CT015 | Implementado |
| RN061 | Idempotência de follow-up | WF015 | CT015 | Implementado |
| RN062 | Backup integral | WF016 | CT016 | Implementado |
| RN063 | Retenção de backup | WF016 | CT016 | Implementado |
| RN064 | Logger sem recursão | WF017 | CT017 | Implementado |
| RN065 | Retenção de logs | WF018 | CT018 | Implementado |


### Gaps de RN que exigem acompanhamento

- **RN014:** limite de um reagendamento ainda não deve ser tratado como implementado sem evidência explícita no WF006.
- **RN018/RN019:** semântica de primeiro/último atendimento precisa permanecer separada de cadastro/contato.
- **RN021:** critério de VIP ainda depende de decisão de produto.
- **RN037:** o WF015 exige consentimento, porém a origem/default desse consentimento precisa ser confiável.

---

# 7. Matriz — Casos de Uso

| UC | Caso de Uso | Status | RF | US | Implementação | CT |
|---|---|---|---|---|---|---|
| UC001 | Agendar Atendimento | Implementado | RF001–RF003, RF008–RF010, RF015 | US001 | WF001/WF002/WF003/WF004/WF005/WF008/WF012 | CT001–CT005, CT008, CT012 |
| UC002 | Consultar Horários Disponíveis | Implementado | RF008 | US002 | WF001/WF002/WF003/WF004 | CT001–CT004 |
| UC003 | Reagendar Atendimento | Implementado com gap RN014 | RF011 | US003 | WF001/WF002/WF003/WF004/WF006/WF012 | CT003/CT004/CT006/CT012 |
| UC004 | Cancelar Atendimento | Implementado | RF012, RF016 | US004 | WF001/WF002/WF003/WF007/WF012 | CT003/CT007/CT012 |
| UC005 | Consultar Serviços, Preços e Duração | Parcial | RF005–RF007, RF020 | US005 | WF001/WF002 | CT001/CT002 |
| UC006 | Receber Confirmação do Agendamento | Implementado | RF010 | US006 | WF005/WF012 | CT005/CT012 |
| UC007 | Receber Lembretes | Parcial | RF014 | US007 | WF013/WF012 | CT013/CT012 |
| UC008 | Cadastrar Cliente | Implementado | RF003 | US008 | WF002/WF008 | CT002/CT008 |
| UC009 | Atualizar Cadastro | Implementado | RF004 | US009 | WF009 | CT009 |
| UC010 | Consultar Histórico | Backlog | RF018 | US010 | App futuro | — |
| UC011 | Lista de Espera | Backlog | RF específico futuro | US011 | — | — |
| UC012 | Registrar Avaliação Recebida | Backlog | RF025 | US012 | — | — |
| UC013 | Registrar Pagamento | Implementado | RF021 | US013 | WF010 | CT010 |
| UC014 | Executar Cobrança Automática | Implementado | RF022 | US014 | WF011/WF012/WF017 | CT011/CT012/CT017 |
| UC015 | Enviar Pesquisa Pós-Atendimento | Parcial | RF023 | US015 | WF014/WF012/WF017 | CT014/CT012/CT017 |
| UC016 | Reengajar Cliente Inativo | Parcial | RF024; relação parcial RF019 | US016 | WF015/WF012/WF017 | CT015/CT012/CT017 |


---

# 8. Matriz — User Stories

| US | User Story | Status | UC | RF | Implementação | CT |
|---|---|---|---|---|---|---|
| US001 | Agendar atendimento | Implementado | UC001 | RF001–RF003, RF008–RF010, RF015 | WF001–WF005, WF008, WF012 | CT001–CT005, CT008, CT012 |
| US002 | Consultar horários | Implementado | UC002 | RF008 | WF001–WF004 | CT001–CT004 |
| US003 | Reagendar atendimento | Implementado com gap RN014 | UC003 | RF011 | WF003/WF004/WF006/WF012 | CT003/CT004/CT006/CT012 |
| US004 | Cancelar atendimento | Implementado | UC004 | RF012, RF016 | WF003/WF007/WF012 | CT003/CT007/CT012 |
| US005 | Consultar serviços/preços | Parcial | UC005 | RF005–RF007, RF020 | WF002 | CT002 |
| US006 | Receber confirmação | Implementado | UC006 | RF010 | WF005/WF012 | CT005/CT012 |
| US007 | Receber lembretes | Parcial | UC007 | RF014 | WF013/WF012 | CT013/CT012 |
| US008 | Cadastrar cliente | Implementado | UC008 | RF003 | WF002/WF008 | CT002/CT008 |
| US009 | Atualizar cadastro | Implementado | UC009 | RF004 | WF009 | CT009 |
| US010 | Consultar histórico | Backlog | UC010 | RF018 | App futuro | — |
| US011 | Entrar em lista de espera | Backlog | UC011 | RF futuro | — | — |
| US012 | Registrar avaliação | Backlog | UC012 | RF025 | — | — |
| US013 | Registrar pagamento | Implementado | UC013 | RF021 | WF010 | CT010 |
| US014 | Cobrar saldo pendente | Implementado | UC014 | RF022 | WF011/WF012 | CT011/CT012 |
| US015 | Receber pesquisa | Parcial | UC015 | RF023 | WF014/WF012 | CT014/CT012 |
| US016 | Reengajar cliente inativo | Parcial | UC016 | RF024 | WF015/WF012 | CT015/CT012 |


---

# 9. Matriz — Workflows WF001–WF018

| WF | Nome | RF/RNF | UC | US | CT | Evidência consolidada |
|---|---|---|---|---|---|---|
| WF001 | ATD — Receber WhatsApp | RF001 | UC001/UC002/UC005 | US001/US002/US005 | CT001 | ⚪ Revalidar evidência consolidada |
| WF002 | ATD — IA Atendimento | RF002, RF003, RF005–RF007, RF020 | UC001/UC005/UC008 | US001/US005/US008 | CT002 | ⚪ Revalidar evidência consolidada |
| WF003 | ATD — Identificar Intenção | Orquestra RF008–RF012 | UC001–UC004 | US001–US004 | CT003 | ⚪ Revalidar evidência consolidada |
| WF004 | AGE — Consultar Disponibilidade | RF008 | UC001/UC002/UC003 | US001/US002/US003 | CT004 | ⚪ Revalidar evidência consolidada |
| WF005 | AGE — Criar Agendamento | RF009, RF010, RF015 | UC001/UC006 | US001/US006 | CT005 | ⚪ Revalidar evidência consolidada |
| WF006 | AGE — Reagendar | RF011 | UC003 | US003 | CT006 | ⚪ Revalidar evidência consolidada |
| WF007 | AGE — Cancelar | RF012, RF016 | UC004 | US004 | CT007 | ⚪ Revalidar evidência consolidada |
| WF008 | CLI — Cadastrar Cliente | RF003 | UC008 | US008 | CT008 | ✅ Validado |
| WF009 | CLI — Atualizar Cliente | RF004 | UC009 | US009 | CT009 | ✅ Validado |
| WF010 | FIN — Registrar Pagamento | RF021 | UC013 | US013 | CT010 | ✅ Validado |
| WF011 | FIN — Cobrança | RF022 | UC014 | US014 | CT011 | ✅ Validado |
| WF012 | COM — Comunicação WhatsApp | RF010 + suporte RF014/RF022–RF024 | UC006/UC007/UC014–UC016 | US006/US007/US014–US016 | CT012 | 🟡 Lógica validada; revalidar integração Meta no ambiente alvo |
| WF013 | COM — Lembrete | RF014 | UC007 | US007 | CT013 | ✅ Validado |
| WF014 | COM — Pesquisa | RF023 | UC015 | US015 | CT014 | 🟡 Parcial — cenário técnico pendente na consolidação |
| WF015 | COM — Follow-up | RF024; parcial RF019 | UC016 | US016 | CT015 | ✅ Validado em rodada posterior |
| WF016 | ADM — Backup | RNF004 / RN062–RN063 | Processo técnico | — | CT016 | ✅ Validado |
| WF017 | ADM — Logs | RNF003/RNF009/RNF014 / RN064 | Processo técnico | — | CT017 | ✅ Validado |
| WF018 | ADM — Limpeza | RN065 / retenção | Processo técnico | — | CT018 | ✅ Validado |


### Indicadores de workflow

- Workflows versionados: **18/18**.
- Workflows com CT principal definido: **18/18**.
- Evidência consolidada classificada como validada: **9/18**.
- Evidência parcial/integração a revalidar: **2/18**.
- Revalidar evidência consolidada: **7/18**.

> A classificação acima não afirma que WF001–WF007 falharam; apenas evita marcar aprovação sem evidência consolidada suficiente nesta matriz.

---

# 10. Relação CT001–CT018

| CT | Workflow principal | Objetivo |
|---|---|---|
| CT001 | WF001 | Webhook/entrada WhatsApp |
| CT002 | WF002 | Atendimento com IA e contexto |
| CT003 | WF003 | Roteamento de intenção |
| CT004 | WF004 | Consulta de disponibilidade |
| CT005 | WF005 | Criação de agendamento |
| CT006 | WF006 | Reagendamento |
| CT007 | WF007 | Cancelamento |
| CT008 | WF008 | Cadastro e duplicidade |
| CT009 | WF009 | Atualização parcial |
| CT010 | WF010 | Registro de pagamento |
| CT011 | WF011 | Cobrança automática |
| CT012 | WF012 | Comunicação WhatsApp |
| CT013 | WF013 | Lembretes |
| CT014 | WF014 | Pesquisa pós-atendimento |
| CT015 | WF015 | Follow-up/reengajamento |
| CT016 | WF016 | Backup e retenção |
| CT017 | WF017 | Logging central |
| CT018 | WF018 | Limpeza/retenção de LOGS |

---

# 11. Critério de cobertura

## 11.1 Requisito funcional implementado

Um RF é considerado **totalmente rastreável** quando possui, conforme aplicável:

- definição funcional;
- regras globais relacionadas;
- UC;
- US;
- implementação;
- CT;
- evidência.

## 11.2 Requisito em backlog

Um RF de backlog pode legitimamente não ter workflow ou CT. A lacuna deve aparecer como `—` e o status deve permanecer `Backlog`.

## 11.3 Requisito não funcional

RNFs podem ser rastreados para:

```text
RNF
 ↓
Arquitetura / Configuração / Código
 ↓
Teste técnico / segurança / carga / aceite
 ↓
Evidência
```

Não é obrigatório inventar UC/US para um RNF técnico.

---

# 12. Cobertura e lacunas conhecidas

## Cobertura documental

| Artefato | Cobertura |
|---|---:|
| RF | 25/25 |
| RNF | 20/20 |
| RN | 65/65 |
| UC | 16/16 |
| US | 16/16 |
| WF | 18/18 |
| CT principal por WF | 18/18 |

## Lacunas funcionais declaradas

1. consulta do próximo agendamento;
2. histórico no App;
3. lista de espera;
4. captura da resposta/nota da avaliação;
5. definição de VIP;
6. campanhas genéricas;
7. fechamento da RN014;
8. origem confiável do consentimento de marketing.

## Lacunas arquiteturais declaradas

1. Supabase/Auth ainda planejado;
2. APP-WF019 ainda planejado;
3. EMP-WF021 ainda planejado;
4. endurecimento multiempresa antes da escala SaaS;
5. orquestração periódica dos WF013–WF015.

---

# 13. Política de atualização

Atualizar esta matriz quando houver:

- inclusão/alteração de RF ou RNF;
- nova RN ou mudança de regra;
- criação/alteração de UC ou US;
- mudança de workflow;
- criação de CT;
- nova evidência de teste;
- mudança de status de backlog/implementação;
- decisão arquitetural que altere a rastreabilidade.

Documentos históricos de evidência permanecem imutáveis; mudanças de estado devem gerar nova evidência datada.

---

# 14. Aprovação

| Papel | Responsável | Status |
|---|---|---|
| Product Owner | __________________ | ☐ |
| QA | __________________ | ☐ |
| Desenvolvimento | __________________ | ☐ |
| Stakeholder | __________________ | ☐ |

---

## Anexo A — Siglas

| Sigla | Significado |
|---|---|
| RF | Requisito Funcional |
| RNF | Requisito Não Funcional |
| RN | Regra de Negócio |
| UC | Caso de Uso |
| US | User Story |
| WF | Workflow n8n |
| CT | Caso de Teste |
| RTM | Requirements Traceability Matrix |

---

**Fim do documento**
