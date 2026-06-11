# Plan de Migración: Contraseñas a bcrypt

**CRITICIDAD:** 🔴 ALTA - Si falla, todos los usuarios quedan sin acceso  
**ESTRATEGIA:** Migración incremental con retrocompatibilidad y rollback en cada paso

---

## Estado Actual

**Problema:**
- Tabla `usuario_v2` almacena contraseñas en texto plano (columna `password`)
- auth.py:72 compara directamente: `AND password = :pass`
- validateUsuario.ts:86 compara directamente: `.eq('password', passClean)`

**Riesgo:**
- Cualquier brecha en BD expone todas las contraseñas
- No hay protección contra rainbow tables
- No cumple estándares de seguridad (OWASP, SOC 2, etc.)

---

## Estrategia de Migración (Zero-Downtime)

### Fase 3A: Preparación (BAJO RIESGO)
✅ Sin impacto en usuarios activos

1. **Agregar columna nueva `password_hash`**
   ```sql
   ALTER TABLE usuario_v2 ADD COLUMN password_hash TEXT;
   ```
   - Columna nullable permite migración gradual
   - No afecta autenticación existente

2. **Instalar dependencias**
   - Python: `pip install bcrypt`
   - Node.js: Ya incluido en runtime de Next.js (crypto.scrypt)

3. **Crear backup**
   ```sql
   CREATE TABLE usuario_v2_backup_20260529 AS 
   SELECT * FROM usuario_v2;
   ```

**Rollback:** Simplemente no usar la columna nueva

---

### Fase 3B: Migración de Datos (BAJO RIESGO)
✅ Autenticación existente sigue funcionando

4. **Script de migración de contraseñas**
   ```python
   import bcrypt
   from core.database import engine
   from sqlalchemy import text
   
   with engine.begin() as conn:
       usuarios = conn.execute(text("SELECT id_usuario, password FROM usuario_v2 WHERE password_hash IS NULL"))
       
       for row in usuarios:
           password_plain = row[1]
           password_hash = bcrypt.hashpw(password_plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
           
           conn.execute(
               text("UPDATE usuario_v2 SET password_hash = :hash WHERE id_usuario = :id"),
               {"hash": password_hash, "id": row[0]}
           )
           print(f"Migrado usuario {row[0]}")
   ```

5. **Verificar migración**
   ```sql
   SELECT COUNT(*) FROM usuario_v2 WHERE password_hash IS NULL;
   -- Debe retornar 0
   ```

**Rollback:** Password original sigue en columna `password`

---

### Fase 3C: Actualizar Lógica de Autenticación (RIESGO MEDIO)
⚠️ Cambio en flujo crítico - testear exhaustivamente

6. **Actualizar auth.py (Streamlit)**
   ```python
   import bcrypt
   
   # Query actualizada
   query = """
       SELECT id_usuario, descp_usuario, categoria, password, password_hash
       FROM public.usuario_v2
       WHERE descp_usuario = :usuario
       LIMIT 1
   """
   
   df = get_dataframe(query, params={"usuario": user_clean})
   
   if df.empty:
       return "bad_credentials", None
   
   row = df.iloc[0]
   password_hash = row['password_hash']
   password_plain = row['password']
   
   # Verificar con bcrypt si existe hash
   if password_hash:
       if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
           return "ok", row
       else:
           return "bad_credentials", None
   # FALLBACK: Si no hay hash, verificar contra texto plano (temporal)
   elif password_plain and password_plain == password:
       # Actualizar a hash en próximo login
       hash_new = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
       engine.execute(text("UPDATE usuario_v2 SET password_hash = :h WHERE id_usuario = :id"), 
                      {"h": hash_new, "id": row['id_usuario']})
       return "ok", row
   else:
       return "bad_credentials", None
   ```

7. **Actualizar validateUsuario.ts (Next.js)**
   ```typescript
   import { scrypt, randomBytes } from 'crypto'
   import { promisify } from 'util'
   
   const scryptAsync = promisify(scrypt)
   
   async function verifyPassword(password: string, hash: string): Promise<boolean> {
     const [salt, key] = hash.split(':')
     const keyBuffer = Buffer.from(key, 'hex')
     const derivedKey = await scryptAsync(password, salt, 64) as Buffer
     return keyBuffer.equals(derivedKey)
   }
   
   // En validateUsuario:
   const { data, error } = await supabaseAdmin
     .from('usuario_v2')
     .select('id_usuario, descp_usuario, categoria, password, password_hash')
     .eq('descp_usuario', userClean)
     .limit(1)
     .maybeSingle()
   
   if (!data) return null
   
   // Verificar hash si existe
   if (data.password_hash) {
     const valid = await verifyPassword(passClean, data.password_hash)
     if (!valid) return null
   }
   // FALLBACK: verificar texto plano (temporal)
   else if (data.password === passClean) {
     // Actualizar a hash
     const salt = randomBytes(16).toString('hex')
     const derivedKey = await scryptAsync(passClean, salt, 64) as Buffer
     const hash = `${salt}:${derivedKey.toString('hex')}`
     await supabaseAdmin.from('usuario_v2').update({ password_hash: hash }).eq('id_usuario', data.id_usuario)
   } else {
     return null
   }
   
   return { id_usuario: data.id_usuario, descp_usuario: data.descp_usuario, categoria: data.categoria }
   ```

**Testeo CRÍTICO:**
- [ ] Login de usuario existente (con hash) funciona
- [ ] Login de usuario sin hash funciona y genera hash
- [ ] Login con contraseña incorrecta falla
- [ ] Ambos sistemas (Streamlit y Next.js) funcionan

**Rollback:** Revertir commits de auth.py y validateUsuario.ts

---

### Fase 3D: Limpieza Final (BAJO RIESGO)
✅ Solo después de confirmar que todo funciona por 1 semana

8. **Eliminar fallback de texto plano**
   - Remover verificación de columna `password` antigua
   - Solo verificar `password_hash`

9. **Eliminar columna antigua**
   ```sql
   ALTER TABLE usuario_v2 DROP COLUMN password;
   ```

10. **Eliminar backup**
    ```sql
    DROP TABLE usuario_v2_backup_20260529;
    ```

**Rollback:** Restaurar desde backup si hay problemas inesperados

---

## Checklist de Ejecución

### Pre-requisitos
- [ ] Backup completo de BD Supabase
- [ ] Ventana de mantenimiento programada (opcional, si es horario de baja demanda)
- [ ] Usuario admin de prueba creado para testeo

### Fase 3A
- [ ] Columna `password_hash` agregada
- [ ] bcrypt instalado en control_central
- [ ] Backup de tabla creado
- [ ] Testeo: INSERT nuevo usuario funciona

### Fase 3B
- [ ] Script de migración ejecutado
- [ ] Verificado: 0 usuarios con password_hash NULL
- [ ] Testeo: Login sigue funcionando con password original

### Fase 3C
- [ ] auth.py actualizado y testeado en local
- [ ] validateUsuario.ts actualizado y testeado en local
- [ ] Deployed a producción
- [ ] Testeo: Login admin funciona
- [ ] Testeo: Login vendedor funciona
- [ ] Testeo: Login con contraseña incorrecta falla
- [ ] Monitorear por 1 semana: sin reportes de acceso bloqueado

### Fase 3D (después de 1 semana)
- [ ] Fallback removido
- [ ] Columna `password` eliminada
- [ ] Backup antiguo eliminado

---

## Plan de Rollback de Emergencia

**Si usuarios no pueden hacer login después de FASE 3C:**

1. **Rollback inmediato de código**
   ```bash
   cd rimec-web && git revert HEAD && git push origin main
   cd control_central && git revert HEAD && git push origin main
   ```

2. **Restaurar desde backup (caso extremo)**
   ```sql
   DROP TABLE usuario_v2;
   CREATE TABLE usuario_v2 AS SELECT * FROM usuario_v2_backup_20260529;
   ```

---

## Próximos Pasos Recomendados

**Después de completar migración:**
- [ ] Implementar política de rotación de contraseñas (cada 90 días)
- [ ] Agregar validación de complejidad (mínimo 8 caracteres, mayúsculas, números)
- [ ] Implementar bloqueo temporal después de 5 intentos fallidos
- [ ] Agregar 2FA para usuarios admin (opcional)

---

## Decisión Requerida

**¿Proceder con FASE 3A-3B ahora (bajo riesgo)?**
- Agregar columna nueva
- Migrar contraseñas existentes
- NO cambia autenticación todavía

**O esperar y ejecutar todo en ventana de mantenimiento programada?**

**Mi recomendación:** Ejecutar 3A-3B ahora (sin impacto), testear 3C exhaustivamente en local, deployar 3C en horario de baja demanda con monitoreo activo.
