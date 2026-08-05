import { Suspense } from "react";
import EmpaquePageInner from "./EmpaquePageInner";

export default function EmpaquePage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-slate-500">Cargando Empaque…</p>}>
      <EmpaquePageInner />
    </Suspense>
  );
}
