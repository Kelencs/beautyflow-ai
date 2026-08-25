import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IaCapacidade,
  IaComportamento,
  IaConfiguracao,
  IaIntencao,
  IaResumo,
} from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { getHojeBrasilISO } from '../dashboard/dashboard-date.util';
import { criarPreviewMensagem } from './ia-mensagem.util';
import { IA_MOCK_RECORDS, type IaMockRecord } from './ia.mock-data';

/**
 * Descrição amigável derivada do comportamento real de WF002 (seção 4 do pedido — nunca
 * o prompt de sistema completo). "Cordial e objetivo" resume o tom observado no prompt
 * único do workflow; não são campos separadamente configuráveis nele, por isso a seção
 * "Comportamento do assistente" é somente leitura (ver relatório do módulo).
 */
const COMPORTAMENTO: IaComportamento = {
  descricaoGeral:
    'Assistente responsável por responder clientes no WhatsApp, interpretar solicitações e direcionar ações do atendimento.',
  tom: 'Cordial e objetivo',
  idioma: 'Português (Brasil)',
  usaMemoria: true,
};

/** Capacidades confirmadas pelos branches reais de WF003 (AGENDAR/CONSULTAR_DISPONIBILIDADE/REAGENDAR/CANCELAR) + comportamento observado em WF002. */
const CAPACIDADES: IaCapacidade[] = [
  {
    titulo: 'Entender a mensagem do cliente',
    descricao: 'Analisa o que o cliente escreveu e identifica o que ele deseja.',
  },
  {
    titulo: 'Responder automaticamente',
    descricao: 'Gera uma resposta ao cliente com base na solicitação identificada.',
  },
  {
    titulo: 'Consultar disponibilidade',
    descricao: 'Verifica horários livres na agenda quando o cliente pergunta.',
  },
  {
    titulo: 'Iniciar um novo agendamento',
    descricao: 'Encaminha o pedido do cliente para marcar um atendimento.',
  },
  {
    titulo: 'Reagendar um atendimento',
    descricao: 'Encaminha pedidos de alteração de um atendimento já marcado.',
  },
  {
    titulo: 'Cancelar um atendimento',
    descricao: 'Encaminha pedidos de cancelamento de um atendimento já marcado.',
  },
  {
    titulo: 'Manter o contexto da conversa',
    descricao: 'Usa o histórico recente do cliente para entender melhor a mensagem atual.',
  },
];

/** Códigos reais confirmados no Switch de WF003 (4 branches) + OUTRO (default de normalização). */
const INTENCOES: IaIntencao[] = [
  { codigo: 'AGENDAR', nome: 'Agendar', descricao: 'Cliente deseja marcar um novo atendimento.' },
  {
    codigo: 'CONSULTAR_DISPONIBILIDADE',
    nome: 'Consultar disponibilidade',
    descricao: 'Cliente quer saber quais horários estão livres.',
  },
  {
    codigo: 'REAGENDAR',
    nome: 'Reagendar',
    descricao: 'Cliente deseja alterar um atendimento já marcado.',
  },
  { codigo: 'CANCELAR', nome: 'Cancelar', descricao: 'Cliente deseja cancelar um atendimento.' },
  {
    codigo: 'OUTRO',
    nome: 'Outro assunto',
    descricao: 'Mensagem que não se encaixa claramente nas categorias acima.',
  },
];

const MEMORIA_DESCRICAO =
  'Para manter o contexto do atendimento, a IA considera um resumo recente da conversa com cada cliente antes de responder.';

function toIaConfiguracao(registro: IaMockRecord, hojeIso: string): IaConfiguracao {
  const interacoesOrdenadas = [...registro.interacoes].sort((a, b) =>
    b.dataHora.localeCompare(a.dataHora),
  );

  const resumo: IaResumo = {
    status: registro.status,
    modelo: registro.modelo,
    totalInteracoes: registro.interacoes.length,
    interacoesHoje: registro.interacoes.filter((item) => item.dataHora.slice(0, 10) === hojeIso)
      .length,
    clientesComMemoriaAtiva: registro.clientesComMemoriaAtiva.length,
  };

  return {
    resumo,
    comportamento: COMPORTAMENTO,
    capacidades: CAPACIDADES,
    intencoes: INTENCOES,
    memoria: {
      descricao: MEMORIA_DESCRICAO,
      clientes: registro.clientesComMemoriaAtiva.map((clienteNome) => ({ clienteNome })),
    },
    // Minimização de dados: a mensagem completa (`item.mensagem`, dado interno) nunca
    // sai daqui — só a prévia truncada pelo backend chega ao DTO público.
    interacoesRecentes: interacoesOrdenadas.map((item) => ({
      idInteracao: item.idInteracao,
      clienteNome: item.clienteNome,
      dataHora: item.dataHora,
      intencao: item.intencao,
      status: item.status,
      confianca: item.confianca,
      previewMensagem: criarPreviewMensagem(item.mensagem),
    })),
  };
}

@Injectable()
export class IaService {
  /**
   * Painel de IA é configuração administrativa (seção 5 do pedido) — mesmo padrão de
   * ConfiguracoesService: 403 Forbidden para qualquer perfil que não seja owner,
   * incluindo platform_admin (nunca tem idEmpresa, nunca é 'owner' — a mesma checagem
   * cobre os dois casos). A autorização real vive aqui, não só na sidebar.
   */
  obterConfiguracao(user: AuthenticatedUser): IaConfiguracao {
    if (user.perfil !== 'owner') {
      throw new ForbiddenException(
        'Você não possui permissão para acessar as configurações da IA.',
      );
    }

    // Defensivo: pela constraint chk_usuarios_empresa_obrigatoria, todo owner tem
    // idEmpresa NOT NULL — mesmo comportamento seguro-por-padrão dos demais módulos.
    if (!user.idEmpresa) {
      throw new ForbiddenException(
        'Você não possui permissão para acessar as configurações da IA.',
      );
    }

    const registro = IA_MOCK_RECORDS.find((item) => item.idEmpresa === user.idEmpresa);
    if (!registro) {
      throw new NotFoundException('Configuração de IA não encontrada para esta empresa.');
    }

    return toIaConfiguracao(registro, getHojeBrasilISO());
  }
}
