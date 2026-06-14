/** Limpia URL Supabase (espacios, barras duplicadas) — Protocolo Imágenes. */
export function cleanSupabaseUrl(url: string): string {
  return url.trim().replace(/([^:]\/)\/+/g, "$1");
}

export function publicStorageObjectUrl(bucket: string, objectPath: string): string {
  const base = cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  if (!base) return "";
  const clean = objectPath.replace(/^\/+/, "");
  return cleanSupabaseUrl(`${base}/storage/v1/object/public/${bucket}/${clean}`);
}
