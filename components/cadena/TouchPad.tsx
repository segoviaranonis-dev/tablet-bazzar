"use client";

/** Botón táctil sin texto — solo ícono o área vacía. Mínimo 48×48 tablet. */
export function TouchPad({
  onClick,
  ariaLabel,
  children,
  className = "",
  stopBubble = false,
  disabled = false,
}: {
  onClick: () => void;
  ariaLabel: string;
  children?: React.ReactNode;
  className?: string;
  stopBubble?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        if (stopBubble) e.stopPropagation();
        onClick();
      }}
      onTouchEnd={(e) => {
        if (stopBubble) e.stopPropagation();
      }}
      aria-label={ariaLabel}
      className={`touch-manipulation select-none active:scale-[0.97] active:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}
