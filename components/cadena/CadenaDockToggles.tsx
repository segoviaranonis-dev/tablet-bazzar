"use client";

import { TouchPad } from "@/components/cadena/TouchPad";

type Props = {
  sidebarParOpen: boolean;
  coloresDockOpen: boolean;
  showSidebar: boolean;
  showColores: boolean;
  onToggleSidebar: () => void;
  onToggleColores: () => void;
};

/** Toggles discretos para agrupaciones secundarias (sidebar L+R · dock colores). */
export function CadenaDockToggles({
  sidebarParOpen,
  coloresDockOpen,
  showSidebar,
  showColores,
  onToggleSidebar,
  onToggleColores,
}: Props) {
  if (!showSidebar && !showColores) return null;

  return (
    <div className="pointer-events-auto flex items-center gap-1">
      {showSidebar ? (
        <TouchPad
          onClick={onToggleSidebar}
          ariaLabel={sidebarParOpen ? "Ocultar referencias L+R" : "Mostrar referencias L+R"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
            sidebarParOpen
              ? "border-orange-400 bg-orange-500 text-white"
              : "border-white/40 bg-white/10 text-white active:bg-white/25"
          }`}
        >
          ☰
        </TouchPad>
      ) : null}
      {showColores ? (
        <TouchPad
          onClick={onToggleColores}
          ariaLabel={coloresDockOpen ? "Ocultar colores" : "Mostrar colores"}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition ${
            coloresDockOpen
              ? "border-orange-400 bg-orange-500 text-white"
              : "border-white/40 bg-white/10 text-white active:bg-white/25"
          }`}
        >
          ◑
        </TouchPad>
      ) : null}
    </div>
  );
}
