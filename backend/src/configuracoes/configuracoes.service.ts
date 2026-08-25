import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  AutomacaoComunicacao,
  ConfiguracoesEmpresa,
  IntegracaoStatus,
} from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import {
  CONFIGURACOES_MOCK_RECORDS,
  type ConfiguracoesMockRecord,
} from './configuracoes.mock-data';

/**
 * Automações do sistema (COM-WF012/013/014/015, FIN-WF011) — todas já existem e rodam
 * hoje, mas não têm flag de ativação por empresa em EMPRESAS (ver comentário em
 * configuracoes.ts). Lista fixa, igual para toda empresa — não vem do mock por não ser
 * um dado que varia por tenant.
 */
const AUTOMACOES_COMUNICACAO: AutomacaoComunicacao[] = [
  { tipo: 'CONFIRMACAO', status: 'DISPONIVEL' },
  { tipo: 'LEMBRETE', status: 'DISPONIVEL' },
  { tipo: 'PESQUISA', status: 'DISPONIVEL' },
  { tipo: 'FOLLOWUP', status: 'DISPONIVEL' },
  { tipo: 'COBRANCA', status: 'DISPONIVEL' },
];

function toConfiguracoesEmpresa(registro: ConfiguracoesMockRecord): ConfiguracoesEmpresa {
  const integracoes: IntegracaoStatus[] = [
    {
      nome: 'WhatsApp',
      // 'ATIVA' aqui reflete só o estado do mock/ambiente atual (whatsappPhoneNumberId
      // presente) — nunca um health-check real da Meta/WhatsApp Cloud API (não é feita
      // nenhuma chamada externa). O texto exibido ao usuário (features/configuracoes/
      // IntegracoesSection.tsx) deixa isso explícito, evitando sugerir confirmação
      // operacional que não existe nesta etapa.
      status: registro.whatsappPhoneNumberId ? 'ATIVA' : 'NAO_CONFIGURADA',
      descricao: registro.whatsappPhoneNumberId
        ? 'Preparado para envio de confirmações, lembretes e demais automações.'
        : 'Ainda não configurado para esta empresa.',
    },
    {
      nome: 'Agenda/Calendário',
      // Idem: nenhuma chamada real ao Google Calendar acontece aqui.
      status: 'ATIVA',
      descricao: 'Preparado para sincronização de agenda e prevenção de conflitos.',
    },
  ];

  return {
    negocio: {
      nomeFantasia: registro.nomeFantasia,
      telefone: registro.telefone,
      email: registro.email,
    },
    agenda: {
      timezone: registro.timezone,
      janelaCancelamentoMinutos: registro.tempoCancelamentoMinutos,
      disponibilidadePorProfissional: registro.disponibilidadePorProfissional,
    },
    automacoesComunicacao: AUTOMACOES_COMUNICACAO,
    integracoes,
  };
}

@Injectable()
export class ConfiguracoesService {
  /**
   * Configurações administrativas do negócio são restritas a `owner` (seção 4 do
   * pedido) — diferente do padrão "lista vazia" usado nos demais módulos para
   * profissional/platform_admin, aqui a resposta é sempre 403 Forbidden para qualquer
   * perfil que não seja owner, incluindo platform_admin (que nunca tem idEmpresa e por
   * definição nunca é 'owner' — a mesma checagem cobre os dois casos). A UI não deve ser
   * a única proteção: a autorização real vive aqui, no backend.
   */
  obterConfiguracoes(user: AuthenticatedUser): ConfiguracoesEmpresa {
    if (user.perfil !== 'owner') {
      throw new ForbiddenException(
        'Você não possui permissão para acessar as configurações do negócio.',
      );
    }

    // Defensivo: pela constraint chk_usuarios_empresa_obrigatoria, todo owner tem
    // idEmpresa NOT NULL — este branch nunca deveria ser alcançável em produção, mas
    // mantém o mesmo comportamento seguro-por-padrão dos demais módulos.
    if (!user.idEmpresa) {
      throw new ForbiddenException(
        'Você não possui permissão para acessar as configurações do negócio.',
      );
    }

    const registro = CONFIGURACOES_MOCK_RECORDS.find((item) => item.idEmpresa === user.idEmpresa);
    if (!registro) {
      throw new NotFoundException('Configurações não encontradas para esta empresa.');
    }

    return toConfiguracoesEmpresa(registro);
  }
}
