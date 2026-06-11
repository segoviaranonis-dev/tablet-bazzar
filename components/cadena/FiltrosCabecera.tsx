"use client";

import { TouchPad } from "@/components/cadena/TouchPad";
import type { FiltrosEntrada, OpcionChip } from "@/lib/cadena-entrada-filtros";
import { toggleChip } from "@/lib/cadena-entrada-filtros";

type RowProps = {
  label: string;
  todosLabel: string;
  items: OpcionChip[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
};

function FilaChips({ label, todosLabel, items, selected, onToggle, onClear }: RowProps) {
  const todosActivo = selected.length === 0;

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
      <span className="shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6560] sm:w-20">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 snap-x">
        <TouchPad
          onClick={onClear}
          ariaLabel={todosLabel}
          className={`chip-filter shrink-0 snap-center ${todosActivo ? "chip-filter-active" : ""}`}
        >
          {todosLabel}
        </TouchPad>
        {items.map((item) => {
          const on = selected.includes(item.id);
          return (
            <TouchPad
              key={item.id}
              onClick={() => onToggle(item.id)}
              ariaLabel={item.label}
              className={`chip-filter shrink-0 snap-center ${on ? "chip-filter-active" : ""}`}
            >
              <span className="block max-w-[140px] truncate">{item.label}</span>
            </TouchPad>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  filtros: FiltrosEntrada;
  generos: OpcionChip[];
  marcas: OpcionChip[];
  estilos: OpcionChip[];
  tipos: OpcionChip[];
  referencias: { key: string; linea: string; referencia: string; count?: number }[];
  onChange: (next: FiltrosEntrada) => void;
  onEnter?: () => void;
};

export function FiltrosCabecera({
  filtros,
  generos,
  marcas,
  estilos,
  tipos,
  referencias,
  onChange,
  onEnter,
}: Props) {
  const set = (patch: Partial<FiltrosEntrada>) => onChange({ ...filtros, ...patch });

  const refChips = referencias.slice(0, 48).map((r) => ({
    id: r.key,
    label: `${r.linea}.${r.referencia}`,
    count: r.count ?? 0,
  }));

  return (
    <div className="space-y-3 rounded-sm border border-[#c4bdb4] bg-white p-3 shadow-sm">
      <FilaChips
        label="Género"
        todosLabel="Todos"
        items={generos}
        selected={filtros.generos}
        onToggle={(id) => set({ generos: toggleChip(filtros.generos, id) })}
        onClear={() => set({ generos: [] })}
      />
      <FilaChips
        label="Marca"
        todosLabel="Todas"
        items={marcas}
        selected={filtros.marcas}
        onToggle={(id) => set({ marcas: toggleChip(filtros.marcas, id) })}
        onClear={() => set({ marcas: [] })}
      />
      <FilaChips
        label="Estilo"
        todosLabel="Todos"
        items={estilos}
        selected={filtros.estilos}
        onToggle={(id) => set({ estilos: toggleChip(filtros.estilos, id) })}
        onClear={() => set({ estilos: [] })}
      />
      <FilaChips
        label="Producto"
        todosLabel="Todos"
        items={tipos}
        selected={filtros.tipos}
        onToggle={(id) => set({ tipos: toggleChip(filtros.tipos, id) })}
        onClear={() => set({ tipos: [] })}
      />
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b6560] sm:w-20">
          Buscar
        </span>
        <input
          type="search"
          value={filtros.buscar}
          onChange={(e) => set({ buscar: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter?.();
            }
          }}
          placeholder="Línea, ref, marca, material, color…"
          className="min-h-[52px] w-full flex-1 border border-[#8a8278] bg-[#faf9f7] px-4 text-base text-[#1a1a1a] placeholder:text-[#9a9288] focus:border-[#ea580c] focus:outline-none"
        />
      </div>
    </div>
  );
}
