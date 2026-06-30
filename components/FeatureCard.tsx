interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div
            className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
            style={{
                backgroundColor: "#1E2A45",
                border: "1px solid #2A3A5C",
            }}
        >
            {/* Icon circle */}
            <div
                className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl flex-shrink-0"
                style={{
                    backgroundColor: "#00D4FF18",
                    border: "1px solid #00D4FF33",
                }}
            >
                {icon}
            </div>

            {/* Title */}
            <h3
                className="text-base font-semibold"
                style={{
                    fontFamily: "var(--font-display), sans-serif",
                    color: "#F0F4FF",
                }}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "#8B9CC8" }}>
                {description}
            </p>
        </div>
    );
}
