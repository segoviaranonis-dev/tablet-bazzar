#!/usr/bin/env node
/**
 * Ignored Build Step — proyecto Vercel tablet-bazzar.
 * Exit 1 = continuar build · Exit 0 = omitir (sin Error).
 * Solo main es tip producto (app/ en raíz). Holding moises-holding ≠ tablet.
 * Doc: .claude/5_errores/detalle/4.05.04.001_nexus-core-origin-apunta-tablet-bazzar.md
 */
const ref = process.env.VERCEL_GIT_COMMIT_REF || process.env.VERCEL_GIT_COMMIT_REF_SLUG || ''
const allowed = new Set(['main'])

if (allowed.has(ref)) {
  console.log(`[vercel-ignore] build OK — rama producto: ${ref}`)
  process.exit(1)
}

console.log(`[vercel-ignore] skip — rama holding/no-tablet: ${ref || '(sin ref)'}`)
process.exit(0)
