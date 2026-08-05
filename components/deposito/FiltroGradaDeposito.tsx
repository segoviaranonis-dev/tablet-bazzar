"use client";

import { useEffect, useState } from "react";

export type GradaDraft = { gradas: string[] };

type Props = {
  applied: GradaDraft;
  gradasOpciones: string[];
  onApply: (draft: GradaDraft) => void;
};

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
      className={`min-h-[44px] shrink-0 snap-center rounded-full border-2 px-4 text-sm font-semibold transition touch-manipulation ${
        active
          ? "border-orange-600 bg-orange-600 text-white"
          : "border-slate-200 bg-white text-slate-700 active:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

/** Filtro GRADA — draft local + botón Aplicar (paridad Report operativa). */
export function FiltroGradaDeposito({ applied, gradasOpciones, onApply }: Props) {
  const [draft, setDraft] = useState<GradaDraft>(applied);

  useEffect(() => {
    setDraft(applied);
  }, [applied]);

  const pendiente =
    draft.gradas.length !== applied.gradas.length ||
    [...draft.gradas].sort().join() !== [...applied.gradas].sort().join();

  const toggleGrada = (g: string) => {
    setDraft((prev) => ({
      gradas: prev.gradas.includes(g)
        ? prev.gradas.filter((x) => x !== g)
        : [...prev.gradas, g],
    }));
  };

  if (gradasOpciones.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-dashed border-orange-400/60 bg-orange-50/50 px-3 py-3">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-700">Grada</p>
          {pendiente ? (
            <p className="mt-0.5 text-[10px] font-medium text-amber-800">Cambios sin aplicar</p>
          ) : null}
          {applied.gradas.length > 0 && !pendiente ? (
            <p className="mt-0.5 text-[10px] font-medium text-slate-600">
              Activo: {applied.gradas.join(", ")}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={!pendiente}
          onClick={() => onApply(draft)}
          className={`min-h-[48px] shrink-0 rounded-xl px-6 text-sm font-black text-white shadow-sm transition touch-manipulation ${
            pendiente
              ? "bg-orange-600 active:bg-orange-700"
              : "cursor-not-allowed bg-slate-300 text-slate-500"
          }`}
        >
          Aplicar grada
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
        <Pill active={draft.gradas.length === 0} onClick={() => setDraft({ gradas: [] })}>
          Todas
        </Pill>
        {gradasOpciones.map((g) => (
          <Pill key={g} active={draft.gradas.includes(g)} onClick={() => toggleGrada(g)}>
            {g}
          </Pill>
        ))}
      </div>
    </div>
  );
}
