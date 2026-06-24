-- 007 · Una sola tabla operativa POS: ticket_bandeja_cajero
-- staging_id = lote_id (agrupa filas) · sin ticket_pos_staging

CREATE SEQUENCE IF NOT EXISTS public.ticket_bandeja_lote_id_seq START WITH 1;

ALTER TABLE public.ticket_bandeja_cajero
  DROP CONSTRAINT IF EXISTS ticket_bandeja_cajero_staging_id_fkey;

ALTER TABLE public.ticket_bandeja_cajero
  ADD COLUMN IF NOT EXISTS snapshot_cliente jsonb,
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS cerrado_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelado_at timestamptz;

ALTER TABLE public.ticket_bandeja_cajero
  DROP CONSTRAINT IF EXISTS ticket_bandeja_cajero_cantidad_check;

ALTER TABLE public.ticket_bandeja_cajero
  ADD CONSTRAINT ticket_bandeja_cajero_cantidad_check CHECK (cantidad >= 1);

ALTER TABLE public.ticket_bandeja_cajero
  DROP CONSTRAINT IF EXISTS ticket_bandeja_cajero_estado_check;

ALTER TABLE public.ticket_bandeja_cajero
  ADD CONSTRAINT ticket_bandeja_cajero_estado_check
  CHECK (estado IN ('ABIERTO', 'PENDIENTE_CAJA', 'CSV_DESCARGADO', 'CANCELADO', 'ARCHIVADO'));

CREATE INDEX IF NOT EXISTS idx_tbc_lote_estado
  ON public.ticket_bandeja_cajero (cliente_id, staging_id, estado)
  WHERE activo = true AND staging_id IS NOT NULL;

COMMENT ON COLUMN public.ticket_bandeja_cajero.staging_id IS
  'Lote factura interna (FI_FA). Agrupa filas — ya no FK a ticket_pos_staging.';
COMMENT ON TABLE public.ticket_bandeja_cajero IS
  'Única tabla operativa POS: ABIERTO=tablet · PENDIENTE_CAJA/CSV=caja · handoff→bobeda';
