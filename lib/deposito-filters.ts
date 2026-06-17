/** Filtros depósito con fotos — paridad RIMEC Web (IDs + cascada SQL). */

export type DepositoFilterState = {
  generoId: string;
  marcaId: string;
  grupoEstiloId: string;
  tipo1Ids: number[];
  lineaIds: number[];
  colorIds: number[];
  /** Paleta rápida — hex activo (cliente → resuelve a colorIds en API si aplica) */
  colorHex: string;
  q: string;
};

export const EMPTY_DEPOSITO_FILTERS: DepositoFilterState = {
  generoId: "",
  marcaId: "",
  grupoEstiloId: "",
  tipo1Ids: [],
  lineaIds: [],
  colorIds: [],
  colorHex: "",
  q: "",
};

export const DEPOSITO_LIMIT_OPTIONS = [80, 200, 500, 1000] as const;
export type DepositoLimit = (typeof DEPOSITO_LIMIT_OPTIONS)[number];

function parseIdList(raw: string | null | undefined): number[] {
  return (raw ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function parseDepositoFiltersFromSearchParams(sp: URLSearchParams): DepositoFilterState {
  return {
    generoId: sp.get("genero_id") ?? "",
    marcaId: sp.get("marca_id") ?? "",
    grupoEstiloId: sp.get("grupo_estilo_id") ?? "",
    tipo1Ids: parseIdList(sp.get("tipo1_ids")),
    lineaIds: parseIdList(sp.get("linea_ids")),
    colorIds: parseIdList(sp.get("color_ids")),
    colorHex: sp.get("color_hex") ?? "",
    q: sp.get("q") ?? "",
  };
}

export function depositoFiltersToSearchParams(
  f: DepositoFilterState,
  limit?: DepositoLimit,
): URLSearchParams {
  const p = new URLSearchParams();
  if (f.generoId) p.set("genero_id", f.generoId);
  if (f.marcaId) p.set("marca_id", f.marcaId);
  if (f.grupoEstiloId) p.set("grupo_estilo_id", f.grupoEstiloId);
  if (f.tipo1Ids.length) p.set("tipo1_ids", f.tipo1Ids.join(","));
  if (f.lineaIds.length) p.set("linea_ids", f.lineaIds.join(","));
  if (f.colorIds.length) p.set("color_ids", f.colorIds.join(","));
  if (f.colorHex) p.set("color_hex", f.colorHex);
  if (f.q.trim()) p.set("q", f.q.trim());
  if (limit != null) p.set("limit", String(limit));
  return p;
}

export function depositoFiltersActive(f: DepositoFilterState): boolean {
  return !!(
    f.generoId ||
    f.marcaId ||
    f.grupoEstiloId ||
    f.tipo1Ids.length ||
    f.lineaIds.length ||
    f.colorIds.length ||
    f.colorHex ||
    f.q.trim()
  );
}

type FiltrosLookup = {
  generos?: { id: number; label: string }[];
  marcas?: { id: number; label: string }[];
  estilos?: { id: number; label: string }[];
  tipo1?: { id: number; label: string }[];
  lineas?: { id: number; label: string }[];
  colores?: { id: number; label: string }[];
};

/** Chips resumen para barra colapsada. */
export function summarizeDepositoFilters(f: DepositoFilterState, data: FiltrosLookup | null): string[] {
  const chips: string[] = [];
  const find = (list: { id: number; label: string }[] | undefined, id: string) =>
    list?.find((x) => String(x.id) === id)?.label;

  if (f.generoId) {
    const l = find(data?.generos, f.generoId);
    if (l) chips.push(l);
  }
  if (f.marcaId) {
    const l = find(data?.marcas, f.marcaId);
    if (l) chips.push(l);
  }
  if (f.grupoEstiloId) {
    const l = find(data?.estilos, f.grupoEstiloId);
    if (l) chips.push(l);
  }
  for (const id of f.tipo1Ids) {
    const l = data?.tipo1?.find((x) => x.id === id)?.label;
    if (l) chips.push(l);
  }
  if (f.lineaIds.length) chips.push(`${f.lineaIds.length} línea(s)`);
  if (f.colorIds.length) chips.push(`${f.colorIds.length} color(es)`);
  if (f.colorHex) chips.push("paleta");
  if (f.q.trim()) chips.push(`«${f.q.trim()}»`);
  return chips;
}
