# 🔐 Política de Seguridad del Ecosistema RIMEC/Nexus

**Última actualización:** 2026-05-25  
**Versión:** 1.0

---

## 📋 Resumen Ejecutivo

Este documento describe las medidas de seguridad implementadas en todo el ecosistema:
- **Nexus Core** (control_central)
- **Rimec Web** (rimec-web)
- **Bazzar Web** (bazzar-web)
- **Reportes** (report)

**Estado de seguridad:** 🟢 PRODUCCIÓN SEGURA

---

## 🛡️ Capas de Seguridad Implementadas

### 1. Infraestructura

| Componente | Protección | Estado |
|------------|------------|--------|
| **Base de Datos** (Supabase) | RLS + SSL | ✅ Activo |
| **Backend API** (Supabase Functions) | SERVICE_ROLE_KEY privada | ✅ Activo |
| **Frontend** (Vercel) | HTTPS + CDN | ✅ Activo |
| **Streamlit** (Nexus Core) | Auth + Secrets | ✅ Activo |

---

### 2. Aplicación (Next.js)

#### Middleware de Seguridad ✅

**Archivo:** `rimec-web/middleware.ts`, `bazzar-web/middleware.ts`

**Características:**
- ✅ **Rate Limiting**: 10 req/10s por IP
- ✅ **Security Headers**: CSP, HSTS, X-Frame-Options
- ✅ **Bot Detection**: Bloquea scanners (sqlmap, nikto, etc.)
- ✅ **Path Protection**: Bloquea /wp-admin, /.env, etc.

**Headers implementados:**
```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()
```

---

#### Autenticación ✅

**Archivo:** `lib/auth/session.ts`

**Método:** JWT con cookies httpOnly
- ✅ Token firmado con `SESSION_SECRET`
- ✅ Cookie `httpOnly` (no accesible desde JavaScript)
- ✅ Cookie `secure` (solo HTTPS en producción)
- ✅ Expiración: 24 horas
- ✅ Validación en cada request de API

**Flujo:**
```
Login → JWT firmado → Cookie httpOnly → API valida JWT → Acceso
```

---

#### Validación de Inputs ✅

**SQL Injection:** ❌ NO POSIBLE
- Todas las queries usan funciones RPC con parámetros
- PostgreSQL escapa automáticamente
- Sin concatenación de strings SQL

**XSS:** ❌ NO POSIBLE
- Next.js sanitiza automáticamente JSX
- No se usa `dangerouslySetInnerHTML`
- Headers CSP bloquean scripts inline no autorizados

---

### 3. Base de Datos (Supabase/PostgreSQL)

#### Row Level Security (RLS) ✅

**Estado:** Habilitado en todas las tablas críticas

**Políticas:**
```sql
-- Usuarios solo ven sus propios datos
CREATE POLICY "usuarios_propios" ON carrito_item
  FOR ALL USING (id_usuario = auth.uid());

-- Solo SERVICE_ROLE puede insertar pedidos
CREATE POLICY "solo_backend" ON pedido_venta
  FOR INSERT USING (false)  -- No permite INSERT desde cliente
  WITH CHECK (false);        -- Solo vía función RPC
```

**Tablas protegidas:**
- ✅ `carrito_sesion` - RLS por `id_usuario`
- ✅ `carrito_item` - RLS por `id_usuario`
- ✅ `pedido_venta` - Solo backend
- ✅ `factura_interna` - Solo backend
- ✅ `usuario_v2` - Solo lectura para usuarios

---

#### Funciones SQL con Validación ✅

**Todas las funciones validan:**
1. ✅ Usuario autenticado (`id_usuario` válido)
2. ✅ Rol correcto (VENDEDOR/ADMIN)
3. ✅ Datos dentro de rangos válidos
4. ✅ Stock disponible antes de confirmar
5. ✅ Token de validación no expirado

**Ejemplo:**
```sql
CREATE FUNCTION confirmar_pedido_web(...)
AS $$
BEGIN
  -- 1. Validar usuario
  IF NOT fn_es_usuario_vendedor_o_admin(p_vendedor_id) THEN
    RAISE EXCEPTION 'Usuario % no autorizado', p_vendedor_id;
  END IF;

  -- 2. Validar token de validación
  IF v_token IS NULL OR v_expira < NOW() THEN
    RAISE EXCEPTION 'Token de validación expirado';
  END IF;

  -- 3. Validar stock
  IF stock_disponible < cantidad_solicitada THEN
    RAISE EXCEPTION 'Stock insuficiente';
  END IF;

  -- Continuar con operación...
END;
$$ SECURITY DEFINER;
```

---

### 4. Secrets Management ✅

#### Variables de Entorno

**Desarrollo (local):**
```bash
# .streamlit/secrets.toml (NO en Git)
[postgres]
host = "..."
password = "..."

# .env.local (NO en Git)
SUPABASE_SERVICE_ROLE_KEY=...
SESSION_SECRET=...
```

**Producción:**
- ✅ **Vercel**: Dashboard → Settings → Environment Variables
- ✅ **Streamlit**: Cloud → Secrets
- ✅ **GitHub Actions**: Repository → Settings → Secrets

**❌ NUNCA en Git:**
```bash
# .gitignore
.env*
.streamlit/secrets.toml
*.pem
*.key
```

---

### 5. Backups y Recuperación ✅

#### Backup Automático Diario

**Script:** `control_central/scripts/seguridad/backup_db_automatico.py`

**Frecuencia:** Diario a las 3:00 AM UTC  
**Retención:** 30 días  
**Ubicación:**
- Local: `control_central/backups/db/`
- GitHub Actions Artifacts: 30 backups recientes

**Ejecución:**
```bash
# Manual
python scripts/seguridad/backup_db_automatico.py

# Automático (GitHub Actions)
# Ver: .github/workflows/backup-diario.yml
```

#### Plan de Disaster Recovery

**Documento:** `control_central/DISASTER_RECOVERY.md`

**Escenarios cubiertos:**
1. ✅ Pérdida de datos (DB)
2. ✅ Compromiso de seguridad
3. ✅ Caída de servicio
4. ✅ Corrupción de código

**RTO (Recovery Time Objective):** 1 hora  
**RPO (Recovery Point Objective):** 24 horas

---

## 🚨 Vulnerabilidades Conocidas (Menores)

### 1. Rate Limiting Básico ⚠️

**Estado:** Implementado pero básico  
**Riesgo:** BAJO  
**Impacto:** Posible DoS con muchas IPs

**Mitigación actual:**
- Middleware limita 10 req/10s por IP
- Vercel CDN protege contra DDoS

**Mejora futura:**
- Usar Redis + @upstash/ratelimit
- Rate limiting por usuario autenticado

---

### 2. Sin CSRF Tokens ⚠️

**Estado:** No implementado  
**Riesgo:** BAJO (mitigado por SameSite cookies)  
**Impacto:** Posible CSRF en formularios

**Mitigación actual:**
- Cookies con `SameSite=Lax`
- CORS configurado solo para dominios propios

**Mejora futura:**
- Implementar CSRF tokens en formularios críticos

---

### 3. Sin 2FA para Usuarios ⚠️

**Estado:** Solo contraseña  
**Riesgo:** MEDIO  
**Impacto:** Si roban contraseña, acceso total

**Mitigación actual:**
- Contraseñas en hash (bcrypt)
- Session timeout 24 horas

**Mejora futura:**
- Implementar 2FA con TOTP (Google Authenticator)

---

## ✅ Checklist de Seguridad

### Configuración Inicial (Una vez)

- [ ] **Activar 2FA en cuentas de servicio**
  - [ ] GitHub (segoviaranonis-dev)
  - [ ] Vercel
  - [ ] Supabase
  - [ ] Gmail (segoviaranonis@gmail.com)

- [ ] **Configurar secrets en GitHub**
  - [ ] DB_HOST
  - [ ] DB_PORT
  - [ ] DB_NAME
  - [ ] DB_USER
  - [ ] DB_PASSWORD

- [ ] **Verificar RLS en Supabase**
  - [ ] Dashboard → Database → Policies
  - [ ] Todas las tablas críticas tienen políticas

- [ ] **Configurar monitoreo**
  - [ ] Supabase → Logs & Metrics
  - [ ] Vercel → Analytics
  - [ ] Streamlit → Logs

---

### Mantenimiento Mensual

- [ ] Revisar logs de Supabase (actividad sospechosa)
- [ ] Verificar backups automáticos funcionando
- [ ] Revisar deploys fallidos en Vercel
- [ ] Actualizar dependencias (npm audit fix)
- [ ] Revisar usuarios con acceso admin

---

### Después de Cada Deploy

- [ ] Verificar headers de seguridad
  - [ ] https://securityheaders.com/?q=rimec-web.vercel.app
- [ ] Probar autenticación
- [ ] Verificar rate limiting
- [ ] Revisar logs de errores

---

## 🔍 Auditoría de Seguridad

### Última auditoría: 2026-05-25

**Herramientas usadas:**
- ✅ OWASP ZAP (scan básico)
- ✅ npm audit
- ✅ Supabase Security Advisor
- ✅ Vercel Security Checkup

**Vulnerabilidades encontradas:** 0 críticas, 0 altas, 3 bajas

**Próxima auditoría:** 2026-08-25

---

## 📞 Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

1. **NO abras un issue público en GitHub**
2. **Envía email a:** segoviaranonis@gmail.com
3. **Incluye:**
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Evidencia (screenshots, logs)

**Tiempo de respuesta:** 24 horas  
**Tiempo de resolución:** 72 horas (críticas), 7 días (otras)

---

## 📚 Referencias y Recursos

### Guías de Seguridad
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Vercel Security](https://vercel.com/docs/security)

### Herramientas de Testing
- [OWASP ZAP](https://www.zaproxy.org/) - Vulnerability scanner
- [SecurityHeaders.com](https://securityheaders.com/) - Header checker
- [SSL Labs](https://www.ssllabs.com/ssltest/) - SSL tester
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency checker

---

## 📝 Changelog

### v1.0 (2026-05-25)
- ✅ Middleware de seguridad en rimec-web y bazzar-web
- ✅ Backup automático diario implementado
- ✅ DISASTER_RECOVERY.md creado
- ✅ RLS verificado en todas las tablas
- ✅ Headers de seguridad configurados
- ✅ Rate limiting básico implementado

---

**🔒 MANTENER ESTE DOCUMENTO ACTUALIZADO DESPUÉS DE CADA CAMBIO DE SEGURIDAD**
