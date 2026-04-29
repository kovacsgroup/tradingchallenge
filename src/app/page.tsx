import { CompoundCalculator } from "@/components/compound-calculator";
import { getFuturesWalletBalance } from "@/lib/mexc";

export default async function Home() {
  let initialBalance = 100;
  try {
    const wallet = await getFuturesWalletBalance("USDC");
    initialBalance = wallet.total;
  } catch {}

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <CompoundCalculator initialBalance={initialBalance} />
    </main>
  );
}
