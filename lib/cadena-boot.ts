import type { ParLineaRef } from "@/lib/cadena";
import type { FiltrosCadena } from "@/lib/cadena-filtros";
import { indiceColorEnPar, indiceGrupoConColor } from "@/lib/cadena-filtros";
import { parseCodigoVendedor, resolveCodigoEnCadena } from "@/lib/codigo-busqueda";
import type { PosicionCadena } from "@/lib/server/cadena-server";

export type CadenaNavState = {
  parIndex: number;
  grupoIndex: number;
  colorG1: number;
  colorG2: number;
};

export type CadenaBootInput = {
  paresNav: ParLineaRef[];
  posUrl: { pi: number; gi: number; c1: number; c2: number };
  serverPosicion?: PosicionCadena | null;
  qBuscar: string;
  filtros: FiltrosCadena;
};

function clampIndex(i: number, len: number): number {
  if (len <= 0) return 0;
  return Math.min(Math.max(0, i), len - 1);
}

/** Una sola resolución de posición inicial — URL > servidor > búsqueda > filtro ref > 0. */
export function resolveCadenaBootState(input: CadenaBootInput): CadenaNavState {
  const { paresNav, posUrl, serverPosicion, qBuscar, filtros } = input;
  const base: CadenaNavState = { parIndex: 0, grupoIndex: 0, colorG1: 0, colorG2: 0 };
  if (paresNav.length === 0) return base;

  if (Number.isFinite(posUrl.pi)) {
    return {
      parIndex: clampIndex(posUrl.pi, paresNav.length),
      grupoIndex: Number.isFinite(posUrl.gi) ? posUrl.gi : 0,
      colorG1: Number.isFinite(posUrl.c1) ? posUrl.c1 : 0,
      colorG2: Number.isFinite(posUrl.c2) ? posUrl.c2 : 0,
    };
  }

  if (serverPosicion) {
    return {
      parIndex: clampIndex(serverPosicion.parIndex, paresNav.length),
      grupoIndex: serverPosicion.grupoIndex ?? 0,
      colorG1: serverPosicion.colorG1 ?? 0,
      colorG2: serverPosicion.colorG2 ?? 0,
    };
  }

  if (filtros.referenciaKeys.length === 1) {
    const idx = paresNav.findIndex((p) => p.key === filtros.referenciaKeys[0]);
    if (idx >= 0) return { ...base, parIndex: idx };
  }

  const q = qBuscar.trim();
  if (q && filtros.referenciaKeys.length === 0) {
    const codigo = parseCodigoVendedor(q);
    if (codigo) {
      const idx = resolveCodigoEnCadena(paresNav, codigo);
      if (idx) {
        return {
          parIndex: idx.parIndex,
          grupoIndex: idx.grupoIndex,
          colorG1: idx.colorGrupo1Index,
          colorG2: idx.colorGrupo2Index,
        };
      }
    }
    if (/^\d+$/.test(q)) {
      const pi = paresNav.findIndex((p) => p.linea === q || p.linea.startsWith(q));
      if (pi >= 0) return { ...base, parIndex: pi };
    }
  }

  return base;
}

/** Re-posicionar solo cuando cambia filtro color en par activo. */
export function resolveColorFilterState(
  par: ParLineaRef | null,
  colorCode: string | null | undefined,
): Pick<CadenaNavState, "grupoIndex" | "colorG1"> | null {
  if (!par || !colorCode) return null;
  const gi = indiceGrupoConColor(par, colorCode);
  const ci = indiceColorEnPar(par, gi, colorCode);
  return { grupoIndex: gi, colorG1: ci };
}

/** Tras cambio de filtros (no boot inicial): reset par si aplica. */
export function resolveFiltrosChangeState(
  paresNav: ParLineaRef[],
  filtros: FiltrosCadena,
  posUrlPi: number,
): Pick<CadenaNavState, "parIndex" | "grupoIndex" | "colorG1" | "colorG2"> | null {
  if (Number.isFinite(posUrlPi)) return null;
  if (filtros.referenciaKeys.length === 1 && paresNav.length > 0) {
    const idx = paresNav.findIndex((p) => p.key === filtros.referenciaKeys[0]);
    return {
      parIndex: idx >= 0 ? idx : 0,
      grupoIndex: 0,
      colorG1: 0,
      colorG2: 0,
    };
  }
  return { parIndex: 0, grupoIndex: 0, colorG1: 0, colorG2: 0 };
}
