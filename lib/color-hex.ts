/** Resolución hex color — paridad RIMEC Web CatalogoGrid. */

const NOMBRE_A_HEX: Record<string, string> = {
  negro: "#1a1a1a",
  blanco: "#f8fafc",
  gris: "#94a3b8",
  azul: "#3b82f6",
  rojo: "#ef4444",
  verde: "#22c55e",
  amarillo: "#eab308",
  rosa: "#f472b6",
  beige: "#d4b896",
  marron: "#78350f",
  cafe: "#78350f",
  nude: "#e8c4a8",
  dourado: "#ca8a04",
  prata: "#cbd5e1",
};

function hexDesdeNombre(nombre: string): string {
  const low = nombre.toLowerCase();
  for (const [key, hex] of Object.entries(NOMBRE_A_HEX)) {
    if (low.includes(key)) return hex;
  }
  return "#CBD5E1";
}

export function resolverColorHex(input: {
  color_hex?: string | null;
  descp_color?: string | null;
  label?: string | null;
}): string {
  const raw = input.color_hex?.trim();
  if (raw && /^#[0-9a-fA-F]{3,8}$/.test(raw)) return raw;
  const name = input.descp_color?.trim() || input.label?.trim();
  if (name) return hexDesdeNombre(name);
  return "#CBD5E1";
}
