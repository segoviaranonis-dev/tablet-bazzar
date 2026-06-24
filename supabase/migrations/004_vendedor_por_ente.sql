-- Código vendedor único por ENTe (Fernando 2100+2900 comparten; San Martín 2400+2700; Palma 3100+3200)

ALTER TABLE public.vendedor_bazzar
  DROP CONSTRAINT IF EXISTS uq_vendedor_bazzar_cliente_pin;

ALTER TABLE public.vendedor_bazzar
  DROP CONSTRAINT IF EXISTS uq_vendedor_bazzar_func_cliente;

ALTER TABLE public.vendedor_bazzar
  ADD CONSTRAINT uq_vendedor_bazzar_ente_pin UNIQUE (ente_id, codigo_pin);

ALTER TABLE public.vendedor_bazzar
  ADD CONSTRAINT uq_vendedor_bazzar_func_ente UNIQUE (funcionario_id, ente_id);

CREATE INDEX IF NOT EXISTS idx_vendedor_bazzar_ente
  ON public.vendedor_bazzar (ente_id)
  WHERE activo = true;

COMMENT ON TABLE public.vendedor_bazzar IS
  'Vendedor POS Bazzar — código único por ente (Fernando/San Martín/Palma). Venta en cualquier piso del mismo ente.';

COMMENT ON COLUMN public.vendedor_bazzar.cliente_id IS
  'Tienda base RRHH (referencia); no restringe venta dentro del mismo ente.';
