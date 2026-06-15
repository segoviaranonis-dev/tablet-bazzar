"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { isImageDecoded, preloadImageDecoded } from "@/lib/image-decode-cache";
import {
  HERO_VIEWPORT,
  IMAGE_INTRINSIC,
  intrinsicDimsFromImageUrl,
  productImageFallbackStyle,
  resolveCanonicalImageUrl,
  resolveFlatImageUrl,
  type ImageVariant,
} from "@/lib/product-image";

type Props = {
  src?: string | null;
  fallbackSrc?: string | null;
  /** Hero: orden lg → flat → sm (precarga en cadena). */
  loadSequence?: string[];
  linea: string;
  ref: string;
  material?: string;
  color?: string;
  imagenNombre?: string | null;
  alt: string;
  variant?: ImageVariant;
  priority?: boolean;
  className?: string;
};

function markLoadedIfCached(img: HTMLImageElement | null): boolean {
  return Boolean(img?.complete && img.naturalWidth > 0);
}

/** Hero: sm/ → lg/; cambio de SKU resetea src de inmediato (sin foto anterior cruzada). */
function useHeroDisplaySrc(sequence: string[]) {
  const seqKey = sequence.join("\0");
  const [displaySrc, setDisplaySrc] = useState<string | null>(() => sequence[0] ?? null);

  useEffect(() => {
    if (sequence.length === 0) {
      setDisplaySrc(null);
      return;
    }

    const next = sequence[0] ?? null;
    if (next && isImageDecoded(next)) {
      setDisplaySrc(next);
      return;
    }

    setDisplaySrc(next);

    let cancelled = false;

    (async () => {
      for (const url of sequence) {
        if (cancelled) return;
        if (await preloadImageDecoded(url)) {
          if (!cancelled) setDisplaySrc(url);
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [seqKey]);

  return displaySrc ?? sequence[0] ?? null;
}

export function ProductImage({
  src: srcProp,
  fallbackSrc: fallbackProp,
  loadSequence,
  linea,
  ref: referencia,
  material = "",
  color = "",
  imagenNombre,
  alt,
  variant = "thumb",
  priority = false,
  className = "",
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const usedFallback = useRef(false);

  const isHero = variant === "hero";

  const heroSequence = useMemo(() => {
    if (!isHero) return [];
    if (loadSequence && loadSequence.length > 0) return loadSequence;
    const lg =
      resolveCanonicalImageUrl({
        linea,
        referencia,
        material,
        color,
        imagenNombre,
        variant: "hero",
      }) ?? null;
    const sm =
      resolveCanonicalImageUrl({
        linea,
        referencia,
        material,
        color,
        imagenNombre,
        variant: "thumb",
      }) ?? null;
    const seen = new Set<string>();
    const out: string[] = [];
    for (const u of [lg, sm]) {
      if (u && !seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
    return out;
  }, [
    isHero,
    loadSequence,
    srcProp,
    fallbackProp,
    linea,
    referencia,
    material,
    color,
    imagenNombre,
  ]);

  const canonicalSrc = useMemo(() => {
    if (isHero) return heroSequence[0] ?? null;
    if (srcProp) return srcProp;
    return resolveCanonicalImageUrl({
      linea,
      referencia,
      material,
      color,
      imagenNombre,
      variant,
    });
  }, [isHero, heroSequence, srcProp, linea, referencia, material, color, imagenNombre, variant]);

  const flatFallback = useMemo(() => {
    if (isHero) return heroSequence[1] ?? null;
    if (fallbackProp) return fallbackProp;
    return resolveFlatImageUrl({
      linea,
      referencia,
      material,
      color,
      imagenNombre,
    });
  }, [isHero, heroSequence, fallbackProp, linea, referencia, material, color, imagenNombre]);

  const heroDisplaySrc = useHeroDisplaySrc(isHero ? heroSequence : []);

  useLayoutEffect(() => {
    if (isHero) return;

    usedFallback.current = false;
    setActiveSrc(canonicalSrc);

    if (!canonicalSrc) {
      setLoaded(false);
      return;
    }

    if (isImageDecoded(canonicalSrc)) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    setLoaded(false);

    void (async () => {
      if (await preloadImageDecoded(canonicalSrc)) {
        if (!cancelled) setLoaded(true);
        return;
      }
      const img = imgRef.current;
      if (!cancelled) {
        setLoaded(markLoadedIfCached(img));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canonicalSrc, isHero]);

  const eager = isHero || priority;

  const handleError = () => {
    if (isHero) return;
    if (
      !usedFallback.current &&
      flatFallback &&
      activeSrc !== flatFallback &&
      flatFallback !== canonicalSrc
    ) {
      usedFallback.current = true;
      void (async () => {
        if (await preloadImageDecoded(flatFallback)) {
          setActiveSrc(flatFallback);
          setLoaded(true);
          return;
        }
        setActiveSrc(flatFallback);
        setLoaded(false);
      })();
      return;
    }
    setLoaded(false);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    void e.currentTarget.decode?.().catch(() => undefined);
  };

  if (isHero) {
    const dims = intrinsicDimsFromImageUrl(heroDisplaySrc);
    return (
      <div className={`relative h-full w-full min-h-0 min-w-0 ${className}`}>
        {heroDisplaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={heroDisplaySrc}
            ref={imgRef}
            src={heroDisplaySrc}
            alt={alt}
            width={dims.width}
            height={dims.height}
            className="absolute inset-0 h-full w-full object-contain object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div
            className="absolute inset-0 bg-white"
            style={{ aspectRatio: `${HERO_VIEWPORT.width} / ${HERO_VIEWPORT.height}` }}
            aria-hidden
          />
        )}
      </div>
    );
  }

  const ready =
    loaded || priority || (activeSrc ? isImageDecoded(activeSrc) : false);
  const imgOpacity = ready ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`cadena-thumb-frame ${className}`}
      style={productImageFallbackStyle(linea, referencia)}
    >
      {!ready && (
        <span
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-0.5 text-center"
          aria-hidden
        >
          <span className="text-[10px] font-extrabold tracking-wide text-white/80">
            {linea}·{referencia}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">BAZZAR</span>
        </span>
      )}
      {activeSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={activeSrc}
          alt={alt}
          className={`bg-white/95 ${imgOpacity}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "low"}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : null}
    </div>
  );
}
