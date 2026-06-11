import { publicStorageObjectUrl } from "./storage-url";

const STAGING_SENTINEL_CODIGO_ABS = 999001;

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

/** Thumbnail en bucket productos/thumbs/ — misma convención RIMEC / Report PDF. */
export function toThumbnailStorageUrl(publicUrl: string): string {
  if (!publicUrl.includes("/productos/")) return publicUrl;
  return publicUrl.replace("/productos/", "/productos/thumbs/");
}

function pushUrl(urls: string[], url: string, preferThumb: boolean) {
  if (!url || urls.includes(url)) return;
  if (preferThumb) {
    const thumb = toThumbnailStorageUrl(url);
    if (thumb !== url && !urls.includes(thumb)) urls.push(thumb);
  }
  if (!urls.includes(url)) urls.push(url);
}

export function productImageCandidates(
  lineaCodigo: string,
  referenciaCodigo: string,
  materialCode: string | number,
  colorCode: string | number,
  preferThumb = true,
): string[] {
  const L = normPillarSegment(lineaCodigo);
  const R = normPillarSegment(referenciaCodigo);
  const M = normPillarSegment(materialCode);
  const C = normPillarSegment(colorCode);
  if (!L || !R) return [];

  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  const urls: string[] = [];

  const stem4 = joinPillarStem([L, R, M, C]);
  if (stem4) {
    for (const ext of exts) {
      pushUrl(urls, publicStorageObjectUrl("productos", `${stem4}${ext}`), preferThumb);
    }
  }
  const stemLr = joinPillarStem([L, R]);
  for (const ext of exts) {
    pushUrl(urls, publicStorageObjectUrl("productos", `${stemLr}${ext}`), preferThumb);
  }
  return urls;
}

export function imagenNombreToCandidates(
  imagenNombre: string | null | undefined,
  preferThumb = true,
): string[] {
  const raw = String(imagenNombre ?? "").trim();
  if (!raw) return [];

  const base = raw.replace(/^productos\//i, "").replace(/^\/+/, "");
  const urls: string[] = [];
  const exts = [".jpg", ".jpeg", ".png", ".webp"];

  const push = (path: string) => {
    pushUrl(urls, publicStorageObjectUrl("productos", path), preferThumb);
  };

  if (/\.(jpe?g|png|webp)$/i.test(base)) {
    push(base);
    return urls;
  }

  for (const ext of exts) push(`${base}${ext}`);
  return urls;
}

export function productImageCandidatesForRow(
  lineaCodigo: string,
  referenciaCodigo: string,
  materialCode: string | number,
  colorCode: string | number,
  imagenNombre?: string | null,
  preferThumb = true,
): string[] {
  const fromExcel = imagenNombreToCandidates(imagenNombre, preferThumb);
  const fromMolecule = productImageCandidates(
    lineaCodigo,
    referenciaCodigo,
    materialCode,
    colorCode,
    preferThumb,
  );
  const out = [...fromExcel];
  for (const u of fromMolecule) {
    if (!out.includes(u)) out.push(u);
  }
  return out;
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
