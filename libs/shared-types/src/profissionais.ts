/**
 * Contrato de GET /profissionais e GET /profissionais/:id (backend NestJS). Mesmo
 * espírito de agenda.ts/clientes.ts/servicos.ts: camelCase, sem ids internos de tenant.
 *
 * Schema real da aba PROFISSIONAIS (corrigido — uma auditoria anterior desta fase,
 * baseada só em workflows que leem um subconjunto de colunas, concluiu incorretamente
 * que TELEFONE/EMAIL/ESPECIALIDADE não existiam): `ID_PROFISSIONAL`, `ID_EMPRESA`,
 * `NOME`, `ESPECIALIDADE`, `TELEFONE`, `EMAIL`, `GOOGLE_CALENDAR_ID`,
 * `DURACAO_INTERVALO_MIN`, `STATUS`, `DATA_ADMISSAO`, `DATA_CADASTRO`,
 * `ULTIMA_ATUALIZACAO`. `telefone`/`email`/`especialidade` **existem** de fato e, quando
 * a fonte é `n8n` (`DATA_SOURCE_PROFISSIONAIS`), vêm normalizados pelo APP-WF019 (trim,
 * vazio/ausente vira `null`, nunca fabricado/inferido). `GOOGLE_CALENDAR_ID`
 * (identificador de integração), `DURACAO_INTERVALO_MIN` (uso futuro em
 * Agenda/disponibilidade), `DATA_ADMISSAO`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO`
 * também existem na planilha mas **não fazem parte deste contrato** — decisão de escopo,
 * não um gap a corrigir.
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
   * Mock: contagem derivada de um mock local (não persistida). Fonte `n8n`: `null` —
   * dependeria de AGENDAMENTOS, que a aba PROFISSIONAIS sozinha não tem (mesmo motivo de
   * `Cliente.totalAtendimentos`/`totalGasto`) — nunca `0` fabricado. Ver
   * ProfissionaisService.
   */
  totalAtendimentos: number | null;
  /**
   * Mock: derivado/mockado nesta etapa, ISO "YYYY-MM-DD". Fonte `n8n`: sempre `null` —
   * mesmo motivo de `totalAtendimentos` ("não sabemos", não "não há").
   */
  proximoAtendimento: string | null;
}

export interface ProfissionaisResponse {
  data: Profissional[];
}
