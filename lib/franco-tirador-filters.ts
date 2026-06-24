/** Franco Tirador — sniper: filtros opcionales por etiqueta (paridad catalogo-sql). */

export type FrancoTiradorFilterState = {
  tipo: string;
  /** `descp_marca` — mismo criterio que `/cadena` filtros. */
  marcas: string[];
  /** `descp_grupo_estilo` — multi (BOTAS + CHANCLAS + …). */
  estilos: string[];
  /** Vía A — etiqueta `color_tono_estandar` (círculo · principal). */
  tonoEstandar?: string;
  /** Vía B — términos Enter (predominante + canónico · sin checkboxes). */
  colorTexto: string[];
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
  const colorTexto = sp.getAll("color_texto").map((c) => c.trim()).filter((c) => c.length >= 2);
  const tonoEstandar = sp.get("tono_estandar")?.trim() || undefined;
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
    tonoEstandar,
    colorTexto,
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
  if (f.tonoEstandar?.trim()) p.set("tono_estandar", f.tonoEstandar.trim());
  for (const t of f.colorTexto) {
    if (t.trim().length >= 2) p.append("color_texto", t.trim());
  }
  return p;
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

export function uniqTerminosColor(vals: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of vals) {
    const t = v.trim();
    if (t.length < 2) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}
