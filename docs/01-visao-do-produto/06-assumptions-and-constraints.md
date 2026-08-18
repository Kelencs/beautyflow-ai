# Assumptions and Constraints

## Premissas
- empresas utilizam WhatsApp como canal relevante;
- horários/serviços/profissionais podem ser parametrizados;
- dados de negócio devem ser isolados por empresa;
- integrações externas podem falhar e devem ter tratamento explícito.

## Restrições atuais
- núcleo operacional ainda depende do Google Sheets;
- WF013–WF015 são subworkflows e precisam de chamador periódico;
- App está na Fase 0A;
- APP-WF019 e EMP-WF021 ainda não existem;
- Supabase/Auth ainda não está implementado;
- configuração multiempresa de produção ainda exige endurecimento em pontos legados dos workflows.

## Restrições de documentação
- não registrar tokens/segredos;
- não usar dados reais de clientes em exemplos;
- não afirmar integração externa validada sem evidência.
