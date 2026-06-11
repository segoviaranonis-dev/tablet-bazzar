#!/bin/bash
echo "Migrando control_central/docs..."

# Crear subcarpetas si no existen
mkdir -p .claude/2_modulos/2.1_control_central

# Archivos clave de control_central
mv control_central/docs/RIMEC_PILARES_CINCO.md .claude/1_fundamentos/1.2_leyes/pilares_cinco.md 2>/dev/null
mv control_central/docs/RIMEC_NOMENCLATURA_PILARES.md .claude/1_fundamentos/1.2_leyes/nomenclatura_pilares.md 2>/dev/null
mv control_central/docs/RIMEC_POLITICAS_BLINDADAS.md .claude/1_fundamentos/1.3_politicas/politicas_blindadas.md 2>/dev/null

# Arquitectura y diseño
mv control_central/docs/NEXUS_CORE_INDEX.md .claude/2_modulos/2.1_control_central/index.md 2>/dev/null
mv control_central/docs/NEXUS_HOLDING_MANUAL_PROCEDIMIENTOS.md .claude/2_modulos/2.1_control_central/manual_procedimientos.md 2>/dev/null
mv control_central/docs/RIMEC_WEB_ARQUITECTURA_MOLECULAR.md .claude/2_modulos/2.2_rimec_web/arquitectura_molecular.md 2>/dev/null

# Motor de precios y trazabilidad
mv control_central/docs/TRAZABILIDAD_PP_LISTADO.md .claude/3_arquitectura/3.3_integracion/trazabilidad_pp.md 2>/dev/null
mv control_central/docs/DICCIONARIO_PRECIO_WEB.md .claude/3_arquitectura/3.3_integracion/diccionario_precio.md 2>/dev/null

# Políticas y flujos
mv control_central/docs/NEXUS_POLITICA_FK_EVENTOS.md .claude/3_arquitectura/3.3_integracion/politica_fk_eventos.md 2>/dev/null
mv control_central/docs/AUDITORIA_FLUJO_FK_EVENTOS_NEXUS_RIMEC_BAZZAR.md .claude/3_arquitectura/3.3_integracion/flujo_fk_eventos.md 2>/dev/null

# Sales Report
mv control_central/docs/DISENO_DATOS_SQL_KPI_JERARQUIA.md .claude/3_arquitectura/3.1_sales_report/sql_kpi_jerarquia.md 2>/dev/null
mv control_central/docs/DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md .claude/3_arquitectura/3.1_sales_report/diseno_8_tablas.md 2>/dev/null

# Mover archive a histórico
mkdir -p .claude/8_historico
mv control_central/docs/archive/*.md .claude/8_historico/ 2>/dev/null

echo "✅ Control Central migrado"
