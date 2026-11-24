import { NextResponse } from "next/server";
import { duplexSuporteDownload } from "@/lib/site";

/** Link amigável: /suporte/acesso-remoto/download → Release do Duplex Suporte. */
export function GET() {
  return NextResponse.redirect(duplexSuporteDownload.assetUrl, 302);
}
