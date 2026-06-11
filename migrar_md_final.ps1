Write-Host "Iniciando limpieza TOTAL de MD dispersos..." -ForegroundColor Yellow

# Crear carpetas si no existen
New-Item -ItemType Directory -Force -Path ".claude/10_roles" | Out-Null
New-Item -ItemType Directory -Force -Path ".claude/2_modulos/2.1_control_central/docs" | Out-Null
New-Item -ItemType Directory -Force -Path ".claude/2_modulos/2.2_rimec_web/docs" | Out-Null
New-Item -ItemType Directory -Force -Path ".claude/2_modulos/2.3_report/docs" | Out-Null
New-Item -ItemType Directory -Force -Path ".claude/2_modulos/2.5_bazzar_web/docs" | Out-Null
New-Item -ItemType Directory -Force -Path ".claude/8_historico/ot_completadas" | Out-Null

$moved = 0

# AGENTS.md → 10_roles
if (Test-Path "control_central/AGENTS.md") {
    Move-Item "control_central/AGENTS.md" ".claude/10_roles/AGENTS_control_central.md" -Force
    $moved++
}
if (Test-Path "report/AGENTS.md") {
    Move-Item "report/AGENTS.md" ".claude/10_roles/AGENTS_report.md" -Force
    $moved++
}
if (Test-Path "rimec-web/AGENTS.md") {
    Move-Item "rimec-web/AGENTS.md" ".claude/10_roles/AGENTS_rimec_web.md" -Force
    $moved++
}
if (Test-Path "bazzar-web/AGENTS.md") {
    Move-Item "bazzar-web/AGENTS.md" ".claude/10_roles/AGENTS_bazzar_web.md" -Force
    $moved++
}

# READMEs → módulos correspondientes
if (Test-Path "control_central/README.md") {
    Move-Item "control_central/README.md" ".claude/2_modulos/2.1_control_central/README.md" -Force
    $moved++
}
if (Test-Path "report/README.md") {
    Move-Item "report/README.md" ".claude/2_modulos/2.3_report/README.md" -Force
    $moved++
}
if (Test-Path "rimec-web/README.md") {
    Move-Item "rimec-web/README.md" ".claude/2_modulos/2.2_rimec_web/README.md" -Force
    $moved++
}
if (Test-Path "bazzar-web/README.md") {
    Move-Item "bazzar-web/README.md" ".claude/2_modulos/2.5_bazzar_web/README.md" -Force
    $moved++
}

# Archivos de control_central/docs → 2.1
$ccDocs = @(
    "NEXUS_HOLDING_PROTOCOLO_CLAUDE_CODE.md",
    "NEXUS_MAPA_VERDAD_OPERATIVA.md",
    "NEXUS_PROTOCOLO_IMAGENES_PRODUCTO.md",
    "COMPRA_WEB_LEY_FI.md",
    "CONTROL_INTEGRIDAD_HOLDING.md",
    "RETAIL_VS_SALES.md",
    "RIMEC_MISION_VISION_POLITICA.md",
    "RIMEC_WEB_FIX_LIMITE_SUPABASE.md",
    "OT_REGISTRO_ESTADO.md"
)

foreach ($doc in $ccDocs) {
    $source = "control_central/docs/$doc"
    if (Test-Path $source) {
        Move-Item $source ".claude/2_modulos/2.1_control_central/docs/$doc" -Force
        $moved++
    }
}

# Archivos de report/docs → 2.3
$reportDocs = @(
    "DEPLOY_VERCEL_REPORT.md",
    "DISENO_DATOS_SQL_KPI_JERARQUIA.md",
    "DISENO_DESCRIPCION_8_TABLAS_INFORME_VENTAS.md"
)

foreach ($doc in $reportDocs) {
    $source = "report/docs/$doc"
    if (Test-Path $source) {
        Move-Item $source ".claude/2_modulos/2.3_report/docs/$doc" -Force
        $moved++
    }
}

# Archivos raíz de report
if (Test-Path "report/DEPLOY_VERCEL.md") {
    Move-Item "report/DEPLOY_VERCEL.md" ".claude/2_modulos/2.3_report/DEPLOY_VERCEL.md" -Force
    $moved++
}
if (Test-Path "report/VERCEL_EMERGENCY_CONFIG.md") {
    Move-Item "report/VERCEL_EMERGENCY_CONFIG.md" ".claude/2_modulos/2.3_report/VERCEL_EMERGENCY_CONFIG.md" -Force
    $moved++
}

# OT completadas → histórico
if (Test-Path "report/OT-INFORME-001_COMPLETADO.md") {
    Move-Item "report/OT-INFORME-001_COMPLETADO.md" ".claude/8_historico/ot_completadas/" -Force
    $moved++
}
if (Test-Path "control_central/SANEO_PP_2026_0001_COMPLETADO.md") {
    Move-Item "control_central/SANEO_PP_2026_0001_COMPLETADO.md" ".claude/8_historico/ot_completadas/" -Force
    $moved++
}

# Archivos raíz de módulos → docs
if (Test-Path "control_central/POLITICA_THUMBNAILS.md") {
    Move-Item "control_central/POLITICA_THUMBNAILS.md" ".claude/2_modulos/2.1_control_central/docs/" -Force
    $moved++
}
if (Test-Path "control_central/COMO_EJECUTAR.md") {
    Move-Item "control_central/COMO_EJECUTAR.md" ".claude/2_modulos/2.1_control_central/docs/" -Force
    $moved++
}
if (Test-Path "control_central/tools/README_buscador_de_fotos.md") {
    Move-Item "control_central/tools/README_buscador_de_fotos.md" ".claude/2_modulos/2.1_control_central/docs/" -Force
    $moved++
}

# Reportes → módulos
if (Test-Path "report/RETAIL_FILTERS_ROBUSTNESS_REPORT.md") {
    Move-Item "report/RETAIL_FILTERS_ROBUSTNESS_REPORT.md" ".claude/2_modulos/2.3_report/docs/" -Force
    $moved++
}

# CONTEXTO_PPT → histórico (obsoletos)
if (Test-Path "control_central/CONTEXTO_PPT.md") {
    Move-Item "control_central/CONTEXTO_PPT.md" ".claude/8_historico/" -Force
    $moved++
}
if (Test-Path "report/CONTEXTO_PPT.md") {
    Move-Item "report/CONTEXTO_PPT.md" ".claude/8_historico/" -Force
    $moved++
}
if (Test-Path "rimec-web/CONTEXTO_PPT.md") {
    Move-Item "rimec-web/CONTEXTO_PPT.md" ".claude/8_historico/" -Force
    $moved++
}
if (Test-Path "bazzar-web/CONTEXTO_PPT.md") {
    Move-Item "bazzar-web/CONTEXTO_PPT.md" ".claude/8_historico/" -Force
    $moved++
}

# CONTEXT.md → módulos
if (Test-Path "bazzar-web/CONTEXT.md") {
    Move-Item "bazzar-web/CONTEXT.md" ".claude/2_modulos/2.5_bazzar_web/docs/" -Force
    $moved++
}

# Diagnósticos → módulos
if (Test-Path "rimec-web/DIAGNOSTICO_VERCEL.md") {
    Move-Item "rimec-web/DIAGNOSTICO_VERCEL.md" ".claude/2_modulos/2.2_rimec_web/docs/" -Force
    $moved++
}
if (Test-Path "rimec-web/CLAUDE.md") {
    Move-Item "rimec-web/CLAUDE.md" ".claude/2_modulos/2.2_rimec_web/docs/" -Force
    $moved++
}

# docs raíz → fundamentos
if (Test-Path "docs/ESTRUCTURA_OBLIGATORIA.md") {
    Move-Item "docs/ESTRUCTURA_OBLIGATORIA.md" ".claude/1_fundamentos/1.3_politicas/" -Force
    $moved++
}
if (Test-Path "docs/MAPA_REPOS.md") {
    Move-Item "docs/MAPA_REPOS.md" ".claude/1_fundamentos/" -Force
    $moved++
}

Write-Host "✅ Migración completada: $moved archivos movidos" -ForegroundColor Green
