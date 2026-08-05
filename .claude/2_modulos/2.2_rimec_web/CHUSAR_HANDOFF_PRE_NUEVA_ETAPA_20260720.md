# CHUSAR — Handoff previo a nueva etapa · 2026-07-20

**App principal:** RIMEC Web  
**Estado:** preparado · nueva etapa todavía no iniciada  
**Motivo:** corte ordenado de pendientes antes de recibir nombre y objetivo de la próxima etapa.

---

## Pendiente prioritario — bug RIMEC Web

El Director activó **bug urgente** y confirmó la app **RIMEC Web**, pero todavía
no indicó:

1. ruta o pantalla afectada;
2. comportamiento actual;
3. comportamiento esperado;
4. error, log o captura.

Por protocolo PARÉNTESIS no hubo diagnóstico, edición ni deploy. El próximo
turno debe comenzar recibiendo esos cuatro datos y aplicar un hotfix mínimo.

## Pendiente operativo secundario — Report local

`npm run dev:clean:3000` levantó Report, pero posteriormente `/login` respondió
500 por `MODULE_NOT_FOUND` dentro de `.next/server/pages/_document.js`. El
proceso terminó. Producción Report quedó fuera de este incidente.

Antes de volver a usar Report local: confirmar que no haya otro proceso Next.js
compartiendo `.next`, limpiar `.next` y levantar una sola instancia.

## Últimos entregables estables

- RIMEC Report producción: digitación multi-asignar, acordeón y filtros
  multi-select.
- Hotfix filtros: **Enter aplica/cierra y pasa al siguiente**, Esc o click fuera
  cierra; commit Report `3237f5a`.
- Alias producción validado: `https://rimec-report.vercel.app`.

## Portón para la nueva etapa

No se crea todavía `ETAPA_*`: falta que el Director defina **nombre, objetivo y
app/módulo**. Al recibir **Nueva etapa** con ese alcance:

1. crear la etapa canónica;
2. pausar expresamente las etapas anteriores que correspondan;
3. actualizar `ACTUAL.md`;
4. registrar la etapa en `nexus-navegador-holding/config/etapas.json`.

---

**Shibboleth:** Andrés, el que viene.
