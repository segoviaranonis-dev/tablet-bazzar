"use client";

import Link from "next/link";
import { filtrosFromSearchParams, filtrosToSearchParams } from "@/lib/filtros-url";

type Props = {
  searchParams: URLSearchParams;
  clienteId: number;
  marca?: string;
};

/** Vista cadena — muestra triángulo activo (URL) y enlace a editar en `/cadena`. */
export function TrianguloResumenStrip({ searchParams, clienteId, marca }: Props) {
  const f = filtrosFromSearchParams(searchParams);
  const chips: string[] = [];
  if (f.generos.length) chips.push(`Género: ${f.generos.join(" · ")}`);
  if (f.marcas.length) chips.push(`Marca: ${f.marcas.join(" · ")}`);
  if (f.estilos.length) chips.push(`Estilo: ${f.estilos.join(" · ")}`);
  if (f.tipos.length) chips.push(`Producto: ${f.tipos.join(" · ")}`);
  if (f.buscar.trim()) chips.push(`Buscar: ${f.buscar.trim()}`);
  if (marca) chips.push(`Cadena: ${marca}`);

  const editQs = filtrosToSearchParams({ ...f, marcaCadena: marca });
  editQs.set("cliente_id", String(clienteId));
  const editHref = `/cadena?${editQs.toString()}`;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#c4bdb4] bg-white/90 px-2 py-1.5 text-[10px] text-[#6b6560]">
      <span className="font-bold uppercase tracking-[0.14em] text-[#1a1a1a]">Triángulo</span>
      {chips.length === 0 ? (
        <span>Sin filtros de entrada</span>
      ) : (
        chips.map((c) => (
          <span key={c} className="rounded-sm border border-[#c4bdb4] bg-[#faf8f5] px-2 py-0.5">
            {c}
          </span>
        ))
      )}
      <Link
        href={editHref}
        className="ml-auto min-h-[36px] rounded-sm border border-[#8a8278] px-3 py-1 font-semibold text-[#1a1a1a] active:bg-[#e8e2d9]"
      >
        Editar filtros
      </Link>
    </div>
  );
}
