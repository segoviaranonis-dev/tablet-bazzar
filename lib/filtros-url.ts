/** Helpers URL filtros — compartido cliente + servidor (sin SQL). */

export type FiltrosUrl = {
  generos: string[];
  marcas: string[];
  estilos: string[];
  tipos: string[];
  referenciaKeys: string[];
  buscar: string;
  marcaCadena?: string;
};

export function filtrosToSearchParams(f: FiltrosUrl): URLSearchParams {
  const p = new URLSearchParams();
  if (f.generos.length) p.set("generos", f.generos.join("|"));
  if (f.marcas.length) p.set("marcas", f.marcas.join("|"));
  if (f.estilos.length) p.set("estilos", f.estilos.join("|"));
  if (f.tipos.length) p.set("tipos", f.tipos.join("|"));
  if (f.referenciaKeys.length) p.set("refs", f.referenciaKeys.join("|"));
  if (f.buscar.trim()) p.set("q", f.buscar.trim());
  if (f.marcaCadena) p.set("marca", f.marcaCadena);
  return p;
}

export function filtrosFromSearchParams(sp: URLSearchParams): FiltrosUrl {
  return {
    generos: sp.get("generos")?.split("|").filter(Boolean) ?? [],
    marcas: sp.get("marcas")?.split("|").filter(Boolean) ?? [],
    estilos: sp.get("estilos")?.split("|").filter(Boolean) ?? [],
    tipos: sp.get("tipos")?.split("|").filter(Boolean) ?? [],
    referenciaKeys: sp.get("refs")?.split("|").filter(Boolean) ?? [],
    buscar: sp.get("q") ?? "",
    marcaCadena: sp.get("marca") ?? undefined,
  };
}
