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
import { useHeroProgressiveSrc } from "@/lib/use-hero-progressive-src";

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

  const canonicalSrc = useMemo(() => {
    if (isHero) return null;
    if (srcProp) return srcProp;
    return resolveCanonicalImageUrl({
      linea,
      referencia,
      material,
      color,
      imagenNombre,
      variant,
    });
  }, [isHero, srcProp, linea, referencia, material, color, imagenNombre, variant]);

  const flatFallback = useMemo(() => {
    if (isHero) return null;
    if (fallbackProp) return fallbackProp;
    return resolveFlatImageUrl({
      linea,
      referencia,
      material,
      color,
      imagenNombre,
    });
  }, [isHero, fallbackProp, linea, referencia, material, color, imagenNombre]);

  const heroSkuKey = `${linea}|${referencia}|${material}|${color}`;

  const heroUrls = useMemo(
    () => ({
      imagen_url_thumb:
        resolveCanonicalImageUrl({
          linea,
          referencia,
          material,
          color,
          imagenNombre,
          variant: "thumb",
        }) ?? null,
      imagen_url_hero:
        resolveCanonicalImageUrl({
          linea,
          referencia,
          material,
          color,
          imagenNombre,
          variant: "hero",
        }) ?? null,
      imagen_url_flat:
        resolveFlatImageUrl({
          linea,
          referencia,
          material,
          color,
          imagenNombre,
        }) ?? null,
    }),
    [linea, referencia, material, color, imagenNombre],
  );

  const emptyHeroUrls = useMemo(
    () => ({
      imagen_url_thumb: null as string | null,
      imagen_url_hero: null as string | null,
      imagen_url_flat: null as string | null,
    }),
    [],
  );

  const { shown: heroDisplaySrc } = useHeroProgressiveSrc(
    isHero ? heroUrls : emptyHeroUrls,
    heroSkuKey,
  );

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

  const thumbKey = `${linea}|${referencia}|${material}|${color}`;

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
          key={thumbKey}
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
