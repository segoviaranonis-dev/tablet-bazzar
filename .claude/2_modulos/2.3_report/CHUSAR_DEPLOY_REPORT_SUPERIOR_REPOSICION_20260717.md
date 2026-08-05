# CHUSAR — Deploy Report · Nivel Superior UI + reposición LIQ/PROMO

**Código:** **2.3.4.0.14**  
**App:** Report `:3000` · prod Vercel  
**Keywords:** **Documenta** · despliega · 2026-07-17  
**Shibboleth:** Andrés, el que viene.

---

## Alcance deploy

| Bloque | Qué va a prod |
|--------|----------------|
| **Ley 5.01.00.020** | UI **Nivel Superior** / **Superior** — sin «Dios» en pantalla · BD `categoria=DIOS` intacto |
| **Herramienta reposición** | Tarjetas con latido **liquidación PE** · badge **PROMOCIONAL** · pill «Pronta entrega · LIQ» |
| **Stock PE panel** | Paridad visual `PeCardMiniatura` · acordeón grada |
| **APIs auth copy** | Mensajes HTTP 403 → «Nivel Superior requerido» |

**Fuera de este push:** migraciones SQL locales · scripts `_diag_*` · logs — aplicar aparte con Claude Code si el Director ordena.

---

## Ley UI (canónica)

[LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md](../../1_fundamentos/1.3_politicas/LEY_ETIQUETA_NIVEL_SUPERIOR_UI.md) · **5.01.00.020** · error `4.05.02.001`

Constantes: `report/src/lib/auth/nivel-dios.ts` → `UI_NIVEL_SUPERIOR` · `UI_NIVEL_SUPERIOR_CORTO`

---

## Archivos clave

| Área | Rutas |
|------|-------|
| Auth / copy | `src/lib/auth/nivel-dios.ts` · `middleware.ts` · APIs aprobaciones |
| Reposición | `src/components/herramienta-reposicion/ReposicionArticuloCard.tsx` · `HerramientaReposicionClient.tsx` |
| Motor precios | `EjecutarProtocoloImportacionPreciosButton.tsx` · `MotorPreciosHubClient.tsx` |
| Facturación / FI | `FacturaInternaCabecera.tsx` · `FacturacionBandejaClient.tsx` |
| Stock PE | `PeCardMiniatura.tsx` · `StockPeContext.tsx` |
| Estilos pulse | `src/app/globals.css` · `tailwind.config.ts` |

---

## Deploy

| Campo | Valor |
|-------|-------|
| Repo | `segoviaranonis-dev/report` · rama `main` |
| Build | `npm run build` ✅ local 2026-07-17 |
| Vercel | Auto-deploy `main` |
| Smoke | `/herramienta-reposicion` · `/aprobaciones` · botón protocolo → «Superior» |

---

## Verificación Director

1. Login Report prod · ningún botón dice «Dios».
2. Herramienta reposición · fila PE liquidación → latido verde + «LIQ».
3. Caso PROMOCIONAL → latido ámbar (sin confundir con LIQ).
4. Aprobaciones bloqueadas → copy «Nivel Superior requerido».

---

**Última actualización:** 2026-07-17 · Documenta Director
