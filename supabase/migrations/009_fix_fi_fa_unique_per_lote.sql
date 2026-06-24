-- 009 · FI_FA es por LOTE (N filas = 1 par c/u). Unicidad por fila (cliente_id, numero_fi_fa) rompe CERRAR.
-- Unicidad operativa: pos_fi_fa_counter + reservarNumeroFiFa en transacción.

DROP INDEX IF EXISTS public.uq_tbc_cliente_fi_fa_activo;

COMMENT ON COLUMN public.ticket_bandeja_cajero.numero_fi_fa IS
  'Factura interna secuencial POR cliente_id (tienda). Repetido en todas las filas del mismo staging_id (lote).';
