-- Tablet Bazzar · vendedor por tienda + tickets intermedios (antes de ORO)
-- ORO = ticket_venta_pos · staging = borrador editable por puesto

CREATE TABLE IF NOT EXISTS public.vendedor_bazzar (
  id_vendedor     bigserial PRIMARY KEY,
  funcionario_id  bigint NOT NULL REFERENCES public.funcionarios(id_funcionario),
  ente_id         integer NOT NULL REFERENCES public.entes(id_ente),
  cliente_id      bigint NOT NULL,
  codigo_pin      text NOT NULL,
  nombre_display  text NOT NULL,
  activo          boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_vendedor_bazzar_cliente_pin UNIQUE (cliente_id, codigo_pin),
  CONSTRAINT uq_vendedor_bazzar_func_cliente UNIQUE (funcionario_id, cliente_id)
);

CREATE INDEX IF NOT EXISTS idx_vendedor_bazzar_cliente
  ON public.vendedor_bazzar (cliente_id)
  WHERE activo = true;

COMMENT ON TABLE public.vendedor_bazzar IS
  'Vendedor POS Bazzar — FK funcionario + ente + tienda piso (cliente_id). codigo_pin = PIN personal.';

CREATE TABLE IF NOT EXISTS public.ticket_pos_staging (
  id                  bigserial PRIMARY KEY,
  codigo_staging      text NOT NULL UNIQUE,
  cliente_id          bigint NOT NULL,
  marca               text NOT NULL,
  vendedor_bazzar_id  bigint NOT NULL REFERENCES public.vendedor_bazzar(id_vendedor),
  vendedor_nombre     text NOT NULL,
  cedula_cliente      text,
  clients_bazaar_id   bigint,
  estado              text NOT NULL DEFAULT 'ABIERTO'
    CHECK (estado IN ('ABIERTO', 'CERRADO', 'CANCELADO', 'ORO')),
  snapshot_cliente    jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  cerrado_at          timestamptz,
  cancelado_at        timestamptz,
  promovido_at        timestamptz
);

CREATE INDEX IF NOT EXISTS idx_ticket_staging_cliente_estado
  ON public.ticket_pos_staging (cliente_id, estado, created_at DESC);

CREATE TABLE IF NOT EXISTS public.ticket_pos_staging_linea (
  id              bigserial PRIMARY KEY,
  staging_id      bigint NOT NULL REFERENCES public.ticket_pos_staging(id) ON DELETE CASCADE,
  linea_id        bigint NOT NULL,
  referencia_id   bigint NOT NULL,
  material_id     bigint NOT NULL,
  color_id        bigint NOT NULL,
  grada           text NOT NULL,
  cantidad        int NOT NULL DEFAULT 1 CHECK (cantidad >= 0),
  activo          boolean NOT NULL DEFAULT true,
  snapshot_json   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ticket_staging_linea_staging
  ON public.ticket_pos_staging_linea (staging_id)
  WHERE activo = true;

ALTER TABLE public.ticket_venta_pos
  ADD COLUMN IF NOT EXISTS vendedor_bazzar_id bigint REFERENCES public.vendedor_bazzar(id_vendedor),
  ADD COLUMN IF NOT EXISTS staging_id bigint REFERENCES public.ticket_pos_staging(id);

-- Demo vendedores (PIN 1111 por tienda) — solo si hay funcionarios activos del ente
INSERT INTO public.vendedor_bazzar (funcionario_id, ente_id, cliente_id, codigo_pin, nombre_display)
SELECT f.id_funcionario, e.id_ente, v.cliente_id, v.pin, COALESCE(f.nombre_completo, f.nombres || ' ' || f.apellidos)
FROM (VALUES
  (2100, 2, '1111'),
  (2900, 2, '2222'),
  (2400, 3, '3333'),
  (2700, 3, '4444'),
  (3100, 4, '5555'),
  (3200, 4, '6666')
) AS v(cliente_id, ente_codigo, pin)
JOIN public.entes e ON e.codigo = v.ente_codigo AND e.activo = true
JOIN public.funcionarios f ON f.ente_id = e.id_ente AND f.activo = true
ON CONFLICT (cliente_id, codigo_pin) DO NOTHING;
