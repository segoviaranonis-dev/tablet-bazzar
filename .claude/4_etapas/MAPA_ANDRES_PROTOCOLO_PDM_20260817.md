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

1. Auth solo `nexusrimec-ux`.  
2. **Push a `rimec-nexus`** el sync que Héctor dejó en mirror (o PAT en cofre) — Héctor **no puede** ls-remote esos repos privados.  
3. Verificar Vercel: `rimec-report-x` · `rimec-web-x` · `bazzar-web-x` · `nexus-navegador`.  
4. Smoke HTTP 200.  
5. Bitácora + avisar «PDM Andrés PASS» + SHA.

## Si algo falla

Parar. No DNS. No mezclar `segoviaranonis-dev`. Avisar bloqueo.

Doc: `CHUSAR_PROTOCOLO_PDM_20260817.md` · DNS: `CHUSAR_PDM_DNS_ABORTO_OPS_20260817.md`.
