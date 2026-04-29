import crypto from "crypto";

export interface WalletBalance {
  total: number;
  available: number;
  inPosition: number;
}

export async function getFuturesWalletBalance(
  currency: "USDC" | "USDT" = "USDC",
): Promise<WalletBalance> {
  const apiKey = process.env.MEXC_API_KEY!;
  const secret = process.env.MEXC_SECRET_KEY!;
  const reqTime = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(apiKey + reqTime)
    .digest("hex");

  const res = await fetch(
    "https://api.mexc.com/api/v1/private/account/assets",
    {
      method: "GET",
      headers: {
        ApiKey: apiKey,
        "Request-Time": reqTime,
        Signature: signature,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`MEXC API responded with ${res.status}`);
  }

  const json = await res.json();
  const asset = json.data?.find(
    (x: { currency: string }) => x.currency === currency,
  );

  if (!asset) {
    throw new Error(`${currency} not found in MEXC response`);
  }

  return {
    /* total: parseFloat(
      (asset.positionMargin + asset.availableBalance).toFixed(2),
    ), */
    total: parseFloat(asset.equity.toFixed(2)),
    available: asset.availableBalance as number,
    inPosition: asset.positionMargin as number,
  };
}
