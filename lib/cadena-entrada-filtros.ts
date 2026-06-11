import { keyLR, numCodigo, type DepositoFila } from "./cadena";
import { parseReferenciaKeysParam, serializeReferenciaKeysParam } from "./filtros-url";
import type { FiltrosCadena } from "./cadena-filtros";

export type FiltrosEntrada = {
  generos: string[];
  marcas: string[];
  estilos: string[];
  tipos: string[];
  referenciaKeys: string[];
  buscar: string;
};

export const FILTROS_ENTRADA_VACIOS: FiltrosEntrada = {
  generos: [],
  marcas: [],
  estilos: [],
  tipos: [],
  referenciaKeys: [],
  buscar: "",
};

export type OpcionChip = { id: string; label: string; count: number };

export type ReferenciaEntrada = {
  key: string;
  linea: string;
  referencia: string;
  estilo: string;
  marca: string;
  pares: number;
  skus: number;
};

const GENERO_CANON: Record<string, string> = {
  caballeros: "Caballeros",
  damas: "Damas",
  unisex: "Unisex",
};

export function normalizarGenero(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!s || s === "(sin género)") return "(sin género)";
  const low = s.toLowerCase();
  if (low.includes("caball") || low.includes("hombre") || low.includes("varon")) return "Caballeros";
  if (low.includes("dam") || low.includes("mujer")) return "Damas";
  if (low.includes("unisex")) return "Unisex";
  return s;
}

function matchesBuscar(f: DepositoFila, q: string): boolean {
  const hay = q.trim().toLowerCase();
  if (!hay) return true;
  const lr = `${f.linea_codigo_proveedor}.${f.referencia_codigo_proveedor}`.toLowerCase();
  if (lr.includes(hay)) return true;
  const blob = [
    f.linea_codigo_proveedor,
    f.referencia_codigo_proveedor,
    f.marca,
    f.estilo,
    f.material_code,
    f.descp_material,
    f.color_code,
    f.descp_color,
    f.tipo_v2,
    f.genero,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return blob.includes(hay);
}

type ExcluirEntrada = keyof FiltrosEntrada | null;

export function filasEntradaFiltradas(
  filas: DepositoFila[],
  filtros: FiltrosEntrada,
  excluir: ExcluirEntrada = null,
): DepositoFila[] {
  let rows = filas.filter((f) => f.cantidad > 0);

  if (filtros.generos.length > 0 && excluir !== "generos") {
    rows = rows.filter((f) => filtros.generos.includes(normalizarGenero(f.genero)));
  }
  if (filtros.marcas.length > 0 && excluir !== "marcas") {
    rows = rows.filter((f) => filtros.marcas.includes(f.marca));
  }
  if (filtros.estilos.length > 0 && excluir !== "estilos") {
    rows = rows.filter((f) => filtros.estilos.includes(f.estilo?.trim() ?? ""));
  }
  if (filtros.tipos.length > 0 && excluir !== "tipos") {
    rows = rows.filter((f) => filtros.tipos.includes(f.tipo_v2?.trim() ?? ""));
  }
  if (filtros.referenciaKeys.length > 0 && excluir !== "referenciaKeys") {
    rows = rows.filter((f) => filtros.referenciaKeys.includes(keyLR(f)));
  }
  if (filtros.buscar.trim() && excluir !== "buscar") {
    rows = rows.filter((f) => matchesBuscar(f, filtros.buscar));
  }

  return rows;
}

function chipsFromMap(map: Map<string, number>): OpcionChip[] {
  return [...map.entries()]
    .map(([id, count]) => ({ id, label: id, count }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));
}

export function buildOpcionesEntrada(
  filas: DepositoFila[],
  filtros: FiltrosEntrada,
): {
  generos: OpcionChip[];
  marcas: OpcionChip[];
  estilos: OpcionChip[];
  tipos: OpcionChip[];
  referencias: ReferenciaEntrada[];
} {
  const base = filasEntradaFiltradas(filas, filtros, null);

  const genMap = new Map<string, number>();
  const marcaMap = new Map<string, number>();
  const estMap = new Map<string, number>();
  const tipoMap = new Map<string, number>();

  for (const f of filasEntradaFiltradas(filas, filtros, "generos")) {
    const g = normalizarGenero(f.genero);
    genMap.set(g, (genMap.get(g) ?? 0) + 1);
  }
  for (const f of filasEntradaFiltradas(filas, filtros, "marcas")) {
    marcaMap.set(f.marca, (marcaMap.get(f.marca) ?? 0) + 1);
  }
  for (const f of filasEntradaFiltradas(filas, filtros, "estilos")) {
    const e = f.estilo?.trim();
    if (e) estMap.set(e, (estMap.get(e) ?? 0) + 1);
  }
  for (const f of filasEntradaFiltradas(filas, filtros, "tipos")) {
    const t = f.tipo_v2?.trim() || "(sin tipo)";
    tipoMap.set(t, (tipoMap.get(t) ?? 0) + 1);
  }

  const refMap = new Map<string, ReferenciaEntrada>();
  for (const f of base) {
    const rk = keyLR(f);
    const prev = refMap.get(rk);
    if (prev) {
      prev.pares += f.cantidad;
      prev.skus += 1;
    } else {
      refMap.set(rk, {
        key: rk,
        linea: f.linea_codigo_proveedor,
        referencia: f.referencia_codigo_proveedor,
        estilo: f.estilo?.trim() ?? "—",
        marca: f.marca,
        pares: f.cantidad,
        skus: 1,
      });
    }
  }

  const referencias = [...refMap.values()].sort((a, b) => {
    const dl = numCodigo(a.linea) - numCodigo(b.linea);
    if (dl !== 0) return dl;
    return numCodigo(a.referencia) - numCodigo(b.referencia);
  });

  return {
    generos: chipsFromMap(genMap).filter((g) => g.id !== "(sin género)"),
    marcas: chipsFromMap(marcaMap),
    estilos: chipsFromMap(estMap),
    tipos: chipsFromMap(tipoMap),
    referencias,
  };
}

export function listMarcasEntrada(
  filas: DepositoFila[],
  filtros: FiltrosEntrada,
): { marca: string; skus: number; pares: number }[] {
  const map = new Map<string, { skus: number; pares: number }>();
  for (const f of filasEntradaFiltradas(filas, filtros)) {
    const cur = map.get(f.marca) ?? { skus: 0, pares: 0 };
    cur.skus += 1;
    cur.pares += f.cantidad;
    map.set(f.marca, cur);
  }
  return [...map.entries()]
    .map(([marca, v]) => ({ marca, ...v }))
    .sort((a, b) => a.marca.localeCompare(b.marca));
}

export function toggleChip(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function hayFiltrosEntradaActivos(f: FiltrosEntrada): boolean {
  return (
    f.generos.length > 0 ||
    f.marcas.length > 0 ||
    f.estilos.length > 0 ||
    f.tipos.length > 0 ||
    f.referenciaKeys.length > 0 ||
    f.buscar.trim().length > 0
  );
}

/** Serializa filtros de entrada + cadena para URL hacia /cadena/vista */
export function buildVistaQuery(
  clienteId: number,
  marca: string,
  entrada: FiltrosEntrada,
  extra?: Partial<FiltrosCadena>,
): string {
  const p = new URLSearchParams();
  p.set("cliente_id", String(clienteId));
  p.set("marca", marca);
  if (entrada.estilos.length) p.set("estilos", entrada.estilos.join("|"));
  const refs = extra?.referenciaKeys ?? entrada.referenciaKeys;
  if (refs.length) p.set("refs", serializeReferenciaKeysParam(refs));
  if (extra?.colorCode) p.set("color", extra.colorCode);
  if (entrada.generos.length === 1) p.set("genero", entrada.generos[0]!);
  if (entrada.tipos.length === 1) p.set("tipo", entrada.tipos[0]!);
  if (entrada.buscar.trim()) p.set("q", entrada.buscar.trim());
  return `/cadena/vista?${p.toString()}`;
}

export function parseFiltrosEntradaFromUrl(sp: URLSearchParams): FiltrosEntrada {
  return {
    generos: sp.get("genero") ? [sp.get("genero")!] : [],
    marcas: sp.get("marcas") ? sp.get("marcas")!.split("|").filter(Boolean) : [],
    estilos: sp.get("estilos") ? sp.get("estilos")!.split("|").filter(Boolean) : [],
    tipos: sp.get("tipo") ? [sp.get("tipo")!] : [],
    referenciaKeys: parseReferenciaKeysParam(sp.get("refs")),
    buscar: sp.get("q") ?? "",
  };
}

export function resolverEntradaVista(
  filtros: FiltrosEntrada,
  marcas: { marca: string }[],
  referencias: ReferenciaEntrada[],
): { marca: string; refKey?: string } | null {
  if (marcas.length === 0) return null;

  const q = filtros.buscar.trim();

  if (filtros.referenciaKeys.length === 1) {
    const k = filtros.referenciaKeys[0]!.trim();
    const ref = referencias.find((r) => r.key.trim() === k);
    if (ref) return { marca: ref.marca.trim(), refKey: ref.key.trim() };
  }

  const codigo = q ? parseCodigoVendedorLite(q) : null;
  if (codigo?.referencia) {
    const key = `${codigo.linea}|${codigo.referencia}`;
    const ref = referencias.find((r) => r.key.trim() === key);
    if (ref) return { marca: ref.marca.trim(), refKey: ref.key.trim() };
  }

  if (q && referencias.length > 0) {
    const matching = referencias.filter(
      (r) =>
        `${r.linea}.${r.referencia}`.startsWith(q) ||
        r.linea === q ||
        r.linea.startsWith(q),
    );
    if (matching.length === 1) {
      const ref = matching[0]!;
      return { marca: ref.marca.trim(), refKey: ref.key.trim() };
    }
    if (matching.length > 1) {
      return { marca: matching[0]!.marca.trim() };
    }
  }

  if (referencias.length === 1) {
    const r = referencias[0]!;
    return { marca: r.marca.trim(), refKey: r.key.trim() };
  }

  const marca =
    filtros.marcas.length === 1
      ? filtros.marcas[0]!.trim()
      : marcas.length === 1
        ? marcas[0]!.marca.trim()
        : null;

  if (marca) return { marca };
  return null;
}

/** Parse mínimo para entrada: 1184.1101 o solo 1184 */
function parseCodigoVendedorLite(raw: string): { linea: string; referencia?: string } | null {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return null;
  const dot = /^(\d+)\.(\d+)/.exec(s);
  if (dot) return { linea: dot[1]!, referencia: dot[2] };
  if (/^\d+$/.test(s)) return { linea: s };
  return null;
}

export function parseFiltrosCadenaFromUrl(sp: URLSearchParams): FiltrosCadena {
  return {
    estilos: sp.get("estilos") ? sp.get("estilos")!.split("|").filter(Boolean) : [],
    referenciaKeys: parseReferenciaKeysParam(sp.get("refs")),
    colorCode: sp.get("color") ?? null,
  };
}
