import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { listarStaging, type StagingEstado } from "@/lib/server/tickets-staging";

export async function GET(req: NextRequest) {
  const session = await readTabletSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  const clienteId = Number(req.nextUrl.searchParams.get("cliente_id"));
  if (!Number.isFinite(clienteId)) {
    return NextResponse.json({ ok: false, error: "cliente_id requerido" }, { status: 400 });
  }

  const estadoParam = req.nextUrl.searchParams.get("estado");
  let estado: StagingEstado | StagingEstado[] | undefined;
  if (estadoParam) {
    estado = estadoParam.includes(",")
      ? (estadoParam.split(",") as StagingEstado[])
      : (estadoParam as StagingEstado);
  }

  const tickets = await listarStaging(clienteId, estado);
  return NextResponse.json({ ok: true, tickets });
}
