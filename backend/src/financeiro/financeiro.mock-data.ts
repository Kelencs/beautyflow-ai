import type { Pagamento } from '@beautyflow/shared-types';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';

/**
 * Mock isolado do backend (mesmo padrão de agenda.mock-data.ts/clientes.mock-data.ts).
 * Cada registro representa o ESTADO FINANCEIRO ATUAL de um agendamento — não uma linha
 * bruta de PAGAMENTOS (ver comentário em libs/shared-types/src/financeiro.ts sobre
 * PAGAMENTOS ser transacional/multi-linha no schema real).
 *
 * Coerência com a Agenda: TODO idAgendamento usado aqui (AGD001-AGD004, AGD006-AGD008,
 * AGD101-AGD102) tem um agendamento correspondente em agenda.mock-data.ts, com os
 * mesmos cliente/profissional/serviço/data/valor — checado por teste
 * (relatorios.service.spec.ts, "integridade dos mocks"). AGD006-AGD008 já foram
 * registros só do Financeiro no passado (nunca espelhados na Agenda); isso causava
 * referências órfãs que inflavam valorRecebido/valorPendente em Relatórios além do que
 * a Agenda sustentava — corrigido adicionando os agendamentos correspondentes à Agenda
 * (nunca inventando outro ID).
 *
 * `data`/`dataHoraPagamento` dos registros de EMP001 agora são geradas com o MESMO
 * deslocamento relativo a `getHojeBrasilISO()` usado em agenda.mock-data.ts para o
 * idAgendamento correspondente (achado P1-1 do Dashboard) — nunca independentemente.
 * Isso preserva exatamente a mesma relação `data` (Financeiro) == `data` (Agenda) para o
 * mesmo idAgendamento que já existia com as datas absolutas antigas, evitando o tipo de
 * incoerência "Agenda em 25/08, Pagamento em 14/08" para o mesmo evento.
 */
export interface FinanceiroMockRecord extends Pagamento {
  idEmpresa: string;
  idProfissional: string;
  /**
   * Timestamp interno do mock (ISO 8601, aproxima PAGAMENTOS.DATA_HORA real) — NUNCA
   * exposto via GET /financeiro (não faz parte do tipo público `Pagamento`). Existe só
   * para permitir que outros módulos internos (ex.: RelatoriosService, via
   * FinanceiroService.obterDataHoraPorPagamento) consolidem corretamente por "mais
   * recente" quando houver mais de uma linha para o mesmo idAgendamento — ver
   * relatorios-financeiro.util.ts. `null` para registros PENDENTE (idPagamento também
   * null: nenhuma linha real em PAGAMENTOS existe ainda).
   */
  dataHoraPagamento: string | null;
}

const HOJE = getHojeBrasilISO();

export const FINANCEIRO_MOCK_RECORDS: FinanceiroMockRecord[] = [
  // EMP001 — Ana Martins (PROF001)
  {
    idAgendamento: 'AGD001',
    idPagamento: 'PAG001',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Mariana Silva',
    servicoNome: 'Alongamento em gel',
    profissionalNome: 'Ana Martins',
    data: deslocarDiasISO(HOJE, -3),
    valorAgendamento: 120,
    valorPago: 120,
    valorPendente: 0,
    formaPagamento: 'PIX',
    status: 'PAGO',
    dataHoraPagamento: `${deslocarDiasISO(HOJE, -3)}T12:00:00-03:00`,
  },
  {
    idAgendamento: 'AGD002',
    idPagamento: 'PAG002',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Camila Souza',
    servicoNome: 'Manutenção de gel',
    profissionalNome: 'Ana Martins',
    data: deslocarDiasISO(HOJE, -3),
    valorAgendamento: 90,
    valorPago: 50,
    valorPendente: 40,
    formaPagamento: 'DINHEIRO',
    status: 'PARCIAL',
    dataHoraPagamento: `${deslocarDiasISO(HOJE, -3)}T15:00:00-03:00`,
  },
  {
    idAgendamento: 'AGD003',
    idPagamento: null,
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Jéssica Almeida',
    servicoNome: 'Esmaltação em gel',
    profissionalNome: 'Ana Martins',
    data: deslocarDiasISO(HOJE, 0),
    valorAgendamento: 70,
    valorPago: 0,
    valorPendente: 70,
    formaPagamento: null,
    status: 'PENDENTE',
    dataHoraPagamento: null,
  },
  {
    idAgendamento: 'AGD007',
    idPagamento: 'PAG005',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Mariana Silva',
    servicoNome: 'Manutenção de gel',
    profissionalNome: 'Ana Martins',
    data: deslocarDiasISO(HOJE, -10),
    valorAgendamento: 90,
    valorPago: 40,
    valorPendente: 50,
    formaPagamento: 'PIX',
    status: 'PARCIAL',
    dataHoraPagamento: `${deslocarDiasISO(HOJE, -10)}T13:00:00-03:00`,
  },
  // EMP001 — Carla Souza (PROF002)
  {
    idAgendamento: 'AGD004',
    idPagamento: 'PAG003',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Débora Nascimento',
    servicoNome: 'Alongamento em fibra',
    profissionalNome: 'Carla Souza',
    data: deslocarDiasISO(HOJE, -2),
    valorAgendamento: 140,
    valorPago: 140,
    valorPendente: 0,
    formaPagamento: 'CARTAO_CREDITO',
    status: 'PAGO',
    dataHoraPagamento: `${deslocarDiasISO(HOJE, -2)}T11:30:00-03:00`,
  },
  {
    idAgendamento: 'AGD006',
    idPagamento: 'PAG004',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Aline Barbosa',
    servicoNome: 'Design de sobrancelhas',
    profissionalNome: 'Carla Souza',
    data: deslocarDiasISO(HOJE, -6),
    valorAgendamento: 60,
    valorPago: 60,
    valorPendente: 0,
    formaPagamento: 'CARTAO_DEBITO',
    status: 'PAGO',
    dataHoraPagamento: `${deslocarDiasISO(HOJE, -6)}T14:00:00-03:00`,
  },
  {
    idAgendamento: 'AGD008',
    idPagamento: null,
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Débora Nascimento',
    servicoNome: 'Design de sobrancelhas',
    profissionalNome: 'Carla Souza',
    data: deslocarDiasISO(HOJE, -5),
    valorAgendamento: 60,
    valorPago: 0,
    valorPendente: 60,
    formaPagamento: null,
    status: 'PENDENTE',
    dataHoraPagamento: null,
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001
  {
    idAgendamento: 'AGD101',
    idPagamento: 'PAG101',
    idEmpresa: 'EMP002',
    idProfissional: 'PROF010',
    clienteNome: 'Beatriz Nogueira',
    servicoNome: 'Corte e escova',
    profissionalNome: 'Rafael Torres',
    data: '2026-08-21',
    valorAgendamento: 80,
    valorPago: 80,
    valorPendente: 0,
    formaPagamento: 'PIX',
    status: 'PAGO',
    dataHoraPagamento: '2026-08-21T10:00:00-03:00',
  },
  {
    idAgendamento: 'AGD102',
    idPagamento: 'PAG102',
    idEmpresa: 'EMP002',
    idProfissional: 'PROF010',
    clienteNome: 'Larissa Ferreira',
    servicoNome: 'Coloração',
    profissionalNome: 'Rafael Torres',
    data: '2026-08-23',
    valorAgendamento: 220,
    valorPago: 150,
    valorPendente: 70,
    formaPagamento: 'CARTAO_CREDITO',
    status: 'PARCIAL',
    dataHoraPagamento: '2026-08-23T17:00:00-03:00',
  },
];
