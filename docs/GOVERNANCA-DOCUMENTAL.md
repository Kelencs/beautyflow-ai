# Governança Documental

## Princípios

1. **Código executável é fonte do comportamento atual.**
2. **Requisito é fonte da intenção do produto.**
3. Divergência entre os dois é um **gap**, não motivo para apagar silenciosamente a regra.
4. Evidência de teste é a fonte do status de validação.
5. Documentos históricos datados não devem ser reescritos para parecer atuais.
6. IDs de RN são globais; UCs e USs não criam suas próprias RN001/RN002.
7. `docs/09-arquitetura` é a fonte oficial de arquitetura.
8. `tests/` é a fonte oficial de QA e evidências.

## Política de status

- `Implementado`: comportamento existente.
- `Parcial`: parte existente.
- `Backlog`: necessidade aprovada sem implementação.
- `Planejado`: arquitetura/entregável futuro.
- `Gap`: implementação diverge da regra/requisito.
- `Pendente de decisão`: há conflito funcional ainda não resolvido.

## Política de atualização

Mudança em workflow:
1. atualizar `n8n/documentacao`;
2. revisar RF/RN/UC/US;
3. atualizar CT;
4. testar;
5. registrar evidência;
6. atualizar matriz.

Mudança no App:
1. atualizar arquitetura;
2. atualizar modelo de dados;
3. atualizar backlog;
4. atualizar RF/RNF/RN;
5. adicionar testes de backend/frontend.
