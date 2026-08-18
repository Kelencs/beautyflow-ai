# Teste — Google Sheets

## Objetivo
Validar buscas, append, update e delete utilizados pelos workflows.

## Cenários mínimos
- resultado encontrado;
- zero linhas legítimo;
- múltiplas linhas;
- aba inexistente para erro controlado;
- falha de gravação;
- preservação de `row_number` quando necessário;
- isolamento por `ID_EMPRESA` quando implementado.

## Atenção
`Always Output Data` e `On Error` devem ser avaliados em conjunto para não transformar erro técnico em vazio legítimo.

