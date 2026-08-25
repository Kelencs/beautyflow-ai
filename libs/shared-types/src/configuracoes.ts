import type { TipoComunicacao } from './comunicacao';

/**
 * Contrato de GET /configuracoes (backend NestJS).
 *
 * Auditoria (n8n workflows + docs/arquitetura/beautyflow-app-arquitetura.md, só
 * leitura — nenhum workflow foi alterado):
 *
 * - EMPRESAS (Google Sheets): só 4 colunas são de fato lidas em algum workflow —
 *   ID_EMPRESA, WHATSAPP_PHONE_NUMBER_ID (COM-WF013/014/015, FIN-WF011),
 *   TIMEZONE (mesmos 4 workflows, default 'America/Sao_Paulo' quando vazio),
 *   TEMPO_CANCELAMENTO_MIN (AGE-WF007, "CODE - Validar Prazo"). Não existe nenhum node de
 *   escrita (append/update) para EMPRESAS em nenhum dos 18 workflows — confirmado por
 *   grep, não é suposição. NÃO existe nome/telefone/e-mail/endereço na aba real hoje.
 * - `nomeFantasia`/`telefone`/`email` (ConfiguracoesNegocio) vêm de uma fonte diferente:
 *   `docs/10-modelo-de-dados/entidades/ENT001-Empresa.md`, o modelo de dados Postgres
 *   PLANEJADO para uma futura tabela `empresas` (ainda não implementada — Supabase hoje só
 *   tem `public.usuarios`). É uma decisão arquitetural documentada (não uma invenção sem
 *   fonte), mas ainda não tem um schema real por trás — por isso estes 3 campos são
 *   tratados como preparação/preview, editáveis só localmente na tela (nunca persistidos,
 *   ver seção 18 do pedido do módulo).
 * - DISPONIBILIDADES (Google Sheets, aba real, lida em AGE-WF004): modelo é POR
 *   PROFISSIONAL e por dia da semana (ID_PROFISSIONAL, DIA_SEMANA_NUM, HORA_INICIO,
 *   HORA_FIM, INTERVALO_INICIO/FIM opcional, ATIVO) — não existe um "horário de
 *   funcionamento" único da empresa. `disponibilidadePorProfissional` reflete esse modelo
 *   real, não a estrutura de exemplo sugerida no pedido do módulo.
 * - Regras de agenda (conflito de horário, reagendamento) são lógica FIXA dos workflows,
 *   sem coluna correspondente em nenhuma aba — por isso não aparecem como campos aqui;
 *   o frontend as mostra como texto informativo, não como dado deste contrato.
 * - Automações de comunicação (Confirmação/Lembrete/Pesquisa/Follow-up/Cobrança) não têm
 *   nenhuma flag de ativação por empresa em EMPRESAS — `automacoesComunicacao` é um
 *   resumo somente leitura ("disponível na automação"), nunca toggles funcionais.
 */

/** DIA_SEMANA_NUM de DISPONIBILIDADES (0=domingo..6=sábado), nomeado por clareza. */
export type DiaSemana = 'DOMINGO' | 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO';

export interface HorarioDia {
  diaSemana: DiaSemana;
  aberto: boolean;
  /** "HH:mm" — null quando aberto = false. */
  horaInicio: string | null;
  horaFim: string | null;
  /** Intervalo/almoço — opcional mesmo quando aberto = true (DISPONIBILIDADES.INTERVALO_INICIO/FIM podem ser vazios). */
  intervaloInicio: string | null;
  intervaloFim: string | null;
}

export interface DisponibilidadeProfissional {
  profissionalNome: string;
  dias: HorarioDia[];
}

/** Campos ainda sem schema real por trás — ver comentário acima (fonte: ENT001, preview/edição local). */
export interface ConfiguracoesNegocio {
  nomeFantasia: string;
  telefone: string | null;
  email: string | null;
}

export interface ConfiguracoesAgenda {
  /** EMPRESAS.TIMEZONE real — somente leitura, não configurável hoje. */
  timezone: string;
  /** EMPRESAS.TEMPO_CANCELAMENTO_MIN real — minutos de antecedência exigidos para cancelar. */
  janelaCancelamentoMinutos: number;
  disponibilidadePorProfissional: DisponibilidadeProfissional[];
}

/** Só existe 'DISPONIVEL' hoje (sem toggle por empresa) — tipo já preparado para quando houver mais estados. */
export type StatusAutomacao = 'DISPONIVEL';

export interface AutomacaoComunicacao {
  tipo: Exclude<TipoComunicacao, 'OUTRO'>;
  status: StatusAutomacao;
}

export type StatusIntegracao = 'ATIVA' | 'NAO_CONFIGURADA';

export interface IntegracaoStatus {
  nome: string;
  status: StatusIntegracao;
  descricao: string;
}

export interface ConfiguracoesEmpresa {
  negocio: ConfiguracoesNegocio;
  agenda: ConfiguracoesAgenda;
  automacoesComunicacao: AutomacaoComunicacao[];
  integracoes: IntegracaoStatus[];
}
