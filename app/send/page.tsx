import { Navbar } from "@/components/Navbar";
import { SendForm } from "@/components/SendForm";
import { Footer } from "@/components/Footer";
import { SplitLine } from "@/components/SplitLine";

export default function SendPage() {
    return (
        <main style={{ backgroundColor: "#1C1917", minHeight: "100vh" }}>
            <Navbar />
            <section
                className="max-w-7xl mx-auto px-6"
                style={{ paddingTop: "calc(56px + 3rem)", paddingBottom: "4rem" }}
            >
                <div style={{ marginBottom: "2.5rem" }}>
                    <p
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "#5C5450",
                            letterSpacing: "0.1em",
                            marginBottom: "0.5rem",
                        }}
                    >
                        TESTNET
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                            fontWeight: 700,
                            color: "#F5F0EB",
                            lineHeight: 1.1,
                            marginBottom: "0.5rem",
                        }}
                    >
                        Send XLM
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.9rem",
                            color: "#8C837C",
                        }}
                    >
                        Send XLM to any Stellar address on testnet.
                    </p>
                </div>

                <SplitLine />

                <div style={{ paddingTop: "2rem" }}>
                    <SendForm />
                </div>
            </section>
            <Footer />
        </main>
    );
}
