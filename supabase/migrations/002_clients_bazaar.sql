-- Ver control_central/migrations/121_clients_bazaar.sql (canónico holding)
-- Copia local tablet-bazzar para referencia deploy

DO $$
BEGIN
  IF to_regclass('public.clients_bazaar') IS NULL
     AND to_regclass('public.cliente_web') IS NOT NULL THEN
    ALTER TABLE public.cliente_web RENAME TO clients_bazaar;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.clients_bazaar (
  id              bigserial PRIMARY KEY,
  cedula          text NOT NULL,
  nombre          text NOT NULL DEFAULT '',
  apellido        text,
  email           text,
  telefono        text,
  direccion       text,
  canal_registro  text NOT NULL DEFAULT 'TIENDA'
    CHECK (canal_registro IN ('TIENDA', 'TABLET', 'WEB')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_clients_bazaar_cedula ON public.clients_bazaar (cedula);

ALTER TABLE public.ticket_venta_pos
  ADD COLUMN IF NOT EXISTS clients_bazaar_id bigint REFERENCES public.clients_bazaar(id);
