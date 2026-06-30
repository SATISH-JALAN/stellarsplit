import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { SplitLine } from "@/components/SplitLine";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const steps = [
  {
    num: "01",
    title: "Connect your wallet",
    description:
      "Freighter or any supported Stellar wallet. No account, no email. Your keys stay with you.",
  },
  {
    num: "02",
    title: "Create a bill",
    description:
      "Name the expense, assign shares. The contract records exact amounts — no rounding disputes.",
  },
  {
    num: "03",
    title: "Funds release automatically",
    description:
      "Each person pays their share directly on-chain. When the last payment confirms, the contract sends everything to the creator.",
  },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: "#1C1917", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />

      {/* How it works — editorial list, not card grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <SplitLine />

        {/* Section header */}
        <div className="flex items-baseline justify-between py-6">
          <h2
            className="font-semibold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              color: "#F5F0EB",
            }}
          >
            How it works
          </h2>
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-mono)",
              color: "#5C5450",
              letterSpacing: "0.08em",
            }}
          >
            3 STEPS
          </span>
        </div>

        {/* Steps as rows */}
        <div>
          {steps.map((s) => (
            <FeatureCard key={s.num} {...s} />
          ))}
          {/* Closing rule */}
          <SplitLine />
        </div>
      </section>

      <Footer />
    </main>
  );
}
