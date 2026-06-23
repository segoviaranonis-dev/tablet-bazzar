"use client";

import { TouchPad } from "@/components/cadena/TouchPad";

export type MultiSelectItem = {
  id: string;
  label: string;
  sub?: string;
};

type Props = {
  titulo: string;
  items: MultiSelectItem[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  variant?: "estilo" | "referencia";
};

export function MultiSelectFlotante({
  titulo,
  items,
  selected,
  onToggle,
  onClear,
  variant = "estilo",
}: Props) {
  const hasSelection = selected.length > 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f1f5f9]/95">
      <TouchPad
        onClick={hasSelection ? onClear : () => {}}
        ariaLabel={hasSelection ? `Limpiar ${titulo}` : titulo}
        className={`shrink-0 border-b border-[#e2e8f0] px-1 py-2 text-center ${
          hasSelection ? "active:bg-[#f1f5f9]" : ""
        }`}
      >
        <span className="font-semibold block text-[11px] tracking-wide text-slate-900">{titulo}</span>
        {hasSelection ? (
          <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-bazzar-naranja">
            {selected.length} · limpiar
          </span>
        ) : (
          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-[#64748b]">
            todos
          </span>
        )}
      </TouchPad>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-1.5 py-2 snap-y">
        {items.map((item) => {
          const active = selected.includes(item.id);
          return (
            <TouchPad
              key={item.id}
              onClick={() => onToggle(item.id)}
              ariaLabel={item.label}
              className={`min-h-[52px] w-full shrink-0 snap-start border px-2 py-2 text-left transition-colors duration-100 ${
                active
                  ? "border-bazzar-naranja bg-gradient-to-br from-bazzar-naranja-light to-bazzar-naranja text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-900 active:bg-orange-50"
              }`}
            >
              <span
                className={`block leading-tight ${
                  variant === "referencia"
                    ? "font-mono text-[11px] tracking-wide"
                    : "font-semibold text-[12px] tracking-wide"
                }`}
              >
                {item.label}
              </span>
              {item.sub ? (
                <span
                  className={`mt-0.5 block truncate text-[9px] uppercase tracking-[0.1em] ${
                    active ? "text-[#f1f5f9]/75" : "text-[#64748b]"
                  }`}
                >
                  {item.sub}
                </span>
              ) : null}
            </TouchPad>
          );
        })}
      </div>
    </div>
  );
}
