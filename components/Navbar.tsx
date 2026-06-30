"use client";

export function Navbar() {
    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 h-14"
            style={{
                backgroundColor: "rgba(28, 25, 23, 0.96)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #38322D",
            }}
        >
            <div
                className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between"
            >
                {/* Brand — just text, no icons */}
                <a
                    href="/"
                    className="text-sm font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
                >
                    Stellar<span style={{ color: "#F46F73" }}>Split</span>
                </a>

                <div className="flex items-center gap-4">
                    {/* Network indicator — monospace, understated */}
                    <span
                        className="text-xs"
                        style={{
                            fontFamily: "var(--font-mono)",
                            color: "#5C5450",
                            letterSpacing: "0.04em",
                        }}
                    >
                        testnet
                    </span>

                    <button
                        className="text-xs font-medium px-3.5 py-2 transition-colors duration-150"
                        style={{
                            fontFamily: "var(--font-mono)",
                            backgroundColor: "#F46F73",
                            color: "#1C1917",
                            borderRadius: "4px",
                            letterSpacing: "0.03em",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E35C63";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F46F73";
                        }}
                    >
                        connect wallet
                    </button>
                </div>
            </div>
        </nav>
    );
}
