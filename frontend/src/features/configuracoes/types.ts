/**
 * Contrato de Configurações vem de `@beautyflow/shared-types` (GET /configuracoes do
 * backend NestJS) — sem duplicar aqui, mesmo padrão já usado nos demais módulos.
 */
export type {
  AutomacaoComunicacao,
  ConfiguracoesAgenda,
  ConfiguracoesEmpresa,
  ConfiguracoesNegocio,
  DiaSemana,
  DisponibilidadeProfissional,
  HorarioDia,
  IntegracaoStatus,
  StatusAutomacao,
  StatusIntegracao,
} from "@beautyflow/shared-types";

/** Seções da navegação interna da tela (seção 17 do pedido) — todas com conteúdo real. */
export type SecaoConfiguracoes = "negocio" | "agenda" | "comunicacao" | "integracoes";
