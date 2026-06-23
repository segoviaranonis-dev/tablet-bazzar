/** Fila de depósito con FK para agrupación en tablet. */
export type DepositoFila = {
  linea_id: number | null;
  referencia_id: number | null;
  material_id: number | null;
  color_id: number | null;
  marca_id: number | null;
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_code: string;
  color_code: string;
  marca: string;
  genero: string;
  estilo: string;
  tipo_v2: string;
  descp_material: string | null;
  descp_color: string | null;
  grada: string;
  cantidad: number;
  imagen_nombre: string | null;
  /** URL canónica sm — resuelta en servidor (thumbs + hero cadena). */
  imagen_url_thumb?: string | null;
  /** URL canónica lg (800px) — hero cadena. */
  imagen_url_hero?: string | null;
  /** Plano legacy — fallback único si tier sm/md falta. */
  imagen_url_flat?: string | null;
};

export function numCodigo(v: string): number {
  const n = Number(String(v).replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Orden cadena: línea ASC → referencia ASC */
export function compareLineaRef(a: DepositoFila, b: DepositoFila): number {
  const dl = numCodigo(a.linea_codigo_proveedor) - numCodigo(b.linea_codigo_proveedor);
  if (dl !== 0) return dl;
  return numCodigo(a.referencia_codigo_proveedor) - numCodigo(b.referencia_codigo_proveedor);
}

export function keyLRM(row: Pick<DepositoFila, "linea_codigo_proveedor" | "referencia_codigo_proveedor" | "material_code">): string {
  return `${String(row.linea_codigo_proveedor).trim()}|${String(row.referencia_codigo_proveedor).trim()}|${String(row.material_code).trim()}`;
}

export function keyLR(row: Pick<DepositoFila, "linea_codigo_proveedor" | "referencia_codigo_proveedor">): string {
  return `${String(row.linea_codigo_proveedor).trim()}|${String(row.referencia_codigo_proveedor).trim()}`;
}

export function keyLRMC(row: DepositoFila): string {
  return `${keyLRM(row)}|${String(row.color_code).trim()}`;
}

/** Grupo 1 — L + R + material (precio / foto base) */
export type GrupoPrincipal = {
  key: string;
  linea: string;
  referencia: string;
  material: string;
  descp_material: string | null;
  marca: string;
  filas: DepositoFila[];
  colores: DepositoFila[];
};

/** Par L+R único en cadena */
export type ParLineaRef = {
  key: string;
  linea: string;
  referencia: string;
  estilo: string;
  gruposMaterial: GrupoPrincipal[];
  /** Colores agregados solo L+R (grupo 2 visual) */
  coloresLR: DepositoFila[];
};

function normMarca(m: string | null | undefined): string {
  return (m ?? "").trim();
}

function qty(v: number | string): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function buildCadenaFromFilas(filas: DepositoFila[], marcaFiltro: string): ParLineaRef[] {
  const mf = normMarca(marcaFiltro);
  const deMarca = filas.filter((f) => normMarca(f.marca) === mf && qty(f.cantidad) > 0);
  const porLR = new Map<string, DepositoFila[]>();

  for (const f of deMarca) {
    const k = keyLR(f);
    if (!porLR.has(k)) porLR.set(k, []);
    porLR.get(k)!.push(f);
  }

  const pares: ParLineaRef[] = [];

  for (const [, rows] of porLR) {
    rows.sort(compareLineaRef);
    const first = rows[0];
    const porMat = new Map<string, DepositoFila[]>();
    for (const r of rows) {
      const mk = keyLRM(r);
      if (!porMat.has(mk)) porMat.set(mk, []);
      porMat.get(mk)!.push(r);
    }

    const gruposMaterial: GrupoPrincipal[] = [...porMat.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, matRows]) => {
        const m0 = matRows[0];
        const colores = dedupeColores(matRows);
        return {
          key,
          linea: String(m0.linea_codigo_proveedor).trim(),
          referencia: String(m0.referencia_codigo_proveedor).trim(),
          material: String(m0.material_code).trim(),
          descp_material: m0.descp_material,
          marca: m0.marca,
          filas: matRows,
          colores,
        };
      });

    pares.push({
      key: keyLR(first),
      linea: String(first.linea_codigo_proveedor).trim(),
      referencia: String(first.referencia_codigo_proveedor).trim(),
      estilo: first.estilo,
      gruposMaterial,
      coloresLR: dedupeColores(rows),
    });
  }

  pares.sort((a, b) => compareLineaRef(
    { linea_codigo_proveedor: a.linea, referencia_codigo_proveedor: a.referencia } as DepositoFila,
    { linea_codigo_proveedor: b.linea, referencia_codigo_proveedor: b.referencia } as DepositoFila,
  ));

  return pares;
}

/** Pares L+R del mismo estilo — cohorte terciaria (Marca → Estilo). */
export function paresMismoEstilo(pares: ParLineaRef[], estilo: string): ParLineaRef[] {
  const e = (estilo ?? "").trim();
  if (!e) return pares;
  const cohort = pares.filter((p) => (p.estilo ?? "").trim() === e);
  return cohort.length > 0 ? cohort : pares;
}

/** Alias canónico — agrupación terciaria acota sidebar y ←→ entre refs. */
export const paresCohorteEstilo = paresMismoEstilo;

/** Índice del par dentro de una lista (p. ej. cohorte secundaria). */
export function indexParEnPares(pares: ParLineaRef[], parKey: string): number {
  return pares.findIndex((p) => p.key === parKey);
}

/** Resuelve cohorte + índice al anclar o cambiar estilo hero. */
export function resolverNavCohorte(
  paresBase: ParLineaRef[],
  estiloCohorte: string,
  parKeyPreferido?: string | null,
): { paresNav: ParLineaRef[]; parIndex: number; estiloCohorte: string } {
  if (paresBase.length === 0) {
    return { paresNav: [], parIndex: 0, estiloCohorte: "" };
  }

  let estilo = (estiloCohorte ?? "").trim();
  const preferido = parKeyPreferido ? paresBase.find((p) => p.key === parKeyPreferido) : null;

  if (!estilo && preferido) estilo = (preferido.estilo ?? "").trim();
  if (!estilo) estilo = (paresBase[0]?.estilo ?? "").trim();

  let paresNav = paresMismoEstilo(paresBase, estilo);
  let parIndex = 0;

  if (preferido) {
    let i = indexParEnPares(paresNav, preferido.key);
    if (i < 0) {
      estilo = (preferido.estilo ?? "").trim();
      paresNav = paresMismoEstilo(paresBase, estilo);
      i = indexParEnPares(paresNav, preferido.key);
    }
    if (i >= 0) parIndex = i;
  }

  return { paresNav, parIndex, estiloCohorte: estilo };
}

export function parIndexEnPares(pares: ParLineaRef[], key: string): number {
  return pares.findIndex((p) => p.key === key);
}

function dedupeColores(rows: DepositoFila[]): DepositoFila[] {
  const map = new Map<string, DepositoFila>();
  for (const r of rows) {
    const k = `${String(r.material_code).trim()}|${String(r.color_code || r.descp_color || "?").trim()}`;
    const prev = map.get(k);
    if (!prev || r.cantidad > prev.cantidad) map.set(k, r);
  }
  return [...map.values()].sort((a, b) => numCodigo(a.color_code) - numCodigo(b.color_code));
}

export function listMarcasConStock(filas: DepositoFila[]): { marca: string; skus: number; pares: number }[] {
  const map = new Map<string, { skus: number; pares: number }>();
  for (const f of filas) {
    if (f.cantidad <= 0) continue;
    const cur = map.get(f.marca) ?? { skus: 0, pares: 0 };
    cur.skus += 1;
    cur.pares += f.cantidad;
    map.set(f.marca, cur);
  }
  return [...map.entries()]
    .map(([marca, v]) => ({ marca, ...v }))
    .sort((a, b) => a.marca.localeCompare(b.marca));
}
