# Deploy Vercel — Tablet Bazzar

**URL producción:** https://tablet-bazzar.vercel.app  
**URL alternativa (typo histórico):** ~~tableta-bazzar.vercel.app~~ — no usar  
**Repo:** https://github.com/segoviaranonis-dev/tablet-bazzar  
**Rama deploy:** `main` (auto-deploy al push)  
**Último deploy producción:** 2026-06-10 · commit `e1cd6f1` · `dpl_DB2cjFdokXbpeFF4JuajkiVZ8Jui`

---

## Variables obligatorias (Vercel → Settings → Environment Variables)

| Variable | Scope | Notas |
|----------|-------|-------|
| `DATABASE_URL` | Production, Preview | Postgres Supabase — **solo server** |
| `TABLET_SESSION_SECRET` | Production, Preview | Mismo criterio que Report (JWT 8h + POS 12h) |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | Storage fotos productos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Storage público |

Copiar valores desde `report/.env.local` o `tablet-bazzar/.env.local` del taller.

**Nunca** exponer `DATABASE_URL` con prefijo `NEXT_PUBLIC_`.

---

## Deploy manual (opcional)

```bash
cd tablet-bazzar
npm run build          # verificar local
git push origin main   # dispara Vercel si proyecto enlazado
```

CLI (si tenés token):

```bash
npx vercel --prod
```

---

## Smoke post-deploy

1. https://tablet-bazzar.vercel.app/login — HECTOR / 123456  
2. `/cadena` — filtros cargan (ms en header)  
3. **INGRESAR** → vista cadena con dock inferior (colores · tallas · carrito)  

Si `/cadena` falla: revisar `DATABASE_URL` en Vercel.

---

**Última actualización:** 2026-06-11
