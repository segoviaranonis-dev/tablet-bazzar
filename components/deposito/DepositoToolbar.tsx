"use client";

import Link from "next/link";
import type { DepositoFilterState } from "@/lib/deposito-filters";
import { depositoFiltersActive, summarizeDepositoFilters } from "@/lib/deposito-filters";
import type { DepositoFiltrosData } from "@/components/deposito/DepositoFiltrosHeader";

export type TabDeposito = "stock" | "alertas" | "estadisticas";

type DepositoOption = {
  cliente_id: number;
  codigo: string;
  nombre: string;
  pares: number;
};

type Props = {
  tab: TabDeposito;
  onTabChange: (t: TabDeposito) => void;
  depositoActivo: DepositoOption | null;
  depositos: DepositoOption[];
  onDepositoChange: (clienteId: number) => void;
  filtrosExpanded: boolean;
  onToggleFiltros: () => void;
  filtros: DepositoFilterState;
  filtrosData: DepositoFiltrosData | null;
  totalMostrados: number;
  limit: number;
  alertasCount?: number;
  colapsarTodo?: boolean;
  onToggleColapsarTodo?: () => void;
};

function usesCabecera(tab: TabDeposito): boolean {
  return tab === "stock" || tab === "estadisticas";
}

function TabBtn({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "blue" | "orange";
}) {
  const base =
    "min-h-[48px] shrink-0 rounded-xl px-4 text-sm font-bold transition touch-manipulation";
  if (active) {
    const bg = accent === "orange" ? "bg-orange-600 text-white" : "bg-rimec-azul text-white";
    return (
      <button type="button" onClick={onClick} className={`${base} ${bg} shadow-sm`}>
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} border-2 border-slate-200 bg-white text-slate-700 active:bg-slate-50`}
    >
      {children}
    </button>
  );
}

export function DepositoToolbar({
  tab,
  onTabChange,
  depositoActivo,
  depositos,
  onDepositoChange,
  filtrosExpanded,
  onToggleFiltros,
  filtros,
  filtrosData,
  totalMostrados,
  limit,
  alertasCount = 0,
  colapsarTodo = true,
  onToggleColapsarTodo,
}: Props) {
  const chips = summarizeDepositoFilters(filtros, filtrosData);
  const filtrosActivos = depositoFiltersActive(filtros);

  return (
    <div className="border-b border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-[56px] items-center gap-2 overflow-x-auto px-2 py-1.5 sm:gap-3 sm:px-4">
        <Link
          href="/"
          className="flex min-h-[48px] min-w-[72px] shrink-0 items-center justify-center rounded-xl bg-rimec-azul px-4 text-base font-black tracking-wide text-white shadow-sm active:bg-rimec-azul/90"
        >
          ATRÁS
        </Link>

        <div className="hidden min-w-0 shrink sm:block">
          <p className="truncate text-sm font-black leading-tight text-rimec-azul">
            {depositoActivo?.nombre ?? "Depósito"}
          </p>
          {depositoActivo ? (
            <p className="truncate text-[11px] text-slate-500">
              <span className="font-bold text-orange-600">{depositoActivo.codigo}</span>
              {" · "}
              {depositoActivo.pares.toLocaleString("es-PY")} p
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <TabBtn active={tab === "stock"} onClick={() => onTabChange("stock")}>
            Stock · cajas
          </TabBtn>
          <TabBtn active={tab === "alertas"} onClick={() => onTabChange("alertas")} accent="orange">
            <span className="relative inline-flex items-center gap-1">
              Alertas · vidriera ⭐
              {alertasCount > 0 && tab !== "alertas" ? (
                <span className="absolute -right-3 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-bazzar-naranja px-1 text-[10px] font-bold text-white">
                  {alertasCount}
                </span>
              ) : null}
            </span>
          </TabBtn>
          <TabBtn
            active={tab === "estadisticas"}
            onClick={() => onTabChange("estadisticas")}
            accent="blue"
          >
            Estadísticas
          </TabBtn>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {usesCabecera(tab) && !filtrosExpanded && filtrosActivos ? (
            <span className="hidden max-w-[140px] truncate rounded-full bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-900 lg:inline">
              {chips.slice(0, 2).join(" · ")}
            </span>
          ) : null}

          <select
            value={depositoActivo?.cliente_id ?? ""}
            onChange={(e) => onDepositoChange(Number(e.target.value))}
            className="max-w-[180px] min-h-[48px] rounded-xl border-2 border-slate-200 bg-white px-2 text-xs font-semibold text-slate-800 sm:max-w-[220px] sm:text-sm"
            aria-label="Depósito"
          >
            {depositos.map((d) => (
              <option key={d.cliente_id} value={d.cliente_id}>
                {d.codigo} · {d.nombre.slice(0, 18)} ({d.pares.toLocaleString("es-PY")} p)
              </option>
            ))}
          </select>

          {tab === "stock" && onToggleColapsarTodo ? (
            <button
              type="button"
              onClick={onToggleColapsarTodo}
              className={`min-h-[48px] shrink-0 rounded-xl border-2 px-3 text-xs font-black sm:px-4 sm:text-sm ${
                !colapsarTodo
                  ? "border-rimec-azul bg-rimec-azul text-white"
                  : "border-slate-300 bg-white text-slate-700 active:bg-slate-50"
              }`}
              aria-pressed={!colapsarTodo}
            >
              {colapsarTodo ? "Ver gradas ▾" : "Colapsar todo ▴"}
            </button>
          ) : null}

          {usesCabecera(tab) ? (
            <button
              type="button"
              onClick={onToggleFiltros}
              className={`min-h-[48px] shrink-0 rounded-xl border-2 px-3 text-xs font-black sm:px-4 sm:text-sm ${
                filtrosExpanded
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-orange-500 bg-orange-50 text-orange-700"
              }`}
            >
              CABECERA {filtrosExpanded ? "▴" : "▾"}
              {!filtrosExpanded ? (
                <span className="ml-1 hidden font-normal opacity-80 sm:inline">
                  · TOP {limit}
                </span>
              ) : null}
            </button>
          ) : null}
        </div>
      </div>

      {usesCabecera(tab) && !filtrosExpanded ? (
        <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-1 text-[11px] text-slate-500 sm:px-4">
          <span className="shrink-0 font-semibold tabular-nums text-slate-700">
            {totalMostrados.toLocaleString("es-PY")} · TOP {limit}
          </span>
          <span className="truncate">
            {chips.length > 0 ? chips.join(" · ") : "Sin filtros activos"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
