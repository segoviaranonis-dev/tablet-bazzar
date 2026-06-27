"use client";

import type { AlertaVidriera } from "@/lib/depositos/vidriera-estrellas";
import { ProductImage } from "@/components/ProductImage";

type Props = {
  alertas: AlertaVidriera[];
  loading?: boolean;
};

export function TabAlertasDeposito({ alertas, loading }: Props) {
  if (loading) {
    return <div className="py-20 text-center text-slate-500">Calculando alertas vidriera…</div>;
  }

  const cambios = alertas.filter((a) => a.tipo === "VIDRIERA_CAMBIO");
  const cerradas = alertas.filter((a) => a.tipo === "CAJA_CERRADA");

  if (alertas.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-12 text-center">
        <p className="text-2xl">⭐</p>
        <p className="mt-2 text-lg font-semibold text-emerald-800">Sin alertas vidriera</p>
        <p className="mt-1 text-sm text-emerald-700">Todas las cajas con estrella al día en piso.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <span className="rounded-full bg-red-100 px-3 py-1 font-bold text-red-800">
          {cambios.length} cambio vidriera
        </span>
        {cerradas.length > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900">
            {cerradas.length} caja{cerradas.length === 1 ? "" : "s"} cerrada{cerradas.length === 1 ? "" : "s"} ⭐
          </span>
        )}
      </div>

      {cambios.length > 0 && (
        <section>
          <h2 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-red-700">
            Alerta 1 · Vidriera
          </h2>
          <div className="flex flex-col gap-3">
            {cambios.map((a) => (
              <AlertaCard key={a.id} alerta={a} />
            ))}
          </div>
        </section>
      )}

      {cerradas.length > 0 && (
        <section>
          <h2 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-amber-800">
            Círculo cerrado · importadora liquidada
          </h2>
          <div className="flex flex-col gap-3">
            {cerradas.map((a) => (
              <AlertaCard key={a.id} alerta={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AlertaCard({ alerta: a }: { alerta: AlertaVidriera }) {
  const urgente = a.tipo === "VIDRIERA_CAMBIO";

  return (
    <article
      className={`flex gap-3 rounded-2xl border-2 p-3 shadow-sm ${
        urgente ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
        <ProductImage
          src={null}
          fallbackSrc={null}
          linea={a.linea}
          ref={a.referencia}
          material={a.materialCode}
          color={a.colorCode}
          imagenNombre={a.imagenNombre}
          alt={`${a.linea}.${a.referencia}`}
        />
        {a.gradaSiguiente && (
          <span className="absolute right-1 top-1 rounded-full bg-bazzar-naranja px-1.5 py-0.5 text-[10px] font-bold text-white">
            ⭐{a.gradaSiguiente}
          </span>
        )}
        {a.celebracion && (
          <span className="absolute inset-0 flex items-center justify-center bg-amber-400/30 text-lg">
            ⭐⭐⭐
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase text-rimec-azul">{a.marca}</p>
        <p className="font-mono text-sm font-bold text-slate-900">
          {a.linea}.{a.referencia}
        </p>
        <p className="text-xs text-slate-600 line-clamp-1">
          {[a.descpMaterial, a.descpColor].filter(Boolean).join(" · ") || a.estilo}
        </p>
        <p className={`mt-2 text-sm font-semibold ${urgente ? "text-red-900" : "text-amber-900"}`}>
          {a.mensaje}
        </p>
        {a.gradaAgotada && a.gradaSiguiente && (
          <p className="mt-1 text-xs text-slate-600">
            {a.gradaAgotada} agotada → exponer <strong>⭐ {a.gradaSiguiente}</strong> en vidriera
          </p>
        )}
      </div>
    </article>
  );
}
