"use client";

import { TouchPad } from "@/components/cadena/TouchPad";
import { usePosCart } from "@/lib/cart/PosCartContext";

function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2 3h2l2.4 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.76L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Carrito compacto — icono + superíndice cantidad (header cadena). */
export function PosCartIconButton() {
  const { count, setOpen } = usePosCart();
  const label = count > 99 ? "99+" : String(count);

  return (
    <TouchPad
      onClick={() => setOpen(true)}
      ariaLabel={`Ver carrito, ${count} pares`}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/40 bg-white/10 text-white transition active:bg-white/25"
    >
      <CartIcon />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bazzar-naranja px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {label}
        </span>
      ) : null}
    </TouchPad>
  );
}
