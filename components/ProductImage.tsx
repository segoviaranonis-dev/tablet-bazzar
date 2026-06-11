"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { productImageCandidatesForRow } from "@/lib/product-image";

type Props = {
  linea: string;
  ref: string;
  material: string;
  color: string;
  imagenNombre?: string | null;
  alt: string;
  variant?: "thumb" | "hero";
  className?: string;
};

export function ProductImage({
  linea,
  ref: referencia,
  material,
  color,
  imagenNombre,
  alt,
  variant = "thumb",
  className = "",
}: Props) {
  const candidates = useMemo(
    () => productImageCandidatesForRow(linea, referencia, material, color, imagenNombre, true),
    [linea, referencia, material, color, imagenNombre],
  );
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFailed(false);
  }, [linea, referencia, material, color, imagenNombre, variant]);

  const tryNext = useCallback(() => {
    setIdx((i) => {
      if (i + 1 < candidates.length) return i + 1;
      setFailed(true);
      return i;
    });
  }, [candidates.length]);

  const placeholder = (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#f4f1ec] text-2xl text-[#9a9288] ${className}`}
      role="img"
      aria-label={alt}
    >
      👟
    </div>
  );

  if (!candidates.length || failed) return placeholder;

  const src = candidates[idx];
  if (!src) return placeholder;

  const imgClass =
    variant === "hero"
      ? "h-full w-full object-contain p-3 md:p-5"
      : "h-full w-full object-contain p-1";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${imgClass} ${className}`}
      loading={variant === "hero" ? "eager" : "lazy"}
      decoding="async"
      onError={tryNext}
      onLoad={(e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < 2 || naturalHeight < 2) tryNext();
      }}
    />
  );
}
