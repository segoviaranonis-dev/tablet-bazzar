import { DEPOSITOS } from "@/lib/depositos-config";
import { depositoMatchesEnteCodigo, resolveClienteIdFromUsuario } from "@/lib/usuario-deposito";
import { isDirectorNivelTablet, type TabletSessionUser } from "@/lib/nivel-dios";

/** Categoría nivel 2 triada holding (ADMIN) · VENDEDOR = POS tienda. */
const CATEGORIAS_TIENDA_OK = new Set(["ADMIN", "SU", "VENDEDOR"]);

export type AccesoCatalogo =
  | { ok: true; scope: "dios"; clienteIds: number[] }
  | { ok: true; scope: "tienda"; clienteId: number }
  | { ok: false; reason: string };

function esEnteTiendaBazzar(enteCodigo: number | null | undefined): boolean {
  const cod = Number(enteCodigo) || 0;
  return (cod >= 2 && cod <= 4) || (cod >= 6 && cod <= 12);
}

/** rol_id=2 + categoria ADMIN/SU (nivel 2) · o rol_id=1 holding en tienda. */
function rolTiendaOk(user: TabletSessionUser): boolean {
  if (user.rol_id === 1) return true;
  if (user.rol_id !== 2) return false;
  const cat = (user.categoria ?? "").toUpperCase().trim();
  return CATEGORIAS_TIENDA_OK.has(cat);
}

export function resolverAccesoCatalogo(user: TabletSessionUser | null | undefined): AccesoCatalogo {
  if (!user?.rol_id) {
    return { ok: false, reason: "Iniciá sesión para acceder al catálogo." };
  }

  if (isDirectorNivelTablet(user)) {
    return {
      ok: true,
      scope: "dios",
      clienteIds: DEPOSITOS.map((d) => d.cliente_id),
    };
  }

  if (!esEnteTiendaBazzar(user.ente_codigo)) {
    return {
      ok: false,
      reason: "Catálogo · Ventas solo para tiendas Bazzar (ente 2–4) o Nivel Dios.",
    };
  }

  if (!rolTiendaOk(user)) {
    return {
      ok: false,
      reason: "Se requiere perfil tienda Bazzar (ADMIN o VENDEDOR) o gerente holding (rol_id=1).",
    };
  }

  const clienteId = resolveClienteIdFromUsuario(user.nombre ?? "");
  if (clienteId == null) {
    return {
      ok: false,
      reason:
        "Usuario sin depósito vinculado. Código esperado: BZZ + sede (F/S/P) + segmento (A/N). Ej. BZZSN, BZZPN.",
    };
  }

  if (!depositoMatchesEnteCodigo(clienteId, Number(user.ente_codigo))) {
    return {
      ok: false,
      reason: "El depósito del usuario no coincide con su ente.",
    };
  }

  return { ok: true, scope: "tienda", clienteId };
}

export function mensajeAccesoCatalogoVentas(): string {
  return "Catálogo · Ventas: Nivel Dios (RIMEC) o tienda Bazzar (ADMIN / VENDEDOR) con código BZZ*.";
}
