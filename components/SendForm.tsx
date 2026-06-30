"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useBalance } from "@/hooks/useBalance";
import { useSendXLM } from "@/hooks/useSendXLM";

const EXPLORER_BASE = "https://stellar.expert/explorer/testnet/tx/";

/** Icon and hint text for each error type */
function ErrorBanner({
    error,
    errorType,
}: {
    error: string;
    errorType: string | null;
}) {
    // Each error type gets a distinct prefix so the user knows what happened
    const prefix: Record<string, string> = {
        WALLET_NOT_FOUND: "NOT INSTALLED —",
        USER_REJECTED: "REJECTED —",
        INSUFFICIENT_BALANCE: "INSUFFICIENT BALANCE —",
        INVALID_ADDRESS: "INVALID ADDRESS —",
        INVALID_AMOUNT: "INVALID AMOUNT —",
        UNKNOWN: "ERROR —",
    };

    const label = errorType ? (prefix[errorType] ?? "ERROR —") : "ERROR —";

    // Wallet not found gets a link to install
    const installHint =
        errorType === "WALLET_NOT_FOUND" ? (
            <span>
                {" "}
                <a
                    href="https://freighter.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#F46F73", textDecoration: "underline" }}
                >
                    Get Freighter ↗
                </a>
            </span>
        ) : null;

    return (
        <div
            style={{
                padding: "10px 12px",
                backgroundColor: "#2A1A1A",
                border: "1px solid #B5524E",
                borderRadius: "4px",
            }}
        >
            <p
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "#B5524E",
                    lineHeight: 1.5,
                    letterSpacing: "0.02em",
                }}
            >
                <span style={{ opacity: 0.7 }}>{label}</span> {error}
                {installHint}
            </p>
        </div>
    );
}

export function SendForm() {
    const { publicKey, isConnected, connect, isConnecting } = useWallet();
    const { formattedXLM, refetch } = useBalance(publicKey);
    const { status, txHash, error, errorType, send, reset } = useSendXLM();

    const [destination, setDestination] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");

    const isSending = status === "sending";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!publicKey) return;
        await send(publicKey, destination, amount, memo || undefined);
        // Refresh balance 2s after successful send
        setTimeout(() => refetch(), 2000);
    }

    function handleReset() {
        reset();
        setDestination("");
        setAmount("");
        setMemo("");
    }

    const labelStyle: React.CSSProperties = {
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        color: "#5C5450",
        letterSpacing: "0.1em",
        display: "block",
        marginBottom: "6px",
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        backgroundColor: "#1C1917",
        border: "1px solid #38322D",
        borderRadius: "4px",
        color: "#F5F0EB",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem",
        padding: "10px 12px",
        outline: "none",
        letterSpacing: "0.02em",
        boxSizing: "border-box",
    };

    return (
        <div
            style={{
                backgroundColor: "#2A2520",
                border: "1px solid #38322D",
                borderRadius: "4px",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "480px",
                margin: "0 auto",
            }}
        >
            {/* Panel header */}
            <div
                style={{
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid #38322D",
                    paddingBottom: "1rem",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "#5C5450",
                        letterSpacing: "0.1em",
                    }}
                >
                    SEND XLM
                </p>
                {formattedXLM && (
                    <p
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "#8C837C",
                            marginTop: "4px",
                        }}
                    >
                        Available:{" "}
                        <span style={{ color: "#F5F0EB" }}>{formattedXLM} XLM</span>
                    </p>
                )}
            </div>

            {/* ── Success state ── */}
            {status === "success" && txHash && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div
                        style={{ borderBottom: "1px solid #38322D", paddingBottom: "1rem" }}
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "#607C5C",
                                letterSpacing: "0.1em",
                                marginBottom: "6px",
                            }}
                        >
                            ✓ TRANSACTION CONFIRMED
                        </p>
                        <p
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "#5C5450",
                                marginBottom: "4px",
                                letterSpacing: "0.06em",
                            }}
                        >
                            TX HASH
                        </p>
                        <a
                            href={`${EXPLORER_BASE}${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.78rem",
                                color: "#F46F73",
                                wordBreak: "break-all",
                                lineHeight: 1.5,
                            }}
                        >
                            {txHash}
                        </a>
                    </div>
                    <button
                        onClick={handleReset}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "#8C837C",
                            backgroundColor: "transparent",
                            border: "1px solid #38322D",
                            borderRadius: "4px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            letterSpacing: "0.05em",
                        }}
                    >
                        send another
                    </button>
                </div>
            )}

            {/* ── Not connected ── */}
            {!isConnected && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <p
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            color: "#8C837C",
                        }}
                    >
                        Connect your wallet to send XLM.
                    </p>
                    <button
                        onClick={connect}
                        disabled={isConnecting}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            backgroundColor: "#F46F73",
                            color: "#1C1917",
                            border: "none",
                            borderRadius: "4px",
                            padding: "10px 16px",
                            cursor: isConnecting ? "not-allowed" : "pointer",
                            opacity: isConnecting ? 0.6 : 1,
                            letterSpacing: "0.03em",
                        }}
                    >
                        {isConnecting ? "connecting…" : "connect wallet"}
                    </button>
                </div>
            )}

            {/* ── Send form ── */}
            {isConnected && status !== "success" && (
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    {/* Destination */}
                    <div>
                        <label style={labelStyle}>DESTINATION ADDRESS</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="G…"
                            required
                            disabled={isSending}
                            style={{ ...inputStyle, opacity: isSending ? 0.6 : 1 }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#473F39";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor =
                                    errorType === "INVALID_ADDRESS" ? "#B5524E" : "#38322D";
                            }}
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label style={labelStyle}>AMOUNT (XLM)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            min="0.0000001"
                            step="any"
                            required
                            disabled={isSending}
                            style={{ ...inputStyle, opacity: isSending ? 0.6 : 1 }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#473F39";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor =
                                    errorType === "INSUFFICIENT_BALANCE" ||
                                        errorType === "INVALID_AMOUNT"
                                        ? "#B5524E"
                                        : "#38322D";
                            }}
                        />
                    </div>

                    {/* Memo */}
                    <div>
                        <label style={labelStyle}>
                            MEMO{" "}
                            <span style={{ color: "#3D3733" }}>(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="what's this for?"
                            maxLength={28}
                            disabled={isSending}
                            style={{ ...inputStyle, opacity: isSending ? 0.6 : 1 }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#473F39";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#38322D";
                            }}
                        />
                    </div>

                    {/* ── Typed error banner ── */}
                    {status === "error" && error && (
                        <ErrorBanner error={error} errorType={errorType} />
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSending}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            backgroundColor: isSending ? "#2A2520" : "#F46F73",
                            color: isSending ? "#5C5450" : "#1C1917",
                            border: isSending ? "1px solid #38322D" : "none",
                            borderRadius: "4px",
                            padding: "12px 16px",
                            cursor: isSending ? "not-allowed" : "pointer",
                            letterSpacing: "0.04em",
                            marginTop: "4px",
                            transition: "background-color 0.15s",
                        }}
                    >
                        {isSending ? "waiting for wallet…" : "send"}
                    </button>
                </form>
            )}
        </div>
    );
}
