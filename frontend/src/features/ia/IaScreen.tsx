import { IaCapacidades } from "./IaCapacidades";
import { IaComportamento } from "./IaComportamento";
import { IaInteracoesRecentes } from "./IaInteracoesRecentes";
import { IaIntencoes } from "./IaIntencoes";
import { IaMemoria } from "./IaMemoria";
import { IaResumoCards } from "./IaResumoCards";
import type { IaConfiguracao } from "./types";

interface IaScreenProps {
  configuracao: IaConfiguracao;
}

/**
 * Página única bem dividida (seção 28 do pedido) — sem tabs: o conteúdo de cada seção é
 * compacto o bastante para não justificar navegação interna, e a owner deve conseguir
 * entender o papel da IA rolando a página uma vez (seção 29).
 */
export function IaScreen({ configuracao }: IaScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">IA</h1>
        <p className="text-sm text-zinc-500">
          Acompanhe como a inteligência artificial atua no atendimento dos seus clientes.
        </p>
      </div>

      <IaResumoCards resumo={configuracao.resumo} />
      <IaCapacidades capacidades={configuracao.capacidades} />
      <IaIntencoes intencoes={configuracao.intencoes} />
      <IaComportamento comportamento={configuracao.comportamento} />
      <IaMemoria memoria={configuracao.memoria} />
      <IaInteracoesRecentes interacoes={configuracao.interacoesRecentes} intencoes={configuracao.intencoes} />
    </div>
  );
}
