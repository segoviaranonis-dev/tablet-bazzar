import { DEPOSITOS, getDepositoByClienteId, type DepositoTienda } from "@/lib/depositos-config";

/** BZZ + sede (F/S/P) + segmento (A/N) → depósito tienda nivel 1. */
const SEDE_SLUG: Record<string, DepositoTienda["enteSlug"]> = {
  F: "fernando",
  S: "sanmartin",
  P: "palma",
};

const ENTE_COD_TO_ENTE: Record<number, DepositoTienda["ente"]> = {
  2: "Fernando",
  3: "San Martin",
  4: "Palma",
};

/** Resuelve cliente_id desde código usuario (ej. BZZSN → 2700 SM-N). Legacy BZZS → sede S. */
export function resolveClienteIdFromUsuario(descpUsuario: string): number | null {
  const key = descpUsuario.trim().toUpperCase();
  const m = key.match(/^BZZ([FSP])([AN])$/);
  if (m) {
    const sede = SEDE_SLUG[m[1]];
    const tipo = m[2] === "A" ? "Adultos" : "Niños";
    if (!sede) return null;
    return DEPOSITOS.find((d) => d.enteSlug === sede && d.tipo === tipo)?.cliente_id ?? null;
  }

  // Legacy BZZF / BZZS / BZZP (sin segmento A/N) → primer depósito Adultos de la sede
  const legacy = key.match(/^BZZ([FSP])$/);
  if (legacy) {
    const sede = SEDE_SLUG[legacy[1]];
    if (!sede) return null;
    return (
      DEPOSITOS.find((d) => d.enteSlug === sede && d.tipo === "Adultos")?.cliente_id ??
      DEPOSITOS.find((d) => d.enteSlug === sede)?.cliente_id ??
      null
    );
  }

  return null;
}

export function depositoMatchesEnteCodigo(clienteId: number, enteCodigo: number): boolean {
  const dep = getDepositoByClienteId(clienteId);
  const ente = ENTE_COD_TO_ENTE[enteCodigo];
  return !!dep && !!ente && dep.ente === ente;
}

export function getDepositoLabel(clienteId: number): string | null {
  const d = getDepositoByClienteId(clienteId);
  return d ? `${d.ente} · ${d.tipo}` : null;
}
