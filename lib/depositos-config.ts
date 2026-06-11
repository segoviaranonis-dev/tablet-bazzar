export const DEPOSITOS = [
  { cliente_id: 2100, ente: "Fernando", tipo: "Adultos", tabla: "deposito_tienda_fernando_adultos", codigo: "FER-A" },
  { cliente_id: 2900, ente: "Fernando", tipo: "Niños", tabla: "deposito_tienda_fernando_ninos", codigo: "FER-N" },
  { cliente_id: 2400, ente: "San Martin", tipo: "Adultos", tabla: "deposito_tienda_sanmartin_adultos", codigo: "SM-A" },
  { cliente_id: 2700, ente: "San Martin", tipo: "Niños", tabla: "deposito_tienda_sanmartin_ninos", codigo: "SM-N" },
  { cliente_id: 3100, ente: "Palma", tipo: "Adultos", tabla: "deposito_tienda_palma_adultos", codigo: "PAL-A" },
  { cliente_id: 3200, ente: "Palma", tipo: "Niños", tabla: "deposito_tienda_palma_ninos", codigo: "PAL-N" },
] as const;

export type DepositoConfig = (typeof DEPOSITOS)[number];

export function getDepositoByClienteId(cliente_id: number): DepositoConfig | undefined {
  return DEPOSITOS.find((d) => d.cliente_id === cliente_id);
}
