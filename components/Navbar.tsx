"use client";

import { useWallet } from "@/context/WalletContext";

export function Navbar() {
    const { isConnected, isConnecting, connect, disconnect, truncatedKey, error } = useWallet();

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 h-14"
            style={{
                backgroundColor: "rgba(28, 25, 23, 0.96)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #38322D",
            }}
        >
            <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Brand */}
                <a
                    href="/"
                    className="text-sm font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
                >
                    Stellar<span style={{ color: "#F46F73" }}>Split</span>
                </a>

                <div className="flex items-center gap-4">
                    {/* Network indicator */}
                    <span
                        className="hidden sm:inline text-xs"
                        style={{ fontFamily: "var(--font-mono)", color: "#5C5450", letterSpacing: "0.04em" }}
                    >
                        testnet
                    </span>

                    {isConnected ? (
                        /* Connected state — show address + disconnect */
                        <div className="flex items-center gap-2">
                            <span
                                className="text-xs px-3 py-2"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    color: "#C8BCB4",
                                    backgroundColor: "#2A2520",
                                    border: "1px solid #38322D",
                                    borderRadius: "4px",
                                    letterSpacing: "0.03em",
                                }}
                            >
                                {truncatedKey}
                            </span>
                            <button
                                onClick={disconnect}
                                className="text-xs font-medium px-3 py-2 transition-colors duration-150"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    color: "#8C837C",
                                    border: "1px solid #38322D",
                                    borderRadius: "4px",
                                    letterSpacing: "0.03em",
                                    backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.borderColor = "#B5524E";
                                    el.style.color = "#B5524E";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.borderColor = "#38322D";
                                    el.style.color = "#8C837C";
                                }}
                            >
                                disconnect
                            </button>
                        </div>
                    ) : (
                        /* Disconnected state */
                        <button
                            onClick={connect}
                            disabled={isConnecting}
                            className="text-xs font-medium px-3.5 py-2 transition-colors duration-150 disabled:opacity-50"
                            style={{
                                fontFamily: "var(--font-mono)",
                                backgroundColor: "#F46F73",
                                color: "#1C1917",
                                borderRadius: "4px",
                                letterSpacing: "0.03em",
                            }}
                            onMouseEnter={(e) => {
                                if (!isConnecting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E35C63";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F46F73";
                            }}
                        >
                            {isConnecting ? "connecting…" : "connect wallet"}
                        </button>
                    )}
                </div>
            </div>

            {/* Error banner — shown below nav when connection fails */}
            {error && (
                <div
                    className="w-full py-1.5 px-6 text-xs text-center"
                    style={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor: "#2A1A1A",
                        borderBottom: "1px solid #B5524E",
                        color: "#B5524E",
                        letterSpacing: "0.03em",
                    }}
                >
                    {error}
                </div>
            )}
        </nav>
    );
}
