let cachedBalance: number | null = null;

export function saveBalance(total: number): void {
  cachedBalance = total;
}

export function loadBalance(): number | null {
  return cachedBalance;
}
