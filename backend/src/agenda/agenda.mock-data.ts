import type { AgendaItem } from '@beautyflow/shared-types';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';

/**
 * Mock isolado do backend — não é o mesmo mock do frontend (frontend/src/features/
 * agenda/mock-data.ts), que continua existindo separadamente e sem ligação com este.
 * Existe só para exercitar a API real (GET /agenda) e validar a arquitetura
 * multi-tenant end-to-end antes de existir integração real com n8n/Google Sheets.
 *
 * Cada registro carrega idEmpresa/idProfissional (não fazem parte de AgendaItem, o
 * contrato público) só para o AgendaService poder filtrar antes de montar a resposta.
 *
 * Datas de EMP001 (AGD001-AGD008) geradas via `getHojeBrasilISO()` + `deslocarDiasISO()`,
 * nunca como string absoluta fixa (achado P1-1 do Dashboard, auditoria geral). Antes
 * desta correção, todo o conjunto era calibrado em torno de "hoje" = '2026-08-24'
 * hardcoded — assim que o calendário real avançava, `DashboardService.obterResumo(user)`
 * (sem `dataReferenciaISO`, o caminho real de produção) deixava de encontrar qualquer
 * agendamento "de hoje", zerando `agendamentosHoje`/`confirmadosHoje`/`pendentesHoje`/
 * `previstoHoje`/`proximoAtendimento`. Cada registro abaixo mantém o MESMO deslocamento
 * relativo que tinha antes (ex.: AGD003 continua sendo "hoje", AGD007 continua "hoje - 10
 * dias"), só a âncora deixou de ser fixa — todo o conjunto (não só o registro de "hoje")
 * precisou virar relativo para preservar a coerência da janela usada pelo preset de "7
 * dias" de Relatórios (ver relatorios.service.spec.ts) sem reintroduzir o mesmo problema
 * ali. Os registros duplicados em financeiro.mock-data.ts/comunicacao.mock-data.ts para
 * estes mesmos idAgendamento foram deslocados pelo EXATO mesmo número de dias, para
 * preservar 100% das relações temporais já existentes entre os três mocks. EMP002
 * (AGD101/AGD102) permanece com datas absolutas fixas — não há necessidade concreta de
 * torná-las relativas nesta correção (nenhum teste/cenário de demonstração depende disso).
 */
export interface AgendaMockRecord extends AgendaItem {
  idEmpresa: string;
  idProfissional: string;
}

const HOJE = getHojeBrasilISO();

export const AGENDA_MOCK_RECORDS: AgendaMockRecord[] = [
  // EMP001 — Ana Martins (PROF001)
  {
    idAgendamento: 'AGD001',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Mariana Silva',
    clienteTelefone: '(34) 99999-1122',
    profissionalNome: 'Ana Martins',
    servicoNome: 'Alongamento em gel',
    data: deslocarDiasISO(HOJE, -3),
    horaInicio: '09:00',
    horaFim: '11:00',
    status: 'CONFIRMADO',
    valor: 120,
  },
  {
    idAgendamento: 'AGD002',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Camila Souza',
    clienteTelefone: '(34) 99999-2233',
    profissionalNome: 'Ana Martins',
    servicoNome: 'Manutenção de gel',
    data: deslocarDiasISO(HOJE, -3),
    horaInicio: '11:30',
    horaFim: '13:00',
    status: 'CONFIRMADO',
    valor: 90,
  },
  {
    idAgendamento: 'AGD003',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Jéssica Almeida',
    clienteTelefone: '(34) 99999-3344',
    profissionalNome: 'Ana Martins',
    servicoNome: 'Esmaltação em gel',
    data: deslocarDiasISO(HOJE, 0),
    horaInicio: '14:30',
    horaFim: '15:30',
    status: 'PENDENTE',
    valor: 70,
  },
  // EMP001 — Carla Souza (PROF002)
  {
    idAgendamento: 'AGD004',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Débora Nascimento',
    clienteTelefone: '(34) 98811-5566',
    profissionalNome: 'Carla Souza',
    servicoNome: 'Alongamento em fibra',
    data: deslocarDiasISO(HOJE, -2),
    horaInicio: '10:00',
    horaFim: '11:30',
    status: 'CONFIRMADO',
    valor: 140,
  },
  {
    idAgendamento: 'AGD005',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Aline Barbosa',
    clienteTelefone: '(34) 98822-6677',
    profissionalNome: 'Carla Souza',
    servicoNome: 'Design de sobrancelhas',
    data: deslocarDiasISO(HOJE, 1),
    horaInicio: '13:00',
    horaFim: '14:00',
    status: 'CANCELADO',
    valor: 60,
  },
  // EMP001 — agendamentos históricos: existiam antes só em financeiro.mock-data.ts/
  // comunicacao.mock-data.ts (AGD006/007/008), que já referenciavam estes idAgendamento
  // sem contrapartida aqui — integridade corrigida adicionando-os com os MESMOS
  // dados (cliente/profissional/serviço/data/valor) já usados nos outros dois mocks, sem
  // inventar outro ID nem alterar datas. Todos CONCLUIDO: já têm registro financeiro
  // resolvido (PAGO/PARCIAL/PENDENTE), logo o atendimento em si já aconteceu.
  {
    idAgendamento: 'AGD006',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Aline Barbosa',
    clienteTelefone: '(34) 98822-6677',
    profissionalNome: 'Carla Souza',
    servicoNome: 'Design de sobrancelhas',
    data: deslocarDiasISO(HOJE, -6),
    horaInicio: '13:00',
    horaFim: '14:00',
    status: 'CONCLUIDO',
    valor: 60,
  },
  {
    idAgendamento: 'AGD007',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF001',
    clienteNome: 'Mariana Silva',
    clienteTelefone: '(34) 99999-1122',
    profissionalNome: 'Ana Martins',
    servicoNome: 'Manutenção de gel',
    data: deslocarDiasISO(HOJE, -10),
    horaInicio: '11:30',
    horaFim: '13:00',
    status: 'CONCLUIDO',
    valor: 90,
  },
  {
    idAgendamento: 'AGD008',
    idEmpresa: 'EMP001',
    idProfissional: 'PROF002',
    clienteNome: 'Débora Nascimento',
    clienteTelefone: '(34) 98811-5566',
    profissionalNome: 'Carla Souza',
    servicoNome: 'Design de sobrancelhas',
    data: deslocarDiasISO(HOJE, -5),
    horaInicio: '10:00',
    horaFim: '11:00',
    status: 'CONCLUIDO',
    valor: 60,
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001
  {
    idAgendamento: 'AGD101',
    idEmpresa: 'EMP002',
    idProfissional: 'PROF010',
    clienteNome: 'Beatriz Nogueira',
    clienteTelefone: '(11) 91234-5678',
    profissionalNome: 'Rafael Torres',
    servicoNome: 'Corte e escova',
    data: '2026-08-21',
    horaInicio: '09:00',
    horaFim: '10:00',
    status: 'CONCLUIDO',
    valor: 80,
  },
  {
    idAgendamento: 'AGD102',
    idEmpresa: 'EMP002',
    idProfissional: 'PROF010',
    clienteNome: 'Larissa Ferreira',
    clienteTelefone: '(11) 91234-8899',
    profissionalNome: 'Rafael Torres',
    servicoNome: 'Coloração',
    data: '2026-08-23',
    horaInicio: '15:00',
    horaFim: '17:00',
    status: 'CONFIRMADO',
    valor: 220,
  },
];
