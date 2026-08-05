import type { DepositoFila, ParLineaRef } from "@/lib/cadena";

export type TonoAssignResult = {
  color_id: number;
  tono_canon: unknown | null;
  tono_etiqueta: string | null;
};

function patchFila(
  f: DepositoFila,
  colorId: number,
  tonoCanon: unknown | null,
  tonoEtiqueta: string | null,
): DepositoFila {
  if (f.color_id !== colorId) return f;
  return { ...f, tono_canon: tonoCanon, tono_etiqueta: tonoEtiqueta };
}

/** Actualiza tono_canon en árbol cadena ya cargado — sin refetch que re-aplique filtros entrada. */
export function patchTonoEnParesAll(
  paresAll: ParLineaRef[],
  result: TonoAssignResult,
): ParLineaRef[] {
  const { color_id, tono_canon, tono_etiqueta } = result;
  return paresAll.map((par) => ({
    ...par,
    coloresLR: (par.coloresLR ?? []).map((f) => patchFila(f, color_id, tono_canon, tono_etiqueta)),
    gruposMaterial: (par.gruposMaterial ?? []).map((g) => {
      const filas = g.filas ?? g.colores ?? [];
      const colores = g.colores ?? g.filas ?? [];
      return {
        ...g,
        filas: filas.map((f) => patchFila(f, color_id, tono_canon, tono_etiqueta)),
        colores: colores.map((f) => patchFila(f, color_id, tono_canon, tono_etiqueta)),
      };
    }),
  }));
}
