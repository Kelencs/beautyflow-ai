import { Injectable } from '@nestjs/common';
import type {
  AgendaItem,
  DashboardProximoAtendimento,
  DashboardResponse,
  DashboardResumo,
} from '@beautyflow/shared-types';
import { AgendaService } from '../agenda/agenda.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ClientesService } from '../clientes/clientes.service';
import { ProfissionaisService } from '../profissionais/profissionais.service';
import { ServicosService } from '../servicos/servicos.service';
import { getHojeBrasilISO, getHoraAgoraBrasil } from './dashboard-date.util';

const RESUMO_VAZIO: DashboardResumo = {
  agendamentosHoje: 0,
  confirmadosHoje: 0,
  pendentesHoje: 0,
  previstoHoje: 0,
  totalClientes: 0,
  clientesAtivos: 0,
  profissionaisAtivos: 0,
  servicosAtivos: 0,
};

/** No máximo N itens em "próximos atendimentos" — seção de destaque, não um calendário completo. */
const MAX_PROXIMOS_ATENDIMENTOS = 5;
/** Status que ainda representam algo "a acontecer" (exclui CANCELADO e CONCLUIDO). */
const STATUS_PENDENTES_DE_OCORRER = new Set(['PENDENTE', 'CONFIRMADO']);

function toDashboardItem(item: AgendaItem): DashboardProximoAtendimento {
  return {
    idAgendamento: item.idAgendamento,
    horario: item.horaInicio,
    clienteNome: item.clienteNome,
    servicoNome: item.servicoNome,
    profissionalNome: item.profissionalNome,
    status: item.status,
  };
}

@Injectable()
export class DashboardService {
  /**
   * Não cria um 5º conjunto de mocks: reutiliza os serviços já existentes via injeção de
   * dependência (Agenda/Clientes/Serviços/Profissionais), chamando exatamente os mesmos
   * métodos públicos que os respectivos controllers chamam — garante que o Dashboard
   * nunca diverge do que a Agenda/Clientes/Serviços/Profissionais já mostram (mesma
   * fonte, mesma filtragem de tenant/perfil, sem reimplementar nada disso aqui).
   */
  constructor(
    private readonly agendaService: AgendaService,
    private readonly clientesService: ClientesService,
    private readonly servicosService: ServicosService,
    private readonly profissionaisService: ProfissionaisService,
  ) {}

  /**
   * `dataReferenciaISO` é opcional e existe só para testes determinísticos (ver seção 9
   * do pedido) — o controller NUNCA o informa (sempre usa a data real de hoje); não é
   * exposto via querystring/HTTP, então não há superfície nova para o cliente manipular.
   *
   * platform_admin (idEmpresa null): mesmo comportamento seguro por padrão já usado nos
   * demais módulos — resumo zerado, sem próximo atendimento, em vez de assumir acesso
   * amplo. Owner vê a empresa inteira; profissional vê sua própria agenda filtrada
   * (AgendaService.listar já aplica essa regra sozinho) — os demais indicadores
   * (clientes/serviços/profissionais ativos) seguem a mesma regra "vê a empresa toda"
   * já documentada em cada respectivo *Service.
   */
  /**
   * Async só por causa de ClientesService.listar() (pode chamar o APP-WF019 via HTTP
   * quando DATA_SOURCE_CLIENTES=n8n — ver clientes.service.ts) — mudança mecânica de
   * sincronização, sem nenhuma alteração de regra de negócio deste método. As demais
   * chamadas (`agendaService`/`servicosService`/`profissionaisService`) continuam
   * síncronas, exatamente como antes.
   */
  async obterResumo(
    user: AuthenticatedUser,
    dataReferenciaISO?: string,
  ): Promise<DashboardResponse> {
    if (!user.idEmpresa) {
      return { resumo: RESUMO_VAZIO, proximoAtendimento: null, proximosAtendimentos: [] };
    }

    const hoje = dataReferenciaISO ?? getHojeBrasilISO();

    const agendaHoje = this.agendaService.listar(user, { dataInicio: hoje, dataFim: hoje }).data;
    const clientes = (await this.clientesService.listar(user)).data;
    const servicos = this.servicosService.listar(user).data;
    const profissionais = this.profissionaisService.listar(user).data;

    const confirmadosHoje = agendaHoje.filter((item) => item.status === 'CONFIRMADO').length;
    const pendentesHoje = agendaHoje.filter((item) => item.status === 'PENDENTE').length;
    const previstoHoje = agendaHoje
      .filter((item) => item.status !== 'CANCELADO')
      .reduce((soma, item) => soma + item.valor, 0);

    // "Próximo" só faz sentido dentro de hoje (ver seção 12 do pedido) — sem passar para
    // amanhã caso não haja mais nada hoje. O corte por horário-atual só é aplicado
    // quando NÃO há dataReferenciaISO explícita (produção, sempre hoje de verdade): em
    // testes com data fixa, usar a hora real de execução do teste tornaria o resultado
    // não-determinístico, então o corte vira '00:00' (nenhum horário do dia é excluído).
    const horaAgora = dataReferenciaISO ? '00:00' : getHoraAgoraBrasil();
    const proximosAtendimentos = agendaHoje
      .filter((item) => STATUS_PENDENTES_DE_OCORRER.has(item.status) && item.horaInicio > horaAgora)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
      .slice(0, MAX_PROXIMOS_ATENDIMENTOS)
      .map(toDashboardItem);

    const resumo: DashboardResumo = {
      agendamentosHoje: agendaHoje.length,
      confirmadosHoje,
      pendentesHoje,
      previstoHoje,
      totalClientes: clientes.length,
      clientesAtivos: clientes.filter((cliente) => cliente.status === 'ATIVO').length,
      profissionaisAtivos: profissionais.filter((profissional) => profissional.status === 'ATIVO')
        .length,
      servicosAtivos: servicos.filter((servico) => servico.status === 'ATIVO').length,
    };

    return {
      resumo,
      proximoAtendimento: proximosAtendimentos[0] ?? null,
      proximosAtendimentos,
    };
  }
}
