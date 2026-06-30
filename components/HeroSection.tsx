"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { WalletPanel } from "@/components/WalletPanel";

export function HeroSection() {
    const { isConnected } = useWallet();
    return (
        <section
            className="relative min-h-screen max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16 md:pb-20"
            style={{ paddingTop: "56px" }}
        >
            {/* Faint watermark — texture without gradient blob */}
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                style={{ paddingTop: "56px" }}
            >
                <span
                    className="font-bold select-none"
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(10rem, 32vw, 28rem)",
                        color: "rgba(244, 111, 115, 0.04)",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        userSelect: "none",
                    }}
                >
                    SPLIT
                </span>
            </div>

            {/* Content — left aligned, bottom of screen */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10">

                {/* Left: headline block */}
                <div className="flex flex-col gap-5 max-w-2xl">

                    {/* Label */}
                    <p
                        className="text-xs font-medium"
                        style={{
                            fontFamily: "var(--font-mono)",
                            color: "#5C5450",
                            letterSpacing: "0.1em",
                        }}
                    >
                        STELLAR · SOROBAN · TESTNET
                    </p>

                    {/* H1 — ragged right, not centered */}
                    <h1
                        className="font-bold leading-none tracking-tight"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(3rem, 8.5vw, 6rem)",
                            color: "#F5F0EB",
                        }}
                    >
                        Split the bill.<br />
                        <span style={{ color: "#F46F73" }}>No one gets</span><br />
                        <span style={{ color: "#F46F73" }}>left behind.</span>
                    </h1>

                    {/* Body */}
                    <p
                        className="text-base leading-relaxed max-w-md"
                        style={{ color: "#8C837C" }}
                    >
                        Group payments held in a Soroban smart contract.
                        Funds release the moment the last person pays — no
                        chasing, no trust required.
                    </p>

                    {/* Actions — left aligned, no centered stack */}
                    <div className="flex flex-wrap gap-3 pt-1">
                        <Link
                            href="/send"
                            className="text-sm font-semibold px-6 py-3 transition-colors duration-150 inline-block"
                            style={{
                                backgroundColor: "#F46F73",
                                color: "#1C1917",
                                borderRadius: "4px",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#E35C63";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F46F73";
                            }}
                        >
                            Create a bill
                        </Link>

                        <button
                            className="text-sm font-medium px-6 py-3 transition-colors duration-150"
                            style={{
                                backgroundColor: "transparent",
                                color: "#8C837C",
                                border: "1px solid #38322D",
                                borderRadius: "4px",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLButtonElement;
                                el.style.borderColor = "#5C5450";
                                el.style.color = "#F5F0EB";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLButtonElement;
                                el.style.borderColor = "#38322D";
                                el.style.color = "#8C837C";
                            }}
                        >
                            How it works
                        </button>
                    </div>
                </div>

                {/* Right: wallet panel when connected, static stats otherwise */}
                {isConnected ? (
                    <WalletPanel />
                ) : (
                    <div
                        className="flex flex-row md:flex-col gap-8 md:gap-0 md:divide-y pb-1"
                        style={{ borderColor: "#38322D" }}
                    >
                        {[
                            { value: "3s", label: "Settlement time" },
                            { value: "~$0", label: "Transaction fees" },
                            { value: "Non-custodial", label: "No third party holds funds" },
                        ].map((s, i) => (
                            <div
                                key={s.label}
                                className="flex flex-col gap-0.5 md:py-5"
                                style={i === 0 ? { paddingTop: 0 } : {}}
                            >
                                <span
                                    className="font-bold tracking-tight"
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1.25rem",
                                        color: "#F5F0EB",
                                    }}
                                >
                                    {s.value}
                                </span>
                                <span
                                    className="text-xs"
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        color: "#5C5450",
                                        letterSpacing: "0.06em",
                                    }}
                                >
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
