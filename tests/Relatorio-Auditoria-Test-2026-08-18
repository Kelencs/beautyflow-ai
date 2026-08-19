# Auditoria da Pasta `tests/` — BeautyFlow AI

**Data de referência:** 18/08/2026  
**Revisão de consolidação:** 19/08/2026  
**Escopo:** documentação, casos, integrações, evidências e rastreabilidade de WF001–WF018.

## 1. Objetivo

Verificar se a pasta `tests/` representa a arquitetura atual do BeautyFlow sem resíduos de tecnologias, workflows ou status incorretos.

## 2. Estrutura oficial

```text
tests/
├── README.md
├── Plano-de-Testes.md
├── Estrategia-de-Testes.md
├── Ambiente-de-Testes.md
├── Matriz-de-Rastreabilidade.md
├── Relatorio-Auditoria-Tests-2026-08-18.md
├── Casos-de-Teste/
├── Evidencias/
├── Testes-de-API/
├── Testes-de-Aceitacao/
├── Testes-de-Carga/
└── Testes-de-Seguranca/
```

## 3. Itens sincronizados

### Casos

CT001–CT018 mapeiam WF001–WF018.

### Matriz

Versão 3.0 cobre:

- RF001–RF025;
- RNF001–RNF020;
- RN001–RN065;
- UC001–UC016;
- US001–US016;
- WF001–WF018;
- CT001–CT018.

### Plano

`Plano-de-Testes.md` atualizado para WF001–WF018.

### Ambiente

`Ambiente-de-Testes.md` atualizado para:

- n8n Cloud;
- BEAUTYFLOW3.1;
- Google Gemini;
- Google Calendar;
- WhatsApp;
- Google Drive.

### APIs

Documentação atual:

- WhatsApp Cloud API;
- Google Gemini;
- Google Calendar;
- Google Sheets;
- Google Drive.

OpenAI não pertence à stack atual.

## 4. Estratégia

`tests/Estrategia-de-Testes.md` deve conter uma estratégia orientada por risco, erro técnico, regressão, multi-item, idempotência, contratos e integrações.

Ela não deve duplicar `Ambiente-de-Testes.md`.

## 5. Evidências

Arquivos oficiais:

```text
tests/Evidencias/
├── README.md
├── BeautyFlow-Documentacao-Testes-Workflows-2026-08-14.md
└── BeautyFlow-Status-Testes-Workflows-2026-08-18.md
```

O relatório de 14/08 permanece histórico e imutável.

A consolidação de 18/08 representa validações posteriores.

## 6. Política de evidência

Workflow não recebe ✅ apenas porque:

- JSON foi atualizado;
- CT existe;
- importação funcionou;
- execução parcial passou.

Aprovação requer evidência suficiente.

## 7. Status consolidado

### Validado

WF008, WF009, WF010, WF011, WF013, WF015, WF016, WF017, WF018.

### Lógica validada / integração externa

WF012.

### Parcial

WF014.

### Revalidar evidência consolidada

WF001–WF007.

Isso não significa reprovação.

## 8. Resíduos que não devem permanecer

- estratégia duplicando Ambiente;
- `Evidencias/readme.md` minúsculo;
- referência a OpenAI como stack atual;
- matriz limitada a WF001–WF010;
- CTs antigos/desalinhados;
- status “validado” sem evidência.

## 9. Critério de fechamento

A pasta `tests/` está documentalmente sincronizada quando:

- Estratégia correta publicada;
- consolidação 18/08 publicada;
- `Evidencias/README.md` publicado;
- `readme.md` legado removido;
- relatório de auditoria com nome correto;
- links do `tests/README.md` resolvem arquivos físicos.

## 10. Próxima revisão

Executar nova auditoria quando:

- um workflow mudar;
- nova integração for incluída;
- BeautyFlow App iniciar novos módulos;
- status WF001–WF007/WF014 mudar.
