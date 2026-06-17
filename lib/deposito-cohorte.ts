import { DEPOSITOS, getDepositoByClienteId, type DepositoConfig } from "@/lib/depositos-config";
import { UBICACIONES, type UbicacionId } from "@/lib/ubicaciones";

/** Los 3 depósitos de la misma cohorte (Adultos o Niños) — uno por ubicación física. */
export function cohorteDepositos(clienteId: number): DepositoConfig[] {
  const config = getDepositoByClienteId(clienteId);
  if (!config) return [];
  return UBICACIONES.map((ub) => ub.depositos.find((d) => d.tipo === config.tipo)).filter(
    (d): d is DepositoConfig => d != null,
  );
}

export function tablaCohortePorUbicacion(
  clienteId: number,
  ubicacionId: UbicacionId,
): string | null {
  const config = getDepositoByClienteId(clienteId);
  if (!config) return null;
  const ub = UBICACIONES.find((u) => u.id === ubicacionId);
  const dep = ub?.depositos.find((d) => d.tipo === config.tipo);
  return dep?.tabla ?? null;
}

export type MoleculeFk = {
  linea_id: number | null;
  referencia_id: number | null;
  material_id: number | null;
  color_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_code: string;
  color_code: string;
};

export function hasMoleculeFk(m: MoleculeFk): boolean {
  return (
    m.linea_id != null &&
    m.referencia_id != null &&
    m.material_id != null &&
    m.color_id != null
  );
}

/** Depósito sync: a menudo linea_id/referencia_id NULL pero códigos + material_id/color_id sí. */
export function hasMoleculeCodigo(m: MoleculeFk): boolean {
  return (
    m.linea_codigo_proveedor.trim() !== "" &&
    m.referencia_codigo_proveedor.trim() !== "" &&
    m.material_id != null &&
    m.color_id != null
  );
}

export function moleculeKey(m: MoleculeFk): string {
  if (hasMoleculeFk(m)) {
    return `fk:${m.linea_id}:${m.referencia_id}:${m.material_id}:${m.color_id}`;
  }
  if (hasMoleculeCodigo(m)) {
    return `cod:${m.linea_codigo_proveedor.trim()}:${m.referencia_codigo_proveedor.trim()}:${m.material_id}:${m.color_id}`;
  }
  return `cod:${m.linea_codigo_proveedor}:${m.referencia_codigo_proveedor}:${m.material_code}:${m.color_code}`;
}

export function cohortePorUbicacion(clienteId: number): Map<UbicacionId, DepositoConfig> {
  const config = getDepositoByClienteId(clienteId);
  const map = new Map<UbicacionId, DepositoConfig>();
  if (!config) return map;
  for (const ub of UBICACIONES) {
    const dep = ub.depositos.find((d) => d.tipo === config.tipo);
    if (dep) map.set(ub.id, dep);
  }
  return map;
}
