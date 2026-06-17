/**
 * Nomenclatura oficial depósitos Bazzar (Director 2026-06-17).
 *
 * Patrón: deposito_{nivel}_{enteSlug}_{tipoSlug}_{categoria}
 *   nivel 1 + tienda   → stock piso (sync Retail · Tablet POS)
 *   nivel 2 + guardado → reserva / bodega
 *   nivel 3 + averiado → mercadería dañada
 *
 * 6 tiendas × 3 categorías = 18 tablas public.*
 */

export type CategoriaDeposito = "tienda" | "guardado" | "averiado";

export type DepositoTiendaBase = {
  cliente_id: number;
  ente: "Fernando" | "San Martin" | "Palma";
  tipo: "Adultos" | "Niños";
  enteSlug: "fernando" | "sanmartin" | "palma";
  tipoSlug: "adultos" | "ninos";
  codigo: string;
};

const TIENDAS: readonly DepositoTiendaBase[] = [
  {
    cliente_id: 2100,
    ente: "Fernando",
    tipo: "Adultos",
    enteSlug: "fernando",
    tipoSlug: "adultos",
    codigo: "FER-A",
  },
  {
    cliente_id: 2900,
    ente: "Fernando",
    tipo: "Niños",
    enteSlug: "fernando",
    tipoSlug: "ninos",
    codigo: "FER-N",
  },
  {
    cliente_id: 2400,
    ente: "San Martin",
    tipo: "Adultos",
    enteSlug: "sanmartin",
    tipoSlug: "adultos",
    codigo: "SM-A",
  },
  {
    cliente_id: 2700,
    ente: "San Martin",
    tipo: "Niños",
    enteSlug: "sanmartin",
    tipoSlug: "ninos",
    codigo: "SM-N",
  },
  {
    cliente_id: 3100,
    ente: "Palma",
    tipo: "Adultos",
    enteSlug: "palma",
    tipoSlug: "adultos",
    codigo: "PAL-A",
  },
  {
    cliente_id: 3200,
    ente: "Palma",
    tipo: "Niños",
    enteSlug: "palma",
    tipoSlug: "ninos",
    codigo: "PAL-N",
  },
] as const;

const CATEGORIAS: readonly { nivel: 1 | 2 | 3; categoria: CategoriaDeposito }[] = [
  { nivel: 1, categoria: "tienda" },
  { nivel: 2, categoria: "guardado" },
  { nivel: 3, categoria: "averiado" },
];

export function nombreTablaDeposito(
  nivel: 1 | 2 | 3,
  enteSlug: string,
  tipoSlug: string,
  categoria: CategoriaDeposito,
): string {
  return `deposito_${nivel}_${enteSlug}_${tipoSlug}_${categoria}`;
}

export type DepositoConfig = DepositoTiendaBase & {
  nivel: 1 | 2 | 3;
  categoria: CategoriaDeposito;
  tabla: string;
};

export const DEPOSITOS_MATRIZ: DepositoConfig[] = TIENDAS.flatMap((t) =>
  CATEGORIAS.map((c) => ({
    ...t,
    nivel: c.nivel,
    categoria: c.categoria,
    tabla: nombreTablaDeposito(c.nivel, t.enteSlug, t.tipoSlug, c.categoria),
  })),
);

/** Stock piso — sync Report + Tablet POS (6 tablas) */
export const DEPOSITOS = DEPOSITOS_MATRIZ.filter((d) => d.categoria === "tienda");

export type DepositoTienda = (typeof DEPOSITOS)[number];

export function getDepositoByClienteId(cliente_id: number): DepositoTienda | undefined {
  return DEPOSITOS.find((d) => d.cliente_id === cliente_id);
}

export function getTablaByClienteId(cliente_id: number): string | undefined {
  return getDepositoByClienteId(cliente_id)?.tabla;
}

export function getDepositoByTabla(tabla: string): DepositoConfig | undefined {
  return DEPOSITOS_MATRIZ.find((d) => d.tabla === tabla);
}
