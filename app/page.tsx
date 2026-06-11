"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VIEW_MODES } from "@/lib/view-modes";

type SessionUser = {
  nombre?: string;
  rol_id?: number;
};

export default function ControlPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
      <header className="border-b border-orange-200 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Tablet Bazzar</p>
            <h1 className="text-2xl font-bold text-orange-800">Panel de control</h1>
            {user?.nombre && (
              <p className="mt-1 text-sm text-slate-600">
                {user.nombre}
                {user.rol_id != null ? ` · Rol ${user.rol_id}` : ""}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="min-h-[44px] rounded-xl border-2 border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-700 disabled:opacity-50"
          >
            {loggingOut ? "Saliendo…" : "Cerrar sesión"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <section>
          <h2 className="mb-1 text-lg font-bold text-slate-800">Modos de vista</h2>
          <p className="mb-6 text-sm text-slate-600">
            Elegí cómo trabajar en la tablet. Más modos se agregarán aquí.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {VIEW_MODES.map((mode) =>
              mode.enabled ? (
                <Link
                  key={mode.id}
                  href={mode.href}
                  className="group flex min-h-[120px] flex-col rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-sm transition hover:border-orange-500 hover:shadow-md active:scale-[0.99]"
                >
                  <span className="mb-3 text-4xl">{mode.icon}</span>
                  <span className="text-lg font-bold text-orange-800 group-hover:text-orange-600">
                    {mode.title}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-slate-600">{mode.description}</span>
                </Link>
              ) : (
                <div
                  key={mode.id}
                  className="flex min-h-[120px] flex-col rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 opacity-60"
                >
                  <span className="mb-3 text-4xl grayscale">{mode.icon}</span>
                  <span className="text-lg font-bold text-slate-500">{mode.title}</span>
                  <span className="mt-2 text-sm text-slate-400">Próximamente</span>
                </div>
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
