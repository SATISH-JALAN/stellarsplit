export function SplitLine({ className }: { className?: string }) {
    return (
        <div className={`relative flex items-center ${className ?? ""}`}>
            <div
                className="flex-1 h-px opacity-60"
                style={{
                    background:
                        "linear-gradient(to right, transparent, #00D4FF, transparent)",
                    boxShadow: "0 0 8px #00D4FF66",
                }}
            />
        </div>
    );
}
