import { NextResponse } from "next/server";
import { getFuturesWalletBalance } from "@/lib/mexc";
import { saveBalance, loadBalance } from "@/lib/balance-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("currency");
  const currency = raw === "USDT" ? "USDT" : "USDC";

  try {
    const wallet = await getFuturesWalletBalance(currency);
    saveBalance(currency, wallet.total);
    return NextResponse.json({ balance: wallet.total, stale: false });
  } catch {
    const last = loadBalance(currency);
    if (last !== null) {
      return NextResponse.json({ balance: last, stale: true });
    }
    return NextResponse.json(
      { error: "Unable to fetch balance and no cached balance available" },
      { status: 503 }
    );
  }
}
