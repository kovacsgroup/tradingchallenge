import { NextResponse } from "next/server";
import { getFuturesWalletBalance } from "@/lib/mexc";
import { saveBalance, loadBalance } from "@/lib/balance-store";

export async function GET() {
  try {
    const wallet = await getFuturesWalletBalance();
    saveBalance(wallet.total);
    return NextResponse.json({ balance: wallet.total, stale: false });
  } catch {
    const last = loadBalance();
    if (last !== null) {
      return NextResponse.json({ balance: last, stale: true });
    }
    return NextResponse.json(
      { error: "Unable to fetch balance and no cached balance available" },
      { status: 503 }
    );
  }
}
