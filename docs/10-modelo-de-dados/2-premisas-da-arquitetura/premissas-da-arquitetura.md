# Premissas da Arquitetura de Dados
1. Sheets é a fonte operacional da fase atual.
2. Supabase não replica AGENDAMENTOS/CLIENTES/PAGAMENTOS nesta fase.
3. IDs entre App e Sheets são referências lógicas.
4. `ID_EMPRESA` deve acompanhar operações tenant-scoped.
5. schema físico deve ser validado contra a fonte real antes de alteração.
