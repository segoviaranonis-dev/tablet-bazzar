import type { DepositoFila, ParLineaRef } from "./cadena";
import { keyLR } from "./cadena";

export type FiltrosCadena = {
  /** Vacío = todos los estilos */
  estilos: string[];
  /** Vacío = todas las referencias (L+R) */
  referenciaKeys: string[];
  /** Color: pendiente definición UI */
  colorCode: string | null;
};

export type EstiloOption = { value: string; count: number };
export type ReferenciaOption = {
  key: string;
  linea: string;
  referencia: string;
  estilo: string;
  count: number;
};
export type ColorOption = { code: string; label: string; count: number };

export const FILTROS_VACIOS: FiltrosCadena = {
  estilos: [],
  referenciaKeys: [],
  colorCode: null,
};

function filasMarca(filas: DepositoFila[], marca: string): DepositoFila[] {
  return filas.filter((f) => f.marca === marca && f.cantidad > 0);
}

function filasParaOpcion(
  filas: DepositoFila[],
  marca: string,
  filtros: FiltrosCadena,
  excluir: "estilos" | "referenciaKeys" | "colorCode" | null,
): DepositoFila[] {
  let rows = filasMarca(filas, marca);
  if (filtros.estilos.length > 0 && excluir !== "estilos") {
    rows = rows.filter((f) => filtros.estilos.includes(f.estilo?.trim() ?? ""));
  }
  if (filtros.referenciaKeys.length > 0 && excluir !== "referenciaKeys") {
    rows = rows.filter((f) => filtros.referenciaKeys.includes(keyLR(f)));
  }
  if (filtros.colorCode && excluir !== "colorCode") {
    rows = rows.filter((f) => f.color_code === filtros.colorCode);
  }
  return rows;
}

function buildFromRows(rows: DepositoFila[]): {
  estilos: EstiloOption[];
  referencias: ReferenciaOption[];
  colores: ColorOption[];
} {
  const estMap = new Map<string, number>();
  const refMap = new Map<string, ReferenciaOption>();
  const colMap = new Map<string, ColorOption>();

  for (const f of rows) {
    const est = f.estilo?.trim();
    if (est) estMap.set(est, (estMap.get(est) ?? 0) + 1);

    const rk = keyLR(f);
    const prevRef = refMap.get(rk);
    if (prevRef) prevRef.count += 1;
    else {
      refMap.set(rk, {
        key: rk,
        linea: f.linea_codigo_proveedor,
        referencia: f.referencia_codigo_proveedor,
        estilo: f.estilo?.trim() ?? "",
        count: 1,
      });
    }

    const cc = f.color_code?.trim();
    if (cc) {
      const label = f.descp_color?.trim() || cc;
      const prevCol = colMap.get(cc);
      if (prevCol) prevCol.count += 1;
      else colMap.set(cc, { code: cc, label, count: 1 });
    }
  }

  return {
    estilos: [...estMap.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    referencias: [...refMap.values()].sort((a, b) =>
      `${a.linea}.${a.referencia}`.localeCompare(`${b.linea}.${b.referencia}`),
    ),
    colores: [...colMap.values()].sort((a, b) => a.code.localeCompare(b.code)),
  };
}

export function buildOpcionesFiltro(
  filas: DepositoFila[],
  marca: string,
  filtros: FiltrosCadena = FILTROS_VACIOS,
): {
  estilos: EstiloOption[];
  referencias: ReferenciaOption[];
  colores: ColorOption[];
} {
  const estilos = buildFromRows(filasParaOpcion(filas, marca, filtros, "estilos")).estilos;
  const referencias = buildFromRows(filasParaOpcion(filas, marca, filtros, "referenciaKeys")).referencias;
  const colores = buildFromRows(filasParaOpcion(filas, marca, filtros, "colorCode")).colores;
  return { estilos, referencias, colores };
}

export function filtrarPares(pares: ParLineaRef[], filtros: FiltrosCadena): ParLineaRef[] {
  const refSet = new Set(filtros.referenciaKeys.map((k) => k.trim()).filter(Boolean));
  return pares.filter((par) => {
    if (filtros.estilos.length > 0 && !filtros.estilos.includes(par.estilo)) return false;
    if (refSet.size > 0 && !refSet.has(par.key.trim())) return false;
    if (filtros.colorCode) {
      const ok = par.coloresLR.some((c) => c.color_code === filtros.colorCode);
      if (!ok) return false;
    }
    return true;
  });
}

export function toggleEstilo(filtros: FiltrosCadena, estilo: string): FiltrosCadena {
  const on = filtros.estilos.includes(estilo);
  return {
    ...filtros,
    estilos: on ? filtros.estilos.filter((e) => e !== estilo) : [...filtros.estilos, estilo],
  };
}

export function toggleReferencia(filtros: FiltrosCadena, key: string): FiltrosCadena {
  const on = filtros.referenciaKeys.includes(key);
  return {
    ...filtros,
    referenciaKeys: on
      ? filtros.referenciaKeys.filter((k) => k !== key)
      : [...filtros.referenciaKeys, key],
  };
}

export function hayFiltrosActivos(f: FiltrosCadena): boolean {
  return f.estilos.length > 0 || f.referenciaKeys.length > 0 || !!f.colorCode;
}

export function indiceColorEnPar(par: ParLineaRef, grupoIndex: number, colorCode: string | null): number {
  if (!colorCode) return 0;
  const grupo = par.gruposMaterial[grupoIndex] ?? par.gruposMaterial[0];
  if (!grupo) return 0;
  const i = grupo.colores.findIndex((c) => c.color_code === colorCode);
  return i >= 0 ? i : 0;
}

export function indiceGrupoConColor(par: ParLineaRef, colorCode: string): number {
  const gi = par.gruposMaterial.findIndex((g) =>
    g.colores.some((c) => c.color_code === colorCode),
  );
  return gi >= 0 ? gi : 0;
}
