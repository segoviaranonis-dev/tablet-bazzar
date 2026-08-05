# Carga Inicial de Datos — Módulo RRHH

**Fuente:** Excel RIMEC  
**Destino:** PostgreSQL Supabase  
**Fecha:** 2026-06-11

---

## 📁 ARCHIVO ORIGEN

**Path:** `C:\Users\hecto\Nexus_Core\DATOS EMPLEADOS 2026.xlsx`

**Características:**
- Formato: Excel (.xlsx)
- Filas: 48 funcionarios
- Ente: RIMEC (código 1)

---

## 📊 ESTRUCTURA EXCEL

### Columnas

| Columna | Tipo | Ejemplo | Mapeo BD |
|---------|------|---------|----------|
| **DEPARTAMENTO** | Text | "ADMINISTRACION" | `funcionarios.departamento` |
| **ANTIG.YY** | Number | 16 | `funcionarios.antiguedad_anios` |
| **ANTIG.MM** | Number | 4 | `funcionarios.antiguedad_meses` |
| **ITEM** | Number | 125 | `funcionarios.item` |
| **NOMBRE Y APELLIDO** | Text | "Juan Pérez" | split → `nombres` + `apellidos` |
| **CARGO** | Text | "Gerente" | `funcionarios.cargo` |
| **SEXO** | Text | "M" | `funcionarios.sexo` |
| **C.I.** | Text | "1234567" | `funcionarios.ci` |
| **FECHA NAC.** | Date | 1980-06-14 | `funcionarios.fecha_nacimiento` |
| **INGRESO IPS** | Date | 2010-02-01 | `funcionarios.fecha_ingreso_ips` |
| **HOY** | Date | 2026-06-11 | (no usar, calculado) |

### Sample Data

```
DEPARTAMENTO      ANTIG.YY  ANTIG.MM  ITEM  NOMBRE Y APELLIDO    CARGO          SEXO  C.I.      FECHA NAC.  INGRESO IPS
ADMINISTRACION    16        4         125   Juan Pérez García    Gerente        M     1234567   1980-06-14  2010-02-01
ADMINISTRACION    14        11        126   María López Torres   Contador       F     2345678   1989-09-12  2011-06-20
VENTAS            13        4         201   Carlos Ruiz Díaz     Vendedor Sr.   M     3456789   1990-01-04  2013-02-01
```

---

## 🔄 PROCESO DE IMPORTACIÓN

### Opción 1: Script Python (Recomendado)

**Archivo:** `control_central/scripts/importar_rrhh_rimec.py`

```python
import pandas as pd
import psycopg2
from datetime import datetime
import os

# Config
EXCEL_PATH = r"C:\Users\hecto\Nexus_Core\DATOS EMPLEADOS 2026.xlsx"
DATABASE_URL = os.getenv("DATABASE_URL")
ENTE_ID_RIMEC = 1

def split_nombre_apellido(nombre_completo):
    """
    Split 'Nombre Y Apellido' en nombres y apellidos.
    Asume formato: "Nombre(s) Apellido(s)"
    """
    partes = nombre_completo.strip().split()
    
    if len(partes) <= 2:
        return partes[0], partes[1] if len(partes) > 1 else ""
    
    # Heurística: primeras 1-2 palabras = nombres, resto = apellidos
    # Ajustar según patrón real
    if len(partes) == 3:
        nombres = partes[0]
        apellidos = f"{partes[1]} {partes[2]}"
    elif len(partes) == 4:
        nombres = f"{partes[0]} {partes[1]}"
        apellidos = f"{partes[2]} {partes[3]}"
    else:
        nombres = " ".join(partes[:2])
        apellidos = " ".join(partes[2:])
    
    return nombres, apellidos

def limpiar_ci(ci):
    """Limpia CI: quita puntos, guiones, espacios."""
    return str(ci).replace(".", "").replace("-", "").replace(" ", "").strip()

def importar_funcionarios():
    print("Leyendo Excel...")
    df = pd.read_excel(EXCEL_PATH)
    
    print(f"Filas encontradas: {len(df)}")
    
    # Conectar a BD
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    insertados = 0
    errores = 0
    
    for idx, row in df.iterrows():
        try:
            # Split nombre
            nombres, apellidos = split_nombre_apellido(row['NOMBRE Y APELLIDO'])
            
            # Limpiar CI
            ci = limpiar_ci(row['C.I.'])
            
            # Preparar datos
            datos = {
                'ente_id': ENTE_ID_RIMEC,
                'nombres': nombres.strip(),
                'apellidos': apellidos.strip(),
                'ci': ci,
                'sexo': row['SEXO'].strip() if pd.notna(row['SEXO']) else None,
                'fecha_nacimiento': row['FECHA NAC.'] if pd.notna(row['FECHA NAC.']) else None,
                'departamento': row['DEPARTAMENTO'].strip(),
                'cargo': row['CARGO'].strip(),
                'item': int(row['ITEM']) if pd.notna(row['ITEM']) else None,
                'fecha_ingreso_ips': row['INGRESO IPS'],
                'antiguedad_anios': int(row['ANTIG.YY']) if pd.notna(row['ANTIG.YY']) else None,
                'antiguedad_meses': int(row['ANTIG.MM']) if pd.notna(row['ANTIG.MM']) else None,
            }
            
            # INSERT
            cur.execute("""
                INSERT INTO funcionarios (
                    ente_id, nombres, apellidos, ci, sexo, fecha_nacimiento,
                    departamento, cargo, item, fecha_ingreso_ips,
                    antiguedad_anios, antiguedad_meses
                ) VALUES (
                    %(ente_id)s, %(nombres)s, %(apellidos)s, %(ci)s, %(sexo)s, %(fecha_nacimiento)s,
                    %(departamento)s, %(cargo)s, %(item)s, %(fecha_ingreso_ips)s,
                    %(antiguedad_anios)s, %(antiguedad_meses)s
                )
                ON CONFLICT (ci) DO NOTHING
            """, datos)
            
            insertados += 1
            print(f"✅ [{idx+1}/{len(df)}] {nombres} {apellidos} (CI: {ci})")
            
        except Exception as e:
            errores += 1
            print(f"❌ Error fila {idx+1}: {e}")
    
    # Commit
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"\n📊 Resumen:")
    print(f"  Insertados: {insertados}")
    print(f"  Errores: {errores}")
    print(f"  Total: {len(df)}")

if __name__ == "__main__":
    importar_funcionarios()
```

**Ejecución:**
```powershell
cd C:\Users\hecto\Nexus_Core\control_central
python scripts\importar_rrhh_rimec.py
```

---

### Opción 2: SQL COPY (Alternativo)

**Paso 1: Exportar Excel a CSV**

```python
# export_to_csv.py
import pandas as pd

df = pd.read_excel(r"C:\Users\hecto\Nexus_Core\DATOS EMPLEADOS 2026.xlsx")

# Transformar columnas
df_transformed = df.rename(columns={
    'DEPARTAMENTO': 'departamento',
    'ANTIG.YY': 'antiguedad_anios',
    'ANTIG.MM': 'antiguedad_meses',
    'ITEM': 'item',
    'CARGO': 'cargo',
    'SEXO': 'sexo',
    'C.I.': 'ci',
    'FECHA NAC.': 'fecha_nacimiento',
    'INGRESO IPS': 'fecha_ingreso_ips'
})

# Split nombre (simplificado)
df_transformed[['nombres', 'apellidos']] = df['NOMBRE Y APELLIDO'].str.split(n=1, expand=True)

# Agregar ente_id
df_transformed['ente_id'] = 1

# Limpiar CI
df_transformed['ci'] = df_transformed['ci'].astype(str).str.replace(r'[^0-9]', '', regex=True)

# Seleccionar columnas
columnas = [
    'ente_id', 'nombres', 'apellidos', 'ci', 'sexo', 'fecha_nacimiento',
    'departamento', 'cargo', 'item', 'fecha_ingreso_ips',
    'antiguedad_anios', 'antiguedad_meses'
]

df_final = df_transformed[columnas]

# Exportar
df_final.to_csv('funcionarios_rimec.csv', index=False, encoding='utf-8')
print("✅ CSV generado: funcionarios_rimec.csv")
```

**Paso 2: COPY a PostgreSQL**

```sql
-- En Supabase SQL Editor o psql
COPY funcionarios (
  ente_id, nombres, apellidos, ci, sexo, fecha_nacimiento,
  departamento, cargo, item, fecha_ingreso_ips,
  antiguedad_anios, antiguedad_meses
)
FROM '/path/to/funcionarios_rimec.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

---

### Opción 3: Streamlit UI (Control Central)

**Módulo:** Control Central → RRHH → Importar

**Características:**
- Upload Excel vía UI
- Preview de datos
- Validación antes de importar
- Log de errores

**Implementación:**
```python
# control_central/modules/rrhh/importar.py
import streamlit as st
import pandas as pd

def importar_funcionarios_ui():
    st.title("Importar Funcionarios RRHH")
    
    # Upload
    archivo = st.file_uploader("Seleccionar Excel", type=['xlsx', 'xls'])
    
    if archivo:
        df = pd.read_excel(archivo)
        
        st.subheader("Preview")
        st.dataframe(df.head(10))
        
        st.metric("Total filas", len(df))
        
        if st.button("Importar a Base de Datos"):
            with st.spinner("Importando..."):
                # Lógica de importación
                insertados, errores = procesar_importacion(df)
                
            st.success(f"✅ {insertados} funcionarios importados")
            if errores > 0:
                st.warning(f"⚠️ {errores} errores")
```

---

## ✅ VALIDACIONES

### Pre-importación

```python
def validar_excel(df):
    errores = []
    
    # Verificar columnas requeridas
    columnas_req = ['NOMBRE Y APELLIDO', 'C.I.', 'DEPARTAMENTO', 'CARGO', 'INGRESO IPS']
    for col in columnas_req:
        if col not in df.columns:
            errores.append(f"Falta columna: {col}")
    
    # Verificar CIs únicos
    cis = df['C.I.'].astype(str).str.replace(r'[^0-9]', '', regex=True)
    if cis.duplicated().any():
        errores.append("Hay CIs duplicados en el Excel")
    
    # Verificar fechas válidas
    if df['INGRESO IPS'].isna().any():
        errores.append("Hay fechas de ingreso IPS vacías")
    
    # Verificar sexo (M/F)
    sexos_invalidos = df[~df['SEXO'].isin(['M', 'F'])]
    if len(sexos_invalidos) > 0:
        errores.append(f"{len(sexos_invalidos)} filas con sexo inválido")
    
    return errores
```

### Post-importación

```sql
-- Verificar que se insertaron 48 funcionarios
SELECT COUNT(*) FROM funcionarios WHERE ente_id = 1;
-- Esperado: 48

-- Verificar que no hay CIs duplicados
SELECT ci, COUNT(*) 
FROM funcionarios 
GROUP BY ci 
HAVING COUNT(*) > 1;
-- Esperado: 0 filas

-- Verificar departamentos
SELECT DISTINCT departamento 
FROM funcionarios 
WHERE ente_id = 1
ORDER BY departamento;

-- Verificar rangos de antigüedad
SELECT 
  MIN(antiguedad_anios) AS min_anios,
  MAX(antiguedad_anios) AS max_anios,
  ROUND(AVG(antiguedad_anios), 1) AS prom_anios
FROM funcionarios
WHERE ente_id = 1;
```

---

## 📊 TRANSFORMACIONES

### Split Nombre y Apellido

**Casos comunes:**

| Formato Excel | Split resultado |
|---------------|-----------------|
| "Juan Pérez" | nombres: "Juan", apellidos: "Pérez" |
| "María López Torres" | nombres: "María", apellidos: "López Torres" |
| "Carlos Alberto Ruiz Díaz" | nombres: "Carlos Alberto", apellidos: "Ruiz Díaz" |

**Estrategia:**
1. Split por espacio
2. Si 2 palabras: primera = nombre, segunda = apellido
3. Si 3 palabras: primera = nombre, resto = apellidos
4. Si 4+ palabras: primeras 2 = nombres, resto = apellidos

**⚠️ Nota:** Revisar manualmente casos especiales.

### Limpiar CI

```python
def limpiar_ci(ci_raw):
    """
    Input: "1.234.567", "1234567-8", " 123456 "
    Output: "1234567", "12345678", "123456"
    """
    return str(ci_raw).replace(".", "").replace("-", "").replace(" ", "").strip()
```

---

## 🔄 ACTUALIZACIÓN DE DATOS

### Reimportar Excel actualizado

```sql
-- Opción 1: Borrar todos los funcionarios de RIMEC
DELETE FROM funcionarios WHERE ente_id = 1;

-- Luego ejecutar script de importación nuevamente
```

```sql
-- Opción 2: Upsert (actualizar existentes, insertar nuevos)
INSERT INTO funcionarios (...)
VALUES (...)
ON CONFLICT (ci) DO UPDATE SET
  nombres = EXCLUDED.nombres,
  apellidos = EXCLUDED.apellidos,
  departamento = EXCLUDED.departamento,
  cargo = EXCLUDED.cargo,
  antiguedad_anios = EXCLUDED.antiguedad_anios,
  antiguedad_meses = EXCLUDED.antiguedad_meses,
  updated_at = NOW();
```

---

## 📋 CHECKLIST

### Antes de importar

- [ ] Verificar que tabla `entes` tiene registro codigo=1 (RIMEC)
- [ ] Verificar que tabla `funcionarios` existe con constraints
- [ ] Backup de BD si hay datos existentes
- [ ] Validar estructura Excel (columnas, tipos)

### Durante importación

- [ ] Ejecutar script con modo dry-run primero
- [ ] Revisar log de errores
- [ ] Verificar split de nombres/apellidos

### Después de importar

- [ ] Verificar count: 48 funcionarios
- [ ] Verificar CIs únicos
- [ ] Verificar que nombre_completo se generó OK
- [ ] Verificar antigüedades razonables (10-20 años promedio)
- [ ] Spot check: comparar 5 funcionarios Excel vs BD

---

## 🔗 REFERENCIAS

- **Excel origen:** `C:\Users\hecto\Nexus_Core\DATOS EMPLEADOS 2026.xlsx`
- **Script Python:** `control_central/scripts/importar_rrhh_rimec.py`
- **Diseño BD:** `./diseño_bd.md`
- **Tipos TypeScript:** `report/src/lib/rrhh/types.ts`

---

**Última actualización:** 2026-06-11  
**Responsable:** Claude Code
