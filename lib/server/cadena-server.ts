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

function normKey(k: string): string {
  return k.trim();
}

function refsCoincidenBuscar(
  referencias: { key: string; marca: string; linea: string; referencia: string }[],
  q: string,
): typeof referencias {
  return referencias.filter(
    (r) =>
      `${r.linea}.${r.referencia}`.startsWith(q) ||
      r.linea === q ||
      r.linea.startsWith(q),
  );
}

export function buildCadenaServer(filas: DepositoFila[], marca: string): ParLineaRef[] {
  return buildCadenaFromFilas(filas, marca.trim());
}

export function resolverMarcaIngreso(
  f: FiltrosSql,
  marcas: { marca: string }[],
  referencias: { key: string; marca: string; linea: string; referencia: string }[],
): { marca: string; refKey?: string } | null {
  if (marcas.length === 0) return null;

  if (f.referenciaKeys.length === 1) {
    const k = normKey(f.referenciaKeys[0]!);
    const ref = referencias.find((r) => normKey(r.key) === k);
    if (ref) return { marca: ref.marca.trim(), refKey: normKey(ref.key) };
  }

  const q = f.buscar.trim();
  const dot = /^(\d+)\.(\d+)/.exec(q);
  if (dot) {
    const key = `${dot[1]}|${dot[2]}`;
    const ref = referencias.find((r) => normKey(r.key) === key);
    if (ref) return { marca: ref.marca.trim(), refKey: normKey(ref.key) };
  }

  if (q && referencias.length > 0) {
    const matching = refsCoincidenBuscar(referencias, q);
    if (matching.length === 1) {
      const ref = matching[0]!;
      return { marca: ref.marca.trim(), refKey: normKey(ref.key) };
    }
    if (matching.length > 1) {
      return { marca: matching[0]!.marca.trim() };
    }
  }

  if (referencias.length === 1) {
    const r = referencias[0]!;
    return { marca: r.marca.trim(), refKey: normKey(r.key) };
  }

  const marca =
    f.marcas.length === 1
      ? f.marcas[0]!.trim()
      : marcas.length === 1
        ? marcas[0]!.marca.trim()
        : f.marcaCadena?.trim();

  if (marca) return { marca };

  if (marcas.length > 0) return { marca: marcas[0]!.marca.trim() };

  return null;
}

export function posicionInicialCadena(
  pares: ParLineaRef[],
  opts: { refKey?: string; buscar?: string },
): PosicionCadena {
  const base: PosicionCadena = { parIndex: 0, grupoIndex: 0, colorG1: 0, colorG2: 0 };
  if (pares.length === 0) return base;

  if (opts.refKey) {
    const rk = normKey(opts.refKey);
    const pi = pares.findIndex((p) => normKey(p.key) === rk);
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
  const refSet = new Set(f.referenciaKeys.map(normKey).filter(Boolean));
  return pares.filter((par) => {
    if (f.estilos.length > 0 && !f.estilos.includes(par.estilo)) return false;
    if (refSet.size > 0 && !refSet.has(normKey(par.key))) return false;
    return true;
  });
}

/** Aplica ref filter post-build usando keyLR */
export function refKeyFromLineaRef(linea: string, referencia: string): string {
  return keyLR({ linea_codigo_proveedor: linea, referencia_codigo_proveedor: referencia });
}
