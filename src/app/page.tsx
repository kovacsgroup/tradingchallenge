import { CompoundCalculator } from "@/components/compound-calculator";
import { getFuturesWalletBalance } from "@/lib/mexc";
import { saveBalance, loadBalance } from "@/lib/balance-store";

export default async function Home() {
  let initialBalance = 1000;
  try {
    const wallet = await getFuturesWalletBalance();
    saveBalance(wallet.total);
    initialBalance = wallet.total;
  } catch {
    const saved = loadBalance();
    if (saved !== null) initialBalance = saved;
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <CompoundCalculator initialBalance={initialBalance} />
    </main>
  );
}
