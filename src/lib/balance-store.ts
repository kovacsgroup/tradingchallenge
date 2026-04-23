import fs from "fs";
import path from "path";

type Currency = "USDC" | "USDT";
type Cache = { [K in Currency]?: number };

const STORE_PATH = path.join(process.cwd(), ".balance-cache.json");

function readCache(): Cache {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeCache(cache: Cache): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(cache));
  } catch {}
}

export function saveBalance(currency: Currency, total: number): void {
  const cache = readCache();
  cache[currency] = total;
  writeCache(cache);
}

export function loadBalance(currency: Currency): number | null {
  const cache = readCache();
  return cache[currency] ?? null;
}
