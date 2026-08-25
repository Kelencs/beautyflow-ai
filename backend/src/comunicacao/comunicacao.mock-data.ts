import type { ComunicacaoItem } from '@beautyflow/shared-types';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';

/**
 * Mock isolado do backend (mesmo padrão de financeiro.mock-data.ts). Cada registro
 * representa um evento de comunicação já concluído (enviado com sucesso ou com falha) —
 * não simula as 5 abas reais (MENSAGENS/LEMBRETES/PESQUISAS/FOLLOWUPS/COBRANCAS)
 * separadamente, já que o objetivo aqui é o contrato de leitura UNIFICADO (ver seção 5
 * do pedido do módulo), não recriar cada aba 1:1.
 *
 * Coerência com os módulos existentes: todo idAgendamento não-nulo usado aqui (AGD001,
 * AGD002, AGD004, AGD006, AGD007, AGD101, AGD102) tem um agendamento correspondente em
 * agenda.mock-data.ts, com os mesmos cliente/profissional/valores — checado por teste
 * (relatorios.service.spec.ts, "integridade dos mocks"). FUP001 (FOLLOWUP) é o único
 * registro com idAgendamento null, deliberadamente (ver comentário mais abaixo).
 *
 * `dataHora` dos eventos ligados a um idAgendamento de EMP001 (AGD001/002/004/006/007)
 * agora é gerada com o MESMO deslocamento relativo a `getHojeBrasilISO()` usado em
 * agenda.mock-data.ts para aquele idAgendamento (achado P1-1 do Dashboard) — preserva
 * exatamente a mesma distância em dias entre o evento de comunicação e o atendimento que
 * já existia com as datas absolutas antigas (ex.: COB002 continua sendo enviada 1 dia
 * depois de AGD007). FUP001 (idAgendamento null, sem vínculo com nenhum atendimento
 * específico) e os registros de EMP002 (MSG101/COB101) permanecem com data absoluta
 * fixa — deslocá-los não é necessário para nenhum cenário coberto por esta correção.
 */
export interface ComunicacaoMockRecord extends ComunicacaoItem {
  idEmpresa: string;
  idProfissional: string | null;
}

const HOJE = getHojeBrasilISO();

export const COMUNICACAO_MOCK_RECORDS: ComunicacaoMockRecord[] = [
  // EMP001 — Ana Martins (PROF001)
  {
    idComunicacao: 'MSG001',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    tipo: 'CONFIRMACAO',
    clienteNome: 'Mariana Silva',
    telefone: '(34) 99999-1122',
    dataHora: `${deslocarDiasISO(HOJE, -4)}T18:32:00-03:00`,
    mensagem:
      'Olá, Mariana! Seu agendamento de Alongamento em gel foi confirmado para 21/08 às 09:00.',
    status: 'ENVIADA',
    idAgendamento: 'AGD001',
    profissionalNome: 'Ana Martins',
    valorRelacionado: null,
  },
  {
    idComunicacao: 'LEM001',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    tipo: 'LEMBRETE',
    clienteNome: 'Camila Souza',
    telefone: '(34) 99999-2233',
    dataHora: `${deslocarDiasISO(HOJE, -4)}T09:00:00-03:00`,
    mensagem:
      'Olá, Camila! Passando para lembrar do seu horário de Manutenção de gel com Ana Martins em 21/08 às 11:30.',
    status: 'ENVIADA',
    idAgendamento: 'AGD002',
    profissionalNome: 'Ana Martins',
    valorRelacionado: null,
  },
  {
    idComunicacao: 'COB001',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    tipo: 'COBRANCA',
    clienteNome: 'Camila Souza',
    telefone: '(34) 99999-2233',
    dataHora: `${deslocarDiasISO(HOJE, -2)}T10:00:00-03:00`,
    mensagem:
      'Notamos um saldo pendente de R$ 40,00 referente ao seu atendimento de Manutenção de gel. Podemos ajudar a regularizar?',
    status: 'ENVIADA',
    idAgendamento: 'AGD002',
    profissionalNome: 'Ana Martins',
    valorRelacionado: 40,
  },
  {
    idComunicacao: 'COB002',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    tipo: 'COBRANCA',
    clienteNome: 'Mariana Silva',
    telefone: '(34) 99999-1122',
    dataHora: `${deslocarDiasISO(HOJE, -9)}T09:00:00-03:00`,
    mensagem:
      'Notamos um saldo pendente de R$ 50,00 referente ao seu atendimento de Manutenção de gel.',
    status: 'FALHA',
    idAgendamento: 'AGD007',
    profissionalNome: 'Ana Martins',
    valorRelacionado: 50,
  },
  // EMP001 — Carla Souza (PROF002)
  {
    idComunicacao: 'MSG002',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    tipo: 'CONFIRMACAO',
    clienteNome: 'Débora Nascimento',
    telefone: '(34) 98811-5566',
    dataHora: `${deslocarDiasISO(HOJE, -3)}T14:10:00-03:00`,
    mensagem:
      'Olá, Débora! Seu agendamento de Alongamento em fibra foi confirmado para 22/08 às 10:00.',
    status: 'ENVIADA',
    idAgendamento: 'AGD004',
    profissionalNome: 'Carla Souza',
    valorRelacionado: null,
  },
  {
    idComunicacao: 'LEM002',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    tipo: 'LEMBRETE',
    clienteNome: 'Débora Nascimento',
    telefone: '(34) 98811-5566',
    dataHora: `${deslocarDiasISO(HOJE, -2)}T08:00:00-03:00`,
    mensagem:
      'Olá, Débora! Seu atendimento de Alongamento em fibra está agendado para hoje às 10:00.',
    status: 'FALHA',
    idAgendamento: 'AGD004',
    profissionalNome: 'Carla Souza',
    valorRelacionado: null,
  },
  {
    idComunicacao: 'PES001',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    tipo: 'PESQUISA',
    clienteNome: 'Aline Barbosa',
    telefone: '(34) 98822-6677',
    dataHora: `${deslocarDiasISO(HOJE, -6)}T20:00:00-03:00`,
    mensagem:
      'Olá, Aline! Como foi sua experiência com o Design de sobrancelhas hoje? Sua opinião é muito importante.',
    status: 'ENVIADA',
    idAgendamento: 'AGD006',
    profissionalNome: 'Carla Souza',
    valorRelacionado: null,
  },
  // EMP001 — sem vínculo de profissional (FOLLOWUP: reengajamento de cliente, sem ID_AGENDAMENTO no schema real)
  {
    idComunicacao: 'FUP001',
    idEmpresa: 'EMP001',
    idProfissional: null,
    tipo: 'FOLLOWUP',
    clienteNome: 'Camila Souza',
    telefone: '(34) 99999-2233',
    dataHora: '2026-07-15T10:00:00-03:00',
    mensagem: 'Sentimos sua falta, Camila! Que tal agendar um novo horário com a gente?',
    status: 'ENVIADA',
    idAgendamento: null,
    profissionalNome: null,
    valorRelacionado: null,
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001
  {
    idComunicacao: 'MSG101',
    idEmpresa: 'EMP002',
    idProfissional: 'PROF010',
    tipo: 'CONFIRMACAO',
    clienteNome: 'Beatriz Nogueira',
    telefone: '(11) 91234-5678',
    dataHora: '2026-08-20T17:00:00-03:00',
    mensagem: 'Olá, Beatriz! Seu agendamento de Corte e escova foi confirmado para 21/08 às 09:00.',
    status: 'ENVIADA',
    idAgendamento: 'AGD101',
    profissionalNome: 'Rafael Torres',
    valorRelacionado: null,
  },
  {
    idComunicacao: 'COB101',
    idEmpresa: 'EMP002',
    idProfissional: 'PROF010',
    tipo: 'COBRANCA',
    clienteNome: 'Larissa Ferreira',
    telefone: '(11) 91234-8899',
    dataHora: '2026-08-24T09:00:00-03:00',
    mensagem: 'Notamos um saldo pendente de R$ 70,00 referente ao seu atendimento de Coloração.',
    status: 'ENVIADA',
    idAgendamento: 'AGD102',
    profissionalNome: 'Rafael Torres',
    valorRelacionado: 70,
  },
];
