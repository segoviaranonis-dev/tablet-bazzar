import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { buscarClienteBazaarPorCedula } from "@/lib/server/clients-bazaar";
import { checkRateLimit, pruneRateLimitStore } from "@/lib/security/rate-limit";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: NextRequest) {
  const vendedor = await readTabletSession(req);
  if (!vendedor) {
    return NextResponse.json({ ok: false, error: "Sesión expirada — volvé a ingresar" }, { status: 401 });
  }

  pruneRateLimitStore();
  const ip = clientIp(req);
  const { ok, retryAfterSec } = checkRateLimit(`${ip}:buscar-cedula`, 20, 60_000);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: `Demasiados intentos. Esperá ${retryAfterSec ?? 60} segundos.` },
      { status: 429 },
    );
  }

  const cedula = req.nextUrl.searchParams.get("cedula") ?? "";
  const cliente = await buscarClienteBazaarPorCedula(cedula);

  return NextResponse.json({ ok: true, cliente });
}
