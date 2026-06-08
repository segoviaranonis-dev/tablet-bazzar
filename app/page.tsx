export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <main className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Tablet Bazzar
          </h1>
          <p className="text-xl text-blue-200">
            Sistema POS para Vendedores en Tienda
          </p>
        </div>

        {/* Status */}
        <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-green-300">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold">Sistema Operativo</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-sm text-blue-300 mb-1">Tiendas</div>
            <div className="text-2xl font-bold text-white">6 Locales</div>
            <div className="text-xs text-slate-400 mt-1">Fernando · San Martín · Palma</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-sm text-blue-300 mb-1">Vendedores</div>
            <div className="text-2xl font-bold text-white">60+ Activos</div>
            <div className="text-xs text-slate-400 mt-1">Login por código</div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-3">Tecnología</div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200 border border-white/20">
              Next.js 15
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200 border border-white/20">
              TypeScript
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200 border border-white/20">
              PWA
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200 border border-white/20">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200 border border-white/20">
              Supabase
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-slate-400">
            Desarrollado con Claude Sonnet 4.5
          </p>
          <p className="text-xs text-slate-500 mt-1">
            RIMEC Holding · {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
