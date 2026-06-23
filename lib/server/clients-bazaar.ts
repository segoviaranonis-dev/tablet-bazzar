import { getPool, isDatabaseConfigured } from "@/lib/pool";
import type { OrigenClienteBazaar } from "@/lib/bazzar-origen";

/** Tabla canónica holding: clients-bazaar → public.clients_bazaar */
export const CLIENTS_BAZAAR_TABLE = "clients_bazaar";

export const CEDULA_RE = /^[0-9]{5,15}$/;
export const PHONE_RE = /^[0-9+\-\s()]{6,20}$/;

export type ClienteBazaarAutocomplete = {
  cedula: string;
  nombre: string;
  apellido: string | null;
  telefono: string | null;
  razon_social: string | null;
};

export type UpsertClienteBazaarInput = {
  cedula: string;
  nombre?: string | null;
  apellido?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  ruc?: string | null;
  razon_social?: string | null;
  origen: OrigenClienteBazaar;
};

export function tituloClienteBazaar(c: {
  nombre?: string | null;
  apellido?: string | null;
  razon_social?: string | null;
}): string {
  const rs = c.razon_social?.trim();
  if (rs) return rs;
  const parts = [c.nombre?.trim(), c.apellido?.trim()].filter(Boolean);
  return parts.join(" ") || "Cliente";
}

export function normalizarCedula(raw: string): string | null {
  const c = raw.replace(/\D/g, "").trim();
  if (!CEDULA_RE.test(c)) return null;
  return c;
}

async function tablaClientsBazaarExiste(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ reg: boolean }>(
    `SELECT to_regclass('public.${CLIENTS_BAZAAR_TABLE}') IS NOT NULL AS reg`,
  );
  return Boolean(r.rows[0]?.reg);
}

async function tieneColumnasOrigen(pool: ReturnType<typeof getPool>): Promise<boolean> {
  const r = await pool.query<{ ok: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'clients_bazaar'
          AND column_name = 'registro_ente_codigo'
      ) AS ok
    `,
  );
  return Boolean(r.rows[0]?.ok);
}

export async function buscarClienteBazaarPorCedula(
  cedula: string,
): Promise<ClienteBazaarAutocomplete | null> {
  if (!isDatabaseConfigured()) return null;

  const c = normalizarCedula(cedula);
  if (!c) return null;

  const pool = getPool();
  if (!(await tablaClientsBazaarExiste(pool))) return null;

  const { rows } = await pool.query<ClienteBazaarAutocomplete>(
    `
      SELECT cedula, nombre, apellido, telefono, razon_social
      FROM public.${CLIENTS_BAZAAR_TABLE}
      WHERE cedula = $1
      LIMIT 1
    `,
    [c],
  );

  return rows[0] ?? null;
}

export async function upsertClienteBazaar(input: UpsertClienteBazaarInput): Promise<number | null> {
  if (!isDatabaseConfigured()) return null;

  const cedula = normalizarCedula(input.cedula);
  if (!cedula) return null;

  const nombre = input.nombre?.trim() ?? "";
  const apellido = input.apellido?.trim() || null;
  const telefono = input.telefono?.trim() || null;
  const email = input.email?.trim() || null;
  const direccion = input.direccion?.trim() || null;
  const ruc = input.ruc?.replace(/\D/g, "").trim() || null;
  const razon_social = input.razon_social?.trim() || null;
  const { ente_codigo, tienda_cliente_id } = input.origen;

  if (ente_codigo < 2 || ente_codigo > 5) return null;
  if (!nombre && !telefono) return null;
  if (telefono && !PHONE_RE.test(telefono)) return null;

  const pool = getPool();
  if (!(await tablaClientsBazaarExiste(pool))) return null;

  const t = CLIENTS_BAZAAR_TABLE;
  const conOrigen = await tieneColumnasOrigen(pool);

  if (conOrigen) {
    const { rows } = await pool.query<{ id: number }>(
      `
        INSERT INTO public.${t} (
          cedula, nombre, apellido, telefono, email, direccion, ruc, razon_social,
          registro_ente_codigo, registro_tienda_cliente_id,
          ultimo_ente_codigo, ultimo_tienda_cliente_id,
          canal_registro, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $9, $10, $11, NOW())
        ON CONFLICT (cedula) DO UPDATE SET
          nombre = CASE
            WHEN NULLIF(TRIM(EXCLUDED.nombre), '') IS NOT NULL THEN EXCLUDED.nombre
            ELSE ${t}.nombre
          END,
          apellido = CASE
            WHEN NULLIF(TRIM(EXCLUDED.apellido), '') IS NOT NULL THEN EXCLUDED.apellido
            ELSE ${t}.apellido
          END,
          telefono = CASE
            WHEN NULLIF(TRIM(EXCLUDED.telefono), '') IS NOT NULL THEN EXCLUDED.telefono
            ELSE ${t}.telefono
          END,
          email = CASE
            WHEN NULLIF(TRIM(EXCLUDED.email), '') IS NOT NULL THEN EXCLUDED.email
            ELSE ${t}.email
          END,
          direccion = CASE
            WHEN NULLIF(TRIM(EXCLUDED.direccion), '') IS NOT NULL THEN EXCLUDED.direccion
            ELSE ${t}.direccion
          END,
          ruc = CASE
            WHEN NULLIF(TRIM(EXCLUDED.ruc), '') IS NOT NULL THEN EXCLUDED.ruc
            ELSE ${t}.ruc
          END,
          razon_social = CASE
            WHEN NULLIF(TRIM(EXCLUDED.razon_social), '') IS NOT NULL THEN EXCLUDED.razon_social
            ELSE ${t}.razon_social
          END,
          ultimo_ente_codigo = EXCLUDED.ultimo_ente_codigo,
          ultimo_tienda_cliente_id = EXCLUDED.ultimo_tienda_cliente_id,
          updated_at = NOW()
        RETURNING id
      `,
      [
        cedula,
        nombre || "Cliente",
        apellido,
        telefono,
        email,
        direccion,
        ruc,
        razon_social,
        ente_codigo,
        tienda_cliente_id,
        ente_codigo === 5 ? "WEB" : "TABLET",
      ],
    );
    return rows[0]?.id ?? null;
  }

  const { rows } = await pool.query<{ id: number }>(
    `
      INSERT INTO public.${t} (cedula, nombre, apellido, telefono, email, direccion, ruc, razon_social, canal_registro, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (cedula) DO UPDATE SET
        nombre = CASE
          WHEN NULLIF(TRIM(EXCLUDED.nombre), '') IS NOT NULL THEN EXCLUDED.nombre
          ELSE ${t}.nombre
        END,
        apellido = CASE
          WHEN NULLIF(TRIM(EXCLUDED.apellido), '') IS NOT NULL THEN EXCLUDED.apellido
          ELSE ${t}.apellido
        END,
        telefono = CASE
          WHEN NULLIF(TRIM(EXCLUDED.telefono), '') IS NOT NULL THEN EXCLUDED.telefono
          ELSE ${t}.telefono
        END,
        email = CASE
          WHEN NULLIF(TRIM(EXCLUDED.email), '') IS NOT NULL THEN EXCLUDED.email
          ELSE ${t}.email
        END,
        direccion = CASE
          WHEN NULLIF(TRIM(EXCLUDED.direccion), '') IS NOT NULL THEN EXCLUDED.direccion
          ELSE ${t}.direccion
        END,
        ruc = CASE
          WHEN NULLIF(TRIM(EXCLUDED.ruc), '') IS NOT NULL THEN EXCLUDED.ruc
          ELSE ${t}.ruc
        END,
        razon_social = CASE
          WHEN NULLIF(TRIM(EXCLUDED.razon_social), '') IS NOT NULL THEN EXCLUDED.razon_social
          ELSE ${t}.razon_social
        END,
        updated_at = NOW()
      RETURNING id
    `,
    [
      cedula,
      nombre || "Cliente",
      apellido,
      telefono,
      email,
      direccion,
      ruc,
      razon_social,
      ente_codigo === 5 ? "WEB" : "TABLET",
    ],
  );

  return rows[0]?.id ?? null;
}
