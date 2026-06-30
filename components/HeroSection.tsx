import { SplitLine } from "./SplitLine";

const stats = [
    { value: "3 sec", label: "Settlement" },
    { value: "$0.001", label: "Per Transaction" },
    { value: "100%", label: "Trustless" },
];

export function HeroSection() {
    return (
        <section
            className="relative flex flex-col items-center justify-center min-h-screen text-center px-6"
            style={{ paddingTop: "64px" }}
        >
            {/* Background glow effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 40% at 50% 40%, #00D4FF0A 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
                {/* Eyebrow */}
                <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "#00D4FF", letterSpacing: "0.2em" }}
                >
                    Built on Stellar Testnet
                </p>

                {/* H1 */}
                <h1
                    className="font-bold leading-none"
                    style={{
                        fontFamily: "var(--font-display), sans-serif",
                        color: "#F0F4FF",
                    }}
                >
                    <span
                        className="block"
                        style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
                    >
                        Split Bills.
                    </span>
                    <span
                        className="block"
                        style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
                    >
                        Settle{" "}
                        <span
                            className="glow-text"
                            style={{ color: "#00D4FF" }}
                        >
                            Instantly.
                        </span>
                    </span>
                </h1>

                {/* Subheading */}
                <p
                    className="text-lg max-w-xl leading-relaxed"
                    style={{ color: "#8B9CC8" }}
                >
                    Trustless group payments powered by Soroban smart contracts. No
                    middlemen, no waiting, no drama.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <button
                        className="text-base font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{
                            backgroundColor: "#00D4FF",
                            color: "#0A0F1E",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                "0 0 30px #00D4FF55";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        }}
                    >
                        Create a Bill
                    </button>
                    <button
                        className="text-base font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{
                            backgroundColor: "transparent",
                            border: "1.5px solid #00D4FF",
                            color: "#00D4FF",
                        }}
                    >
                        View Demo
                    </button>
                </div>

                {/* Split line */}
                <div className="w-full max-w-md mt-4">
                    <SplitLine />
                </div>

                {/* Stats row */}
                <div className="flex gap-10 sm:gap-16 mt-2">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-1">
                            <span
                                className="text-2xl font-bold"
                                style={{
                                    fontFamily: "var(--font-display), sans-serif",
                                    color: "#00D4FF",
                                }}
                            >
                                {stat.value}
                            </span>
                            <span className="text-xs uppercase tracking-wider" style={{ color: "#8B9CC8" }}>
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
