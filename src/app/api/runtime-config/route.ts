import { NextResponse } from "next/server";

export async function GET() {
  const whatsappNumber = (process.env.WHATSAPP_NUMBER || "").replace(/\D/g, "");

  return NextResponse.json(
    { whatsappNumber },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
