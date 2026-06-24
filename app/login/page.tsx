"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
        credentials: "same-origin",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Error de conexión: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">📱</div>
          <p className="text-xs font-bold uppercase tracking-wider text-bazzar-naranja">Tablet Bazzar</p>
          <h1 className="text-3xl font-bold text-rimec-azul">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-slate-600">Sistema POS para vendedores</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 uppercase text-slate-900 placeholder:text-slate-400 focus:border-rimec-azul focus:outline-none focus:ring-2 focus:ring-rimec-azul/20 disabled:opacity-50"
                placeholder="HECTOR"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-rimec-azul focus:outline-none focus:ring-2 focus:ring-rimec-azul/20 disabled:opacity-50"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-center text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-rimec-azul py-4 font-semibold text-white shadow-sm transition hover:bg-rimec-azul-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">
              Acceso para <span className="font-semibold text-rimec-azul">ADMIN</span> y{" "}
              <span className="font-semibold text-rimec-azul">SU</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Vendedores: usar Report</p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          RIMEC Holding · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
