import { SplitLine } from "./SplitLine";

export function Footer() {
    return (
        <footer className="max-w-7xl mx-auto px-6 pb-10">
            <SplitLine />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6">
                <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
                >
                    Stellar<span style={{ color: "#F46F73" }}>Split</span>
                </span>
                <span
                    className="text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "#5C5450", letterSpacing: "0.06em" }}
                >
                    STELLAR TESTNET · 2025
                </span>
            </div>
        </footer>
    );
}
