"use client";

import { useState, useCallback } from "react";
import { sendXLM, SendResult } from "@/lib/stellar";
import { StrKey } from "@stellar/stellar-sdk";
import { classifyError, getErrorMessage, getErrorType } from "@/lib/errors";

export type SendStatus = "idle" | "sending" | "success" | "error";
export type SendErrorType =
  | "WALLET_NOT_FOUND"
  | "USER_REJECTED"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_ADDRESS"
  | "INVALID_AMOUNT"
  | "UNKNOWN";

export interface UseSendXLMResult {
  status: SendStatus;
  txHash: string | null;
  error: string | null;
  errorType: SendErrorType | null;
  send: (
    sender: string,
    destination: string,
    amount: string,
    memo?: string
  ) => Promise<void>;
  reset: () => void;
}

export function useSendXLM(): UseSendXLMResult {
  const [status, setStatus] = useState<SendStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<SendErrorType | null>(null);

  const send = useCallback(
    async (
      sender: string,
      destination: string,
      amount: string,
      memo?: string
    ) => {
      // ── Error type 1: invalid address (client-side, before any network call)
      if (!StrKey.isValidEd25519PublicKey(destination)) {
        setError("Invalid destination address. Must be a valid Stellar public key starting with G.");
        setErrorType("INVALID_ADDRESS");
        setStatus("error");
        return;
      }

      // ── Validation: amount
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError("Amount must be greater than 0.");
        setErrorType("INVALID_AMOUNT");
        setStatus("error");
        return;
      }

      setStatus("sending");
      setError(null);
      setErrorType(null);
      setTxHash(null);

      try {
        const result: SendResult = await sendXLM(
          sender,
          destination,
          amount,
          memo
        );
        setTxHash(result.txHash);
        setStatus("success");
      } catch (err) {
        // ── Error types 2 & 3: classified from wallet/network response
        const classified = classifyError(err);
        setError(getErrorMessage(classified));
        setErrorType(getErrorType(classified) as SendErrorType);
        setStatus("error");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setTxHash(null);
    setError(null);
    setErrorType(null);
  }, []);

  return { status, txHash, error, errorType, send, reset };
}
