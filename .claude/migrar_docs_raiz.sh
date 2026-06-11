#!/bin/bash
echo "Migrando docs/ raíz..."

# Auditorías
mkdir -p .claude/7_auditorias/rbac
mv docs/auditorias/*.md .claude/7_auditorias/rbac/ 2>/dev/null

# Migraciones
mkdir -p .claude/7_auditorias/migraciones
mv docs/migraciones/*.md .claude/7_auditorias/migraciones/ 2>/dev/null

# Histórico
mkdir -p .claude/8_historico
mv docs/historico/*.md .claude/8_historico/ 2>/dev/null

# Protocolos y guías generales
mkdir -p .claude/1_fundamentos/1.1_protocolos
mv docs/GUARDIAN_CLAUDE.md .claude/1_fundamentos/1.1_protocolos/guardian_claude.md 2>/dev/null
mv docs/FLUJO_OT_Y_AUDITORIA.md .claude/1_fundamentos/1.1_protocolos/flujo_ot.md 2>/dev/null

# Comercial (separado)
mkdir -p .claude/9_comercial
mv comercial/*.md .claude/9_comercial/ 2>/dev/null

echo "✅ Docs raíz migrados"
