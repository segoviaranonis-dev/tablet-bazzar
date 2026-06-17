"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IMAGE_INTRINSIC, intrinsicDimsFromImageUrl } from "@/lib/product-image";

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

export function ProductLightbox({ src, alt, onClose }: Props) {
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

  const dims = intrinsicDimsFromImageUrl(src);
  const w = dims.width >= IMAGE_INTRINSIC.lg.width ? dims.width : IMAGE_INTRINSIC.lg.width;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ampliar producto"
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-slate-800 shadow"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={w}
        height={w}
        className="max-h-[92dvh] max-w-[min(92vw,800px)] object-contain object-center"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}
