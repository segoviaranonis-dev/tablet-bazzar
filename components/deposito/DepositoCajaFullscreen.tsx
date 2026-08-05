"use client";

import { useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import {
  buildDepositoNavIndex,
  firstVariantKeyForPar,
  resolveNavPosition,
  stepDepositoPar,
  stepDepositoVariant,
  variantsForPar,
} from "@/lib/depositos/nav-cajas";
import { useDepositoStockLive } from "@/lib/depositos/use-deposito-stock-live";
import { analizarVidrieraCaja } from "@/lib/depositos/vidriera-estrellas";
import { ProductImage } from "@/components/ProductImage";
import { formatPrecioGs } from "@/lib/precio-venta";
import { useTouchNav } from "@/lib/use-touch-nav";
import { DepositoCarruselColores } from "./DepositoCarruselColores";
import { DepositoFullscreenStockStrip } from "./DepositoFullscreenStockStrip";
import { DepositoSidebarReferencias } from "./DepositoSidebarReferencias";

type Props = {
  cards: ProductoCajaCard[];
  activeKey: string;
  tiendaLabel: string;
  clienteId: number;
  onActiveKeyChange: (key: string) => void;
  onClose: () => void;
};

export function DepositoCajaFullscreen({
  cards,
  activeKey,
  tiendaLabel,
  clienteId,
  onActiveKeyChange,
  onClose,
}: Props) {
  const nav = useMemo(() => buildDepositoNavIndex(cards), [cards]);
  const card = nav.cardByKey.get(activeKey) ?? cards[0] ?? null;
  const pos = card ? resolveNavPosition(nav, card.key) : null;
  const parKey = pos?.parKey ?? "";
  const variants = useMemo(() => variantsForPar(nav, parKey), [nav, parKey]);

  const { ubicaciones, bootLoading, error, retry } = useDepositoStockLive(clienteId, card);

  const stepPar = useCallback(
    (delta: -1 | 1) => {
      const next = stepDepositoPar(nav, activeKey, delta);
      if (next) onActiveKeyChange(next);
    },
    [nav, activeKey, onActiveKeyChange],
  );

  const stepVariant = useCallback(
    (delta: -1 | 1) => {
      const next = stepDepositoVariant(nav, activeKey, delta);
      if (next) onActiveKeyChange(next);
    },
    [nav, activeKey, onActiveKeyChange],
  );

  const selectPar = useCallback(
    (pk: string) => {
      const key = firstVariantKeyForPar(nav, pk);
      if (key) onActiveKeyChange(key);
    },
    [nav, onActiveKeyChange],
  );

  const touch = useTouchNav({
    threshold: 28,
    onUp: () => stepPar(-1),
    onDown: () => stepPar(1),
    onLeft: () => stepVariant(-1),
    onRight: () => stepVariant(1),
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        stepPar(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        stepPar(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepVariant(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepVariant(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, stepPar, stepVariant]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!card || typeof document === "undefined") return null;

  const p = card.producto;
  const subtitulo =
    [p.descp_material, p.descp_color].filter(Boolean).join(" · ") ||
    `${p.material_code} / ${p.color_code}`;
  const vidriera = analizarVidrieraCaja({
    moleculeKey: card.key,
    clienteId,
    tallas: card.tallas,
    stock: card.stock,
  });
  const variantTotal = pos ? (nav.variantsByPar.get(pos.parKey)?.length ?? 1) : 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle ${p.linea_codigo_proveedor}.${p.referencia_codigo_proveedor}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-rimec-azul px-3 py-2 text-white">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[48px] min-w-[72px] rounded-xl bg-white/15 px-4 text-sm font-black active:bg-white/25"
        >
          ← CERRAR
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-xs font-normal uppercase tracking-wide opacity-90">
            Marca {p.marca}
          </p>
          <p className="font-mono text-sm font-semibold">
            {p.linea_codigo_proveedor}.{p.referencia_codigo_proveedor}
          </p>
        </div>
        <div className="shrink-0 text-right text-[10px] font-bold tabular-nums opacity-90">
          {pos ? (
            <>
              <span className="block">
                L+R {(pos.parIndex + 1).toLocaleString("es-PY")} /{" "}
                {nav.parKeys.length.toLocaleString("es-PY")}
              </span>
              <span className="block text-orange-200">
                Mat·col {(pos.variantIndex + 1).toLocaleString("es-PY")} /{" "}
                {variantTotal.toLocaleString("es-PY")}
              </span>
            </>
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          className="relative min-h-0 min-w-0 flex-1 touch-manipulation overflow-y-auto"
          {...touch}
        >
          <div className="mx-auto flex max-w-3xl flex-col px-3 pb-4 pt-2">
            <p className="text-2xl font-extrabold leading-tight text-rimec-azul">
              {card.estilo || p.tipo_v2 || "—"}
            </p>
            <p className="font-mono text-sm text-orange-600">
              {p.linea_codigo_proveedor}.{p.referencia_codigo_proveedor}
            </p>
            {card.precioUnitario != null ? (
              <p className="mt-1 text-xl font-black tabular-nums text-emerald-800">
                {formatPrecioGs(card.precioUnitario)}
              </p>
            ) : null}

            <div className="relative mx-auto mt-2 aspect-square w-full max-h-[min(42vh,440px)] max-w-[440px] bg-white">
              <ProductImage
                src={p.imagen_url_hero ?? p.imagen_url_thumb}
                fallbackSrc={p.imagen_url_flat}
                linea={p.linea_codigo_proveedor}
                ref={p.referencia_codigo_proveedor}
                material={p.material_code}
                color={p.color_code}
                imagenNombre={p.imagen_nombre}
                alt={`${p.linea_codigo_proveedor}-${p.referencia_codigo_proveedor}`}
                variant="hero"
                priority
                className="h-full w-full"
              />
              <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-bazzar-naranja px-3 py-1 text-sm font-bold text-white">
                {Math.round(card.totalPares)} p
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600">{subtitulo}</p>
            <p className="font-mono text-xs text-slate-500">
              Mat {p.material_code} · Col {p.color_code}
            </p>

            <DepositoCarruselColores
              variants={variants}
              activeKey={activeKey}
              onSelect={onActiveKeyChange}
            />

            <DepositoFullscreenStockStrip
              ubicaciones={ubicaciones}
              tiendaLabel={tiendaLabel}
              estilo={card.estilo}
              precioUnitario={card.precioUnitario}
              vidrieraActiva={vidriera.vidrieraActiva}
              loading={bootLoading}
              error={error}
              onRetry={retry}
            />
          </div>
        </div>

        <DepositoSidebarReferencias
          nav={nav}
          activeParKey={parKey}
          onSelectPar={selectPar}
        />
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-[11px] font-semibold text-slate-500">
        ↑↓ línea · referencia &nbsp;·&nbsp; ←→ material · color &nbsp;·&nbsp; stock vía /live
      </footer>
    </div>,
    document.body,
  );
}
