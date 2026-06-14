"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  HERO_VIEWPORT,
  IMAGE_INTRINSIC,
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

function preloadDecoded(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    const done = (ok: boolean) => resolve(ok);
    img.onload = () => {
      void (img.decode?.() ?? Promise.resolve())
        .then(() => done(true))
        .catch(() => done(true));
    };
    img.onerror = () => done(false);
    img.src = url;
    if (img.complete && img.naturalWidth > 0) {
      void (img.decode?.() ?? Promise.resolve())
        .then(() => done(true))
        .catch(() => done(true));
    }
  });
}

/** Hero: mantiene foto anterior hasta que la nueva decodifica (lg → flat → sm). */
function useHeroDisplaySrc(sequence: string[]) {
  const seqKey = sequence.join("\0");
  const [displaySrc, setDisplaySrc] = useState<string | null>(() => sequence[0] ?? null);

  useEffect(() => {
    if (sequence.length === 0) {
      setDisplaySrc(null);
      return;
    }

    let cancelled = false;

    (async () => {
      for (const url of sequence) {
        if (cancelled) return;
        if (await preloadDecoded(url)) {
          if (!cancelled) setDisplaySrc(url);
          return;
        }
      }
      if (!cancelled) setDisplaySrc(sequence[0] ?? null);
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
    const primary =
      srcProp ??
      resolveCanonicalImageUrl({
        linea,
        referencia,
        material,
        color,
        imagenNombre,
        variant: "hero",
      });
    const flat =
      fallbackProp ??
      resolveFlatImageUrl({ linea, referencia, material, color, imagenNombre });
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
    for (const u of [primary, flat, sm]) {
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

    let cancelled = false;

    void (async () => {
      if (await preloadDecoded(canonicalSrc)) {
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
        if (await preloadDecoded(flatFallback)) {
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
    const dims = IMAGE_INTRINSIC.lg;
    return (
      <div
        className={`relative flex h-full w-full min-h-0 min-w-0 items-center justify-center ${className}`}
      >
        {heroDisplaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
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
            className="aspect-square max-h-full max-w-full bg-white"
            style={{ aspectRatio: `${HERO_VIEWPORT.width} / ${HERO_VIEWPORT.height}` }}
            aria-hidden
          />
        )}
      </div>
    );
  }

  const dims = IMAGE_INTRINSIC.sm;
  const imgOpacity = loaded ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={productImageFallbackStyle(linea, referencia)}
    >
      <span
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center"
        aria-hidden
      >
        <span className="text-[10px] font-extrabold tracking-wide text-white/80">
          {linea}·{referencia}
        </span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">BAZZAR</span>
      </span>
      {activeSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={activeSrc}
          alt={alt}
          width={dims.width}
          height={dims.height}
          className={`absolute inset-0 h-full w-full bg-white/95 object-contain object-center p-1 ${imgOpacity}`}
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
