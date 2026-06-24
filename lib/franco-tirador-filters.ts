/** Franco Tirador — sniper: filtros opcionales por etiqueta (paridad catalogo-sql). */

export type FrancoTiradorFilterState = {
  tipo: string;
  /** `descp_marca` — mismo criterio que `/cadena` filtros. */
  marcas: string[];
  /** `descp_grupo_estilo` — multi (BOTAS + CHANCLAS + …). */
  estilos: string[];
  colores: string[];
  colorBuscar?: string;
};

export type FrancoTiradorSearchInput = FrancoTiradorFilterState & {
  grada?: string;
};

export type FrancoFilterItem = { id: number; label: string; count: number };

function parseStringList(raw: string | null | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((x) => decodeURIComponent(x.trim()))
    .filter(Boolean);
}

export function parseFrancoFiltersFromSearchParams(sp: URLSearchParams): FrancoTiradorFilterState {
  const colores = sp.getAll("colores").map((c) => c.trim()).filter(Boolean);
  const colorBuscar = sp.get("color_buscar")?.trim() ?? "";
  const marcas = sp.getAll("marcas").length
    ? sp.getAll("marcas").map((m) => m.trim()).filter(Boolean)
    : parseStringList(sp.get("marcas_csv"));
  const estilos = sp.getAll("estilos").length
    ? sp.getAll("estilos").map((e) => e.trim()).filter(Boolean)
    : parseStringList(sp.get("estilos_csv"));
  return {
    tipo: sp.get("tipo")?.trim() ?? "",
    marcas,
    estilos,
    colores,
    colorBuscar: colorBuscar || undefined,
  };
}

export function francoFiltersToSearchParams(f: FrancoTiradorFilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.tipo) p.set("tipo", f.tipo);
  for (const m of f.marcas) {
    if (m.trim()) p.append("marcas", m.trim());
  }
  for (const e of f.estilos) {
    if (e.trim()) p.append("estilos", e.trim());
  }
  for (const c of f.colores) {
    if (c.trim()) p.append("colores", c.trim());
  }
  if (f.colorBuscar?.trim()) p.set("color_buscar", f.colorBuscar.trim());
  return p;
}

export function coloresQueCoinciden(options: string[], q: string): string[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  return options.filter((o) => o.toLowerCase().includes(needle));
}

export function labelsRemovidos(prev: string[], next: string[]): boolean {
  return prev.some((l) => !next.includes(l));
}

export function uniqLabels(vals: string[]): string[] {
  return [...new Set(vals.map((v) => v.trim()).filter(Boolean))];
}

/** Tipo calzado en depósito — alias comunes en `tipo_v2`. */
export function esTipoCalzadoScope(tipo: string): boolean {
  const t = tipo.trim().toLowerCase();
  return t === "calzados" || t === "calzado" || t === "calz";
}
