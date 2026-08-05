"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IMAGE_INTRINSIC, intrinsicDimsFromImageUrl } from "@/lib/product-image";

function zoomSrcFromThumb(url: string): string {
  if (url.includes("/sm/")) return url.replace("/sm/", "/lg/");
  if (url.includes("/productos/sm/")) return url.replace("/productos/sm/", "/productos/lg/");
  return url;
}

type Props = {
  src: string | null;
  alt: string;
  grada: string;
  molécula: string;
  busy: boolean;
  /** true = verde controlado · false = naranja pendiente */
  controlado: boolean;
  progreso?: string;
  onToggle: () => void;
  onClose: () => void;
};

/** Acceso rápido empaque — pantalla completa + toggle controlado/pendiente. */
export function EmpaqueControlLightbox({
  src,
  alt,
  grada,
  molécula,
  busy,
  controlado,
  progreso,
  onToggle,
  onClose,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const zoomSrc = src ? zoomSrcFromThumb(src) : null;
  const dims = zoomSrc ? intrinsicDimsFromImageUrl(zoomSrc) : IMAGE_INTRINSIC.lg;
  const w = dims.width >= IMAGE_INTRINSIC.lg.width ? dims.width : IMAGE_INTRINSIC.lg.width;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Control rápido empaque"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
        <div className="min-w-0 text-white">
          <p className="truncate text-sm font-semibold">{molécula}</p>
          <p className="text-xs text-slate-300">
            {progreso ? `${progreso} · ` : ""}
            Tocá para alternar pendiente (naranja) ↔ controlado (verde)
          </p>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-800 shadow"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-4">
        {zoomSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={zoomSrc}
            alt={alt}
            width={w}
            height={w}
            className="max-h-[58dvh] max-w-[min(96vw,900px)] flex-1 object-contain object-center"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-lg font-bold text-slate-400">{molécula}</div>
        )}

        <div
          className={`mt-4 w-full max-w-md rounded-2xl border-2 px-6 py-4 text-center shadow-lg ${
            controlado
              ? "border-emerald-400 bg-gradient-to-b from-emerald-50 to-white"
              : "border-orange-400 bg-gradient-to-b from-orange-50 to-white"
          }`}
        >
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
              controlado ? "text-emerald-800" : "text-orange-800"
            }`}
          >
            {controlado ? "Controlado" : "Pendiente"}
          </p>
          <p
            className={`font-mono text-5xl font-black tabular-nums ${
              controlado ? "text-emerald-700" : "text-orange-700"
            }`}
          >
            {grada}
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={onToggle}
          className={`mt-5 w-full max-w-md rounded-2xl py-5 text-lg font-black uppercase tracking-wide text-white shadow-lg disabled:opacity-50 ${
            controlado ? "bg-emerald-600" : "bg-orange-600"
          }`}
        >
          {busy ? "…" : controlado ? "✓ Controlado · tocar → pendiente" : "Pendiente · tocar → controlado"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
