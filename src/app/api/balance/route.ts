import { NextResponse } from "next/server";
import { getFuturesWalletBalance } from "@/lib/mexc";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("currency");
  const currency = raw === "USDT" ? "USDT" : "USDC";

  try {
    const wallet = await getFuturesWalletBalance(currency);
    return NextResponse.json({ balance: wallet.total });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch balance" },
      { status: 503 }
    );
  }
}
