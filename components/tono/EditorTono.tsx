"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TouchPad } from "@/components/cadena/TouchPad";
import {
  COLORES_ESTANDAR_DEFAULT,
  estandarToTono,
  type ColorEstandar,
} from "@/lib/tono/colores-estandar";
import { parseTonoCanon, tonoCircleStyle, type TonoCanon } from "@/lib/tono/color-canon";

type Props = {
  catalog?: ColorEstandar[];
  tonoCanon?: unknown;
  tonoEtiqueta?: string | null;
  colorId?: number | null;
  colorNombre?: string | null;
  editable?: boolean;
  onAssigned?: (etiqueta: string | null) => void;
};

export function EditorTonoBadge({
  catalog: catalogProp,
  tonoCanon,
  tonoEtiqueta,
  colorId,
  colorNombre,
  editable = true,
  onAssigned,
}: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localEtiqueta, setLocalEtiqueta] = useState<string | null>(tonoEtiqueta ?? null);
  const [localCanon, setLocalCanon] = useState<TonoCanon | null>(() => parseTonoCanon(tonoCanon));
  const [catalog, setCatalog] = useState<ColorEstandar[]>(catalogProp ?? COLORES_ESTANDAR_DEFAULT);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLocalEtiqueta(tonoEtiqueta ?? null);
    setLocalCanon(parseTonoCanon(tonoCanon));
  }, [tonoEtiqueta, tonoCanon]);

  useEffect(() => {
    if (catalogProp?.length) {
      setCatalog(catalogProp);
      return;
    }
    fetch("/api/tono", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.estandar?.length) setCatalog(d.estandar);
      })
      .catch(() => {});
  }, [catalogProp]);

  const assign = useCallback(
    async (c: ColorEstandar) => {
      if (!editable || !colorId) return;
      setSaving(true);
      try {
        const tono = estandarToTono(c);
        const r = await fetch("/api/tono", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            color_id: colorId,
            tono_canon: tono,
            sync_predominante: false,
          }),
        });
        const data = await r.json();
        if (!data.ok) throw new Error(data.error ?? "No se pudo asignar TONO");
        setLocalEtiqueta(c.etiqueta);
        setLocalCanon(tono);
        onAssigned?.(c.etiqueta);
        setOpen(false);
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    },
    [colorId, editable, onAssigned],
  );

  const hasTono = !!localEtiqueta;
  const swatchStyle = localCanon
    ? tonoCircleStyle(localCanon)
    : hasTono
      ? { backgroundColor: "#94a3b8" }
      : undefined;

  return (
    <div className="relative shrink-0">
      <button
        ref={anchorRef}
        type="button"
        disabled={!editable || saving || !colorId}
        onClick={() => editable && colorId && setOpen((v) => !v)}
        className={`flex min-w-[88px] items-center gap-2 rounded-xl border px-2.5 py-2 shadow-sm transition ${
          hasTono
            ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
            : "border-dashed border-slate-300 bg-white"
        } ${editable && colorId ? "active:scale-[0.98]" : "opacity-70"}`}
        aria-label={hasTono ? `TONO ${localEtiqueta}` : "Asignar TONO"}
      >
        <span
          className={`h-7 w-7 shrink-0 rounded-full border-2 ${
            hasTono ? "border-orange-300" : "border-slate-300 border-dashed"
          }`}
          style={swatchStyle ?? { backgroundColor: "#f1f5f9" }}
        />
        <span className="min-w-0 text-left">
          <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">Tono</span>
          <span className="block max-w-[72px] truncate text-[10px] font-bold uppercase text-rimec-azul">
            {hasTono ? localEtiqueta : "Sin asignar"}
          </span>
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20"
            aria-label="Cerrar paleta TONO"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,320px)] rounded-xl border border-orange-200 bg-white p-3 shadow-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Asignar TONO · solo este color
            </p>
            <div className="flex flex-wrap gap-2">
              {catalog.map((c) => {
                const t = estandarToTono(c);
                const active = localEtiqueta === c.etiqueta;
                return (
                  <TouchPad
                    key={c.etiqueta}
                    onClick={() => assign(c)}
                    ariaLabel={c.etiqueta}
                    className={`h-9 w-9 rounded-full border-2 p-0 ${active ? "border-orange-600 ring-2 ring-orange-300" : "border-slate-200"}`}
                  >
                    <span className="block h-full w-full rounded-full" style={tonoCircleStyle(t)} />
                  </TouchPad>
                );
              })}
            </div>
            {saving ? (
              <p className="mt-2 text-center text-xs text-orange-600">Guardando…</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

type FiltroProps = {
  catalog: ColorEstandar[];
  tonos: string[];
  sinTono: boolean;
  onChange: (patch: { tonos?: string[]; sinTono?: boolean }) => void;
};

export function FiltroTonoRow({ catalog, tonos, sinTono, onChange }: FiltroProps) {
  const items = catalog.length ? catalog : COLORES_ESTANDAR_DEFAULT;

  const toggleEtiqueta = (etiqueta: string) => {
    onChange({
      sinTono: false,
      tonos: tonos.includes(etiqueta) ? tonos.filter((t) => t !== etiqueta) : [...tonos, etiqueta],
    });
  };

  return (
    <div className="flex flex-col gap-1.5 border-t border-orange-50 pt-3 sm:flex-row sm:items-start sm:gap-3">
      <span className="chip-filter-label shrink-0 pt-1 sm:w-20">Tono</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <TouchPad
          onClick={() => onChange({ tonos: [], sinTono: false })}
          ariaLabel="Todos los tonos"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 p-0 ${
            !sinTono && tonos.length === 0 ? "border-orange-600 ring-2 ring-orange-300" : "border-slate-300"
          }`}
        >
          <span className="block h-6 w-6 rounded-full bg-[conic-gradient(red,yellow,green,blue,magenta,red)]" />
        </TouchPad>

        <TouchPad
          onClick={() => onChange({ sinTono: !sinTono, tonos: [] })}
          ariaLabel="Sin TONO asignado"
          className={`chip-filter shrink-0 ${sinTono ? "chip-filter-active" : ""}`}
        >
          Sin asignar
        </TouchPad>

        <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 snap-x">
          {items.map((c) => {
            const on = tonos.includes(c.etiqueta);
            const t = estandarToTono(c);
            return (
              <TouchPad
                key={c.etiqueta}
                onClick={() => toggleEtiqueta(c.etiqueta)}
                ariaLabel={`TONO ${c.etiqueta}`}
                className={`flex h-9 w-9 shrink-0 snap-center items-center justify-center rounded-full border-2 p-0 ${
                  on ? "border-orange-600 ring-2 ring-orange-300" : "border-slate-200"
                }`}
              >
                <span className="block h-6 w-6 rounded-full" style={tonoCircleStyle(t)} />
              </TouchPad>
            );
          })}
        </div>
      </div>
    </div>
  );
}
