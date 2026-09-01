/**
 * Tipos internos do gateway NestJS -> APP-WF019. Deliberadamente NÃO misturados com
 * `@beautyflow/shared-types` (ver seção 24 do pedido da Fase 1): o envelope técnico do
 * n8n é um detalhe de integração interna do backend, não um contrato público exposto ao
 * frontend. Só mudam se essa fronteira mudar.
 */

/**
 * Operações reconhecidas pelo APP-WF019 nesta fase (camada read-only completa: +
 * `empresa.obter` + `disponibilidades.listar`, ambas de Configurações).
 */
export type N8nGatewayOperation =
  | 'clientes.listar'
  | 'servicos.listar'
  | 'profissionais.listar'
  | 'empresa.obter'
  | 'disponibilidades.listar';

/**
 * Código de erro técnico do envelope. `AUTH_FAILED` nunca aparece dentro de um envelope
 * JSON vindo do WF019 — a autenticação é rejeitada pelo próprio Header Auth do Webhook,
 * antes de qualquer node de negócio rodar (ver n8n-gateway.client.ts), então o NestJS é
 * quem produz esse código a partir do status HTTP (401/403), não o corpo da resposta.
 */
export type N8nGatewayErrorCode =
  | 'AUTH_FAILED'
  | 'TENANT_REQUIRED'
  | 'INVALID_OPERATION'
  | 'VALIDATION_ERROR'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

export interface N8nGatewaySuccessEnvelope<T> {
  ok: true;
  data: T;
  meta: { requestId: string };
}

export interface N8nGatewayErrorEnvelope {
  ok: false;
  error: { code: string; message: string };
  meta: { requestId: string };
}

export type N8nGatewayEnvelope<T> = N8nGatewaySuccessEnvelope<T> | N8nGatewayErrorEnvelope;

/**
 * Nunca confia cegamente no shape devolvido pelo n8n (seção 25 do pedido — "resposta
 * inválida -> erro técnico"). Valida só a estrutura do envelope; o conteúdo de `data` é
 * responsabilidade de quem chama `N8nGatewayClient.call()`.
 */
export function isN8nGatewayEnvelope(value: unknown): value is N8nGatewayEnvelope<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const envelope = value as Record<string, unknown>;

  if (typeof envelope.ok !== 'boolean') {
    return false;
  }
  if (typeof envelope.meta !== 'object' || envelope.meta === null) {
    return false;
  }
  if (typeof (envelope.meta as Record<string, unknown>).requestId !== 'string') {
    return false;
  }

  if (envelope.ok === true) {
    return 'data' in envelope;
  }

  const error = envelope.error;
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as Record<string, unknown>).code === 'string' &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Shape de integração de um cliente, já normalizado pelo APP-WF019 a partir da aba
 * CLIENTES (ver n8n/workflows/app/APP-WF019-gateway-app.json) — nunca inclui
 * `ID_EMPRESA` nem colunas técnicas. `clienteDesde`/`ultimoAtendimento` vêm de
 * `DATA_CADASTRO`/`ULTIMO_ATENDIMENTO`; CLIENTES não tem coluna para "próximo
 * atendimento" nem totais de atendimento/gasto (dependeriam de AGENDAMENTOS/PAGAMENTOS,
 * fora do escopo desta Fase 1) — por isso não aparecem aqui. A conversão para o DTO
 * público `Cliente` (que preenche esses campos ausentes com um valor neutro documentado)
 * acontece em clientes.service.ts, não no workflow.
 */
export interface N8nGatewayClienteIntegracao {
  idCliente: string;
  nome: string;
  telefone: string;
  email: string | null;
  dataNascimento: string | null;
  status: string;
  clienteDesde: string | null;
  ultimoAtendimento: string | null;
  observacoes: string | null;
}

/**
 * Shape de integração de um serviço, já normalizado pelo APP-WF019 a partir da aba
 * SERVICOS — nunca inclui `ID_EMPRESA` nem colunas técnicas. Schema real confirmado:
 * `ID_SERVICO`, `ID_EMPRESA`, `NOME`, `CATEGORIA`, `DESCRICAO`, `DURACAO_MIN`,
 * `TEMPO_INTERVALO_MIN`, `VALOR`, `STATUS`, `DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`.
 * `CATEGORIA`, `TEMPO_INTERVALO_MIN`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` existem na
 * planilha mas não fazem parte do contrato público `Servico` — decisão de escopo (não
 * foram pedidos, não é dado de catálogo exibido ao usuário), nem chegam a ser lidos pelo
 * workflow. `descricao` **existe** na aba real (uma premissa anterior errada dizia que
 * não existia) — vem já normalizada pelo WF019 (`trim()`, vazio/ausente vira `null`,
 * nunca fabricada/substituída pelo nome). `duracaoMinutos`/`valor` já chegam validados
 * como number finito e não-negativo — o WF019 recusa a operação inteira (não apenas
 * descarta a linha) quando algum valor não normaliza (ver `CODE - Normalizar Serviços`),
 * então nunca chegam aqui como NaN/negativo.
 */
export interface N8nGatewayServicoIntegracao {
  idServico: string;
  nome: string;
  descricao: string | null;
  status: string;
  duracaoMinutos: number;
  valor: number;
}

/**
 * Shape de integração de um profissional, já normalizado pelo APP-WF019 a partir da aba
 * PROFISSIONAIS — nunca inclui `ID_EMPRESA` nem colunas técnicas. Schema real confirmado
 * (correção de schema desta tarefa — a conclusão anterior de que só `ID_EMPRESA`/
 * `ID_PROFISSIONAL`/`NOME`/`STATUS` existiam, baseada em workflows que só leem um
 * subconjunto de colunas, estava incompleta): `ID_PROFISSIONAL`, `ID_EMPRESA`, `NOME`,
 * `ESPECIALIDADE`, `TELEFONE`, `EMAIL`, `GOOGLE_CALENDAR_ID`, `DURACAO_INTERVALO_MIN`,
 * `STATUS`, `DATA_ADMISSAO`, `DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`. `GOOGLE_CALENDAR_ID`,
 * `DURACAO_INTERVALO_MIN`, `DATA_ADMISSAO`, `DATA_CADASTRO` e `ULTIMA_ATUALIZACAO` existem
 * na planilha mas não fazem parte do contrato público `Profissional` — decisão de escopo
 * (identificador de integração interno, campo de uso futuro em Agenda/disponibilidade, e
 * datas administrativas não pedidas como dado de catálogo), não lidos por
 * `CODE - Normalizar Profissionais`. `especialidade`/`telefone`/`email` **existem** de
 * fato na aba real e são mapeados aqui (`trim()`, vazio/ausente vira `null`, nunca
 * fabricados) — `telefone` nunca passa por conversão numérica (é texto/identificador, não
 * quantidade: `Number()` perderia zeros à esquerda, sinal `+` internacional e precisão).
 * A conversão para o DTO público `Profissional` (que preenche só `totalAtendimentos`/
 * `proximoAtendimento` com `null` documentado — dependeriam de AGENDAMENTOS) acontece em
 * profissionais.service.ts, não no workflow. `status` já chega validado como exatamente
 * `'ATIVO'` ou `'INATIVO'` — o WF019 recusa a operação inteira (não apenas descarta a
 * linha) quando algum profissional real tem STATUS fora dessa whitelist (ver
 * `CODE - Normalizar Profissionais`).
 */
export interface N8nGatewayProfissionalIntegracao {
  idProfissional: string;
  nome: string;
  especialidade: string | null;
  telefone: string | null;
  email: string | null;
  status: string;
}

/**
 * Shape de integração do registro único da empresa autenticada, já normalizado pelo
 * APP-WF019 a partir da aba EMPRESAS. Schema real confirmado (correção de schema desta
 * tarefa — a conclusão anterior de que só 4 colunas existiam, inferida indiretamente dos
 * workflows WF001-018 que só usam um subconjunto, estava incompleta): 18 colunas —
 * `ID_EMPRESA`, `NOME`, `CNPJ`, `TELEFONE`, `EMAIL`, `ENDERECO`, `CIDADE`, `UF`, `CEP`,
 * `TIMEZONE`, `HORARIO_FUNCIONAMENTO`, `TEMPO_CANCELAMENTO_MIN`,
 * `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WABA_ID`, `GOOGLE_CALENDAR_ID`, `STATUS`,
 * `DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`.
 *
 * `NOME`/`TELEFONE`/`EMAIL` **existem** de fato (premissa anterior corrigida) e agora
 * alimentam `ConfiguracoesEmpresa.negocio` com dado real — `nome`/`telefone`/`email`
 * aqui (`trim()`, vazio/ausente vira `null` para telefone/email; `nome` segue o mesmo
 * tipo não-nulo do contrato público, vazio/ausente vira `''`, nunca um texto fabricado).
 * `telefone` nunca passa por conversão numérica (é texto/identificador, não quantidade).
 *
 * `CNPJ`, `ENDERECO`, `CIDADE`, `UF`, `CEP`, `HORARIO_FUNCIONAMENTO`, `STATUS`,
 * `DATA_CADASTRO`, `ULTIMA_ATUALIZACAO`, `WHATSAPP_WABA_ID` e `GOOGLE_CALENDAR_ID`
 * existem na planilha mas **não fazem parte do contrato público** `ConfiguracoesEmpresa`
 * — decisão de escopo (o App não tem modelo de endereço/CNPJ, `HORARIO_FUNCIONAMENTO` do
 * estabelecimento é conceito distinto de `DISPONIBILIDADES` por profissional, `STATUS`/
 * datas são administrativos, `WHATSAPP_WABA_ID`/`GOOGLE_CALENDAR_ID` são identificadores
 * de integração internos) — nenhum deles chega a ser lido para o shape de saída por
 * `CODE - Normalizar Empresa`, mas todos participam da distinção placeholder × linha
 * corrompida (qualquer um presente sem `ID_EMPRESA` já basta para classificar a linha
 * como dado corrompido). `WHATSAPP_PHONE_NUMBER_ID` nunca sai como valor deste
 * workflow — só a presença/ausência é traduzida para `whatsappConfigurado`
 * (minimização de dados, mesmo padrão de nunca expor `GOOGLE_CALENDAR_ID` em
 * `N8nGatewayProfissionalIntegracao`). `empresa.obter` é uma operação singular:
 * ausência de linha real para o `idEmpresa` autenticado é tratada como `UPSTREAM_ERROR`
 * (nunca um "sucesso vazio" — diferente de uma lista, aqui não existe "nenhuma empresa"
 * legítimo para um tenant já autenticado).
 */
export interface N8nGatewayEmpresaIntegracao {
  nome: string;
  telefone: string | null;
  email: string | null;
  timezone: string;
  tempoCancelamentoMinutos: number;
  whatsappConfigurado: boolean;
}

/**
 * Shape de integração de uma linha de disponibilidade, já normalizada pelo APP-WF019 a
 * partir da aba DISPONIBILIDADES — nunca inclui `ID_EMPRESA`. Schema real confirmado
 * (correção de schema desta tarefa — a conclusão anterior de 8 colunas, baseada só no
 * subconjunto lido por AGE-WF004, estava incompleta): 10 colunas — `ID_DISPONIBILIDADE`,
 * `ID_EMPRESA`, `ID_PROFISSIONAL`, `DIA_SEMANA_NUM` (convenção do cadastro,
 * 0=domingo..6=sábado — comentário do próprio AGE-WF004: distinta do `weekday` do Luxon,
 * que usa 1=segunda..7=domingo), `DIA_SEMANA` (texto), `HORA_INICIO`, `HORA_FIM`,
 * `INTERVALO_INICIO`, `INTERVALO_FIM` (opcionais), `ATIVO` ('SIM'/'NAO').
 *
 * `ID_DISPONIBILIDADE` e `DIA_SEMANA` (texto) **não fazem parte deste shape de saída**:
 * o contrato público `HorarioDia`/`DisponibilidadeProfissional` não tem um campo
 * equivalente a `ID_DISPONIBILIDADE` (identificador interno de linha, sem uso no App), e
 * `diaSemana` (string) do contrato já é DERIVADO de `diaSemanaNum` em
 * configuracoes.service.ts — expor `DIA_SEMANA` bruto aqui criaria uma segunda fonte de
 * verdade para o mesmo conceito, sem necessidade (o vocabulário textual real de
 * `DIA_SEMANA` não está confirmado, então não haveria nem como validar consistência
 * entre as duas colunas sem arriscar inventar valores). As duas **participam**, porém,
 * da distinção placeholder × linha corrompida em `CODE - Normalizar Disponibilidades`:
 * uma linha com `ID_DISPONIBILIDADE` ou `DIA_SEMANA` preenchidos mas `ID_PROFISSIONAL`
 * ausente é dado corrompido, nunca "nenhuma disponibilidade".
 *
 * `disponibilidades.listar` NÃO replica o filtro adicional `ATIVO='SIM'` que AGE-WF004
 * usa (ele só quer dias abertos para calcular horários livres) — aqui vêm TODOS os dias,
 * para montar a grade completa por profissional. `diaSemanaNum` permanece numérico aqui
 * (fiel à fonte); a tradução para o enum público `DiaSemana` (string) acontece em
 * configuracoes.service.ts, usando a mesma convenção 0=domingo..6=sábado já documentada
 * em código real (nunca inventada). `aberto` é a tradução direta de `ATIVO==='SIM'` —
 * quando `false`, `horaInicio`/`horaFim` vêm `null` (nunca fabricados). `nome` do
 * profissional NÃO faz parte deste shape (a aba real não tem essa coluna) — é resolvido
 * em configuracoes.service.ts via ProfissionaisService, já integrado.
 */
export interface N8nGatewayDisponibilidadeIntegracao {
  idProfissional: string;
  diaSemanaNum: number;
  aberto: boolean;
  horaInicio: string | null;
  horaFim: string | null;
  intervaloInicio: string | null;
  intervaloFim: string | null;
}
