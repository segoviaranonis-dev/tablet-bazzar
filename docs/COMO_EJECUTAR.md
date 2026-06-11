# Cómo ejecutar Tablet Bazzar

## Requisitos

- Node.js 20+
- Acceso a Supabase PostgreSQL (`DATABASE_URL`)
- Puerto **3002** libre (Report suele usar 3000/3001)

## Variables de entorno

Copiar `.env.example` → `.env.local`:

```bash
DATABASE_URL=postgresql://...   # mismo pool que Report (server-side only)
```

Sincronizar desde Report (opcional):

```bash
node scripts/sync-database-url.mjs
```

**Nunca** usar `NEXT_PUBLIC_` para la base de datos.

## Desarrollo

```bash
cd tablet-bazzar
npm install
npm run dev
```

Abrir: http://localhost:3002

Login de prueba (según `usuario_v2`): **HECTOR** / **123456** (rol 1).

## Build

```bash
npm run build
npm start
```

## Rutas principales

| Ruta | Uso |
|------|-----|
| `/login` | Autenticación |
| `/` | Panel — modos de vista |
| `/deposito` | Grid stock con fotos |
| `/cadena` | Selector marca + depósito |
| `/cadena/vista?cliente_id=&marca=` | Cadena consecutiva |

## Depósitos (`cliente_id`)

| Tienda | Adultos | Niños |
|--------|---------|-------|
| Fernando | 2100 | 2900 |
| San Martín | 2400 | 2700 |
| Palma | 3100 | 3200 |

Config canónica: `lib/depositos-config.ts`

---

**Última actualización:** 2026-06-10
