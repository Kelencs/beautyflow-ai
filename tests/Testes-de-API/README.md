# Testes de API — BeautyFlow AI

Esta pasta documenta cenários de validação das integrações externas utilizadas pelos workflows do BeautyFlow.

## Integrações atuais

| Arquivo | Integração | Uso principal |
|---|---|---|
| `WhatsApp-Cloud-API.md` | WhatsApp Cloud API / Meta | WF001 e WF012 |
| `Google-Gemini.md` | Google Gemini | WF002 |
| `Google-Calendar.md` | Google Calendar | WF004–WF007 |
| `Google-Sheets.md` | Google Sheets | Persistência operacional |
| `Google-Drive.md` | Google Drive | WF016 |

## Diretrizes

Para cada API, validar conforme aplicável:

- autenticação;
- request válido;
- resposta válida;
- 4xx;
- 5xx;
- timeout;
- rate limit/quota;
- payload vazio ou malformado;
- retry controlado;
- persistência do resultado;
- tratamento de erro.

## Segurança

Nunca registrar em documentação/evidência:

- access token;
- API key;
- client secret;
- private key;
- refresh token;
- senha;
- Supabase Secret Key futura.

Utilizar exemplos sintéticos.

## Regra de status

Falha de credencial/ambiente deve ser diferenciada de falha da lógica funcional.

## IA atual

A IA utilizada pelos workflows atuais é **Google Gemini**.

O documento legado de OpenAI foi removido e OpenAI não faz parte da stack operacional atual do BeautyFlow.
