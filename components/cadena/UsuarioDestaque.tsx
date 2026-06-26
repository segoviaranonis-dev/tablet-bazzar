"use client";

type Props = {
  nombre: string;
  categoria?: string | null;
};

/** Badge sesión — zona derecha del header Catálogo · Ventas (Nivel Dios). */
export function UsuarioDestaque({ nombre, categoria }: Props) {
  const cat = (categoria ?? "").toUpperCase().trim();
  return (
    <div
      className="flex max-w-[96px] flex-col items-end rounded-lg border border-amber-300/70 bg-gradient-to-br from-amber-400/25 to-white/10 px-2.5 py-1.5 text-right shadow-sm"
      title={`${nombre}${cat ? ` · ${cat}` : ""}`}
    >
      <span className="w-full truncate text-[10px] font-extrabold uppercase tracking-wide text-white">
        {nombre}
      </span>
      <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-amber-100">
        {cat === "DIOS" ? "Director · Nivel Dios" : cat || "—"}
      </span>
    </div>
  );
}
