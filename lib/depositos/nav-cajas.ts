import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";

export type DepositoNavPosition = {
  parIndex: number;
  variantIndex: number;
  parKey: string;
  cardKey: string;
};

export type DepositoNavIndex = {
  cards: ProductoCajaCard[];
  cardByKey: Map<string, ProductoCajaCard>;
  parKeys: string[];
  variantsByPar: Map<string, string[]>;
  lookup: Map<string, DepositoNavPosition>;
};

export function parKeyFromCard(card: ProductoCajaCard): string {
  const p = card.producto;
  return `${p.linea_codigo_proveedor}|${p.referencia_codigo_proveedor}`;
}

function variantSortKey(card: ProductoCajaCard): string {
  const p = card.producto;
  return `${p.material_code}|${p.color_code}|${card.key}`;
}

/** Índice de navegación sobre el resultado filtrado (misma lista que la grilla). */
export function buildDepositoNavIndex(cards: ProductoCajaCard[]): DepositoNavIndex {
  const cardByKey = new Map(cards.map((c) => [c.key, c]));
  const parMap = new Map<string, ProductoCajaCard[]>();

  for (const card of cards) {
    const pk = parKeyFromCard(card);
    const list = parMap.get(pk);
    if (list) list.push(card);
    else parMap.set(pk, [card]);
  }

  const parKeys = Array.from(parMap.entries())
    .sort((a, b) => {
      const maxA = Math.max(...a[1].map((c) => c.totalPares));
      const maxB = Math.max(...b[1].map((c) => c.totalPares));
      if (maxB !== maxA) return maxB - maxA;
      return a[0].localeCompare(b[0], "es");
    })
    .map(([pk]) => pk);

  const variantsByPar = new Map<string, string[]>();
  const lookup = new Map<string, DepositoNavPosition>();

  parKeys.forEach((pk, parIndex) => {
    const variants = (parMap.get(pk) ?? [])
      .slice()
      .sort((a, b) => variantSortKey(a).localeCompare(variantSortKey(b), "es"))
      .map((c) => c.key);
    variantsByPar.set(pk, variants);
    variants.forEach((cardKey, variantIndex) => {
      lookup.set(cardKey, { parIndex, variantIndex, parKey: pk, cardKey });
    });
  });

  return { cards, cardByKey, parKeys, variantsByPar, lookup };
}

export function resolveNavPosition(
  index: DepositoNavIndex,
  activeKey: string,
): DepositoNavPosition | null {
  return index.lookup.get(activeKey) ?? null;
}

/** ↑↓ — cambia línea + referencia (cohorte del filtro aplicado). */
export function stepDepositoPar(
  index: DepositoNavIndex,
  activeKey: string,
  delta: -1 | 1,
): string | null {
  const pos = index.lookup.get(activeKey);
  if (!pos || index.parKeys.length === 0) return null;

  const nextParIndex = (pos.parIndex + delta + index.parKeys.length) % index.parKeys.length;
  const nextParKey = index.parKeys[nextParIndex];
  const variants = index.variantsByPar.get(nextParKey) ?? [];
  if (variants.length === 0) return null;

  const clamped = Math.min(pos.variantIndex, variants.length - 1);
  return variants[clamped];
}

/** ←→ — cambia material + color del par L+R activo. */
export function stepDepositoVariant(
  index: DepositoNavIndex,
  activeKey: string,
  delta: -1 | 1,
): string | null {
  const pos = index.lookup.get(activeKey);
  if (!pos) return null;

  const variants = index.variantsByPar.get(pos.parKey) ?? [];
  if (variants.length <= 1) return null;

  const nextIndex = (pos.variantIndex + delta + variants.length) % variants.length;
  return variants[nextIndex];
}

export function cardForParKey(index: DepositoNavIndex, parKey: string): ProductoCajaCard | null {
  const keys = index.variantsByPar.get(parKey);
  if (!keys?.length) return null;
  return index.cardByKey.get(keys[0]) ?? null;
}

export function firstVariantKeyForPar(index: DepositoNavIndex, parKey: string): string | null {
  const keys = index.variantsByPar.get(parKey);
  return keys?.[0] ?? null;
}

export function variantsForPar(index: DepositoNavIndex, parKey: string): ProductoCajaCard[] {
  const keys = index.variantsByPar.get(parKey) ?? [];
  return keys.map((k) => index.cardByKey.get(k)).filter((c): c is ProductoCajaCard => Boolean(c));
}
