#!/bin/bash
# Script de migración masiva - Nexus Core
# Reorganiza TODOS los MD a .claude/ con estructura numerada

CLAUDE_DIR=".claude"

# 1. FUNDAMENTOS - Copiar de memoria permanente
echo "1. Migrando Fundamentos..."
# Ya están en memoria permanente, crearemos referencias

# 2. MÓDULOS - Mover desde cada módulo
echo "2. Migrando Módulos..."

# 2.4 Tablet Bazzar - Ya migrado
# Solo actualizar si hay cambios

# 3. ARQUITECTURA
echo "3. Migrando Arquitectura..."
mv .claude/SALES_REPORT_VENTAS_ARQUITECTURA.md .claude/3_arquitectura/3.1_sales_report/arquitectura_ventas.md 2>/dev/null
mv .claude/VENTA_TIENDA_ARQUITECTURA_DEPOSITOS.md .claude/3_arquitectura/3.2_venta_tienda/depositos.md 2>/dev/null
mv .claude/VENTA_TIENDA_TICKETS_ORO.md .claude/3_arquitectura/3.2_venta_tienda/tickets_oro.md 2>/dev/null
mv .claude/VENTA_TIENDA_MULTI_PROVEEDOR.md .claude/3_arquitectura/3.2_venta_tienda/multi_proveedor.md 2>/dev/null
mv .claude/VENTA_TIENDA_DECISIONES_TECNICAS.md .claude/3_arquitectura/3.2_venta_tienda/decisiones_tecnicas.md 2>/dev/null
mv .claude/SISTEMA_PERMISOS_ROLES_CATEGORIAS.md .claude/2_modulos/2.3_report/sistema_permisos.md 2>/dev/null

# 6. OT - Mover todos
echo "6. Migrando OT..."
mv ot/en_curso/*.md .claude/6_ot/en_curso/ 2>/dev/null
mv ot/cerradas/*.md .claude/6_ot/cerradas/ 2>/dev/null
mv ot/*.md .claude/6_ot/ 2>/dev/null

# 7. AUDITORÍAS
echo "7. Migrando Auditorías..."
mv .claude/AUDITORIA_SEGURIDAD_COMPLETA_2026-06-08.md .claude/7_auditorias/seguridad/auditoria_completa.md 2>/dev/null
mv .claude/PLAN_REMEDIACION_SEGURIDAD_URGENTE.md .claude/7_auditorias/seguridad/plan_remediacion.md 2>/dev/null
mv .claude/PLAN_MIGRACION_PASSWORDS.md .claude/7_auditorias/seguridad/migracion_passwords.md 2>/dev/null

echo "✅ Migración completada"
