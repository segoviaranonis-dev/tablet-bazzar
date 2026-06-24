/** Helpers URL filtros — compartido cliente + servidor (sin SQL). */

export type FiltrosUrl = {
  generos: string[];
  marcas: string[];
  estilos: string[];
  tipos: string[];
  tipo1s: string[];
  referenciaKeys: string[];
  buscar: string;
  marcaCadena?: string;
};

/** Separador entre claves L+R en query `refs` (cada clave usa `linea|referencia`). */
export const REF_KEYS_SEP = ",";

export function parseReferenciaKeysParam(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  const s = raw.trim();
  if (s.includes(REF_KEYS_SEP)) {
    return s.split(REF_KEYS_SEP).map((k) => k.trim()).filter(Boolean);
  }
  // Una sola clave: linea|referencia (pipe interno, no comas)
  return [s];
}

export function serializeReferenciaKeysParam(keys: string[]): string {
  return keys.map((k) => k.trim()).filter(Boolean).join(REF_KEYS_SEP);
}

export function filtrosToSearchParams(f: FiltrosUrl): URLSearchParams {
  const p = new URLSearchParams();
  if (f.generos.length) p.set("generos", f.generos.join("|"));
  if (f.marcas.length) p.set("marcas", f.marcas.join("|"));
  if (f.estilos.length) p.set("estilos", f.estilos.join("|"));
  if (f.tipos.length) p.set("tipos", f.tipos.join("|"));
  if (f.tipo1s.length) p.set("tipo1s", f.tipo1s.join("|"));
  if (f.referenciaKeys.length) p.set("refs", serializeReferenciaKeysParam(f.referenciaKeys));
  if (f.buscar.trim()) p.set("q", f.buscar.trim());
  if (f.marcaCadena) p.set("marca", f.marcaCadena);
  return p;
}

export function filtrosFromSearchParams(sp: URLSearchParams): FiltrosUrl {
  return {
    generos: sp.get("generos")?.split("|").map((s) => s.trim()).filter(Boolean) ?? [],
    marcas: sp.get("marcas")?.split("|").map((s) => s.trim()).filter(Boolean) ?? [],
    estilos: sp.get("estilos")?.split("|").map((s) => s.trim()).filter(Boolean) ?? [],
    tipos: sp.get("tipos")?.split("|").map((s) => s.trim()).filter(Boolean) ?? [],
    tipo1s: sp.get("tipo1s")?.split("|").map((s) => s.trim()).filter(Boolean) ?? [],
    referenciaKeys: parseReferenciaKeysParam(sp.get("refs")),
    buscar: (sp.get("q") ?? "").trim(),
    marcaCadena: sp.get("marca")?.trim() || undefined,
  };
}
