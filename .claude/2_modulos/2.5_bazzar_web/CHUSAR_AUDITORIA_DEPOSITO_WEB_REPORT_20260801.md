# CHUSAR — Auditoría Depósito Web (Report) · 2026-08-01

**Código:** **2.5.1.3**  
**Keyword:** **Nueva** etapa · **Documenta** · protocolo Chusar  
**Estado:** 🟢 EN CURSO · preparación auditoría  
**Etapa:** [ETAPA_AUDITORIA_DEPOSITO_WEB_20260801.md](../../4_etapas/ETAPA_AUDITORIA_DEPOSITO_WEB_20260801.md)  
**Módulo Report:** `/bazzar-web/deposito-web` · hub tarjeta «Depósito Web»  
**Tienda local:** http://localhost:3002  
**Almacén:** `ALM_WEB_01`  
**Padre ops:** [CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md](./CHUSAR_DEPOSITO_WEB_GRADA_Y_PURGE_5000.md) (**2.5.1.2**)  
**Shibboleth:** Andrés, el que viene.

---

## Qué auditar (pantalla Director)

Captura ref. 2026-08-01: Vendible tienda · Pronta entrega · ~138 prod · ~1.745 pares · Gs · chips CALZADO 654 / KYLY 638 · grilla tarjetas compactas · filtros siameses.

| Zona | Qué mirar |
|------|-----------|
| Cabecera | Cadena Compra→Depósito→Stock Sano→Motor→tienda |
| Toggle | Ingreso ALM vs Vendible tienda (pares) |
| Sidebar | Stock CP/PE · Categoría · AB-CR · molécula |
| Tabs | TODOS / NORMAL / PROMO / LIQUIDACION / COMUN |
| Grilla | Imagen protocolo 654+638 · pares badge · orden L-R |
| API | `/api/bazzar-web/deposito-web` · `no-store` · LEFT JOIN traspaso |

---

## Código canónico

| Pieza | Ruta |
|-------|------|
| Page | `report/src/app/bazzar-web/deposito-web/page.tsx` |
| Client | `…/components/DepositoWebClient.tsx` |
| API | `report/src/app/api/bazzar-web/deposito-web/route.ts` |
| Queries | `report/src/lib/bazzar-web/deposito-web/queries.ts` |

---

## Local (arranque)

```powershell
# Report (módulo Depósito Web)
cd C:\Users\hecto\Nexus_Core\report
npm run dev:3000
# → http://localhost:3000/bazzar-web/deposito-web

# Bazzar Web tienda
cd C:\Users\hecto\Nexus_Core\bazzar-web
npm run dev:3002
# → http://localhost:3002
```

---

## Protocolo Chusar (esta etapa)

1. Memoria solo lectura salvo **Documenta** / cierre / bug.
2. Hallazgos de auditoría → reportar al Director; fix código solo con orden.
3. No deploy prod sin cierre etapa u orden directa.
4. Imágenes: Ley Universal **2.01.04.021** (contain · no crop).

---

## Próximo paso

Director navega Depósito Web local → agente ejecuta checklist de la etapa y anota PASS/FAIL.
