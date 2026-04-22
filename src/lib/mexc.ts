import crypto from "crypto";

export interface WalletBalance {
  total: number;
  available: number;
  inPosition: number;
}

export async function getFuturesWalletBalance(): Promise<WalletBalance> {
  const apiKey = process.env.MEXC_API_KEY!;
  const secret = process.env.MEXC_SECRET_KEY!;
  const reqTime = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(apiKey + reqTime)
    .digest("hex");

  const res = await fetch("https://api.mexc.com/api/v1/private/account/assets", {
    method: "GET",
    headers: {
      ApiKey: apiKey,
      "Request-Time": reqTime,
      Signature: signature,
    },
  });

  if (!res.ok) {
    throw new Error(`MEXC API responded with ${res.status}`);
  }

  const json = await res.json();
  const usdc = json.data?.find(
    (x: { currency: string }) => x.currency === "USDC"
  );

  if (!usdc) {
    throw new Error("USDC not found in MEXC response");
  }

  return {
    total: parseFloat((usdc.positionMargin + usdc.availableBalance).toFixed(2)),
    available: usdc.availableBalance as number,
    inPosition: usdc.positionMargin as number,
  };
}
