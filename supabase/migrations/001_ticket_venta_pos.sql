-- Tablet Bazzar — tickets POS tienda (1 fila = 1 par)
-- Ejecutor: Claude Code / psql cuando Director apruebe

CREATE TABLE IF NOT EXISTS public.ticket_venta_pos (
  id              bigserial PRIMARY KEY,
  codigo_ticket   text NOT NULL UNIQUE,
  cliente_id      bigint NOT NULL,
  marca           text NOT NULL,
  vendedor_id     bigint,
  vendedor_nombre text,
  cedula_cliente  text,
  linea_id        bigint NOT NULL,
  referencia_id   bigint NOT NULL,
  material_id     bigint NOT NULL,
  color_id        bigint NOT NULL,
  grada           text NOT NULL,
  cantidad        int NOT NULL DEFAULT 1 CHECK (cantidad = 1),
  estado          text NOT NULL DEFAULT 'EMITIDO',
  snapshot_json   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_venta_pos_cliente_created
  ON public.ticket_venta_pos (cliente_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ticket_venta_pos_vendedor
  ON public.ticket_venta_pos (vendedor_id, created_at DESC);
