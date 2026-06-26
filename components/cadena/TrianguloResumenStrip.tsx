"use client";

import Link from "next/link";
import { filtrosFromSearchParams, filtrosToSearchParams } from "@/lib/filtros-url";

type Props = {
  searchParams: URLSearchParams;
  clienteId: number;
  marca?: string;
};

export function TrianguloResumenStrip({ searchParams, clienteId, marca }: Props) {
  const f = filtrosFromSearchParams(searchParams);
  const chips: string[] = [];
  if (f.generos.length) chips.push(`Género: ${f.generos.join(" · ")}`);
  if (f.marcas.length) chips.push(`Marca: ${f.marcas.join(" · ")}`);
  if (f.estilos.length) chips.push(`Estilo: ${f.estilos.join(" · ")}`);
  if (f.tipos.length) chips.push(`Categoría: ${f.tipos.join(" · ")}`);
  if (f.tipo1s.length) chips.push(`Tipo 1: ${f.tipo1s.join(" · ")}`);
  if (f.buscar.trim()) chips.push(`Buscar: ${f.buscar.trim()}`);
  if (f.sinTono) chips.push("TONO: sin asignar");
  if (f.tonos.length) chips.push(`TONO: ${f.tonos.join(" · ")}`);
  if (marca) chips.push(`Cadena: ${marca}`);

  const editQs = filtrosToSearchParams({ ...f, marcaCadena: marca });
  editQs.set("cliente_id", String(clienteId));
  const editHref = `/cadena?${editQs.toString()}`;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-white px-2 py-2 text-[10px] text-slate-600">
      <span className="bazzar-badge bazzar-badge-navy">Triángulo</span>
      {chips.length === 0 ? (
        <span className="text-slate-500">Sin filtros de entrada</span>
      ) : (
        chips.map((c) => (
          <span key={c} className="rounded-full border border-orange-200 bg-white px-2.5 py-0.5 font-semibold text-bazzar-naranja">
            {c}
          </span>
        ))
      )}
      <Link
        href={editHref}
        className="ml-auto min-h-[36px] rounded-full border border-bazzar-naranja bg-bazzar-naranja px-3 py-1 text-xs font-bold text-white active:bg-bazzar-naranja-dark"
      >
        Editar filtros
      </Link>
    </div>
  );
}
