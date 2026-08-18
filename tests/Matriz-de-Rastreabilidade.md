# Matriz de Rastreabilidade — BeautyFlow AI

**Código:** TEST002  
**Versão:** 2.0  
**Data:** 18/08/2026  
**Status:** Atualizada para WF001–WF018

## 1. Objetivo

Relacionar implementação, requisitos, casos de uso, user stories, casos de teste e evidência, sem criar vínculos artificiais quando um artefato ainda não existe.

## 2. Matriz principal

| Workflow | Implementação | RF/RNF relacionado | Caso de Uso | User Story | Caso de Teste | Estado da evidência |
|---|---|---|---|---|---|---|
| WF001 | ATD - Receber WhatsApp | RF001 | — | — | CT001 | ⚪ Revalidar evidência consolidada |
| WF002 | ATD - IA Atendimento | RF002, RF003, RF005, RF006, RF007, RF020 | UC005, UC008 | US005, US008 | CT002 | ⚪ Revalidar evidência consolidada |
| WF003 | ATD - Identificar Intenção | RF008, RF009, RF011, RF012 (orquestração) | UC001–UC004 (orquestração) | US001–US004 (orquestração) | CT003 | ⚪ Revalidar evidência consolidada |
| WF004 | AGE - Consultar Disponibilidade | RF008 | UC002 | US002 | CT004 | ⚪ Revalidar evidência consolidada |
| WF005 | AGE - Criar Agendamento | RF009, RF010, RF015 | UC001, UC006 | US001, US006 | CT005 | ⚪ Revalidar evidência consolidada |
| WF006 | AGE - Reagendar | RF011 | UC003 | US003 | CT006 | ⚪ Revalidar evidência consolidada |
| WF007 | AGE - Cancelar Agendamento | RF012, RF016 | UC004 | US004 | CT007 | ⚪ Revalidar evidência consolidada |
| WF008 | CLI - Cadastrar Cliente | RF003 | UC008 | US008 | CT008 | ✅ Validado |
| WF009 | CLI - Atualizar Cliente | RF004 | UC009 | US009 | CT009 | ✅ Validado |
| WF010 | FIN - Registrar Pagamento | GAP: requisito financeiro específico não existe em RF001–RF020 | — | — | CT010 | ✅ Validado |
| WF011 | FIN - Cobrança | GAP: requisito de cobrança não existe em RF001–RF020 | — | — | CT011 | ✅ Validado |
| WF012 | COM - Confirmação/Comunicação | RF010 | UC006 | US006 | CT012 | 🟡 Lógica validada; integração externa deve ser revalidada no ambiente alvo |
| WF013 | COM - Lembrete | RF014 | UC007 | US007 | CT013 | ✅ Validado |
| WF014 | COM - Pesquisa | GAP: RF específico não existe; relacionado a UC012/US012 | UC012 | US012 | CT014 | 🟡 Parcialmente validado; manter pendência explícita até evidência final |
| WF015 | COM - Follow-up | RF019 (parcialmente relacionado) | — | — | CT015 | ✅ Validado em rodada posterior ao relatório de 14/08 |
| WF016 | ADM - Backup | RNF004 | — | — | CT016 | ✅ Validado |
| WF017 | ADM - Logs | RNF003, RNF009 | — | — | CT017 | ✅ Validado |
| WF018 | ADM - Limpeza | RNF009 (parcial); GAP: retenção de 90 dias não está formalizada em RNF | — | — | CT018 | ✅ Validado |

## 3. Leitura da matriz

- `—` = não existe artefato equivalente claro na documentação atual.
- `GAP` = o workflow implementa capacidade relevante que ainda não possui requisito formal correspondente.
- `orquestração` = o workflow encaminha para o responsável; não executa sozinho toda a regra.
- `⚪` = evidência consolidada insuficiente, não reprovação.

## 4. Gaps identificados

### GAP-RF-001 — Pagamentos
WF010 implementa registro transacional e cálculo de saldo, porém RF001–RF020 não possuem requisito financeiro específico.

### GAP-RF-002 — Cobrança
WF011 implementa cobrança automática, janela 09h–18h, 24h entre tentativas e limite de 3, sem RF/UC/US específico equivalente.

### GAP-RF-003 — Pesquisa pós-atendimento
UC012/US012 existem, mas falta RF explícito correspondente.

### GAP-RF-004 — Follow-up
RF019 é apenas parcialmente relacionado; o comportamento de 30/45 dias e idempotência do WF015 merece requisito próprio.

### GAP-RNF-001 — Retenção de logs
WF018 executa retenção de 90 dias, mas a duração não está formalizada nos RNFs atuais.

## 5. Cobertura técnica

- Workflows com caso principal: **18/18**.
- Workflows representados na matriz: **18/18**.
- Workflows com gaps formais de requisito: documentados acima.
- Aprovação de teste: consultar `Evidencias/BeautyFlow-Status-Testes-Workflows-2026-08-18.md`.

## 6. Regra de atualização

Alterar esta matriz sempre que:
- um workflow for criado/removido;
- RF/RNF/UC/US mudar;
- um CT mudar;
- status de evidência mudar.
