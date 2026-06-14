import { publicStorageObjectUrl } from "./storage-url";

export type ImageSize = "sm" | "md" | "lg";
export type ImageVariant = "thumb" | "hero";

/** Dimensiones intrínsecas Protocolo Imágenes Nexus. */
export const IMAGE_INTRINSIC = {
  sm: { width: 200, height: 200 },
  md: { width: 400, height: 400 },
  lg: { width: 800, height: 800 },
} as const;

/** Hero — viewport 1:1 alineado al tier lg (800×800) en Storage. */
export const HERO_VIEWPORT = {
  width: 800,
  height: 800,
  aspectClass: "aspect-square",
} as const;

const STAGING_SENTINEL_CODIGO_ABS = 999001;

/** URL pública sm/md/lg — Protocolo Imágenes Nexus. */
export function getProductImageUrl(
  imageName: string,
  size: ImageSize = "sm",
): string {
  const base = imageName
    .replace(/^productos\//i, "")
    .replace(/^(sm|md|lg)\//i, "")
    .replace(/^\/+/, "");
  if (!base) return "";
  return publicStorageObjectUrl("productos", `${size}/${base}`);
}

/** Tablet listados/cadena: siempre sm (~6 KB). */
export function getTabletImageUrl(imageName: string): string {
  return getProductImageUrl(imageName, "sm");
}

function normCodigo(v: string | number | null | undefined): string {
  if (v == null) return "";
  const n = Number(v);
  if (Number.isFinite(n) && n === Math.floor(n)) return String(Math.floor(n));
  return String(v).trim().replace(/\s+/g, "");
}

function isSentinelCodigoProveedor(norm: string): boolean {
  if (!norm) return false;
  const n = Number(norm.replace(/^\+/, ""));
  return Number.isFinite(n) && Math.abs(Math.trunc(n)) === STAGING_SENTINEL_CODIGO_ABS;
}

function normPillarSegment(v: string | number | null | undefined): string {
  const s = normCodigo(v);
  if (!s || isSentinelCodigoProveedor(s)) return "";
  return s;
}

function joinPillarStem(parts: string[]): string {
  return parts.filter(Boolean).join("-");
}

/** Thumb → sm (~20 KB). Hero → lg (~95 KB); nunca escalar sm/ a pantalla grande. */
function variantToSize(variant: ImageVariant): ImageSize {
  return variant === "hero" ? "lg" : "sm";
}

function normalizeImageFileName(raw: string): string | null {
  const base = raw
    .replace(/^productos\//i, "")
    .replace(/^(sm|md|lg)\//i, "")
    .replace(/^\/+/, "")
    .trim();
  if (!base) return null;
  return /\.(jpe?g|png|webp)$/i.test(base) ? base : `${base}.jpg`;
}

/** URL plana legacy (sin tier sm/md/lg) — fallback único cuando el tier falta en Storage. */
export function resolveFlatImageUrl(input: {
  linea: string;
  referencia: string;
  material: string;
  color: string;
  imagenNombre?: string | null;
}): string | null {
  const excel = String(input.imagenNombre ?? "").trim();
  if (excel) {
    const file = normalizeImageFileName(excel);
    if (!file) return null;
    return publicStorageObjectUrl("productos", file);
  }

  const L = normPillarSegment(input.linea);
  const R = normPillarSegment(input.referencia);
  if (!L || !R) return null;

  const M = normPillarSegment(input.material);
  const C = normPillarSegment(input.color);
  const stem = joinPillarStem([L, R, M, C]) || joinPillarStem([L, R]);
  if (!stem) return null;

  return publicStorageObjectUrl("productos", `${stem}.jpg`);
}

/** Una sola URL canónica — sin arrays ni fallback en cliente. */
export function resolveCanonicalImageUrl(input: {
  linea: string;
  referencia: string;
  material: string;
  color: string;
  imagenNombre?: string | null;
  variant: ImageVariant;
}): string | null {
  const size = variantToSize(input.variant);
  const excel = String(input.imagenNombre ?? "").trim();
  if (excel) {
    const file = normalizeImageFileName(excel);
    if (!file) return null;
    const url = getProductImageUrl(file, size);
    return url || null;
  }

  const L = normPillarSegment(input.linea);
  const R = normPillarSegment(input.referencia);
  if (!L || !R) return null;

  const M = normPillarSegment(input.material);
  const C = normPillarSegment(input.color);
  const stem = joinPillarStem([L, R, M, C]) || joinPillarStem([L, R]);
  if (!stem) return null;

  const url = publicStorageObjectUrl("productos", `${size}/${stem}.jpg`);
  return url || null;
}

/** Gradiente fallback fijo estilo RIMEC (sin emoji). */
export function productImageFallbackStyle(
  linea: string,
  referencia: string,
): { background: string } {
  void linea;
  void referencia;
  return {
    background: "linear-gradient(135deg, #0F172A 0%, #2d5a8e 100%)",
  };
}

export type ImagenUrls = {
  imagen_url_thumb: string | null;
  imagen_url_hero: string | null;
  /** Plano legacy — un solo fallback si sm/md responde 400/404. */
  imagen_url_flat: string | null;
};

/**
 * Hero salón: lg/ → flat → sm (rimec-web usa md/lg en zoom; thumb solo en miniaturas).
 */
export function pickHeroLoadSequence(
  urls: Pick<ImagenUrls, "imagen_url_thumb" | "imagen_url_flat" | "imagen_url_hero">,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of [urls.imagen_url_hero, urls.imagen_url_flat, urls.imagen_url_thumb]) {
    if (u && !seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

export function pickHeroDisplaySrc(
  urls: Pick<ImagenUrls, "imagen_url_thumb" | "imagen_url_flat" | "imagen_url_hero">,
): string | null {
  return pickHeroLoadSequence(urls)[0] ?? null;
}

export function pickHeroFallbackSrc(
  urls: Pick<ImagenUrls, "imagen_url_thumb" | "imagen_url_flat" | "imagen_url_hero">,
): string | null {
  return pickHeroLoadSequence(urls)[1] ?? null;
}

export function enrichDepositoFilaImagenes<
  T extends {
    linea_codigo_proveedor: string;
    referencia_codigo_proveedor: string;
    material_code: string;
    color_code: string;
    imagen_nombre?: string | null;
  },
>(fila: T): T & ImagenUrls {
  const base = {
    linea: fila.linea_codigo_proveedor,
    referencia: fila.referencia_codigo_proveedor,
    material: fila.material_code,
    color: fila.color_code,
    imagenNombre: fila.imagen_nombre,
  };
  const flat = resolveFlatImageUrl(base);
  return {
    ...fila,
    imagen_url_thumb: resolveCanonicalImageUrl({ ...base, variant: "thumb" }),
    imagen_url_hero: resolveCanonicalImageUrl({ ...base, variant: "hero" }),
    imagen_url_flat: flat,
  };
}

/** Legacy thumbs/ → sm/ (Protocolo Imágenes). */
export function toThumbnailStorageUrl(publicUrl: string): string {
  if (!publicUrl.includes("/productos/")) return publicUrl;
  if (publicUrl.includes("/productos/sm/")) return publicUrl;
  if (publicUrl.includes("/productos/thumbs/")) {
    return publicUrl.replace("/productos/thumbs/", "/productos/sm/");
  }
  const after = publicUrl.split("/productos/")[1] ?? "";
  const clean = after.replace(/^(sm|md|lg)\//, "");
  if (!clean) return publicUrl;
  return publicStorageObjectUrl("productos", `sm/${clean}`);
}

export type CadenaBgStyle = { background: string; transition: string };

export function cadenaBackgroundStyle(linea: string, referencia: string): CadenaBgStyle {
  const a = Number(linea.replace(/\D/g, "")) || 0;
  const b = Number(referencia.replace(/\D/g, "")) || 0;
  const t = ((a * 17 + b * 31) % 100) / 100;
  const l1 = 94 - t * 4;
  const l2 = 90 - t * 3;
  return {
    background: `linear-gradient(168deg, hsl(38 18% ${l1}%) 0%, hsl(32 14% ${l2}%) 55%, hsl(40 12% ${l1 + 1}%) 100%)`,
    transition: "background 0.35s ease",
  };
}
