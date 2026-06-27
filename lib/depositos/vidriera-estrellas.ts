/**
 * Vidriera · estrella por molécula (L+R+material+color).
 * Una estrella activa por caja · sucesión hasta liquidar último par.
 */

export type CohorteVidriera = "adultos" | "ninos";

/** Ancla canónica adultos calzado */
export const ESTRELLA_ANCLA_ADULTOS = "35";

/** Anclas niños — primera presente en la caja define estrella inicial */
export const ESTRELLA_ANCLAS_NINOS = ["32", "30", "23", "25", "27", "29"] as const;

/** Tras agotar 35 adultos · resto de curva importadora */
export const SUCESION_DESPUES_ANCLA_ADULTOS = ["36", "37", "38", "39", "34"] as const;

export type VidrieraCajaEstado = {
  moleculeKey: string;
  cohorte: CohorteVidriera;
  anclaEstrella: string | null;
  vidrieraActiva: string | null;
  ordenSucesion: string[];
  tallas: string[];
  stock: number[];
  totalPares: number;
};

export type AlertaVidrieraTipo = "VIDRIERA_CAMBIO" | "CAJA_CERRADA";

export type AlertaVidriera = {
  id: string;
  tipo: AlertaVidrieraTipo;
  moleculeKey: string;
  linea: string;
  referencia: string;
  marca: string;
  materialCode: string;
  colorCode: string;
  descpMaterial: string | null;
  descpColor: string | null;
  estilo: string;
  gradaAgotada: string | null;
  gradaSiguiente: string | null;
  totalParesRestantes: number;
  mensaje: string;
  celebracion: boolean;
  imagenNombre: string | null;
};

const CLIENTES_NINOS = new Set([2900, 2700, 3200]);

export function cohorteVidrieraPorClienteId(clienteId: number): CohorteVidriera {
  return CLIENTES_NINOS.has(clienteId) ? "ninos" : "adultos";
}

function sortNumeric(a: string, b: string): number {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.localeCompare(b, "es");
}

function stockDeGrada(tallas: string[], stock: number[], grada: string): number {
  const i = tallas.indexOf(grada);
  return i >= 0 ? (stock[i] ?? 0) : 0;
}

/** Orden de liquidación vidriera para esta caja */
export function buildOrdenSucesionVidriera(tallas: string[], cohorte: CohorteVidriera): string[] {
  const set = new Set(tallas);
  const ordered: string[] = [];

  if (cohorte === "adultos") {
    if (set.has(ESTRELLA_ANCLA_ADULTOS)) {
      ordered.push(ESTRELLA_ANCLA_ADULTOS);
    } else {
      for (const a of ESTRELLA_ANCLAS_NINOS) {
        if (set.has(a)) {
          ordered.push(a);
          break;
        }
      }
    }
    for (const g of SUCESION_DESPUES_ANCLA_ADULTOS) {
      if (set.has(g) && !ordered.includes(g)) ordered.push(g);
    }
  } else {
    for (const a of ESTRELLA_ANCLAS_NINOS) {
      if (set.has(a) && !ordered.includes(a)) ordered.push(a);
    }
  }

  const rest = tallas.filter((t) => !ordered.includes(t)).sort(sortNumeric);
  return [...ordered, ...rest];
}

export function resolverAnclaEstrella(ordenSucesion: string[]): string | null {
  return ordenSucesion[0] ?? null;
}

/** Primera grada del orden con stock > 0 = lo que va en vidriera ahora */
export function resolverVidrieraActiva(
  ordenSucesion: string[],
  tallas: string[],
  stock: number[],
): string | null {
  for (const g of ordenSucesion) {
    if (stockDeGrada(tallas, stock, g) > 0) return g;
  }
  return null;
}

export function analizarVidrieraCaja(input: {
  moleculeKey: string;
  clienteId: number;
  tallas: string[];
  stock: number[];
}): VidrieraCajaEstado {
  const cohorte = cohorteVidrieraPorClienteId(input.clienteId);
  const totalPares = input.stock.reduce((s, n) => s + (n ?? 0), 0);
  const ordenSucesion = buildOrdenSucesionVidriera(input.tallas, cohorte);
  const anclaEstrella = resolverAnclaEstrella(ordenSucesion);
  const vidrieraActiva = resolverVidrieraActiva(ordenSucesion, input.tallas, input.stock);

  return {
    moleculeKey: input.moleculeKey,
    cohorte,
    anclaEstrella,
    vidrieraActiva,
    ordenSucesion,
    tallas: input.tallas,
    stock: input.stock,
    totalPares,
  };
}

export function detectarAlertaVidriera(
  estado: VidrieraCajaEstado,
  meta: {
    linea: string;
    referencia: string;
    marca: string;
    materialCode: string;
    colorCode: string;
    descpMaterial: string | null;
    descpColor: string | null;
    estilo: string;
    imagenNombre: string | null;
  },
): AlertaVidriera | null {
  const base = {
    moleculeKey: estado.moleculeKey,
    linea: meta.linea,
    referencia: meta.referencia,
    marca: meta.marca,
    materialCode: meta.materialCode,
    colorCode: meta.colorCode,
    descpMaterial: meta.descpMaterial,
    descpColor: meta.descpColor,
    estilo: meta.estilo,
    imagenNombre: meta.imagenNombre,
  };

  if (estado.totalPares <= 0) {
    return null;
  }

  const { vidrieraActiva, ordenSucesion } = estado;
  if (!vidrieraActiva) return null;

  const idxActiva = ordenSucesion.indexOf(vidrieraActiva);
  let gradaAgotada: string | null = null;
  for (let i = 0; i < idxActiva; i++) {
    const g = ordenSucesion[i];
    if (estado.tallas.includes(g) && stockDeGrada(estado.tallas, estado.stock, g) <= 0) {
      gradaAgotada = g;
    }
  }

  if (!gradaAgotada) return null;

  return {
    ...base,
    id: `${estado.moleculeKey}:vidriera:${gradaAgotada}->${vidrieraActiva}`,
    tipo: "VIDRIERA_CAMBIO",
    gradaAgotada,
    gradaSiguiente: vidrieraActiva,
    totalParesRestantes: estado.totalPares,
    celebracion: false,
    mensaje: `Vidriera · último par ${gradaAgotada} vendido · exponer ⭐ ${vidrieraActiva} (${estado.totalPares} p restantes)`,
  };
}

export function listarAlertasVidriera(
  cajas: Array<{
    key: string;
    tallas: string[];
    stock: number[];
    totalPares: number;
    producto: {
      linea_codigo_proveedor: string;
      referencia_codigo_proveedor: string;
      marca: string;
      material_code: string;
      color_code: string;
      descp_material: string | null;
      descp_color: string | null;
      estilo: string;
      imagen_nombre: string | null;
    };
  }>,
  clienteId: number,
): AlertaVidriera[] {
  const alertas: AlertaVidriera[] = [];

  for (const caja of cajas) {
    const estado = analizarVidrieraCaja({
      moleculeKey: caja.key,
      clienteId,
      tallas: caja.tallas,
      stock: caja.stock,
    });
    const alerta = detectarAlertaVidriera(estado, {
      linea: caja.producto.linea_codigo_proveedor,
      referencia: caja.producto.referencia_codigo_proveedor,
      marca: caja.producto.marca,
      materialCode: caja.producto.material_code,
      colorCode: caja.producto.color_code,
      descpMaterial: caja.producto.descp_material,
      descpColor: caja.producto.descp_color,
      estilo: caja.producto.estilo,
      imagenNombre: caja.producto.imagen_nombre,
    });
    if (alerta) alertas.push(alerta);
  }

  return alertas.sort((a, b) => {
    if (a.tipo === "CAJA_CERRADA" && b.tipo !== "CAJA_CERRADA") return 1;
    if (b.tipo === "CAJA_CERRADA" && a.tipo !== "CAJA_CERRADA") return -1;
    if (a.tipo === "VIDRIERA_CAMBIO" && b.tipo === "VIDRIERA_CAMBIO") {
      return b.totalParesRestantes - a.totalParesRestantes;
    }
    return a.moleculeKey.localeCompare(b.moleculeKey, "es");
  });
}
