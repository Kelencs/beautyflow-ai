import type { Cliente } from "./types";
import { parseISODate } from "@/lib/date";

interface ClientesSummaryProps {
  clientes: Cliente[];
  /** "Hoje" real, calculado uma única vez no servidor (mesmo padrão da Agenda). */
  todayIso: string;
}

/** Cliente recorrente: já teve 2 ou mais atendimentos (regra simples, documentada aqui). */
const MINIMO_ATENDIMENTOS_RECORRENTE = 2;

/** Cartões discretos de contexto — nunca deve virar um dashboard pesado. */
export function ClientesSummary({ clientes, todayIso }: ClientesSummaryProps) {
  const hoje = parseISODate(todayIso);

  const ativos = clientes.filter((cliente) => cliente.status === "ATIVO").length;
  const novosNoMes = clientes.filter((cliente) => {
    const desde = parseISODate(cliente.clienteDesde);
    return desde.getFullYear() === hoje.getFullYear() && desde.getMonth() === hoje.getMonth();
  }).length;
  const recorrentes = clientes.filter((cliente) => cliente.totalAtendimentos >= MINIMO_ATENDIMENTOS_RECORRENTE).length;

  const cards = [
    { label: "Total de clientes", value: String(clientes.length) },
    { label: "Clientes ativos", value: String(ativos) },
    { label: "Novos no mês", value: String(novosNoMes) },
    { label: "Clientes recorrentes", value: String(recorrentes) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
          <dt className="text-xs text-zinc-500">{card.label}</dt>
          <dd className="mt-0.5 text-lg font-semibold text-zinc-900 sm:text-xl">{card.value}</dd>
        </div>
      ))}
    </dl>
  );
}
