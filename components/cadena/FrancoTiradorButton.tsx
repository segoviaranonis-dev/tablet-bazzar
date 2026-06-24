"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DepositoFila } from "@/lib/cadena";
import type { FrancoAplicarMeta } from "@/lib/franco-tirador";
import {
  coloresQueCoinciden,
  francoFiltersToSearchParams,
  labelsRemovidos,
  uniqLabels,
  type FrancoFilterItem,
  type FrancoTiradorFilterState,
} from "@/lib/franco-tirador-filters";
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
  colores: string[];
};

type Props = {
  clienteId: number;
  scope: FrancoTiradorScope | null;
  disabled?: boolean;
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

function uniqStr(vals: string[]): string[] {
  return uniqLabels(vals);
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
            ? "border-orange-500 bg-orange-50 text-orange-800"
            : "border-slate-200 bg-white text-slate-600"
        }`}
      >
        <span className="truncate text-left">
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

/** Color: escribir + Enter selecciona todos los que contienen el texto. */
function ColorFrancoInput({
  options,
  selected,
  colorBuscar,
  onChange,
  onBuscarChange,
}: {
  options: string[];
  selected: string[];
  colorBuscar: string;
  onChange: (vals: string[]) => void;
  onBuscarChange: (q: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(colorBuscar);
  /** Términos confirmados con Enter (ej. azul, negro) — visibles aunque ya no estén en el input. */
  const [terminos, setTerminos] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(colorBuscar);
  }, [colorBuscar]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered =
    query.length >= 2 ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase())) : options;

  function addTermino(needle: string) {
    const t = needle.trim();
    if (t.length < 2) return;
    setTerminos((prev) => {
      if (prev.some((x) => x.toLowerCase() === t.toLowerCase())) return prev;
      return [...prev, t];
    });
  }

  function applyQuery(q: string) {
    const needle = q.trim();
    if (needle.length < 2) return;
    const matches = coloresQueCoinciden(options, needle);
    if (matches.length) {
      onChange(uniqStr([...selected, ...matches]));
      addTermino(needle);
      setQuery("");
      onBuscarChange("");
      setOpen(true);
    } else {
      onBuscarChange(needle);
      onChange([]);
    }
  }

  function removeTermino(termino: string) {
    const tl = termino.toLowerCase();
    setTerminos((prev) => {
      const otros = prev.filter((t) => t.toLowerCase() !== tl);
      const keep = new Set(otros.flatMap((t) => coloresQueCoinciden(options, t)));
      const quitar = new Set(coloresQueCoinciden(options, termino));
      onChange(selected.filter((c) => keep.has(c) || !quitar.has(c)));
      return otros;
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    applyQuery(query);
  }

  const totalSel = selected.length;
  const activo = totalSel > 0 || terminos.length > 0 || colorBuscar.length >= 2;

  return (
    <div ref={ref} className="relative">
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
              onClick={() => removeTermino(t)}
              className="shrink-0 text-orange-400 hover:text-orange-700"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onBuscarChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={terminos.length ? "Otro color + Enter…" : "Escribí color (ej. negro) + Enter"}
          className="min-w-[8rem] flex-1 bg-transparent py-1.5 text-sm font-semibold text-[#002B4E] outline-none placeholder:font-normal placeholder:text-slate-400"
        />
        {totalSel > 0 ? (
          <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-orange-700">
            {totalSel}
          </span>
        ) : colorBuscar.length >= 2 ? (
          <span className="shrink-0 text-[10px] font-bold text-orange-600">buscar</span>
        ) : null}
        <button type="button" onClick={() => setOpen(!open)} className="shrink-0 px-1 text-slate-400">
          {open ? "▴" : "▾"}
        </button>
      </div>
      {open && options.length > 0 ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {query.length >= 2 ? (
            <div className="border-b border-orange-100 bg-orange-50 px-3 py-2">
              <button
                type="button"
                onClick={() => applyQuery(query)}
                className="text-[10px] font-bold uppercase text-orange-700"
              >
                Enter · seleccionar {filtered.length} con &quot;{query.trim()}&quot;
              </button>
            </div>
          ) : null}
          <div className="max-h-48 overflow-y-auto">
            {filtered.slice(0, 80).map((o, idx) => {
              const sel = selected.includes(o);
              const safeKey = o.length > 0 ? o : `__empty_${idx}`;
              return (
                <button
                  key={safeKey}
                  type="button"
                  onClick={() => {
                    const next = sel ? selected.filter((x) => x !== o) : uniqStr([...selected, o]);
                    onChange(next);
                    onBuscarChange("");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-xs hover:bg-slate-50"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      sel ? "border-orange-600 bg-orange-600 text-white" : "border-slate-300"
                    }`}
                  >
                    {sel ? "✓" : ""}
                  </span>
                  <span className={sel ? "font-bold text-orange-700" : "text-slate-600"}>{o}</span>
                </button>
              );
            })}
          </div>
          {selected.length > 0 || terminos.length > 0 ? (
            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                onClick={() => {
                  onChange([]);
                  onBuscarChange("");
                  setTerminos([]);
                  setQuery("");
                }}
                className="text-[10px] font-bold text-slate-400"
              >
                Limpiar selección ({selected.length})
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function FrancoTiradorButton({ clienteId, scope, disabled, onAplicar }: Props) {
  const [open, setOpen] = useState(false);
  const [filtros, setFiltros] = useState<FrancoTiradorFilterState>({
    tipo: "",
    marcas: [],
    estilos: [],
    colores: [],
    colorBuscar: "",
  });
  const [gradaInput, setGradaInput] = useState("");
  const [opciones, setOpciones] = useState<FrancoOpciones | null>(null);
  const [loadingOpciones, setLoadingOpciones] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          colores: [],
        });
        p.set("modo", "opciones");
        const r = await fetch(`/api/deposito/${clienteId}/franco-tirador?${p}`, { cache: "no-store" });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Error opciones");
        setOpciones({
          marcas: data.marcas ?? [],
          estilos: data.estilos ?? [],
          colores: data.colores ?? [],
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
    const initial: FrancoTiradorFilterState = {
      tipo: scope.tipo,
      marcas: scope.marcaLabelDefault ? [scope.marcaLabelDefault] : [],
      estilos: [],
      colores: [],
      colorBuscar: "",
    };
    setFiltros(initial);
    setOpen(true);
    void loadOpciones(initial);
  }

  useEffect(() => {
    if (!open || !opciones || filtros.estilos.length) return;
    if (!scope?.estiloDefault) return;
    const match = opciones.estilos.find(
      (e) => e.label.trim().toUpperCase() === scope.estiloDefault.trim().toUpperCase(),
    );
    if (match) setFiltros((prev) => ({ ...prev, estilos: [match.label] }));
  }, [open, opciones, scope?.estiloDefault, filtros.estilos.length]);

  const cascadeKey = `${filtros.tipo}|${filtros.marcas.join("\0")}|${filtros.estilos.join("\0")}`;
  useEffect(() => {
    if (!open) return;
    const snapshot: FrancoTiradorFilterState = {
      tipo: filtros.tipo,
      marcas: filtros.marcas,
      estilos: filtros.estilos,
      colores: [],
    };
    const t = window.setTimeout(() => void loadOpciones(snapshot), 120);
    return () => window.clearTimeout(t);
  }, [open, cascadeKey, loadOpciones]);

  function patchFiltros(p: Partial<FrancoTiradorFilterState>) {
    setFiltros((prev) => {
      const next = { ...prev, ...p };
      if (p.marcas && labelsRemovidos(prev.marcas, p.marcas)) {
        next.estilos = [];
        next.colores = [];
        next.colorBuscar = "";
      }
      if (p.estilos && labelsRemovidos(prev.estilos, p.estilos)) {
        next.colores = [];
        next.colorBuscar = "";
      }
      return next;
    });
    resetResults();
  }

  async function procesar() {
    if (!scope) return;
    const grada = gradaInput.trim();

    let colores = filtros.colores;
    let colorBuscar = filtros.colorBuscar?.trim() ?? "";
    if (!colores.length && colorBuscar.length >= 2 && opciones?.colores.length) {
      colores = coloresQueCoinciden(opciones.colores, colorBuscar);
    }

    setLoading(true);
    setError(null);
    try {
      const payload: FrancoTiradorFilterState = {
        ...filtros,
        colores,
        colorBuscar: colores.length ? undefined : colorBuscar.length >= 2 ? colorBuscar : undefined,
      };
      const p = francoFiltersToSearchParams(payload);
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
        title="Franco Tirador"
        aria-label="Franco Tirador"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/40 bg-white/10 text-white transition active:bg-white/25 disabled:opacity-40"
      >
        <TargetIcon className="h-5 w-5" />
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
                  onChange={(estilos) => patchFiltros({ estilos: uniqLabels(estilos) })}
                />
              </div>

              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#002B4E]">
                  Color <span className="font-normal normal-case text-[#64748b]">(opcional)</span>
                </span>
                <ColorFrancoInput
                  key={`${filtros.marcas.join("|")}|${filtros.estilos.join("|")}`}
                  options={opciones?.colores ?? []}
                  selected={filtros.colores}
                  colorBuscar={filtros.colorBuscar ?? ""}
                  onChange={(colores) => patchFiltros({ colores, colorBuscar: "" })}
                  onBuscarChange={(q) => setFiltros((prev) => ({ ...prev, colorBuscar: q }))}
                />
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
