import { Horizon } from "@stellar/stellar-sdk";
import { HORIZON_URL } from "./constants";

const server = new Horizon.Server(HORIZON_URL);

export interface AccountBalance {
  xlm: string;    // formatted, e.g. "125.4200000"
  xlmRaw: string; // raw string from API
}

export async function fetchAccountBalance(publicKey: string): Promise<AccountBalance> {
  const account = await server.loadAccount(publicKey);
  const nativeBalance = account.balances.find(b => b.asset_type === "native");
  const balance = (nativeBalance as any)?.balance ?? null;
  if (!balance) {
    throw new Error("No XLM balance found for this account");
  }
  return {
    xlm: balance,
    xlmRaw: balance,
  };
}

export function formatXLM(raw: string): string {
  const num = parseFloat(raw);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}
