"use client";

import { useCallback, useRef } from "react";

type TouchNavOptions = {
  threshold?: number;
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onTap?: () => void;
};

export function useTouchNav({
  threshold = 24,
  onLeft,
  onRight,
  onUp,
  onDown,
  onTap,
}: TouchNavOptions) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (t) start.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const t = e.changedTouches[0];
      const s = start.current;
      start.current = null;
      if (!t || !s) return;

      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      if (adx < threshold && ady < threshold) {
        onTap?.();
        return;
      }

      if (adx >= ady) {
        if (dx < -threshold) onLeft?.();
        else if (dx > threshold) onRight?.();
      } else {
        if (dy < -threshold) onUp?.();
        else if (dy > threshold) onDown?.();
      }
    },
    [threshold, onLeft, onRight, onUp, onDown, onTap],
  );

  return { onTouchStart, onTouchEnd };
}
