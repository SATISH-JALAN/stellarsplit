"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAccountBalance, formatXLM, AccountBalance } from "@/lib/stellar";

interface UseBalanceResult {
  balance: AccountBalance | null;
  formattedXLM: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBalance(publicKey: string | null): UseBalanceResult {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAccountBalance(publicKey);
      setBalance(result);
    } catch (err) {
      // Handle unfunded testnet accounts gracefully
      const msg = err instanceof Error ? err.message : "Failed to fetch balance";
      if (
        msg.includes("404") ||
        msg.includes("Not Found") ||
        msg.includes("ResourceMissing")
      ) {
        setError("Account not funded. Use Friendbot to fund your testnet wallet.");
      } else {
        setError(msg);
      }
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    balance,
    formattedXLM: balance ? formatXLM(balance.xlm) : null,
    isLoading,
    error,
    refetch: fetch,
  };
}
