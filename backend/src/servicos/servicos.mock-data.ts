import type { Servico } from '@beautyflow/shared-types';

/**
 * Mock isolado do backend (não reaproveita mocks do frontend). `idEmpresa` só existe
 * aqui, para o ServicosService filtrar — nunca faz parte do contrato público `Servico`.
 */
export interface ServicoMockRecord extends Servico {
  idEmpresa: string;
}

export const SERVICOS_MOCK_RECORDS: ServicoMockRecord[] = [
  // EMP001 — catálogo do salão
  {
    idServico: 'SRV001',
    idEmpresa: 'EMP001',
    nome: 'Alongamento em gel',
    descricao: 'Alongamento completo das unhas com gel, acabamento uniforme e resistente.',
    duracaoMinutos: 120,
    valor: 120,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV002',
    idEmpresa: 'EMP001',
    nome: 'Manutenção de gel',
    descricao: 'Retoque e reforço do alongamento em gel já existente.',
    duracaoMinutos: 90,
    valor: 90,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV003',
    idEmpresa: 'EMP001',
    nome: 'Esmaltação em gel',
    descricao: 'Esmaltação em gel de longa duração, sem alongamento.',
    duracaoMinutos: 60,
    valor: 70,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV004',
    idEmpresa: 'EMP001',
    nome: 'Manicure simples',
    descricao: 'Cuidado tradicional das unhas das mãos, com esmaltação comum.',
    duracaoMinutos: 45,
    valor: 45,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV005',
    idEmpresa: 'EMP001',
    nome: 'Pedicure',
    descricao: 'Cuidado tradicional das unhas dos pés, com esmaltação comum.',
    duracaoMinutos: 60,
    valor: 50,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV006',
    idEmpresa: 'EMP001',
    nome: 'Design de sobrancelhas',
    descricao: 'Modelagem e alinhamento das sobrancelhas.',
    duracaoMinutos: 30,
    valor: 60,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV007',
    idEmpresa: 'EMP001',
    nome: 'Alongamento em fibra',
    descricao: 'Alongamento das unhas com fibra de vidro, acabamento natural.',
    duracaoMinutos: 150,
    valor: 140,
    status: 'INATIVO',
  },
  {
    idServico: 'SRV008',
    idEmpresa: 'EMP001',
    nome: 'Pedicure spa',
    descricao: 'Pedicure com hidratação e massagem relaxante.',
    duracaoMinutos: 90,
    valor: 90,
    status: 'INATIVO',
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001
  {
    idServico: 'SRV101',
    idEmpresa: 'EMP002',
    nome: 'Corte e escova',
    descricao: 'Corte de cabelo com finalização em escova.',
    duracaoMinutos: 60,
    valor: 80,
    status: 'ATIVO',
  },
  {
    idServico: 'SRV102',
    idEmpresa: 'EMP002',
    nome: 'Coloração',
    descricao: 'Coloração completa dos cabelos.',
    duracaoMinutos: 120,
    valor: 220,
    status: 'ATIVO',
  },
];
