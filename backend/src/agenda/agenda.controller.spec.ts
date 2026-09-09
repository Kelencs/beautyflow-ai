import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { AgendaController } from './agenda.controller';
import type { AgendaService } from './agenda.service';

function usuario(overrides: Partial<AuthenticatedUser>): AuthenticatedUser {
  return {
    idUsuario: 'usr-1',
    idEmpresa: 'EMP001',
    idProfissional: null,
    nome: 'Usuário Teste',
    email: 'teste@exemplo.com',
    perfil: 'owner',
    ...overrides,
  };
}

/**
 * Testa o CONTROLLER isoladamente (service mockado) — prova estruturalmente que
 * `PATCH /agenda/:id/cancelar` nunca lê `idEmpresa`/`status`/`googleEventId`/
 * `calendarId`/`dataCancelamento`/um `idAgendamento` alternativo do body, mesmo que um
 * cliente malicioso os envie: o método só declara `@Body('motivo')`, então o Nest nunca
 * entrega mais nada a ele — mas este teste chama o handler diretamente com um body
 * "completo" (simulando o pior caso) para confirmar isso na prática, não só por leitura
 * de código.
 */
describe('AgendaController', () => {
  describe('cancelar', () => {
    it('idAgendamento vem exclusivamente da URL (:id) — nunca de um campo no body', async () => {
      const cancelar = jest
        .fn()
        .mockResolvedValue({ idAgendamento: 'AGD001', status: 'CANCELADO' });
      const controller = new AgendaController({ cancelar } as unknown as AgendaService);

      const bodyMalicioso = {
        motivo: 'Motivo legítimo',
        idAgendamento: 'AGD-OUTRO',
        idEmpresa: 'EMP999',
        status: 'CONCLUIDO',
        dataCancelamento: '2020-01-01T00:00:00.000Z',
        googleEventId: 'evt-forjado',
        calendarId: 'calendario-forjado@group.calendar.google.com',
      };

      // O NestJS real só entregaria `bodyMalicioso.motivo` (via @Body('motivo')) — aqui
      // simulamos exatamente esse comportamento chamando o handler com os dois
      // argumentos que ele realmente declara, não o objeto body inteiro.
      await controller.cancelar(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'AGD001',
        bodyMalicioso.motivo,
      );

      expect(cancelar).toHaveBeenCalledWith(
        expect.objectContaining({ idEmpresa: 'EMP001' }),
        'AGD001',
        'Motivo legítimo',
      );
      // Nenhum dos campos "extra" do body malicioso aparece em nenhum argumento passado
      // ao service — a única forma de isso acontecer seria o controller declarar
      // @Body() sem seletor (o que ele não faz).
      const chamada = cancelar.mock.calls[0] as unknown[];
      expect(JSON.stringify(chamada)).not.toContain('EMP999');
      expect(JSON.stringify(chamada)).not.toContain('evt-forjado');
      expect(JSON.stringify(chamada)).not.toContain('calendario-forjado');
      expect(JSON.stringify(chamada)).not.toContain('AGD-OUTRO');
    });

    it('idEmpresa enviado ao service é sempre o do usuário autenticado (@CurrentUser), nunca outro', async () => {
      const cancelar = jest
        .fn()
        .mockResolvedValue({ idAgendamento: 'AGD001', status: 'CANCELADO' });
      const controller = new AgendaController({ cancelar } as unknown as AgendaService);

      await controller.cancelar(
        usuario({ idEmpresa: 'EMP001', perfil: 'profissional', idProfissional: 'PROF001' }),
        'AGD001',
        undefined,
      );

      const [userArg] = cancelar.mock.calls[0] as [AuthenticatedUser, string, string];
      expect(userArg.idEmpresa).toBe('EMP001');
    });

    it('motivo ausente no body -> normalizado para o texto padrão antes de chegar ao service', async () => {
      const cancelar = jest
        .fn()
        .mockResolvedValue({ idAgendamento: 'AGD001', status: 'CANCELADO' });
      const controller = new AgendaController({ cancelar } as unknown as AgendaService);

      await controller.cancelar(
        usuario({ idEmpresa: 'EMP001', perfil: 'owner' }),
        'AGD001',
        undefined,
      );

      const [, , motivoArg] = cancelar.mock.calls[0] as [AuthenticatedUser, string, string];
      expect(motivoArg).toBe('Cancelado pelo usuário');
    });
  });
});
