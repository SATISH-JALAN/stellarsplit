import {
  StellarWalletsKit,
  Networks,
  type ISupportedWallet,
} from "@creit.tech/stellar-wallets-kit";
import {
  FreighterModule,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit/modules/freighter";
import {
  xBullModule,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit/modules/xbull";
import {
  LobstrModule,
  LOBSTR_ID,
} from "@creit.tech/stellar-wallets-kit/modules/lobstr";

export { FREIGHTER_ID, XBULL_ID, LOBSTR_ID };
export type { ISupportedWallet };

let initialized = false;

export function initKit(): void {
  if (initialized) return;
  StellarWalletsKit.init({
    network: Networks.TESTNET,
    selectedWalletId: FREIGHTER_ID,
    modules: [
      new FreighterModule(),
      new xBullModule(),
      new LobstrModule(),
    ],
  });
  initialized = true;
}

export async function getSupportedWallets(): Promise<ISupportedWallet[]> {
  initKit();
  return StellarWalletsKit.refreshSupportedWallets();
}

export function selectWallet(id: string): void {
  initKit();
  StellarWalletsKit.setWallet(id);
}

export async function getPublicKeyFromKit(): Promise<string> {
  initKit();
  // fetchAddress() talks directly to the extension (triggers permission popup if needed)
  // getAddress() only reads from kit memory — empty on first connect
  const { address } = await StellarWalletsKit.fetchAddress();
  return address;
}

export async function signTransactionWithKit(
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  initKit();
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase,
  });
  return signedTxXdr;
}

export async function disconnectKit(): Promise<void> {
  if (!initialized) return;
  await StellarWalletsKit.disconnect();
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}
