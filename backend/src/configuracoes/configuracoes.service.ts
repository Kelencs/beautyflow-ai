import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  AutomacaoComunicacao,
  ConfiguracoesEmpresa,
  DiaSemana,
  DisponibilidadeProfissional,
  HorarioDia,
  IntegracaoStatus,
} from '@beautyflow/shared-types';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { N8nGatewayClient } from '../n8n-gateway/n8n-gateway.client';
import { N8nGatewayException } from '../n8n-gateway/n8n-gateway.exception';
import type {
  N8nGatewayDisponibilidadeIntegracao,
  N8nGatewayEmpresaIntegracao,
} from '../n8n-gateway/n8n-gateway.types';
import { ProfissionaisService } from '../profissionais/profissionais.service';
import {
  CONFIGURACOES_MOCK_RECORDS,
  type ConfiguracoesMockRecord,
} from './configuracoes.mock-data';

/**
 * Automações do sistema (COM-WF012/013/014/015, FIN-WF011) — todas já existem e rodam
 * hoje, mas não têm flag de ativação por empresa em EMPRESAS (ver comentário em
 * configuracoes.ts). Lista fixa, igual para toda empresa — não vem do mock nem do
 * gateway por não ser um dado que varia por tenant.
 */
const AUTOMACOES_COMUNICACAO: AutomacaoComunicacao[] = [
  { tipo: 'CONFIRMACAO', status: 'DISPONIVEL' },
  { tipo: 'LEMBRETE', status: 'DISPONIVEL' },
  { tipo: 'PESQUISA', status: 'DISPONIVEL' },
  { tipo: 'FOLLOWUP', status: 'DISPONIVEL' },
  { tipo: 'COBRANCA', status: 'DISPONIVEL' },
];

/**
 * `DIA_SEMANA_NUM` de DISPONIBILIDADES é 0=domingo..6=sábado (convenção do cadastro real
 * — comentário original em AGE-WF004, distinta do `weekday` do Luxon). Índice do array =
 * o número real; nunca inventado.
 */
const DIA_SEMANA_POR_NUM: DiaSemana[] = [
  'DOMINGO',
  'SEGUNDA',
  'TERCA',
  'QUARTA',
  'QUINTA',
  'SEXTA',
  'SABADO',
];

/** Dia sem linha real na fonte = fechado por padrão — nunca fabricado como aberto. */
function diaFechado(diaSemana: DiaSemana): HorarioDia {
  return {
    diaSemana,
    aberto: false,
    horaInicio: null,
    horaFim: null,
    intervaloInicio: null,
    intervaloFim: null,
  };
}

function integracoesDe(whatsappConfigurado: boolean): IntegracaoStatus[] {
  return [
    {
      nome: 'WhatsApp',
      // 'ATIVA' aqui reflete só a presença de WHATSAPP_PHONE_NUMBER_ID (mock) ou
      // `whatsappConfigurado` (n8n) — nunca um health-check real da Meta/WhatsApp Cloud
      // API (não é feita nenhuma chamada externa). O texto exibido ao usuário
      // (features/configuracoes/IntegracoesSection.tsx) deixa isso explícito.
      status: whatsappConfigurado ? 'ATIVA' : 'NAO_CONFIGURADA',
      descricao: whatsappConfigurado
        ? 'Preparado para envio de confirmações, lembretes e demais automações.'
        : 'Ainda não configurado para esta empresa.',
    },
    {
      nome: 'Agenda/Calendário',
      // Idem: nenhuma chamada real ao Google Calendar acontece aqui, nos dois modos.
      status: 'ATIVA',
      descricao: 'Preparado para sincronização de agenda e prevenção de conflitos.',
    },
  ];
}

function toConfiguracoesEmpresa(registro: ConfiguracoesMockRecord): ConfiguracoesEmpresa {
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
    integracoes: integracoesDe(Boolean(registro.whatsappPhoneNumberId)),
  };
}

/**
 * Monta o contrato público a partir dos dois shapes de integração do APP-WF019
 * (`empresa.obter` + `disponibilidades.listar`) e do mapa idProfissional->nome já
 * resolvido via ProfissionaisService (evita um join na fonte/no workflow — reaproveita
 * um service já integrado, mesmo padrão de RelatoriosService compondo múltiplos
 * services).
 *
 * `negocio` (nomeFantasia/telefone/email) vem de fato de EMPRESAS (correção de schema
 * desta tarefa — a aba real tem 18 colunas, incluindo NOME/TELEFONE/EMAIL; uma premissa
 * anterior de que não existiam estava incompleta). `empresa.nome`/`telefone`/`email` já
 * chegam normalizados pelo WF019 (`trim()`, vazio/ausente vira `''`/`null` conforme o
 * tipo do contrato) — nunca fabricados aqui, só repassados.
 */
function toConfiguracoesEmpresaFromIntegracao(
  empresa: N8nGatewayEmpresaIntegracao,
  disponibilidades: N8nGatewayDisponibilidadeIntegracao[],
  nomePorIdProfissional: Map<string, string>,
): ConfiguracoesEmpresa {
  const porProfissional = new Map<string, N8nGatewayDisponibilidadeIntegracao[]>();
  for (const item of disponibilidades) {
    const lista = porProfissional.get(item.idProfissional) ?? [];
    lista.push(item);
    porProfissional.set(item.idProfissional, lista);
  }

  const disponibilidadePorProfissional: DisponibilidadeProfissional[] = Array.from(
    porProfissional.entries(),
  ).map(([idProfissional, linhas]) => {
    const porDia = new Map(linhas.map((linha) => [linha.diaSemanaNum, linha]));
    const dias: HorarioDia[] = DIA_SEMANA_POR_NUM.map((diaSemana, diaSemanaNum) => {
      const linha = porDia.get(diaSemanaNum);
      if (!linha) {
        // Profissional sem linha real para este dia da semana: "sem dado" = fechado,
        // nunca um horário fabricado.
        return diaFechado(diaSemana);
      }
      return {
        diaSemana,
        aberto: linha.aberto,
        horaInicio: linha.horaInicio,
        horaFim: linha.horaFim,
        intervaloInicio: linha.intervaloInicio,
        intervaloFim: linha.intervaloFim,
      };
    });

    return {
      // Nome resolvido via ProfissionaisService (já tenant-scoped); se por algum motivo
      // o profissional não aparecer mais na lista atual (ex.: removido entre as duas
      // chamadas), usa o próprio id como texto — nunca "undefined"/nome fabricado.
      profissionalNome: nomePorIdProfissional.get(idProfissional) ?? idProfissional,
      dias,
    };
  });

  return {
    negocio: { nomeFantasia: empresa.nome, telefone: empresa.telefone, email: empresa.email },
    agenda: {
      timezone: empresa.timezone,
      janelaCancelamentoMinutos: empresa.tempoCancelamentoMinutos,
      disponibilidadePorProfissional,
    },
    automacoesComunicacao: AUTOMACOES_COMUNICACAO,
    integracoes: integracoesDe(empresa.whatsappConfigurado),
  };
}

@Injectable()
export class ConfiguracoesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly n8nGatewayClient: N8nGatewayClient,
    private readonly profissionaisService: ProfissionaisService,
  ) {}

  /** Flag por módulo (mesmo padrão de Clientes/Serviços/ProfissionaisService). */
  private usaFonteReal(): boolean {
    return this.configService.get<string>('DATA_SOURCE_CONFIGURACOES') === 'n8n';
  }

  /**
   * Configurações administrativas do negócio são restritas a `owner` (mesmo padrão nos
   * dois modos) — diferente do padrão "lista vazia" usado nos demais módulos para
   * profissional/platform_admin, aqui a resposta é sempre 403 Forbidden para qualquer
   * perfil que não seja owner, incluindo platform_admin (que nunca tem idEmpresa e por
   * definição nunca é 'owner' — a mesma checagem cobre os dois casos). A UI não deve ser
   * a única proteção: a autorização real vive aqui, no backend.
   *
   * Async por causa do modo `n8n` (duas chamadas HTTP ao gateway: `empresa.obter` +
   * `disponibilidades.listar`) — mesmo padrão de Clientes/Serviços/Profissionais.
   */
  async obterConfiguracoes(user: AuthenticatedUser): Promise<ConfiguracoesEmpresa> {
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

    if (this.usaFonteReal()) {
      return this.obterConfiguracoesViaGateway(user);
    }

    const registro = CONFIGURACOES_MOCK_RECORDS.find((item) => item.idEmpresa === user.idEmpresa);
    if (!registro) {
      throw new NotFoundException('Configurações não encontradas para esta empresa.');
    }

    return toConfiguracoesEmpresa(registro);
  }

  /**
   * Nunca cai silenciosamente no mock quando o gateway falha — mesmo padrão de
   * Clientes/Serviços/ProfissionaisService. As duas chamadas (`empresa.obter` +
   * `disponibilidades.listar`) usam o MESMO idEmpresa já validado acima; se qualquer
   * uma falhar, a operação inteira falha (nunca uma resposta parcial só com uma delas).
   */
  private async obterConfiguracoesViaGateway(
    user: AuthenticatedUser,
  ): Promise<ConfiguracoesEmpresa> {
    const idEmpresa = user.idEmpresa as string;
    try {
      const [empresa, disponibilidades, profissionais] = await Promise.all([
        this.n8nGatewayClient.call<N8nGatewayEmpresaIntegracao>('empresa.obter', idEmpresa),
        this.n8nGatewayClient.call<N8nGatewayDisponibilidadeIntegracao[]>(
          'disponibilidades.listar',
          idEmpresa,
        ),
        this.profissionaisService.listar(user),
      ]);

      const nomePorIdProfissional = new Map(
        profissionais.data.map((profissional) => [profissional.idProfissional, profissional.nome]),
      );

      return toConfiguracoesEmpresaFromIntegracao(empresa, disponibilidades, nomePorIdProfissional);
    } catch (error) {
      if (error instanceof N8nGatewayException) {
        throw new ServiceUnavailableException(
          'Não foi possível obter as configurações no momento. Tente novamente em instantes.',
        );
      }
      throw error;
    }
  }
}
