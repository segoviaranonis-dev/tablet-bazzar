import type { GrupoPrincipal, ParLineaRef } from "@/lib/cadena";

/** Grupo sin `filas` redundantes — suficiente con `colores` en wire. */
export type GrupoPrincipalWire = Omit<GrupoPrincipal, "filas">;

export type ParLineaRefWire = Omit<ParLineaRef, "gruposMaterial"> & {
  gruposMaterial: GrupoPrincipalWire[];
};

function slimGrupo(g: GrupoPrincipal): GrupoPrincipalWire {
  const { filas: _filas, ...rest } = g;
  return rest;
}

/** Serializa cadena para JSON API — omite `filas[]` duplicadas. */
export function slimParesForWire(pares: ParLineaRef[]): ParLineaRefWire[] {
  return pares.map((p) => ({
    key: p.key,
    linea: p.linea,
    referencia: p.referencia,
    estilo: p.estilo,
    coloresLR: p.coloresLR,
    gruposMaterial: p.gruposMaterial.map(slimGrupo),
  }));
}

export type CadenaWirePayload = {
  paresAll: ParLineaRefWire[];
  pares?: ParLineaRefWire[];
};

/** Evita duplicar `pares` cuando es idéntico a `paresAll`. */
export function buildCadenaWireResponse(
  paresAll: ParLineaRef[],
  paresFiltrados: ParLineaRef[],
): CadenaWirePayload {
  const slimAll = slimParesForWire(paresAll);
  if (paresFiltrados.length === paresAll.length) {
    return { paresAll: slimAll };
  }
  return { paresAll: slimAll, pares: slimParesForWire(paresFiltrados) };
}
