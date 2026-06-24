-- 008 · Integridad bandeja única · escala multi-tienda · IDs numéricos

DELETE FROM public.ticket_bandeja_cajero WHERE staging_id IS NULL;

ALTER TABLE public.ticket_bandeja_cajero
  ALTER COLUMN staging_id SET NOT NULL;

ALTER TABLE public.ticket_bandeja_cajero
  ALTER COLUMN staging_id SET DEFAULT nextval('public.ticket_bandeja_lote_id_seq');

CREATE UNIQUE INDEX IF NOT EXISTS uq_tbc_cliente_fi_fa_activo
  ON public.ticket_bandeja_cajero (cliente_id, numero_fi_fa)
  WHERE activo = true
    AND numero_fi_fa IS NOT NULL
    AND estado IN ('ABIERTO', 'PENDIENTE_CAJA', 'CSV_DESCARGADO');

CREATE INDEX IF NOT EXISTS idx_tbc_cliente_estado_created
  ON public.ticket_bandeja_cajero (cliente_id, estado, created_at DESC)
  WHERE activo = true;

COMMENT ON COLUMN public.ticket_bandeja_cajero.id IS
  'PK fila (bigserial). Un par = una fila.';
COMMENT ON COLUMN public.ticket_bandeja_cajero.staging_id IS
  'Lote factura (bigint secuencial global). Agrupa filas del mismo pedido.';
COMMENT ON COLUMN public.ticket_bandeja_cajero.numero_fi_fa IS
  'Factura interna secuencial POR cliente_id (tienda). UI: FI_FA: {n}.';
COMMENT ON COLUMN public.ticket_bandeja_cajero.cliente_id IS
  'Tienda origen (2100|2900|2400|2700|3100|3200). Ley aislamiento: toda query filtra aquí.';
