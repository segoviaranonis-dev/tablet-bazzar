"use client";

import { useEffect } from "react";

type Options = {
  enabled?: boolean;
  onLeft: () => void;
  onRight: () => void;
  onUp?: () => void;
  onDown?: () => void;
};

function isTypingTarget(t: EventTarget | null): boolean {
  return (
    t instanceof HTMLInputElement ||
    t instanceof HTMLTextAreaElement ||
    t instanceof HTMLSelectElement
  );
}

/** Flechas del teclado — sin botones visibles en UI. */
export function useCadenaKeyboard({
  enabled = true,
  onLeft,
  onRight,
  onUp,
  onDown,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          onRight();
          break;
        case "ArrowUp":
          if (onUp) {
            e.preventDefault();
            onUp();
          }
          break;
        case "ArrowDown":
          if (onDown) {
            e.preventDefault();
            onDown();
          }
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, onLeft, onRight, onUp, onDown]);
}
