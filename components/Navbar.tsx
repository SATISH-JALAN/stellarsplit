export function Navbar() {
    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center"
            style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                backgroundColor: "rgba(10, 15, 30, 0.85)",
                borderBottom: "1px solid #2A3A5C",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
                {/* Brand */}
                <span
                    className="text-xl font-bold tracking-tight select-none"
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                    <span style={{ color: "#00D4FF" }}>✦</span>{" "}
                    <span style={{ color: "#F0F4FF" }}>StellarSplit</span>
                </span>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Testnet badge */}
                    <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                            border: "1px solid #00D4FF",
                            color: "#00D4FF",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Testnet
                    </span>

                    {/* Connect Wallet button */}
                    <button
                        className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{
                            backgroundColor: "#00D4FF",
                            color: "#0A0F1E",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                "0 0 20px #00D4FF44";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        }}
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        </nav>
    );
}
