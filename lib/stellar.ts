import {
  Horizon,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Asset,
  Memo,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { HORIZON_URL } from "./constants";

const server = new Horizon.Server(HORIZON_URL);

export interface AccountBalance {
  xlm: string;    // formatted, e.g. "125.4200000"
  xlmRaw: string; // raw string from API
}

export async function fetchAccountBalance(publicKey: string): Promise<AccountBalance> {
  const account = await server.loadAccount(publicKey);
  const nativeBalance = account.balances.find(b => b.asset_type === "native");
  const balance = (nativeBalance as any)?.balance ?? null;
  if (!balance) {
    throw new Error("No XLM balance found for this account");
  }
  return {
    xlm: balance,
    xlmRaw: balance,
  };
}

export function formatXLM(raw: string): string {
  const num = parseFloat(raw);
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}

export interface SendResult {
  success: boolean;
  txHash: string | null;
  error: string | null;
}

export async function sendXLM(
  senderPublicKey: string,
  destinationAddress: string,
  amount: string,
  memo?: string
): Promise<SendResult> {
  // Load sender account for sequence number
  const senderAccount = await server.loadAccount(senderPublicKey);

  // Build transaction
  const transaction = new TransactionBuilder(senderAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: destinationAddress,
        asset: Asset.native(),
        amount: amount,
      })
    )
    .addMemo(memo ? Memo.text(memo) : Memo.none())
    .setTimeout(30)
    .build();

  // Sign with Freighter
  const xdrString = transaction.toXDR();
  const signResult = await signTransaction(xdrString, {
    networkPassphrase: Networks.TESTNET,
  });

  if (signResult.error) {
    throw new Error(String(signResult.error));
  }

  // Reconstruct and submit the signed transaction
  const signedTx = TransactionBuilder.fromXDR(
    signResult.signedTxXdr,
    Networks.TESTNET
  );
  const response = await server.submitTransaction(signedTx);

  return {
    success: true,
    txHash: response.hash,
    error: null,
  };
}
