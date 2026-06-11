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
    <div className="flex h-full min-h-0 flex-col bg-[#f4f1ec]/95">
      <TouchPad
        onClick={hasSelection ? onClear : () => {}}
        ariaLabel={hasSelection ? `Limpiar ${titulo}` : titulo}
        className={`shrink-0 border-b border-[#c4bdb4] px-1 py-2 text-center ${
          hasSelection ? "active:bg-[#e8e2d9]" : ""
        }`}
      >
        <span className="font-br block text-[11px] tracking-wide text-[#1a1a1a]">{titulo}</span>
        {hasSelection ? (
          <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.15em] text-[#1b2a41]">
            {selected.length} · limpiar
          </span>
        ) : (
          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-[#6b6560]">
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
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ec]"
                  : "border-[#8a8278] bg-white text-[#1a1a1a] active:bg-[#e8e2d9]"
              }`}
            >
              <span
                className={`block leading-tight ${
                  variant === "referencia"
                    ? "font-mono text-[11px] tracking-wide"
                    : "font-br text-[12px] tracking-wide"
                }`}
              >
                {item.label}
              </span>
              {item.sub ? (
                <span
                  className={`mt-0.5 block truncate text-[9px] uppercase tracking-[0.1em] ${
                    active ? "text-[#f4f1ec]/75" : "text-[#6b6560]"
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
