"use client";

import { useState, useCallback } from "react";
import { sendXLM, SendResult } from "@/lib/stellar";
import { StrKey } from "@stellar/stellar-sdk";

export type SendStatus = "idle" | "sending" | "success" | "error";

export interface UseSendXLMResult {
  status: SendStatus;
  txHash: string | null;
  error: string | null;
  send: (sender: string, destination: string, amount: string, memo?: string) => Promise<void>;
  reset: () => void;
}

export function useSendXLM(): UseSendXLMResult {
  const [status, setStatus] = useState<SendStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (
    sender: string,
    destination: string,
    amount: string,
    memo?: string
  ) => {
    // Client-side validation
    if (!StrKey.isValidEd25519PublicKey(destination)) {
      setError("Invalid destination address.");
      setStatus("error");
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be greater than 0.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError(null);
    setTxHash(null);

    try {
      const result: SendResult = await sendXLM(sender, destination, amount, memo);
      setTxHash(result.txHash);
      setStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      // Friendlier messages for common errors
      if (msg.toLowerCase().includes("user declined") || msg.toLowerCase().includes("rejected")) {
        setError("Transaction rejected in wallet.");
      } else if (msg.toLowerCase().includes("insufficient")) {
        setError("Insufficient balance to complete this transaction.");
      } else {
        setError(msg);
      }
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
  }, []);

  return { status, txHash, error, send, reset };
}
