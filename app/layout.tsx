import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "StellarSplit — Split Bills on Stellar",
  description:
    "Trustless group payments powered by Soroban smart contracts. No middlemen, no waiting, no drama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmMono.variable}`}
      style={{ backgroundColor: "#1C1917" }}
    >
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
