"use client";

import { useMemo } from "react";
import type { DepositoProducto } from "@/app/api/deposito/[cliente_id]/route";
import { agruparProductosPorCaja, type ProductoCajaCard } from "@/lib/depositos/agrupar-cajas";
import { analizarVidrieraCaja } from "@/lib/depositos/vidriera-estrellas";
import { formatPrecioGs } from "@/lib/precio-venta";
import { TarjetaCajaDeposito } from "./TarjetaCajaDeposito";

type Props = {
  productos: DepositoProducto[];
  tiendaLabel: string;
  codigoDeposito: string;
  clienteId: number;
  /** Barra de totales más delgada — stock protagonista */
  compactStats?: boolean;
  /** Solo foto + overlay; grilla más densa */
  colapsarTodo?: boolean;
  maxCards?: number;
  onCardSelect?: (card: ProductoCajaCard) => void;
};

export function GrillaCajasDeposito({
  productos,
  tiendaLabel,
  codigoDeposito,
  clienteId,
  compactStats = false,
  colapsarTodo = true,
  maxCards,
  onCardSelect,
}: Props) {
  const cards = useMemo(() => {
    const all = agruparProductosPorCaja(productos);
    if (maxCards != null && all.length > maxCards) return all.slice(0, maxCards);
    return all;
  }, [productos, maxCards]);

  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-lg text-slate-600">Sin cajas en este depósito o sin coincidencias.</p>
      </div>
    );
  }

  const totalPares = cards.reduce((s, c) => s + c.totalPares, 0);
  const totalValor = cards.reduce((s, c) => {
    const p = c.precioUnitario;
    return p != null ? s + p * c.totalPares : s;
  }, 0);
  const cajasConPrecio = cards.filter((c) => c.precioUnitario != null).length;

  return (
    <>
      <div
        className={`mb-3 flex flex-wrap items-center justify-center gap-2 text-center text-slate-600 ${
          compactStats ? "text-xs" : "mb-4 text-sm"
        }`}
      >
        <span
          className={`rounded-full bg-rimec-azul/10 font-bold text-rimec-azul ${
            compactStats ? "px-2 py-0.5" : "px-3 py-1"
          }`}
        >
          {cards.length.toLocaleString("es-PY")} cajas
        </span>
        <span
          className={`rounded-full bg-bazzar-naranja/15 font-bold text-bazzar-naranja-dark ${
            compactStats ? "px-2 py-0.5" : "px-3 py-1"
          }`}
        >
          {Math.round(totalPares).toLocaleString("es-PY")} pares
        </span>
        {cajasConPrecio > 0 ? (
          <span
            className={`rounded-full bg-emerald-100 font-bold text-emerald-800 ${
              compactStats ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
            }`}
          >
            {formatPrecioGs(totalValor)}
          </span>
        ) : null}
        {!compactStats ? (
          <span className="text-xs text-slate-500">
            {codigoDeposito} · agrupación L+R+material+color
          </span>
        ) : null}
      </div>
      <div
        className={`flex flex-wrap justify-center ${colapsarTodo ? "gap-2" : "gap-3"}`}
      >
        {cards.map((card) => {
          const vidriera = analizarVidrieraCaja({
            moleculeKey: card.key,
            clienteId,
            tallas: card.tallas,
            stock: card.stock,
          });
          return (
            <TarjetaCajaDeposito
              key={card.key}
              card={card}
              tiendaLabel={tiendaLabel}
              vidriera={vidriera}
              colapsarTodo={colapsarTodo}
              compactGrid={colapsarTodo}
              onImageTap={onCardSelect ? () => onCardSelect(card) : undefined}
            />
          );
        })}
      </div>
    </>
  );
}
