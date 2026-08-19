# CT012 — WF012 — COM - Confirmação/Comunicação

**Objetivo:** Validar envio centralizado de texto pela WhatsApp Cloud API, persistência em MENSAGENS e saída padronizada.

## Rastreabilidade

- **Workflow:** WF012
- **RF/RNF:** RF010
- **Caso de Uso:** UC006
- **User Story:** US006
- **Estado de evidência consolidada em 18/08/2026:** 🟡 Lógica validada; integração externa deve ser revalidada no ambiente alvo

## Pré-condições

- Credencial Meta do ambiente de teste válida quando o cenário exigir envio real.
- MENSAGENS disponível.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Envio válido | Telefone e phone_number_id válidos. | Retorna `ENVIADA` e registra tentativa. | ☐ |
| 2 | Validação | Remover telefone ou phone_number_id. | Retorna `ERRO_VALIDACAO` sem POST à Meta. | ☐ |
| 3 | Erro Meta | Usar cenário controlado de falha. | Retorna `ERRO_WHATSAPP` e registra tentativa com erro. | ☐ |
| 4 | Contrato de dados | Executar chamado por outro workflow. | Contexto necessário é devolvido ao chamador. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.
