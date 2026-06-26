"use client";

import { TouchPad } from "@/components/cadena/TouchPad";
import { FiltroTonoRow } from "@/components/tono/EditorTono";
import type { FiltrosEntrada, OpcionChip } from "@/lib/cadena-entrada-filtros";
import { toggleChip } from "@/lib/cadena-entrada-filtros";
import type { ColorEstandar } from "@/lib/tono/colores-estandar";

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
      <span className="chip-filter-label shrink-0 pt-2 sm:w-20">{label}</span>
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
  tipo1s: OpcionChip[];
  tonoCatalog?: ColorEstandar[];
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
  tipo1s,
  tonoCatalog = [],
  onChange,
  onEnter,
}: Props) {
  const set = (patch: Partial<FiltrosEntrada>) => onChange({ ...filtros, ...patch });

  return (
    <div className="bazzar-card bazzar-card-accent space-y-3 p-3">
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
        label="Tipo 1"
        todosLabel="Todos"
        items={tipo1s}
        selected={filtros.tipo1s}
        onToggle={(id) => set({ tipo1s: toggleChip(filtros.tipo1s, id) })}
        onClear={() => set({ tipo1s: [] })}
      />
      <FilaChips
        label="Categoría"
        todosLabel="Todos"
        items={tipos}
        selected={filtros.tipos}
        onToggle={(id) => set({ tipos: toggleChip(filtros.tipos, id) })}
        onClear={() => set({ tipos: [] })}
      />
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="chip-filter-label shrink-0 sm:w-20">Buscar</span>
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
          className="bazzar-input"
        />
      </div>
      <FiltroTonoRow
        catalog={tonoCatalog}
        tonos={filtros.tonos}
        sinTono={filtros.sinTono}
        onChange={(patch) => set({ ...patch })}
      />
    </div>
  );
}
