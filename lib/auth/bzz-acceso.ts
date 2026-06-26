/**
 * Matriz holding: usuarios código BZZ* = empresa Bazzar (rol_id 2).
 * Doc: report/docs/ACCESOS_BZZ_RIMEC_WEB.md
 */

const SEDE_ENTE: Record<string, number> = {
  F: 2,
  S: 3,
  P: 4,
};

export function esUsuarioCodigoBzz(descpUsuario: string): boolean {
  return /^BZZ/i.test((descpUsuario ?? "").trim());
}

export function inferirEnteCodigoBzz(descpUsuario: string): number | null {
  const u = (descpUsuario ?? "").trim().toUpperCase();
  if (!u.startsWith("BZZ")) return null;
  if (u === "BZZF") return 2;
  const m = u.match(/^BZZ([FSP])/);
  return m ? (SEDE_ENTE[m[1]] ?? null) : null;
}

export function aplicarAccesoCanonicoBzz(
  descpUsuario: string,
  rolId: number,
  enteCodigo: number | null,
): { rol_id: number; ente_codigo: number | null; corregido: boolean } {
  if (!esUsuarioCodigoBzz(descpUsuario)) {
    return { rol_id: rolId, ente_codigo: enteCodigo, corregido: false };
  }

  let rol_id = rolId;
  let ente_codigo = enteCodigo;
  let corregido = false;

  if (rol_id === 1 || rol_id === 3) {
    rol_id = 2;
    corregido = true;
  }

  const inferido = inferirEnteCodigoBzz(descpUsuario);
  if (inferido != null && ente_codigo !== inferido) {
    ente_codigo = inferido;
    corregido = true;
  }

  return { rol_id, ente_codigo, corregido };
}
