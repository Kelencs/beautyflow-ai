# CT008 — WF008 — CLI - Cadastrar Cliente

**Objetivo:** Validar cadastro, prevenção de duplicidade e distinção entre vazio legítimo e erro técnico.

## Rastreabilidade

- **Workflow:** WF008
- **RF/RNF:** RF003
- **Caso de Uso:** UC008
- **User Story:** US008
- **Estado de evidência consolidada em 18/08/2026:** ✅ Validado

## Pré-condições

- CLIENTES disponível.
- Dados sintéticos.

## Cenários

| # | Cenário | Execução | Resultado esperado | Executado |
|---|---|---|---|:---:|
| 1 | Novo cliente | Telefone não cadastrado. | Cria cliente com ID e retorna sucesso. | ☐ |
| 2 | Duplicado | Telefone já cadastrado. | Não cria nova linha. | ☐ |
| 3 | Erro de busca | Apontar busca para recurso inválido controlado. | Erro técnico não é tratado como 'não encontrado'. | ☐ |

## Critérios de aprovação

- nenhum efeito externo indevido;
- status final compatível com o cenário;
- IDs e contexto preservados;
- erro técnico não confundido com regra de negócio;
- evidência registrada para a execução.

## Evidência

Registrar em `../Evidencias/` a data, execution ID do n8n quando disponível, dados sintéticos utilizados e resultado observado.

