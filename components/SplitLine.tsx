/**
 * SplitLine — a full-bleed horizontal rule.
 * No gradient fade, no glyph. Just a clean warm line.
 * Used as structural punctuation between sections.
 */
export function SplitLine({ className }: { className?: string }) {
    return (
        <hr
            className={className}
            style={{
                border: "none",
                borderTop: "1px solid #38322D",
                margin: 0,
            }}
        />
    );
}
