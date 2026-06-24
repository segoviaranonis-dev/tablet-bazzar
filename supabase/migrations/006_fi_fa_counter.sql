-- Contador factura interna POS · FI_FA por tienda + campo factura legal (pendiente destino UI)

CREATE TABLE IF NOT EXISTS public.pos_fi_fa_counter (
  cliente_id  bigint PRIMARY KEY,
  last_num    bigint NOT NULL DEFAULT 0 CHECK (last_num >= 0)
);

COMMENT ON TABLE public.pos_fi_fa_counter IS
  'Contador secuencial FI_FA por tienda (cliente_id). Próximo número = last_num + 1.';

ALTER TABLE public.ticket_pos_staging
  ADD COLUMN IF NOT EXISTS numero_fi_fa bigint,
  ADD COLUMN IF NOT EXISTS numero_factura_legal text;

ALTER TABLE public.ticket_bandeja_cajero
  ADD COLUMN IF NOT EXISTS numero_fi_fa bigint,
  ADD COLUMN IF NOT EXISTS numero_factura_legal text;

ALTER TABLE public.bobeda_venta_pos
  ADD COLUMN IF NOT EXISTS numero_fi_fa bigint,
  ADD COLUMN IF NOT EXISTS numero_factura_legal text;

CREATE INDEX IF NOT EXISTS idx_tbc_fi_fa
  ON public.ticket_bandeja_cajero (cliente_id, numero_fi_fa DESC);

CREATE INDEX IF NOT EXISTS idx_bvp_fi_fa
  ON public.bobeda_venta_pos (cliente_id, numero_fi_fa DESC);

COMMENT ON COLUMN public.ticket_pos_staging.numero_fi_fa IS
  'Factura interna POS · formato UI: {titular} - FI_FA: {n}';
COMMENT ON COLUMN public.ticket_pos_staging.numero_factura_legal IS
  'Número factura legal (facturador). Destino UI definido por Director.';
