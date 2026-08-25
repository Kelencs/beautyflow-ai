import type { DisponibilidadeProfissional } from '@beautyflow/shared-types';

/**
 * Mock isolado do backend (mesmo padrão dos demais módulos). Reaproveita os mesmos
 * profissionais já usados em agenda.mock-data.ts (Ana Martins/PROF001, Carla Souza/
 * PROF002 em EMP001; Rafael Torres/PROF010 em EMP002) para coerência entre módulos.
 *
 * `whatsappPhoneNumberId` é interno — nunca mapeado para o contrato público
 * `ConfiguracoesEmpresa` (ver configuracoes.service.ts); serve só para o service decidir
 * o status da integração de WhatsApp (seção 11 do pedido: nunca expor o ID cru).
 */
export interface ConfiguracoesMockRecord {
  idEmpresa: string;
  nomeFantasia: string;
  telefone: string | null;
  email: string | null;
  whatsappPhoneNumberId: string | null;
  timezone: string;
  tempoCancelamentoMinutos: number;
  disponibilidadePorProfissional: DisponibilidadeProfissional[];
}

const DISPONIBILIDADE_PADRAO_SEG_SEX: Pick<
  DisponibilidadeProfissional['dias'][number],
  'aberto' | 'horaInicio' | 'horaFim' | 'intervaloInicio' | 'intervaloFim'
> = {
  aberto: true,
  horaInicio: '09:00',
  horaFim: '18:00',
  intervaloInicio: '12:00',
  intervaloFim: '13:00',
};

const FECHADO: Pick<
  DisponibilidadeProfissional['dias'][number],
  'aberto' | 'horaInicio' | 'horaFim' | 'intervaloInicio' | 'intervaloFim'
> = {
  aberto: false,
  horaInicio: null,
  horaFim: null,
  intervaloInicio: null,
  intervaloFim: null,
};

export const CONFIGURACOES_MOCK_RECORDS: ConfiguracoesMockRecord[] = [
  {
    idEmpresa: 'EMP001',
    nomeFantasia: 'Studio Bela Vida',
    telefone: '(34) 99999-0001',
    email: 'contato@studiobelavida.com.br',
    whatsappPhoneNumberId: '109876543210001',
    timezone: 'America/Sao_Paulo',
    tempoCancelamentoMinutos: 120,
    disponibilidadePorProfissional: [
      {
        profissionalNome: 'Ana Martins',
        dias: [
          { diaSemana: 'DOMINGO', ...FECHADO },
          { diaSemana: 'SEGUNDA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'TERCA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'QUARTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'QUINTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'SEXTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          {
            diaSemana: 'SABADO',
            aberto: true,
            horaInicio: '09:00',
            horaFim: '13:00',
            intervaloInicio: null,
            intervaloFim: null,
          },
        ],
      },
      {
        profissionalNome: 'Carla Souza',
        dias: [
          { diaSemana: 'DOMINGO', ...FECHADO },
          { diaSemana: 'SEGUNDA', ...FECHADO },
          { diaSemana: 'TERCA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'QUARTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'QUINTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'SEXTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'SABADO', ...FECHADO },
        ],
      },
    ],
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001
  {
    idEmpresa: 'EMP002',
    nomeFantasia: 'Espaço Rafael Torres',
    telefone: '(11) 98888-0002',
    email: null,
    whatsappPhoneNumberId: null,
    timezone: 'America/Sao_Paulo',
    tempoCancelamentoMinutos: 60,
    disponibilidadePorProfissional: [
      {
        profissionalNome: 'Rafael Torres',
        dias: [
          { diaSemana: 'DOMINGO', ...FECHADO },
          { diaSemana: 'SEGUNDA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'TERCA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'QUARTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'QUINTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'SEXTA', ...DISPONIBILIDADE_PADRAO_SEG_SEX },
          { diaSemana: 'SABADO', ...FECHADO },
        ],
      },
    ],
  },
];
