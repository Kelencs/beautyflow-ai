import type { Pagamento } from '@beautyflow/shared-types';
import {
  consolidarPagamentosPorAgendamento,
  filtrarPagamentosDoUniverso,
} from './relatorios-financeiro.util';

function pagamento(overrides: Partial<Pagamento>): Pagamento {
  return {
    idAgendamento: 'AGD001',
    idPagamento: 'PAG001',
    clienteNome: 'Cliente Teste',
    servicoNome: 'Serviço Teste',
    profissionalNome: 'Profissional Teste',
    data: '2026-08-20',
    valorAgendamento: 100,
    valorPago: 100,
    valorPendente: 0,
    formaPagamento: 'PIX',
    status: 'PAGO',
    ...overrides,
  };
}

describe('relatorios-financeiro.util', () => {
  describe('consolidarPagamentosPorAgendamento', () => {
    it('FALLBACK DO MOCK (sem DATA_HORA disponível): mantém só a última do array — nunca soma duas linhas', () => {
      const antiga = pagamento({
        idAgendamento: 'AGD001',
        valorPago: 60,
        valorPendente: 40,
        status: 'PARCIAL',
      });
      const recente = pagamento({
        idAgendamento: 'AGD001',
        valorPago: 100,
        valorPendente: 0,
        status: 'PAGO',
      });

      // Sem passar dataHoraPorPagamento — exercita o fallback documentado no cabeçalho
      // do módulo, nunca a regra de produção.
      const consolidados = consolidarPagamentosPorAgendamento([antiga, recente]);

      expect(consolidados.size).toBe(1);
      expect(consolidados.get('AGD001')).toEqual(recente);
    });

    it('REGRA REAL: usa DATA_HORA (não a posição no array) para decidir qual registro é mais recente', () => {
      const maisAntigo = pagamento({
        idAgendamento: 'AGD001',
        idPagamento: 'PAG_ANTIGO',
        valorPago: 50,
        valorPendente: 40,
        status: 'PARCIAL',
      });
      const maisRecente = pagamento({
        idAgendamento: 'AGD001',
        idPagamento: 'PAG_RECENTE',
        valorPago: 90,
        valorPendente: 0,
        status: 'PAGO',
      });
      const dataHoraPorPagamento = new Map([
        ['PAG_ANTIGO', '2026-08-10T09:00:00-03:00'],
        ['PAG_RECENTE', '2026-08-20T15:00:00-03:00'],
      ]);

      // maisRecente vem ANTES no array (posição não pode ser a autoridade) — mesmo assim
      // deve vencer, porque seu DATA_HORA é o mais recente.
      const consolidados = consolidarPagamentosPorAgendamento(
        [maisRecente, maisAntigo],
        dataHoraPorPagamento,
      );

      expect(consolidados.size).toBe(1);
      expect(consolidados.get('AGD001')).toEqual(maisRecente);
    });

    it('REGRA REAL: escolhe o mais recente independentemente da ordem inversa no array', () => {
      const maisAntigo = pagamento({
        idAgendamento: 'AGD001',
        idPagamento: 'PAG_ANTIGO',
        valorPago: 50,
      });
      const maisRecente = pagamento({
        idAgendamento: 'AGD001',
        idPagamento: 'PAG_RECENTE',
        valorPago: 90,
      });
      const dataHoraPorPagamento = new Map([
        ['PAG_ANTIGO', '2026-08-10T09:00:00-03:00'],
        ['PAG_RECENTE', '2026-08-20T15:00:00-03:00'],
      ]);

      // Desta vez maisAntigo vem DEPOIS no array — se a regra fosse "última do array",
      // maisAntigo venceria erroneamente. Com DATA_HORA disponível, maisRecente continua vencendo.
      const consolidados = consolidarPagamentosPorAgendamento(
        [maisAntigo, maisRecente],
        dataHoraPorPagamento,
      );

      expect(consolidados.get('AGD001')?.idPagamento).toBe('PAG_RECENTE');
    });

    it('mantém uma entrada por idAgendamento quando não há duplicatas', () => {
      const a = pagamento({ idAgendamento: 'AGD001' });
      const b = pagamento({ idAgendamento: 'AGD002' });

      const consolidados = consolidarPagamentosPorAgendamento([a, b]);

      expect(consolidados.size).toBe(2);
      expect(consolidados.get('AGD001')).toEqual(a);
      expect(consolidados.get('AGD002')).toEqual(b);
    });
  });

  describe('filtrarPagamentosDoUniverso', () => {
    it('remove registros com idAgendamento fora do universo (referências órfãs)', () => {
      const valido = pagamento({ idAgendamento: 'AGD001', valorPago: 120 });
      const orfao = pagamento({ idAgendamento: 'AGD999', valorPago: 60 });

      const resultado = filtrarPagamentosDoUniverso([valido, orfao], new Set(['AGD001']));

      expect(resultado).toEqual([valido]);
      expect(resultado.some((item) => item.idAgendamento === 'AGD999')).toBe(false);
    });

    it('nunca soma valores de duas linhas do mesmo agendamento, mesmo quando ambas estão no universo', () => {
      const antiga = pagamento({
        idAgendamento: 'AGD001',
        valorPago: 50,
        valorPendente: 40,
        status: 'PARCIAL',
      });
      const recente = pagamento({
        idAgendamento: 'AGD001',
        valorPago: 90,
        valorPendente: 0,
        status: 'PAGO',
      });

      const resultado = filtrarPagamentosDoUniverso([antiga, recente], new Set(['AGD001']));

      expect(resultado).toHaveLength(1);
      expect(resultado[0]?.valorPago).toBe(90);

      const totalPago = resultado.reduce((soma, item) => soma + item.valorPago, 0);
      expect(totalPago).toBe(90);
      expect(totalPago).not.toBe(50 + 90);
    });

    it('preserva pagamentos PARCIAL corretamente (valorPago e valorPendente intactos)', () => {
      const parcial = pagamento({
        idAgendamento: 'AGD002',
        valorPago: 50,
        valorPendente: 40,
        status: 'PARCIAL',
      });

      const resultado = filtrarPagamentosDoUniverso([parcial], new Set(['AGD002']));

      expect(resultado).toEqual([parcial]);
      expect(resultado[0]?.valorPago).toBe(50);
      expect(resultado[0]?.valorPendente).toBe(40);
    });

    it('retorna lista vazia quando nenhum idAgendamento pertence ao universo', () => {
      const orfao1 = pagamento({ idAgendamento: 'AGD901' });
      const orfao2 = pagamento({ idAgendamento: 'AGD902' });

      const resultado = filtrarPagamentosDoUniverso([orfao1, orfao2], new Set(['AGD001']));

      expect(resultado).toEqual([]);
    });
  });
});
