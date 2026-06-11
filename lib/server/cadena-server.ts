import type { ParLineaRef } from "@/lib/cadena";
import { buildCadenaFromFilas, keyLR, type DepositoFila } from "@/lib/cadena";
import { parseCodigoVendedor, resolveCodigoEnCadena } from "@/lib/codigo-busqueda";
import type { FiltrosSql } from "@/lib/server/catalogo-sql";

export type PosicionCadena = {
  parIndex: number;
  grupoIndex: number;
  colorG1: number;
  colorG2: number;
};

export function buildCadenaServer(filas: DepositoFila[], marca: string): ParLineaRef[] {
  return buildCadenaFromFilas(filas, marca);
}

export function resolverMarcaIngreso(
  f: FiltrosSql,
  marcas: { marca: string }[],
  referencias: { key: string; marca: string; linea: string; referencia: string }[],
): { marca: string; refKey?: string } | null {
  if (marcas.length === 0) return null;

  if (f.referenciaKeys.length === 1) {
    const ref = referencias.find((r) => r.key === f.referenciaKeys[0]);
    if (ref) return { marca: ref.marca, refKey: ref.key };
  }

  const q = f.buscar.trim();
  const dot = /^(\d+)\.(\d+)/.exec(q);
  if (dot) {
    const key = `${dot[1]}|${dot[2]}`;
    const ref = referencias.find((r) => r.key === key);
    if (ref) return { marca: ref.marca, refKey: ref.key };
  }

  if (q && referencias.length > 0) {
    const ref =
      referencias.find((r) => `${r.linea}.${r.referencia}`.startsWith(q)) ??
      referencias.find((r) => r.linea === q || r.linea.startsWith(q));
    if (ref) return { marca: ref.marca, refKey: ref.key };
  }

  if (referencias.length === 1) {
    const r = referencias[0]!;
    return { marca: r.marca, refKey: r.key };
  }

  const marca =
    f.marcas.length === 1 ? f.marcas[0]! : marcas.length === 1 ? marcas[0]!.marca : f.marcaCadena;

  if (marca) return { marca };
  return null;
}

export function posicionInicialCadena(
  pares: ParLineaRef[],
  opts: { refKey?: string; buscar?: string },
): PosicionCadena {
  const base: PosicionCadena = { parIndex: 0, grupoIndex: 0, colorG1: 0, colorG2: 0 };
  if (pares.length === 0) return base;

  if (opts.refKey) {
    const pi = pares.findIndex((p) => p.key === opts.refKey);
    if (pi >= 0) return { ...base, parIndex: pi };
  }

  const q = opts.buscar?.trim() ?? "";
  if (q) {
    const codigo = parseCodigoVendedor(q);
    if (codigo) {
      const idx = resolveCodigoEnCadena(pares, codigo);
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
      const pi = pares.findIndex((p) => p.linea === q || p.linea.startsWith(q));
      if (pi >= 0) return { ...base, parIndex: pi };
    }
  }

  return base;
}

export function filtrarParesServer(
  pares: ParLineaRef[],
  f: Pick<FiltrosSql, "estilos" | "referenciaKeys">,
): ParLineaRef[] {
  return pares.filter((par) => {
    if (f.estilos.length > 0 && !f.estilos.includes(par.estilo)) return false;
    if (f.referenciaKeys.length > 0 && !f.referenciaKeys.includes(par.key)) return false;
    return true;
  });
}

/** Aplica ref filter post-build usando keyLR */
export function refKeyFromLineaRef(linea: string, referencia: string): string {
  return keyLR({ linea_codigo_proveedor: linea, referencia_codigo_proveedor: referencia });
}
