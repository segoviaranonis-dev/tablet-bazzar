#!/bin/bash
echo "Migrando Report, RIMEC Web, Bazzar Web..."

# REPORT
mkdir -p .claude/2_modulos/2.3_report
mv report/docs/MODULO_REPORT_LEYES_DISENO.md .claude/2_modulos/2.3_report/leyes_diseno.md 2>/dev/null
mv report/docs/MEMORIA_HOLDING_REPORT.md .claude/2_modulos/2.3_report/memoria.md 2>/dev/null
mv report/.claude/*.md .claude/2_modulos/2.3_report/ 2>/dev/null

# RIMEC WEB
mkdir -p .claude/2_modulos/2.2_rimec_web
mv rimec-web/.claude/*.md .claude/2_modulos/2.2_rimec_web/ 2>/dev/null

# BAZZAR WEB
mkdir -p .claude/2_modulos/2.5_bazzar_web
mv bazzar-web/docs/*.md .claude/2_modulos/2.5_bazzar_web/ 2>/dev/null

echo "✅ Webs migradas"
