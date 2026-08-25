import type { IaIntencaoCodigo, IaStatus, StatusProcessamentoIa } from '@beautyflow/shared-types';
import { deslocarDiasISO, getHojeBrasilISO } from '../dashboard/dashboard-date.util';

/**
 * Mock isolado do backend (mesmo padrão dos demais módulos). EMP001 reaproveita os
 * mesmos clientes já usados em Agenda/Financeiro/Comunicação (Mariana Silva, Camila
 * Souza, Jéssica Almeida, Débora Nascimento, Aline Barbosa) para coerência entre
 * módulos.
 *
 * Datas calibradas em torno de "hoje" — gerado dinamicamente via `getHojeBrasilISO()` +
 * `deslocarDiasISO()`, nunca como string absoluta fixa. Antes desta correção "hoje" era
 * hardcoded ('2026-08-24'); assim que o calendário real avançou para o dia seguinte, o
 * teste `interacoesHoje` passou a contar 0 em vez de 2 (achado P1-1 da auditoria geral —
 * ver ia.service.spec.ts). Cada interação abaixo mantém o mesmo deslocamento relativo que
 * tinha antes (ex.: IA001/IA002 continuam "hoje", IA006 continua "hoje - 6 dias"), só a
 * âncora deixou de ser fixa.
 *
 * EMP002 é deliberadamente NAO_CONFIGURADA e sem interações/memória: WF001 hoje tem
 * `id_empresa: 'EMP001'` fixo no código (auditoria), então nenhuma outra empresa tem o
 * fluxo de IA operacional no sistema real — inventar interações "vindas da IA" para
 * EMP002 seria incoerente com essa limitação real. O registro existe só para provar
 * isolamento multi-tenant (owner de EMP002 recebe sua própria config, vazia, nunca a de
 * EMP001).
 *
 * EMP003 existe só para tornar o teste de isolamento multi-tenant efetivo (achado M1 da
 * auditoria final): como EMP002 é vazio, um bug futuro no filtro por `idEmpresa` que
 * misturasse dados de empresas diferentes não seria pego por nenhum teste (não haveria
 * nada de EMP002 para "vazar"). EMP003 tem cliente, mensagem e interação exclusivos,
 * inequivocamente diferentes de EMP001, para que os testes possam provar que nada desse
 * conteúdo aparece na resposta de EMP001 (e vice-versa).
 */
export interface IaMockRecord {
  idEmpresa: string;
  status: IaStatus;
  modelo: string;
  interacoes: IaInteracaoMockRecord[];
  clientesComMemoriaAtiva: string[];
}

/**
 * Não estende `IaInteracao` (o DTO público) de propósito: o contrato público só tem
 * `previewMensagem` (truncada pelo backend, ver ia-mensagem.util.ts), nunca a mensagem
 * completa. Este registro interno guarda `mensagem` na íntegra — representa
 * MENSAGENS.MENSAGEM real — porque é dado interno; `IaService` é o único lugar que lê
 * este campo, e nunca o repassa como está para o DTO público.
 */
export interface IaInteracaoMockRecord {
  idInteracao: string;
  idEmpresa: string;
  clienteNome: string;
  dataHora: string;
  intencao: IaIntencaoCodigo;
  status: StatusProcessamentoIa;
  confianca: number;
  mensagem: string;
}

const HOJE = getHojeBrasilISO();

/** `dataHora` de uma interação, `offsetDias` dias antes/depois de "hoje" (0 = hoje). */
function dataHoraRelativaAHoje(offsetDias: number, horaMinuto: string): string {
  return `${deslocarDiasISO(HOJE, offsetDias)}T${horaMinuto}:00-03:00`;
}

export const IA_MOCK_RECORDS: IaMockRecord[] = [
  {
    idEmpresa: 'EMP001',
    status: 'PREPARADA',
    modelo: 'models/gemini-3-flash-preview',
    clientesComMemoriaAtiva: ['Mariana Silva', 'Camila Souza'],
    interacoes: [
      {
        idInteracao: 'IA001',
        idEmpresa: 'EMP001',
        clienteNome: 'Mariana Silva',
        dataHora: dataHoraRelativaAHoje(0, '09:15'),
        intencao: 'AGENDAR',
        status: 'PROCESSADA',
        confianca: 0.92,
        // Mensagem propositalmente mais longa que o limite padrão de preview (120
        // caracteres) — prova o truncamento real do backend com um dado do próprio mock,
        // não só via testes sintéticos do helper.
        mensagem:
          'Oi, queria marcar um horário para fazer as unhas essa semana, se possível na quinta ou sexta à tarde. Vocês têm alguma vaga disponível nesses dias?',
      },
      {
        idInteracao: 'IA002',
        idEmpresa: 'EMP001',
        clienteNome: 'Camila Souza',
        dataHora: dataHoraRelativaAHoje(0, '10:40'),
        intencao: 'CONSULTAR_DISPONIBILIDADE',
        status: 'PROCESSADA',
        confianca: 0.88,
        mensagem: 'Vocês têm horário livre no sábado de manhã?',
      },
      {
        idInteracao: 'IA003',
        idEmpresa: 'EMP001',
        clienteNome: 'Jéssica Almeida',
        dataHora: dataHoraRelativaAHoje(-2, '16:05'),
        intencao: 'REAGENDAR',
        status: 'PROCESSADA',
        confianca: 0.81,
        mensagem: 'Preciso mudar meu horário de quinta para sexta, é possível?',
      },
      {
        idInteracao: 'IA004',
        idEmpresa: 'EMP001',
        clienteNome: 'Débora Nascimento',
        dataHora: dataHoraRelativaAHoje(-3, '18:30'),
        intencao: 'CANCELAR',
        status: 'PROCESSADA',
        confianca: 0.95,
        mensagem: 'Vou precisar cancelar meu horário de amanhã, desculpa o transtorno.',
      },
      {
        idInteracao: 'IA005',
        idEmpresa: 'EMP001',
        clienteNome: 'Aline Barbosa',
        dataHora: dataHoraRelativaAHoje(-4, '11:00'),
        intencao: 'OUTRO',
        status: 'PROCESSADA',
        confianca: 0.4,
        mensagem: 'Vocês fazem sobrancelha com henna?',
      },
      {
        idInteracao: 'IA006',
        idEmpresa: 'EMP001',
        clienteNome: 'Mariana Silva',
        dataHora: dataHoraRelativaAHoje(-6, '14:20'),
        intencao: 'AGENDAR',
        status: 'PROCESSADA',
        confianca: 0.9,
        mensagem: 'Bom dia! Queria agendar minha manutenção de gel.',
      },
    ],
  },
  // EMP002 — outra empresa, nunca deve aparecer para usuários de EMP001 (ver comentário acima)
  {
    idEmpresa: 'EMP002',
    status: 'NAO_CONFIGURADA',
    modelo: 'models/gemini-3-flash-preview',
    clientesComMemoriaAtiva: [],
    interacoes: [],
  },
  // EMP003 — outra empresa com dados próprios, usada para provar isolamento multi-tenant
  // de forma efetiva (ver comentário acima, achado M1 da auditoria final).
  {
    idEmpresa: 'EMP003',
    status: 'PREPARADA',
    modelo: 'models/gemini-3-flash-preview',
    clientesComMemoriaAtiva: ['Cliente Exclusivo EMP003'],
    interacoes: [
      {
        idInteracao: 'IA-EMP003-01',
        idEmpresa: 'EMP003',
        clienteNome: 'Cliente Exclusivo EMP003',
        dataHora: dataHoraRelativaAHoje(-1, '15:00'),
        intencao: 'CONSULTAR_DISPONIBILIDADE',
        status: 'PROCESSADA',
        confianca: 0.77,
        mensagem:
          'Mensagem exclusiva da EMP003 que nunca deve aparecer para outra empresa — conteúdo inédito.',
      },
    ],
  },
];
