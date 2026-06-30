"use client";

import { useEffect, useRef } from "react";
import type { ISupportedWallet } from "@/lib/wallet";

interface WalletModalProps {
    wallets: ISupportedWallet[];
    onSelect: (walletId: string) => void;
    onClose: () => void;
}

export function WalletModal({ wallets, onSelect, onClose }: WalletModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    function handleOverlayClick(e: React.MouseEvent) {
        if (e.target === overlayRef.current) onClose();
    }

    const available = wallets.filter((w) => w.isAvailable);
    const unavailable = wallets.filter((w) => !w.isAvailable);
    const ordered = [...available, ...unavailable];

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label="Select wallet"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                backgroundColor: "rgba(10, 8, 7, 0.8)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <div
                style={{
                    backgroundColor: "#232019",
                    border: "1px solid #38322D",
                    borderRadius: "4px",
                    width: "100%",
                    maxWidth: "340px",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.875rem 1.25rem",
                        borderBottom: "1px solid #38322D",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.68rem",
                            color: "#5C5450",
                            letterSpacing: "0.12em",
                        }}
                    >
                        SELECT WALLET
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "#5C5450",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            lineHeight: 1,
                            padding: "2px 4px",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Wallet list */}
                <div>
                    {ordered.length === 0 && (
                        <p
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.8rem",
                                color: "#8C837C",
                                padding: "1.25rem",
                            }}
                        >
                            No wallets detected. Install Freighter at freighter.app
                        </p>
                    )}
                    {ordered.map((wallet, i) => (
                        <button
                            key={wallet.id}
                            onClick={() => wallet.isAvailable && onSelect(wallet.id)}
                            disabled={!wallet.isAvailable}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                width: "100%",
                                padding: "0.875rem 1.25rem",
                                backgroundColor: "transparent",
                                border: "none",
                                borderTop: i > 0 ? "1px solid #38322D" : "none",
                                cursor: wallet.isAvailable ? "pointer" : "default",
                                textAlign: "left",
                                opacity: wallet.isAvailable ? 1 : 0.4,
                                transition: "background-color 0.1s",
                            }}
                            onMouseEnter={(e) => {
                                if (wallet.isAvailable) {
                                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2A2520";
                                }
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                            }}
                        >
                            {wallet.icon ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={wallet.icon}
                                    alt=""
                                    width={22}
                                    height={22}
                                    style={{ borderRadius: "4px", flexShrink: 0 }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "4px",
                                        backgroundColor: "#38322D",
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.85rem",
                                        fontWeight: 500,
                                        color: "#F5F0EB",
                                    }}
                                >
                                    {wallet.name}
                                </span>
                                {!wallet.isAvailable && (
                                    <span
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: "0.62rem",
                                            color: "#5C5450",
                                            letterSpacing: "0.08em",
                                        }}
                                    >
                                        NOT INSTALLED
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
