import type { Profissional } from '@beautyflow/shared-types';

/**
 * Mock isolado do backend (não reaproveita mocks do frontend). `idEmpresa` só existe
 * aqui, para o ProfissionaisService filtrar — nunca faz parte do contrato público
 * `Profissional`. `totalAtendimentos`/`proximoAtendimento` são valores derivados/
 * mockados nesta etapa (não vêm de uma consulta real à Agenda) — só para dar contexto
 * visual ao resumo e ao drawer.
 *
 * Nomes coincidem de propósito com backend/src/agenda/agenda.mock-data.ts onde possível
 * (Ana Martins, Carla Souza) — ver seção "Coerência com Agenda" do relatório para as
 * divergências documentadas (alguns nomes sugeridos no pedido já são usados como
 * CLIENTE em outros módulos; mantidos mesmo assim, por serem os nomes pedidos).
 */
export interface ProfissionalMockRecord extends Profissional {
  idEmpresa: string;
}

export const PROFISSIONAIS_MOCK_RECORDS: ProfissionalMockRecord[] = [
  // EMP001 — mesma empresa da Agenda/Clientes/Serviços mockados
  {
    idProfissional: 'PROF001',
    idEmpresa: 'EMP001',
    nome: 'Ana Martins',
    telefone: '(34) 99911-2233',
    email: 'ana.martins@beautyflow.com',
    especialidade: 'Nail Designer',
    status: 'ATIVO',
    totalAtendimentos: 42,
    proximoAtendimento: '2026-08-24',
  },
  {
    idProfissional: 'PROF002',
    idEmpresa: 'EMP001',
    nome: 'Carla Souza',
    telefone: '(34) 99922-3344',
    email: 'carla.souza@beautyflow.com',
    especialidade: 'Nail Designer',
    status: 'ATIVO',
    totalAtendimentos: 35,
    proximoAtendimento: '2026-08-25',
  },
  {
    idProfissional: 'PROF003',
    idEmpresa: 'EMP001',
    nome: 'Juliana Rocha',
    telefone: '(34) 99933-4455',
    email: null,
    especialidade: 'Manicure',
    status: 'ATIVO',
    totalAtendimentos: 28,
    proximoAtendimento: '2026-08-26',
  },
  {
    idProfissional: 'PROF004',
    idEmpresa: 'EMP001',
    nome: 'Camila Duarte',
    telefone: null,
    email: 'camila.duarte@beautyflow.com',
    especialidade: 'Manicure e Pedicure',
    status: 'ATIVO',
    totalAtendimentos: 19,
    proximoAtendimento: null,
  },
  {
    idProfissional: 'PROF005',
    idEmpresa: 'EMP001',
    nome: 'Larissa Ferreira',
    telefone: '(34) 99944-5566',
    email: 'larissa.ferreira@beautyflow.com',
    especialidade: 'Designer de Sobrancelhas',
    status: 'INATIVO',
    totalAtendimentos: 11,
    proximoAtendimento: null,
  },
  {
    idProfissional: 'PROF006',
    idEmpresa: 'EMP001',
    nome: 'Débora Lima',
    telefone: null,
    email: null,
    especialidade: 'Nail Designer',
    status: 'INATIVO',
    totalAtendimentos: 3,
    proximoAtendimento: null,
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001
  {
    idProfissional: 'PROF010',
    idEmpresa: 'EMP002',
    nome: 'Rafael Torres',
    telefone: '(11) 98111-2233',
    email: 'rafael.torres@beautyflow.com',
    especialidade: 'Cabeleireiro',
    status: 'ATIVO',
    totalAtendimentos: 24,
    proximoAtendimento: '2026-08-27',
  },
  {
    idProfissional: 'PROF102',
    idEmpresa: 'EMP002',
    nome: 'Fernanda Dias',
    telefone: '(11) 98122-3344',
    email: null,
    especialidade: 'Colorista',
    status: 'ATIVO',
    totalAtendimentos: 17,
    proximoAtendimento: null,
  },
];
