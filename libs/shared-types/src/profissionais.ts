/**
 * Contrato de GET /profissionais e GET /profissionais/:id (backend NestJS). Mesmo
 * espírito de agenda.ts/clientes.ts/servicos.ts: camelCase, sem ids internos de tenant.
 *
 * Schema real da aba PROFISSIONAIS (confirmado nos workflows n8n existentes — AGE-WF004,
 * COM-WF013, COM-WF014): só `ID_EMPRESA`, `ID_PROFISSIONAL`, `NOME` e `STATUS` são
 * efetivamente lidos/filtrados em algum workflow. **Não existe** coluna de TELEFONE,
 * EMAIL nem ESPECIALIDADE na planilha real hoje — `telefone`/`email`/`especialidade`
 * aqui são campos do domínio já preparados para quando a aba ganhar essas colunas; nos
 * mocks do backend vêm preenchidos (ou null) para dar contexto visual, mas não
 * correspondem a dados reais ainda.
 */
export type StatusProfissional = "ATIVO" | "INATIVO";

export interface Profissional {
  idProfissional: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  especialidade: string | null;
  status: StatusProfissional;
  /**
   * Derivado/mockado nesta etapa (contagem sobre o mock de Agenda-like data interno do
   * backend) — não é um valor persistido real ainda. Ver ProfissionaisService.
   */
  totalAtendimentos: number;
  /** Derivado/mockado nesta etapa — ISO "YYYY-MM-DD", ou null se não houver. */
  proximoAtendimento: string | null;
}

export interface ProfissionaisResponse {
  data: Profissional[];
}
