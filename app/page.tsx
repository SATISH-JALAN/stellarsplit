import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/components/FeatureCard";
import { SplitLine } from "@/components/SplitLine";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const features = [
  {
    icon: "👛",
    title: "Connect Your Wallet",
    description:
      "Use Freighter or any Stellar wallet. No signup required.",
  },
  {
    icon: "🧾",
    title: "Create a Bill",
    description:
      "Add participants and amounts. The contract handles the math.",
  },
  {
    icon: "⚡",
    title: "Settle Instantly",
    description:
      "Each person pays their share. Funds release automatically.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0A0F1E" }}>
      <Navbar />

      <HeroSection />

      <SplitLine className="max-w-6xl mx-auto px-6 my-4" />

      {/* Features section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-3xl font-bold text-center mb-12"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            color: "#F0F4FF",
          }}
        >
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
