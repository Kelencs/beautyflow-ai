/**
 * @beautyflow/shared-types
 *
 * Tipos, DTOs e contratos compartilhados entre frontend (Next.js) e backend
 * (NestJS) do BeautyFlow App.
 *
 * Conteúdo previsto para fases futuras, conforme o plano de arquitetura aprovado:
 * - DTOs das demais entidades operacionais (Pagamento etc.), espelhando o schema real
 *   das abas do Google Sheets.
 * - Contrato de request/response do gateway n8n (`APP-WF019`).
 * - Catálogo de códigos de erro de regra de negócio (RN007_CONFLITO_HORARIO,
 *   RN011_JANELA_CANCELAMENTO, RN014_REAGENDAMENTO_UNICO etc.).
 */

export * from './agenda';
export * from './clientes';
export * from './servicos';
export * from './profissionais';
export * from './dashboard';
export * from './financeiro';
export * from './comunicacao';
export * from './relatorios';
export * from './configuracoes';
export * from './ia';
