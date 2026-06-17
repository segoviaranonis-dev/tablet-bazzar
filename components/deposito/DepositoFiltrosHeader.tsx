"use client";

import { useEffect, useRef, useState } from "react";
import type { DepositoFilterState, DepositoLimit } from "@/lib/deposito-filters";
import { DEPOSITO_LIMIT_OPTIONS, depositoFiltersActive, summarizeDepositoFilters } from "@/lib/deposito-filters";

export type DepositoFiltrosData = {
  generos: { id: number; label: string; count: number }[];
  marcas: { id: number; label: string; count: number }[];
  estilos: { id: number; label: string; count: number }[];
  tipo1: { id: number; label: string; count: number }[];
  lineas: { id: number; label: string; count: number }[];
  colores: { id: number; label: string; count: number; hex: string }[];
  hexPalette: string[];
  resumen?: { skus: number; pares: number };
};

type Props = {
  filtros: DepositoFilterState;
  onChange: (next: DepositoFilterState) => void;
  data: DepositoFiltrosData | null;
  limit: DepositoLimit;
  onLimitChange: (n: DepositoLimit) => void;
  totalMostrados: number;
  expanded: boolean;
  onToggleExpanded: () => void;
};

function cap(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] shrink-0 snap-center rounded-full border-2 px-4 text-sm font-semibold transition-colors ${
        active
          ? "border-orange-600 bg-orange-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-orange-300"
      }`}
    >
      {children}
    </button>
  );
}

function DropdownIds({
  label,
  options,
  selectedIds,
  onChange,
  placeholder,
}: {
  label: string;
  options: { id: number; label: string }[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [temp, setTemp] = useState<number[]>(selectedIds);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTemp(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered =
    query.length >= 1
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex min-h-[44px] items-center gap-2 rounded-xl border-2 px-4 text-xs font-semibold transition ${
          selectedIds.length
            ? "border-orange-500 bg-orange-50 text-orange-800"
            : "border-slate-200 bg-white text-slate-600"
        }`}
      >
        {label}
        {selectedIds.length > 0 ? (
          <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] tabular-nums">{selectedIds.length}</span>
        ) : null}
        <span className="text-slate-400">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((o) => {
              const sel = temp.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() =>
                    setTemp(sel ? temp.filter((x) => x !== o.id) : [...temp, o.id])
                  }
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs hover:bg-slate-50"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      sel ? "border-orange-600 bg-orange-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {sel ? "✓" : ""}
                  </span>
                  <span className={sel ? "font-bold text-orange-700" : "text-slate-600"}>{o.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 p-3">
            <button type="button" onClick={() => setTemp([])} className="text-[10px] font-bold text-slate-400">
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(temp);
                setOpen(false);
              }}
              className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white"
            >
              Aplicar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DepositoFiltrosHeader({
  filtros,
  onChange,
  data,
  limit,
  onLimitChange,
  totalMostrados,
  expanded,
  onToggleExpanded,
}: Props) {
  const patch = (p: Partial<DepositoFilterState>) => onChange({ ...filtros, ...p });
  const resumenChips = summarizeDepositoFilters(filtros, data);

  const onHex = (hex: string) => {
    if (!hex || filtros.colorHex === hex) {
      patch({ colorHex: "", colorIds: [] });
      return;
    }
    const ids = (data?.colores ?? []).filter((c) => c.hex === hex).map((c) => c.id);
    patch({ colorHex: hex, colorIds: ids });
  };

  if (!expanded) {
    return (
      <div className="flex min-h-[52px] items-center gap-2 border-t border-orange-100 bg-white px-3 py-2">
        <p className="shrink-0 text-xs font-semibold text-orange-700 tabular-nums">
          {totalMostrados.toLocaleString("es-PY")} · TOP {limit}
        </p>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="flex gap-1.5">
            {resumenChips.length > 0 ? (
              resumenChips.map((c) => (
                <span
                  key={c}
                  className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-medium text-orange-900"
                >
                  {c}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Sin filtros activos</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="min-h-[44px] shrink-0 rounded-xl border-2 border-orange-500 bg-orange-50 px-4 text-sm font-bold text-orange-700"
        >
          Filtros ▾
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-[min(52dvh,520px)] space-y-2 overflow-y-auto border-t border-orange-100 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-orange-700">{totalMostrados.toLocaleString("es-PY")} moléculas</span>
          {data?.resumen ? (
            <span className="text-slate-500">
              {" "}
              · depósito {Number(data.resumen.pares).toLocaleString("es-PY")} pares
            </span>
          ) : null}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Top/marca</span>
          {DEPOSITO_LIMIT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onLimitChange(n)}
              className={`min-h-[36px] rounded-lg border px-2.5 text-xs font-bold ${
                limit === n ? "border-orange-600 bg-orange-600 text-white" : "border-slate-200 text-slate-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {depositoFiltersActive(filtros) ? (
          <button
            type="button"
            onClick={() =>
              onChange({
                generoId: "",
                marcaId: "",
                grupoEstiloId: "",
                tipo1Ids: [],
                lineaIds: [],
                colorIds: [],
                colorHex: "",
                q: "",
              })
            }
            className="text-xs font-semibold text-red-600 underline-offset-2 hover:underline"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div className="space-y-3 rounded-2xl border border-orange-100 bg-[#fffaf7] p-3 shadow-sm">
        {data?.generos && data.generos.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <span className="shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:w-16">
              Género
            </span>
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 snap-x">
              <Pill active={!filtros.generoId} onClick={() => patch({ generoId: "" })}>
                Todos
              </Pill>
              {data.generos.map((g) => (
                <Pill
                  key={g.id}
                  active={filtros.generoId === String(g.id)}
                  onClick={() => patch({ generoId: filtros.generoId === String(g.id) ? "" : String(g.id) })}
                >
                  {cap(g.label)} ({g.count})
                </Pill>
              ))}
            </div>
          </div>
        ) : null}

        {data?.marcas && data.marcas.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <span className="shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:w-16">
              Marca
            </span>
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 snap-x">
              <Pill active={!filtros.marcaId} onClick={() => patch({ marcaId: "" })}>
                Todas
              </Pill>
              {data.marcas.map((m) => (
                <Pill
                  key={m.id}
                  active={filtros.marcaId === String(m.id)}
                  onClick={() => patch({ marcaId: filtros.marcaId === String(m.id) ? "" : String(m.id) })}
                >
                  {cap(m.label)}
                </Pill>
              ))}
            </div>
          </div>
        ) : null}

        {data?.estilos && data.estilos.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <span className="shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:w-16">
              Estilo
            </span>
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 snap-x">
              <Pill active={!filtros.grupoEstiloId} onClick={() => patch({ grupoEstiloId: "" })}>
                Todos
              </Pill>
              {data.estilos.slice(0, 20).map((e) => (
                <Pill
                  key={e.id}
                  active={filtros.grupoEstiloId === String(e.id)}
                  onClick={() =>
                    patch({ grupoEstiloId: filtros.grupoEstiloId === String(e.id) ? "" : String(e.id) })
                  }
                >
                  {e.label}
                </Pill>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-orange-50 pt-3">
          <DropdownIds
            label="Línea"
            options={data?.lineas ?? []}
            selectedIds={filtros.lineaIds}
            onChange={(lineaIds) => patch({ lineaIds })}
            placeholder="Buscar línea…"
          />
          <DropdownIds
            label="Color"
            options={(data?.colores ?? []).map((c) => ({ id: c.id, label: c.label }))}
            selectedIds={filtros.colorIds}
            onChange={(colorIds) => patch({ colorIds, colorHex: "" })}
            placeholder="Buscar color…"
          />
          <DropdownIds
            label="Tipo 1"
            options={data?.tipo1 ?? []}
            selectedIds={filtros.tipo1Ids}
            onChange={(tipo1Ids) => patch({ tipo1Ids })}
            placeholder="Buscar tipo…"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:w-16">
            Buscar
          </span>
          <input
            type="search"
            value={filtros.q}
            onChange={(e) => patch({ q: e.target.value })}
            placeholder="Buscar modelos…"
            className="min-h-[48px] flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 text-base focus:border-orange-500 focus:outline-none"
          />
        </div>

        {data?.hexPalette && data.hexPalette.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-orange-50 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Color</span>
            <button
              type="button"
              onClick={() => onHex("")}
              aria-label="Todos los colores"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${
                !filtros.colorHex ? "border-orange-600 ring-2 ring-orange-300" : "border-slate-300 opacity-70"
              }`}
            >
              <span className="block h-5 w-5 rounded-full bg-[conic-gradient(red,yellow,green,blue,magenta,red)]" />
            </button>
            {data.hexPalette.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onHex(hex)}
                aria-label={`Color ${hex}`}
                className={`h-8 w-8 shrink-0 rounded-full border-2 transition hover:scale-110 ${
                  filtros.colorHex === hex ? "border-orange-600 ring-2 ring-orange-300" : "border-slate-200"
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onToggleExpanded}
        className="sticky bottom-0 w-full min-h-[48px] rounded-xl border-2 border-orange-400 bg-orange-600 text-sm font-bold text-white shadow-md"
      >
        Ocultar filtros · ver catálogo ▲
      </button>
    </div>
  );
}
