/**
 * Origen cliente Bazzar — sellado por tabla `entes` (holding).
 *
 * entes.codigo:
 *   1 = RIMEC (no aplica clientes Bazzar B2C)
 *   2 = Fernando
 *   3 = San Martín
 *   4 = Palma
 *   5 = Bazzar Web
 *
 * Tablet: 6 tiendas vía cliente_id depósito (2100…3200).
 */

export const ENTES_CODIGO = {
  RIMEC: 1,
  FERNANDO: 2,
  SAN_MARTIN: 3,
  PALMA: 4,
  BAZZAR_WEB: 5,
} as const;

/** Cliente RIMEC canal e-commerce — FI Compra Web / checkout (oficial Bazzar Web). */
export const CLIENTE_ID_BAZZAR_WEB = 5000;

/** cliente_id piso tienda — depositos-config */
export const TIENDAS_CLIENTE_ID = [2100, 2900, 2400, 2700, 3100, 3200] as const;

export type OrigenClienteBazaar = {
  ente_codigo: number;
  tienda_cliente_id: number | null;
};

const TIENDA_A_ENTE: Record<number, number> = {
  2100: ENTES_CODIGO.FERNANDO,
  2900: ENTES_CODIGO.FERNANDO,
  2400: ENTES_CODIGO.SAN_MARTIN,
  2700: ENTES_CODIGO.SAN_MARTIN,
  3100: ENTES_CODIGO.PALMA,
  3200: ENTES_CODIGO.PALMA,
};

export function origenDesdeTiendaClienteId(cliente_id: number): OrigenClienteBazaar | null {
  const ente = TIENDA_A_ENTE[cliente_id];
  if (!ente) return null;
  return { ente_codigo: ente, tienda_cliente_id: cliente_id };
}

export function origenWeb(): OrigenClienteBazaar {
  return { ente_codigo: ENTES_CODIGO.BAZZAR_WEB, tienda_cliente_id: CLIENTE_ID_BAZZAR_WEB };
}

export function etiquetaOrigen(o: OrigenClienteBazaar): string {
  if (o.tienda_cliente_id === CLIENTE_ID_BAZZAR_WEB) return "Bazzar Web";
  const ente =
    o.ente_codigo === ENTES_CODIGO.FERNANDO
      ? "Fernando"
      : o.ente_codigo === ENTES_CODIGO.SAN_MARTIN
        ? "San Martín"
        : o.ente_codigo === ENTES_CODIGO.PALMA
          ? "Palma"
          : o.ente_codigo === ENTES_CODIGO.BAZZAR_WEB
            ? "Bazzar Web"
            : "?";
  if (!o.tienda_cliente_id) return ente;
  const tipo =
    o.tienda_cliente_id === 2100 || o.tienda_cliente_id === 2400 || o.tienda_cliente_id === 3100
      ? "Adultos"
      : "Niños";
  return `${ente} ${tipo}`;
}
