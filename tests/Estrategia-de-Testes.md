# Estratégia de Testes — BeautyFlow AI

**Código:** TEST001  
**Versão:** 2.0  
**Data:** 19/08/2026  
**Status:** Ativa  
**Escopo:** WF001–WF018 e integrações do núcleo n8n

## 1. Objetivo

Definir como o BeautyFlow valida qualidade funcional e técnica, evitando:

- erro técnico tratado como regra de negócio;
- perda de correlação multi-item;
- efeitos externos duplicados;
- aprovação sem evidência;
- regressões entre workflows dependentes.

JSON representa comportamento implementado. RF/RNF/RN/UC/US representam intenção do produto.

## 2. Princípios

1. **Evidência antes de status.**
2. **Erro técnico ≠ resultado de negócio.**
3. **Toda correção crítica exige regressão.**
4. **Idempotência em efeitos externos quando aplicável.**
5. **Correlação multi-item obrigatória.**
6. **Dados sintéticos em testes.**
7. **Relatórios históricos permanecem imutáveis.**

## 3. Camadas

### 3.1 Estrutural

Conferir:

- JSON válido;
- trigger;
- nodes;
- conexões;
- `Execute Workflow`;
- credenciais referenciadas;
- `onError`;
- `alwaysOutputData`;
- modo por item/lote;
- campos obrigatórios.

### 3.2 Funcional

Executar caminho principal esperado.

### 3.3 Bloqueio de negócio

Exercitar:

- não encontrado;
- indisponibilidade;
- cancelamento fora da janela;
- valor inválido;
- item já pago;
- cobrança recente;
- limite de tentativas;
- comunicação já enviada;
- agendamento futuro.

### 3.4 Erro técnico

Forçar, de forma controlada:

- aba Sheets inexistente;
- erro Calendar;
- erro Meta;
- erro Drive;
- erro append/update/delete;
- erro sem `pairedItem`.

Confirmar que erro técnico não vira falso:

- “não encontrado”;
- “não elegível”;
- “sem horário”;
- “já processado”.

### 3.5 Regressão

Após fix:

1. repetir erro original;
2. repetir caminho normal;
3. repetir erro técnico relevante;
4. validar efeito externo;
5. validar saída;
6. registrar evidência.

## 4. Múltiplos itens

Testar:

- 0 itens;
- 1 item;
- 2+ itens;
- execuções consecutivas;
- erro global sem `pairedItem`, quando aplicável.

Preservar:

- `ID_EMPRESA`;
- `ID_CLIENTE`;
- `ID_AGENDAMENTO`;
- IDs financeiros;
- IDs de cobrança/follow-up;
- tentativa;
- valor;
- telefone;
- `phone_number_id`.

## 5. Idempotência

Prioridade:

- WF008 — duplicidade;
- WF011 — cobrança;
- WF013 — lembrete;
- WF014 — pesquisa;
- WF015 — follow-up.

Repetição não deve criar efeito externo indevido.

## 6. Contratos entre workflows

Validar:

- WF002 → WF008;
- WF002 → WF003;
- WF005/WF006 → WF004;
- workflows de domínio → WF012;
- workflows com logging → WF017.

## 7. Integrações externas

### WhatsApp / Meta

Validar payload, sucesso, 4xx/5xx, credencial e persistência.

### Gemini

Validar resposta, intenção, erro, retorno vazio/malformado e contexto.

### Calendar

Validar consulta, criação, atualização/reagendamento, cancelamento e erro.

### Sheets

Validar encontrado, zero legítimo, multi-item, busca, append/update/delete, `row_number` e `ID_EMPRESA`.

### Drive

Validar cópia, retenção, erro de cópia/listagem/exclusão e proteção da origem.

## 8. Testes não funcionais

### Segurança

- segredos;
- permissões;
- multiempresa;
- logs;
- LGPD.

### Carga

Roteiros previstos:

- 100 mensagens;
- 1000 mensagens;
- stress.

Não executar carga contra ambiente real sem autorização.

### Aceitação

UAT por persona:

- Cliente;
- Profissional;
- Proprietário;
- Administrador.

## 9. Status

| Status | Critério |
|---|---|
| ✅ Validado | Evidência suficiente |
| 🟡 Parcial | Pendência relevante |
| ⚠️ Externo | Integração/credencial alvo a revalidar |
| ❌ Reprovado | Comportamento divergente |
| ⚪ Revalidar | Evidência consolidada insuficiente |

## 10. Critério de conclusão de um workflow

Para `✅ Validado`, conforme aplicável:

- caminho principal;
- bloqueios críticos;
- erro técnico relevante;
- múltiplos itens;
- idempotência;
- efeito externo;
- saída final;
- regressão;
- evidência;
- CT e matriz sincronizados.

## 11. Fontes

- `tests/Plano-de-Testes.md`
- `tests/Ambiente-de-Testes.md`
- `tests/Matriz-de-Rastreabilidade.md`
- `tests/Casos-de-Teste/`
- `tests/Evidencias/`
- `n8n/workflows/`
- `n8n/documentacao/`
