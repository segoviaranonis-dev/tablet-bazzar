"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DepositoFila } from "@/lib/cadena";
import type { FrancoAplicarMeta } from "@/lib/franco-tirador";
import {
  francoFiltersToSearchParams,
  labelsRemovidos,
  uniqLabels,
  uniqTerminosColor,
  type FrancoFilterItem,
  type FrancoTiradorFilterState,
} from "@/lib/franco-tirador-filters";
import type { TonoEstandarRow } from "@/lib/color-canon-franco";
import { TouchPad } from "@/components/cadena/TouchPad";

export type FrancoTiradorScope = {
  tipo: string;
  marcaIdDefault: number | null;
  marcaLabelDefault: string;
  estiloDefault: string;
  colorDefault: string;
  depositoLabel: string;
};

type FrancoOpciones = {
  marcas: FrancoFilterItem[];
  estilos: FrancoFilterItem[];
  tonosEstandar: TonoEstandarRow[];
};

type Props = {
  clienteId: number;
  scope: FrancoTiradorScope | null;
  disabled?: boolean;
  /** Modo sniper activo — catálogo reemplazado por hits Franco Tirador. */
  active?: boolean;
  /** Carga la cadena detrás con los hits del sniper. */
  onAplicar: (hits: DepositoFila[], meta: FrancoAplicarMeta) => void;
};

function TargetIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

/** Vía A — tono canónico en burbuja táctil (tablet/celular). */
function ColorTonoPicker({
  tonos,
  selected,
  onSelect,
}: {
  tonos: TonoEstandarRow[];
  selected?: string;
  onSelect: (etiqueta: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedRow = tonos.find((t) => t.etiqueta === selected);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!tonos.length) return null;

  function pick(etiqueta: string | undefined) {
    onSelect(etiqueta);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${
          selected
            ? "border-orange-500 bg-orange-50 text-orange-800"
            : "border-slate-200 bg-white text-slate-600"
        }`}
      >
        <span className="flex min-w-0 items-center gap-3 truncate text-left">
          {selectedRow ? (
            <>
              <span
                className="h-8 w-8 shrink-0 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200"
                style={{ backgroundColor: selectedRow.hex }}
                aria-hidden
              />
              <span className="truncate">{selectedRow.etiqueta}</span>
            </>
          ) : (
            <span className="truncate">Todos los tonos</span>
          )}
        </span>
        <span className="shrink-0 text-slate-400">{open ? "▴" : "▾"}</span>
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-[100] mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Elegí un tono</p>
          </div>
          <div className="grid max-h-[min(52dvh,320px)] grid-cols-4 gap-3 overflow-y-auto p-4 sm:grid-cols-5">
            <button
              type="button"
              aria-label="Todos los tonos"
              onClick={() => pick(undefined)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition active:scale-95 ${
                !selected ? "bg-orange-50 ring-2 ring-orange-400" : "hover:bg-slate-50"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-lg text-slate-400">
                ∅
              </span>
              <span className="max-w-full truncate text-[10px] font-semibold text-slate-500">Todos</span>
            </button>
            {tonos.map((t) => {
              const active = selected === t.etiqueta;
              return (
                <button
                  key={t.etiqueta}
                  type="button"
                  aria-label={t.etiqueta}
                  aria-pressed={active}
                  onClick={() => pick(active ? undefined : t.etiqueta)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition active:scale-95 ${
                    active ? "bg-orange-50 ring-2 ring-orange-400" : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-14 w-14 rounded-full border-2 shadow-sm ${
                      active ? "border-orange-500 ring-2 ring-orange-300 ring-offset-2" : "border-white"
                    }`}
                    style={{ backgroundColor: t.hex }}
                  />
                  <span
                    className={`max-w-full truncate text-[10px] font-semibold ${
                      active ? "text-orange-700" : "text-slate-600"
                    }`}
                  >
                    {t.etiqueta}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 p-3">
            <button
              type="button"
              onClick={() => pick(undefined)}
              className="min-h-[44px] px-2 text-xs font-bold text-slate-400"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-[44px] rounded-xl bg-orange-600 px-6 text-sm font-bold text-white"
            >
              Listo
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Vía B — texto + Enter (sin lista de checkboxes). */
function ColorTextoFranco({
  terminos,
  onChange,
}: {
  terminos: string[];
  onChange: (next: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  function confirmTerm() {
    const t = query.trim();
    if (t.length < 2) return;
    onChange(uniqTerminosColor([...terminos, t]));
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    confirmTerm();
  }

  function removeTerm(t: string) {
    onChange(terminos.filter((x) => x.toLowerCase() !== t.toLowerCase()));
  }

  const activo = terminos.length > 0 || query.trim().length >= 2;

  return (
    <div
      className={`flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border-2 px-2 py-1.5 transition ${
        activo ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white"
      }`}
    >
      {terminos.map((t) => (
        <span
          key={t.toLowerCase()}
          className="inline-flex max-w-full items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-bold text-orange-800 shadow-sm"
        >
          <span className="truncate">{t}</span>
          <button
            type="button"
            aria-label={`Quitar ${t}`}
            onClick={() => removeTerm(t)}
            className="shrink-0 text-orange-400 hover:text-orange-700"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={terminos.length ? "Otro término + Enter…" : "Ej. bronce, negro… + Enter"}
        className="min-w-[8rem] flex-1 bg-transparent py-1.5 text-sm font-semibold text-[#002B4E] outline-none placeholder:font-normal placeholder:text-slate-400"
      />
      {terminos.length > 0 ? (
        <button
          type="button"
          onClick={() => onChange([])}
          className="shrink-0 text-[10px] font-bold text-slate-400"
        >
          Limpiar
        </button>
      ) : null}
    </div>
  );
}

/** Multi-select por etiqueta (descp_marca / descp_grupo_estilo) — paridad catalogo-sql. */
function DropdownMultiLabels({
  emptyLabel,
  searchPlaceholder,
  options,
  selectedLabels,
  onChange,
  uppercaseLabels = false,
}: {
  emptyLabel: string;
  searchPlaceholder: string;
  options: FrancoFilterItem[];
  selectedLabels: string[];
  onChange: (labels: string[]) => void;
  uppercaseLabels?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

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

  function toggle(label: string) {
    const next = selectedLabels.includes(label)
      ? selectedLabels.filter((x) => x !== label)
      : uniqLabels([...selectedLabels, label]);
    onChange(next);
  }

  function selectAllVisible() {
    onChange(uniqLabels([...selectedLabels, ...filtered.map((o) => o.label)]));
  }

  const preview = selectedLabels.slice(0, 3);
  const fmt = (s: string) => (uppercaseLabels ? s.toUpperCase() : s);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border-2 px-4 text-xs font-semibold transition ${
          selectedLabels.length
            ? "border-orange-500 bg-orange-50 text-orange-900"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        <span className="truncate text-left text-inherit">
          {selectedLabels.length === 0
            ? emptyLabel
            : preview.length
              ? preview.map(fmt).join(" · ")
              : `${selectedLabels.length} seleccionados`}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {selectedLabels.length > 0 ? (
            <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] tabular-nums">{selectedLabels.length}</span>
          ) : null}
          <span className="text-slate-400">{open ? "▴" : "▾"}</span>
        </span>
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
            />
          </div>
          {filtered.length > 1 ? (
            <div className="border-b border-slate-100 px-3 py-2">
              <button
                type="button"
                onClick={selectAllVisible}
                className="text-[10px] font-bold uppercase text-orange-600"
              >
                + Todas las visibles ({filtered.length})
              </button>
            </div>
          ) : null}
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((o) => {
              const sel = selectedLabels.includes(o.label);
              return (
                <button
                  key={`${o.id}|${o.label}`}
                  type="button"
                  onClick={() => toggle(o.label)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs hover:bg-slate-50"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      sel ? "border-orange-600 bg-orange-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {sel ? "✓" : ""}
                  </span>
                  <span className={sel ? "font-bold text-orange-700" : "text-slate-600"}>{fmt(o.label)}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 p-3">
            <button type="button" onClick={() => onChange([])} className="text-[10px] font-bold text-slate-400">
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white"
            >
              Listo
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function allMarcaLabels(marcas: FrancoFilterItem[]): string[] {
  return uniqLabels(marcas.map((m) => m.label));
}

function defaultEstiloLabels(estilos: FrancoFilterItem[], estiloDefault?: string): string[] {
  if (!estilos.length) return [];
  const pref = estiloDefault?.trim();
  if (pref) {
    const match = estilos.find((e) => e.label.trim().toUpperCase() === pref.toUpperCase());
    if (match) return [match.label];
  }
  return [estilos[0].label];
}

export function FrancoTiradorButton({ clienteId, scope, disabled, active = false, onAplicar }: Props) {
  const [open, setOpen] = useState(false);
  const [filtros, setFiltros] = useState<FrancoTiradorFilterState>({
    tipo: "",
    marcas: [],
    estilos: [],
    colorTexto: [],
  });
  const [gradaInput, setGradaInput] = useState("");
  const [opciones, setOpciones] = useState<FrancoOpciones | null>(null);
  const [loadingOpciones, setLoadingOpciones] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultsAppliedRef = useRef(false);

  const resetResults = useCallback(() => {
    setGradaInput("");
    setError(null);
  }, []);

  const loadOpciones = useCallback(
    async (f: FrancoTiradorFilterState) => {
      if (!f.tipo) return;
      setLoadingOpciones(true);
      try {
        const p = francoFiltersToSearchParams({
          tipo: f.tipo,
          marcas: f.marcas,
          estilos: f.estilos,
          colorTexto: [],
        });
        p.set("modo", "opciones");
        const r = await fetch(`/api/deposito/${clienteId}/franco-tirador?${p}`, { cache: "no-store" });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Error opciones");
        setOpciones({
          marcas: data.marcas ?? [],
          estilos: data.estilos ?? [],
          tonosEstandar: data.tonosEstandar ?? [],
        });
      } catch {
        setOpciones(null);
      } finally {
        setLoadingOpciones(false);
      }
    },
    [clienteId],
  );

  function openModal() {
    if (!scope) return;
    resetResults();
    defaultsAppliedRef.current = false;
    const initial: FrancoTiradorFilterState = {
      tipo: scope.tipo,
      marcas: [],
      estilos: [],
      colorTexto: [],
    };
    setFiltros(initial);
    setOpen(true);
    void loadOpciones(initial);
  }

  useEffect(() => {
    if (!open || !opciones) return;

    setFiltros((prev) => {
      let marcas = prev.marcas;
      let estilos = prev.estilos;
      let changed = false;

      if (!defaultsAppliedRef.current && opciones.marcas.length > 0) {
        marcas = allMarcaLabels(opciones.marcas);
        changed = true;
        defaultsAppliedRef.current = true;
      }

      if (opciones.estilos.length > 0) {
        const valid =
          estilos.length > 0 && estilos.every((e) => opciones.estilos.some((o) => o.label === e));
        if (!valid) {
          estilos = defaultEstiloLabels(opciones.estilos, scope?.estiloDefault);
          changed = true;
        }
      }

      if (!changed) return prev;
      return { ...prev, marcas, estilos };
    });
  }, [open, opciones, scope?.estiloDefault]);

  const cascadeKey = `${filtros.tipo}|${filtros.marcas.join("\0")}|${filtros.estilos.join("\0")}`;
  useEffect(() => {
    if (!open) return;
    const snapshot: FrancoTiradorFilterState = {
      tipo: filtros.tipo,
      marcas: filtros.marcas,
      estilos: filtros.estilos,
      colorTexto: [],
    };
    const t = window.setTimeout(() => void loadOpciones(snapshot), 120);
    return () => window.clearTimeout(t);
  }, [open, cascadeKey, loadOpciones]);

  function patchFiltros(p: Partial<FrancoTiradorFilterState>) {
    setFiltros((prev) => {
      const next = { ...prev, ...p };
      if (p.marcas && labelsRemovidos(prev.marcas, p.marcas)) {
        next.estilos = [];
        next.tonoEstandar = undefined;
        next.colorTexto = [];
      }
      if (p.estilos && labelsRemovidos(prev.estilos, p.estilos)) {
        next.tonoEstandar = undefined;
        next.colorTexto = [];
      }
      return next;
    });
    resetResults();
  }

  async function procesar() {
    if (!scope) return;
    const grada = gradaInput.trim();

    setLoading(true);
    setError(null);
    try {
      const p = francoFiltersToSearchParams(filtros);
      if (grada) p.set("grada", grada);
      const r = await fetch(`/api/deposito/${clienteId}/franco-tirador?${p}`, { cache: "no-store" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Error al procesar");
      const hits: DepositoFila[] = data.hits ?? [];
      const totalPares = Number(data.total_pares) || 0;
      if (hits.length === 0) {
        setError("Sin stock con esos criterios.");
        return;
      }
      onAplicar(hits, {
        grada: grada || undefined,
        total: hits.length,
        totalPares,
      });
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setOpen(false);
    resetResults();
    setOpciones(null);
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled || !scope}
        onClick={openModal}
        title={
          active
            ? "Franco Tirador ACTIVO — catálogo muy limitado por el filtro sniper"
            : "Franco Tirador — filtro sniper"
        }
        aria-label={
          active ? "Franco Tirador activo — catálogo limitado" : "Franco Tirador — abrir filtro sniper"
        }
        aria-pressed={active}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg border-2 transition disabled:opacity-40 ${
          active
            ? "border-[#fef08a] bg-[#facc15] text-[#001829] shadow-[0_0_0_2px_#002B4E,0_0_16px_rgba(250,204,21,0.95)]"
            : "border-white/40 bg-white/10 text-white active:bg-white/25"
        }`}
      >
        <TargetIcon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
        {active ? (
          <span
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#002B4E] bg-[#ea580c]"
            aria-hidden
          />
        ) : null}
      </button>

      {open && scope ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#002B4E]/20 bg-white shadow-xl">
            <header className="border-b border-[#e2e8f0] bg-[#002B4E] px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TargetIcon className="h-6 w-6" />
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide">Franco Tirador</h2>
                    <p className="text-[10px] text-white/80">{scope.depositoLabel}</p>
                  </div>
                </div>
                <button type="button" onClick={close} className="rounded-lg px-2 py-1 text-xl leading-none text-white/90">
                  ×
                </button>
              </div>
            </header>

            <div className="space-y-3 overflow-y-auto p-4">
              <div className="rounded-xl bg-[#f1f5f9] px-3 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#64748b]">Tipo</span>
                <p className="text-lg font-bold uppercase text-[#002B4E]">{scope.tipo}</p>
              </div>

              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#002B4E]">
                  Marca <span className="font-normal normal-case text-[#64748b]">(opcional)</span>
                </span>
                <DropdownMultiLabels
                  emptyLabel="Todas las marcas"
                  searchPlaceholder="Buscar marca…"
                  options={opciones?.marcas ?? []}
                  selectedLabels={filtros.marcas}
                  onChange={(marcas) => patchFiltros({ marcas: uniqLabels(marcas) })}
                />
              </div>

              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#002B4E]">
                  Estilo <span className="font-normal normal-case text-[#64748b]">(opcional · multi)</span>
                </span>
                <DropdownMultiLabels
                  emptyLabel="Todos los estilos"
                  searchPlaceholder="Buscar estilo…"
                  uppercaseLabels
                  options={opciones?.estilos ?? []}
                  selectedLabels={filtros.estilos}
                  onChange={(estilos) => {
                    const next = uniqLabels(estilos);
                    if (next.length === 0) return;
                    patchFiltros({ estilos: next });
                  }}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#002B4E]">
                    Tono <span className="font-normal normal-case text-[#64748b]">(principal · opcional)</span>
                  </span>
                  <ColorTonoPicker
                    tonos={opciones?.tonosEstandar ?? []}
                    selected={filtros.tonoEstandar}
                    onSelect={(tonoEstandar) => patchFiltros({ tonoEstandar })}
                  />
                </div>
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#002B4E]">
                    Texto <span className="font-normal normal-case text-[#64748b]">(Enter · opcional)</span>
                  </span>
                  <ColorTextoFranco
                    terminos={filtros.colorTexto}
                    onChange={(colorTexto) => patchFiltros({ colorTexto: uniqTerminosColor(colorTexto) })}
                  />
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#002B4E]">
                  Talla <span className="font-normal normal-case text-[#64748b]">(opcional)</span>
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={gradaInput}
                  onChange={(e) => setGradaInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="39 — vacío = todas"
                  className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 text-2xl font-bold tabular-nums text-[#002B4E] outline-none focus:border-[#002B4E]"
                />
              </label>

              {loadingOpciones ? <p className="text-xs text-[#64748b]">Actualizando opciones…</p> : null}
              {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

              <TouchPad
                onClick={procesar}
                disabled={loading}
                ariaLabel="Procesar Franco Tirador"
                className="w-full rounded-xl border border-[#ea580c] bg-[#ea580c] py-3 text-center text-sm font-bold uppercase tracking-wide text-white disabled:opacity-50"
              >
                {loading ? "Procesando…" : "Procesar"}
              </TouchPad>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
