"use client";

import { useWallet } from "@/context/WalletContext";
import { useBalance } from "@/hooks/useBalance";

export function WalletPanel() {
    const { publicKey, truncatedKey, isConnected } = useWallet();
    const { formattedXLM, isLoading, error, refetch } = useBalance(publicKey);

    if (!isConnected) return null;

    return (
        <div
            className="flex flex-col gap-0 md:min-w-[200px] border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6"
            style={{ borderColor: "#38322D" }}
        >
            {/* Address row */}
            <div className="flex flex-col gap-0.5 pb-5" style={{ borderBottom: "1px solid #38322D" }}>
                <span
                    className="text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "#5C5450", letterSpacing: "0.08em" }}
                >
                    WALLET
                </span>
                <span
                    className="font-medium"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#C8BCB4" }}
                >
                    {truncatedKey}
                </span>
            </div>

            {/* Balance row */}
            <div className="flex flex-col gap-0.5 pt-5">
                <span
                    className="text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "#5C5450", letterSpacing: "0.08em" }}
                >
                    XLM BALANCE
                </span>

                {isLoading && (
                    <span
                        className="font-medium"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#5C5450" }}
                    >
                        loading…
                    </span>
                )}

                {!isLoading && error && (
                    <div className="flex flex-col gap-1">
                        <span
                            className="text-xs leading-snug"
                            style={{ fontFamily: "var(--font-mono)", color: "#B5524E" }}
                        >
                            {error}
                        </span>
                        <button
                            onClick={refetch}
                            className="text-xs text-left transition-colors duration-150"
                            style={{ fontFamily: "var(--font-mono)", color: "#5C5450" }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.color = "#F5F0EB";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.color = "#5C5450";
                            }}
                        >
                            retry ↺
                        </button>
                    </div>
                )}

                {!isLoading && !error && formattedXLM && (
                    <div className="flex items-baseline gap-1.5">
                        <span
                            className="font-bold tracking-tight"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "1.5rem",
                                color: "#F5F0EB",
                            }}
                        >
                            {formattedXLM}
                        </span>
                        <span
                            className="text-xs font-medium"
                            style={{ fontFamily: "var(--font-mono)", color: "#5C5450", letterSpacing: "0.08em" }}
                        >
                            XLM
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
