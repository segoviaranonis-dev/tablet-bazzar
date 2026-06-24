-- P0 · Bandeja cajero ≠ Bobeda ORO
-- ticket_bandeja_cajero = operativa cajero · bobeda_venta_pos = histórico + import

CREATE TABLE IF NOT EXISTS public.ticket_bandeja_cajero (
  id                  bigserial PRIMARY KEY,
  codigo_bandeja      text NOT NULL UNIQUE,
  cliente_id          bigint NOT NULL,
  marca               text NOT NULL,
  vendedor_id         bigint,
  vendedor_nombre     text,
  vendedor_bazzar_id  bigint REFERENCES public.vendedor_bazzar(id_vendedor),
  staging_id          bigint REFERENCES public.ticket_pos_staging(id),
  cedula_cliente      text,
  clients_bazaar_id   bigint,
  linea_id            bigint NOT NULL,
  referencia_id       bigint NOT NULL,
  material_id         bigint NOT NULL,
  color_id            bigint NOT NULL,
  grada               text NOT NULL,
  cantidad            int NOT NULL DEFAULT 1 CHECK (cantidad = 1),
  estado              text NOT NULL DEFAULT 'PENDIENTE_CAJA'
    CHECK (estado IN ('PENDIENTE_CAJA', 'CSV_DESCARGADO', 'ARCHIVADO')),
  snapshot_json       jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  csv_descargado_at   timestamptz
);

CREATE INDEX IF NOT EXISTS idx_tbc_cliente_estado
  ON public.ticket_bandeja_cajero (cliente_id, estado, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tbc_staging
  ON public.ticket_bandeja_cajero (staging_id);

CREATE TABLE IF NOT EXISTS public.bobeda_venta_pos (
  id                  bigserial PRIMARY KEY,
  codigo_oro          text NOT NULL UNIQUE,
  cliente_id          bigint NOT NULL,
  marca               text NOT NULL,
  vendedor_id         bigint,
  vendedor_nombre     text,
  vendedor_bazzar_id  bigint REFERENCES public.vendedor_bazzar(id_vendedor),
  staging_id          bigint,
  bandeja_codigo      text,
  cedula_cliente      text,
  clients_bazaar_id   bigint,
  linea_id            bigint NOT NULL,
  referencia_id       bigint NOT NULL,
  material_id           bigint NOT NULL,
  color_id            bigint NOT NULL,
  grada               text NOT NULL,
  cantidad            int NOT NULL DEFAULT 1 CHECK (cantidad = 1),
  estado              text NOT NULL DEFAULT 'PENDIENTE_ENTREGA'
    CHECK (estado IN ('PENDIENTE_ENTREGA', 'ENTREGADO', 'ANULADO')),
  origen              text NOT NULL DEFAULT 'POS_VIVO'
    CHECK (origen IN ('POS_VIVO', 'IMPORT_HISTORICO', 'MIGRACION')),
  fecha_venta         date NOT NULL DEFAULT (CURRENT_DATE),
  snapshot_json       jsonb,
  import_batch_id     uuid,
  created_at          timestamptz NOT NULL DEFAULT now(),
  entregado_at        timestamptz
);

CREATE INDEX IF NOT EXISTS idx_bvp_cliente_estado
  ON public.bobeda_venta_pos (cliente_id, estado, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bvp_fecha
  ON public.bobeda_venta_pos (cliente_id, fecha_venta DESC);

CREATE INDEX IF NOT EXISTS idx_bvp_origen
  ON public.bobeda_venta_pos (origen);

-- Backfill desde legacy ticket_venta_pos
INSERT INTO public.ticket_bandeja_cajero (
  codigo_bandeja, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id,
  staging_id, cedula_cliente, clients_bazaar_id, linea_id, referencia_id, material_id,
  color_id, grada, cantidad, estado, snapshot_json, created_at
)
SELECT
  codigo_ticket, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id,
  staging_id, cedula_cliente, clients_bazaar_id, linea_id, referencia_id, material_id,
  color_id, grada, cantidad,
  CASE WHEN upper(btrim(estado)) = 'EMITIDO' THEN 'PENDIENTE_CAJA' ELSE 'PENDIENTE_CAJA' END,
  snapshot_json, created_at
FROM public.ticket_venta_pos
WHERE upper(btrim(estado)) = 'EMITIDO'
ON CONFLICT (codigo_bandeja) DO NOTHING;

INSERT INTO public.bobeda_venta_pos (
  codigo_oro, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id,
  staging_id, bandeja_codigo, cedula_cliente, clients_bazaar_id, linea_id, referencia_id,
  material_id, color_id, grada, cantidad, estado, origen, fecha_venta, snapshot_json, created_at
)
SELECT
  codigo_ticket, cliente_id, marca, vendedor_id, vendedor_nombre, vendedor_bazzar_id,
  staging_id, codigo_ticket, cedula_cliente, clients_bazaar_id, linea_id, referencia_id,
  material_id, color_id, grada, cantidad, 'PENDIENTE_ENTREGA', 'MIGRACION',
  created_at::date, snapshot_json, created_at
FROM public.ticket_venta_pos
WHERE upper(btrim(estado)) = 'FACTURADO'
ON CONFLICT (codigo_oro) DO NOTHING;

COMMENT ON TABLE public.ticket_bandeja_cajero IS 'Cola operativa cajero Report — efímera · CSV · pre-ORO';
COMMENT ON TABLE public.bobeda_venta_pos IS 'ORO histórico Bazzar — import · Sales Report futuro · ENTREGADO';
