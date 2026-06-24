export const REOPEN_STAGING_KEY = "tablet_reopen_staging_id";
export const REOPEN_OPEN_CART_KEY = "tablet_reopen_open_cart";
export const REOPEN_CLIENTE_KEY = "tablet_reopen_cliente_json";
export const REOPEN_VENDEDOR_KEY = "tablet_reopen_vendedor_json";
export const REOPEN_FI_FA_KEY = "tablet_reopen_fi_fa";

export type ReopenClienteSnapshot = {
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
};

export type ReopenVendedorSnapshot = {
  id_vendedor: number;
  nombre_display: string;
  ente_codigo: number;
};

export function setReopenSession(payload: {
  stagingId: number;
  cliente: ReopenClienteSnapshot | null;
  vendedor: ReopenVendedorSnapshot;
  numero_fi_fa?: number | null;
}) {
  sessionStorage.setItem(REOPEN_STAGING_KEY, String(payload.stagingId));
  sessionStorage.setItem(REOPEN_OPEN_CART_KEY, "1");
  if (payload.cliente) {
    sessionStorage.setItem(REOPEN_CLIENTE_KEY, JSON.stringify(payload.cliente));
  } else {
    sessionStorage.removeItem(REOPEN_CLIENTE_KEY);
  }
  sessionStorage.setItem(REOPEN_VENDEDOR_KEY, JSON.stringify(payload.vendedor));
  if (payload.numero_fi_fa != null && Number.isFinite(payload.numero_fi_fa)) {
    sessionStorage.setItem(REOPEN_FI_FA_KEY, String(payload.numero_fi_fa));
  } else {
    sessionStorage.removeItem(REOPEN_FI_FA_KEY);
  }
}

export function clearReopenSession() {
  sessionStorage.removeItem(REOPEN_STAGING_KEY);
  sessionStorage.removeItem(REOPEN_OPEN_CART_KEY);
  sessionStorage.removeItem(REOPEN_CLIENTE_KEY);
  sessionStorage.removeItem(REOPEN_VENDEDOR_KEY);
  sessionStorage.removeItem(REOPEN_FI_FA_KEY);
}

export function readReopenFiFa(): number | null {
  const raw = sessionStorage.getItem(REOPEN_FI_FA_KEY);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function getReopenStagingId(): number | null {
  const raw = sessionStorage.getItem(REOPEN_STAGING_KEY);
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function consumeOpenCartFlag(): boolean {
  const v = sessionStorage.getItem(REOPEN_OPEN_CART_KEY);
  sessionStorage.removeItem(REOPEN_OPEN_CART_KEY);
  return v === "1";
}

export function readReopenCliente(): ReopenClienteSnapshot | null {
  try {
    const raw = sessionStorage.getItem(REOPEN_CLIENTE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReopenClienteSnapshot;
  } catch {
    return null;
  }
}

export function readReopenVendedor(): ReopenVendedorSnapshot | null {
  try {
    const raw = sessionStorage.getItem(REOPEN_VENDEDOR_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReopenVendedorSnapshot;
  } catch {
    return null;
  }
}
