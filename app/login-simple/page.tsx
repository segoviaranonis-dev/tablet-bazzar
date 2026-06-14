"use client"

export default function LoginSimplePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login Simple - Tablet Bazzar</h1>

        <form method="POST" action="/api/auth/login-simple">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Usuario</label>
            <input
              type="text"
              name="usuario"
              defaultValue="HECTOR"
              className="w-full px-4 py-2 border rounded uppercase text-black"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              defaultValue="todotodito"
              className="w-full px-4 py-2 border rounded text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
          >
            ENTRAR
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-blue-600">← Volver al login normal</a>
        </div>
      </div>
    </div>
  )
}
