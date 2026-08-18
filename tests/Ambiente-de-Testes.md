# Ambiente de Testes — BeautyFlow AI

**Código:** TEST003  
**Versão:** 2.0  
**Data:** 18/08/2026  
**Status:** Ambiente de desenvolvimento/testes documentado

## 1. Ambiente utilizado

| Componente | Ambiente |
|---|---|
| Orquestração | n8n Cloud |
| Dados operacionais | Google Sheets — planilha BEAUTYFLOW3.1 |
| Agenda | Google Calendar |
| IA | Google Gemini |
| Comunicação | WhatsApp Cloud API / Meta |
| Backup | Google Drive |
| Timezone predominante | America/Sao_Paulo |

## 2. Google Sheets

Abas operacionais utilizadas pelos workflows atuais incluem:

`AGENDAMENTOS`, `CLIENTES`, `COBRANCAS`, `DISPONIBILIDADES`, `EMPRESAS`, `FOLLOWUPS`, `IA_MEMORIA`, `LEMBRETES`, `LOGS`, `MENSAGENS`, `PAGAMENTOS`, `PESQUISAS`, `PROFISSIONAIS`, `SERVICOS`.

Não registrar credenciais, tokens ou IDs secretos neste documento.

## 3. Google Calendar

WF004–WF007 dependem de Calendar. O JSON atual possui configuração direta do calendário de teste/implementação atual; o teste deve sempre confirmar qual calendário está selecionado antes de criar ou alterar eventos.

## 4. WhatsApp Cloud API

Usar número e credenciais de teste autorizados. Diferenciar:
- erro de lógica do workflow;
- erro de token/credencial;
- limitação do ambiente Meta;
- pendência de configuração de produção.

## 5. Google Gemini

O teste deve validar conteúdo estruturado retornado ao WF002 e comportamento diante de resposta inesperada.

## 6. Google Drive

WF016 cria cópia da planilha e aplica retenção de backups. O teste deve usar pasta/escopo controlado e confirmar que a planilha original não é excluída.

## 7. Dados

- usar dados sintéticos;
- evitar telefone/e-mail reais;
- limpar registros de teste quando necessário;
- preservar evidência suficiente para auditoria.

## 8. Segurança

Credenciais devem permanecer nas credenciais do n8n/secret store. Nunca inserir token real nos arquivos versionados em `tests/`.
