# Mapa Andrés — Protocolo PDM (re-ejecución)

**Código:** **5.01.00.036** §5  
**Para:** Andrés · PC aislada · cuenta `nexus.rimec@gmail.com`  
**Cuándo:** Después de cada PDM que ejecute Héctor/Cursor en OPS.

---

## Para qué

Una empresa de mercado no tolera un segundo de incertidumbre. Héctor hace PDM → Vercel queda vivo → **vos volvés a correr PDM** = tercera verificación independiente.

---

## Reglas

1. Solo cuenta `nexus.rimec` / `nexusrimec-ux` / org `rimec-nexus`.  
2. Remotes Git **solo** `rimec-nexus/*`.  
3. BD solo `yvuwdbc…` — nunca proyecto Héctor.  
4. Secretos en cofre — nunca chat.  
5. Keyword del Director: **PDM** o «re-PDM Andrés».

## Pasos

1. `git -C report/rimec-web/bazzar-web fetch` y confirmar SHA = el que Héctor publicó.  
2. Redeploy Vercel scope `rimec-nexus`: `rimec-report-x` · `rimec-web-x` · `bazzar-web-x`.  
3. Smoke HTTP 200 en las tres.  
4. Bitácora: fecha + SHA + «PDM Andrés PASS».  
5. Avisar a Héctor.

## Si algo falla

Parar. No DNS. No mezclar `segoviaranonis-dev`. Avisar bloqueo.

Doc completo: `CHUSAR_PROTOCOLO_PDM_20260817.md`.
