/**
 * StepRow — replaces the 3-card grid.
 * An editorial list row: number, title, description in a horizontal band.
 * Separated by hairline rules, not boxed in rounded cards.
 */
interface StepRowProps {
    num: string;
    title: string;
    description: string;
}

export function FeatureCard({ num, title, description }: StepRowProps) {
    return (
        <div
            className="grid gap-4 py-8"
            style={{
                gridTemplateColumns: "3rem 1fr 2fr",
                borderTop: "1px solid #38322D",
            }}
        >
            {/* Step number */}
            <span
                className="font-medium pt-0.5"
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    color: "#F46F73",
                    letterSpacing: "0.05em",
                }}
            >
                {num}
            </span>

            {/* Title */}
            <h3
                className="font-semibold leading-snug"
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    color: "#F5F0EB",
                }}
            >
                {title}
            </h3>

            {/* Description */}
            <p
                className="text-sm leading-relaxed"
                style={{ color: "#8C837C" }}
            >
                {description}
            </p>
        </div>
    );
}
