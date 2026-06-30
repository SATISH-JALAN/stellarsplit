import {
  isConnected,
  getAddress,
  isAllowed,
  setAllowed,
} from "@stellar/freighter-api";

export async function isFreighterInstalled(): Promise<boolean> {
  const result = await isConnected();
  return result.isConnected;
}

export async function connectFreighter(): Promise<string> {
  // Request access if not already allowed
  const allowed = await isAllowed();
  if (!allowed.isAllowed) {
    await setAllowed();
  }
  const result = await getAddress();
  if (result.error) throw new Error(String(result.error));
  return result.address;
}

export async function getFreighterPublicKey(): Promise<string | null> {
  try {
    const connected = await isConnected();
    if (!connected.isConnected) return null;
    const allowed = await isAllowed();
    if (!allowed.isAllowed) return null;
    const result = await getAddress();
    if (result.error) return null;
    return result.address;
  } catch {
    return null;
  }
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
