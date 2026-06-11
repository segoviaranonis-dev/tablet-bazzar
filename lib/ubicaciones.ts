import { DEPOSITOS, type DepositoConfig } from "@/lib/depositos-config";

export type UbicacionId = "fernando" | "san_martin" | "palma";

export type UbicacionConfig = {
  id: UbicacionId;
  label: string;
  depositos: DepositoConfig[];
};

/** 3 ubicaciones físicas × 2 depósitos (adultos + niños). */
export const UBICACIONES: UbicacionConfig[] = [
  {
    id: "fernando",
    label: "Fernando",
    depositos: DEPOSITOS.filter((d) => d.ente === "Fernando"),
  },
  {
    id: "san_martin",
    label: "San Martín",
    depositos: DEPOSITOS.filter((d) => d.ente === "San Martin"),
  },
  {
    id: "palma",
    label: "Palma",
    depositos: DEPOSITOS.filter((d) => d.ente === "Palma"),
  },
];

export function ubicacionIdFromClienteId(clienteId: number): UbicacionId | null {
  const u = UBICACIONES.find((ub) => ub.depositos.some((d) => d.cliente_id === clienteId));
  return u?.id ?? null;
}
