"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import type { ISupportedWallet } from "@/lib/wallet";
import {
    getSupportedWallets,
    selectWallet,
    getPublicKeyFromKit,
    disconnectKit,
    truncateAddress,
    initKit,
} from "@/lib/wallet";
import { WalletModal } from "@/components/WalletModal";

interface WalletState {
    publicKey: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    connect: () => void;
    disconnect: () => void;
    truncatedKey: string | null;
}

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [wallets, setWallets] = useState<ISupportedWallet[]>([]);

    // Open the wallet picker modal
    const connect = useCallback(() => {
        setError(null);
        initKit();
        getSupportedWallets()
            .then((supported) => {
                setWallets(supported);
                setShowModal(true);
            })
            .catch(() => {
                setWallets([]);
                setShowModal(true);
            });
    }, []);

    // Called when user picks a wallet from the modal
    const handleWalletSelect = useCallback(async (walletId: string) => {
        setShowModal(false);
        setIsConnecting(true);
        setError(null);
        try {
            await selectWallet(walletId);
            const address = await getPublicKeyFromKit();
            setPublicKey(address);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Connection failed";
            if (
                msg.toLowerCase().includes("not found") ||
                msg.toLowerCase().includes("not installed")
            ) {
                setError("Wallet not installed. Install it and try again.");
            } else if (
                msg.toLowerCase().includes("declined") ||
                msg.toLowerCase().includes("rejected")
            ) {
                setError("Connection rejected by wallet.");
            } else {
                setError(msg);
            }
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        disconnectKit().catch(() => { });
        setPublicKey(null);
        setError(null);
    }, []);

    return (
        <WalletContext.Provider
            value={{
                publicKey,
                isConnected: !!publicKey,
                isConnecting,
                error,
                connect,
                disconnect,
                truncatedKey: publicKey ? truncateAddress(publicKey) : null,
            }}
        >
            {children}
            {showModal && (
                <WalletModal
                    wallets={wallets}
                    onSelect={handleWalletSelect}
                    onClose={() => setShowModal(false)}
                />
            )}
        </WalletContext.Provider>
    );
}

export function useWallet(): WalletState {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
    return ctx;
}
