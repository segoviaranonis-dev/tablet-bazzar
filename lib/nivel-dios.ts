/** Nivel Dios · Ente RIMEC (cod 1) · rol gerente — acceso catálogo ventas admin. */
export const NIVEL_DIOS_ROL_ID = 1;
export const NIVEL_DIOS_CATEGORIA = "DIOS";
export const NIVEL_DIOS_ENTE_CODIGO = 1;

export type TabletSessionUser = {
  id?: number;
  nombre?: string;
  email?: string | null;
  rol_id?: number;
  categoria?: string | null;
  ente_codigo?: number | null;
};

export function isDiosEnte1Rol1(user: TabletSessionUser | null | undefined): boolean {
  if (!user) return false;
  const cat = (user.categoria ?? "").toUpperCase().trim();
  return (
    user.rol_id === NIVEL_DIOS_ROL_ID &&
    cat === NIVEL_DIOS_CATEGORIA &&
    user.ente_codigo === NIVEL_DIOS_ENTE_CODIGO
  );
}
