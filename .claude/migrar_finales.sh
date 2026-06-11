#!/bin/bash
echo "Migración final - Limpiando MD fuera de .claude..."

# Mover archivos de roles
mkdir -p .claude/10_roles
mv roles/*.md .claude/10_roles/ 2>/dev/null

# Mover docs raíz restantes
mv docs/BUENAS_PRACTICAS.md .claude/1_fundamentos/1.1_protocolos/ 2>/dev/null
mv docs/CONTRATO_ARQUITECTURA.md .claude/1_fundamentos/ 2>/dev/null
mv docs/EQUIPO_Y_ROLES.md .claude/10_roles/ 2>/dev/null

# Mover OT de control_central que quedaron
mv control_central/docs/ot/*.md .claude/6_ot/en_curso/ 2>/dev/null

# Mover archivos importantes de control_central
mv control_central/docs/NEXUS_HOLDING_REGLAS_CANONICAS.md .claude/1_fundamentos/1.3_politicas/ 2>/dev/null
mv control_central/docs/NEXUS_CORE_PROTOCOLO_TRABAJO_HECTOR.md .claude/1_fundamentos/1.1_protocolos/ 2>/dev/null

echo "✅ Migración final completada"
