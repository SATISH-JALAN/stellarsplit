import { SplitLine } from "./SplitLine";

export function Footer() {
    return (
        <footer className="w-full px-6 pb-8">
            <div className="max-w-6xl mx-auto">
                <SplitLine className="mb-6" />
                <p
                    className="text-center text-sm"
                    style={{ color: "#8B9CC8" }}
                >
                    Built on Stellar Testnet • StellarSplit 2025
                </p>
            </div>
        </footer>
    );
}
