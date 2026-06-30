"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { connectFreighter, getFreighterPublicKey, isFreighterInstalled, truncateAddress } from "@/lib/wallet";

interface WalletState {
    publicKey: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    isInstalled: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    truncatedKey: string | null;
}

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check on mount if already connected
    useEffect(() => {
        isFreighterInstalled().then(setIsInstalled);
        getFreighterPublicKey().then((key) => {
            if (key) setPublicKey(key);
        });
    }, []);

    const connect = useCallback(async () => {
        setError(null);
        setIsConnecting(true);
        try {
            const installed = await isFreighterInstalled();
            if (!installed) {
                throw new Error("Freighter wallet not found. Install it from freighter.app");
            }
            const key = await connectFreighter();
            setPublicKey(key);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connection failed");
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        setPublicKey(null);
        setError(null);
    }, []);

    return (
        <WalletContext.Provider
            value={{
                publicKey,
                isConnected: !!publicKey,
                isConnecting,
                isInstalled,
                error,
                connect,
                disconnect,
                truncatedKey: publicKey ? truncateAddress(publicKey) : null,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet(): WalletState {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
    return ctx;
}
