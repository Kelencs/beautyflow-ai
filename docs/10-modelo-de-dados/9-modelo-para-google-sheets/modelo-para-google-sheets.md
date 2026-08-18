# Modelo para Google Sheets

Google Sheets permanece a persistência operacional da fase atual.

## Regras
- não renomear/reordenar colunas sem análise de impacto;
- filtrar por `ID_EMPRESA` quando aplicável;
- diferenciar 0 linhas legítimo de erro técnico;
- preservar `row_number` quando exclusão/update depender dele;
- não usar Sheets como repositório de senha/token.
