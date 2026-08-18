# Requisitos Não Funcionais

**Sincronização:** 18/08/2026

| ID | Tema | Requisito |
|---|---|---|
| RNF001 | Desempenho | Operações síncronas devem ter tempo de resposta monitorado; alvo nominal de até 5 s quando não houver limitação de terceiro. |
| RNF002 | Disponibilidade | Após produção do App, alvo inicial de 99% mensal para componentes controlados pela plataforma, com indisponibilidade de terceiros registrada separadamente. |
| RNF003 | Observabilidade | Execuções relevantes devem produzir logs/saídas suficientes para diagnóstico. |
| RNF004 | Backup | Deve existir rotina de backup e retenção controlada dos dados operacionais suportados. |
| RNF005 | Transporte seguro | Comunicação de produção deve usar HTTPS/TLS. |
| RNF006 | Autenticação | Áreas administrativas do App devem exigir autenticação. |
| RNF007 | Multiempresa | Toda operação deve preservar isolamento lógico por `ID_EMPRESA`; defaults silenciosos não podem causar acesso cross-tenant. |
| RNF008 | Segredos | Tokens, senhas e chaves devem ficar em secret stores/credentials, nunca versionados. |
| RNF009 | Logs de erro | Erros técnicos devem ser registrados sem mascaramento como regra de negócio. |
| RNF010 | Responsividade | A interface web deve ser utilizável em desktop e mobile. |
| RNF011 | Privacidade/LGPD | Coletar e persistir apenas dados necessários, com finalidade e consentimento quando aplicável. |
| RNF012 | Idempotência | Fluxos que geram efeito externo devem prevenir duplicidade conforme chave de negócio. |
| RNF013 | Retry limitado | Retries automáticos devem ser limitados e evitar loops/duplicidade. |
| RNF014 | Auditoria | Ações administrativas e do App devem ser auditáveis. |
| RNF015 | Integridade | Falha parcial entre integrações deve ser detectável e tratada explicitamente. |
| RNF016 | Autorização por papel | Owner, profissional e platform_admin devem ser validados no backend, não apenas escondidos na UI. |
| RNF017 | Recuperação | Rotinas críticas devem permitir reexecução segura quando tecnicamente possível. |
| RNF018 | Escalabilidade | Arquitetura deve permitir crescer de um tenant de teste para múltiplas empresas sem recursos fixos por tenant. |
| RNF019 | Manutenibilidade | Código, workflows e documentação devem ser versionados, nomeados e rastreáveis. |
| RNF020 | Acessibilidade | A UI deve seguir boas práticas de acessibilidade e navegação por teclado; meta formal WCAG deve ser definida antes da release pública. |

## Estado
RNFs são metas/constraints. A presença neste documento não significa que o App já cumpra todos eles — especialmente autenticação, autorização, Supabase e escalabilidade, que pertencem às fases seguintes do App.
