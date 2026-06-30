/**
 * Typed error system for StellarSplit.
 *
 * Level 2 requires 3 explicit error types:
 *   1. WalletNotFoundError   — extension not installed
 *   2. UserRejectedError     — user cancelled in wallet popup
 *   3. InsufficientBalanceError — not enough XLM
 */

export class WalletNotFoundError extends Error {
  readonly type = "WALLET_NOT_FOUND" as const;
  constructor(walletName = "Wallet") {
    super(`${walletName} is not installed. Install it and try again.`);
    this.name = "WalletNotFoundError";
  }
}

export class UserRejectedError extends Error {
  readonly type = "USER_REJECTED" as const;
  constructor(action = "Request") {
    super(`${action} was rejected. You can try again when ready.`);
    this.name = "UserRejectedError";
  }
}

export class InsufficientBalanceError extends Error {
  readonly type = "INSUFFICIENT_BALANCE" as const;
  constructor() {
    super("Insufficient balance. Fund your account and try again.");
    this.name = "InsufficientBalanceError";
  }
}

export type AppError =
  | WalletNotFoundError
  | UserRejectedError
  | InsufficientBalanceError
  | Error;

/** Map a raw error from any wallet/SDK into a typed AppError */
export function classifyError(err: unknown): AppError {
  const msg =
    err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();

  // Wallet not found / not installed
  if (
    msg.includes("not found") ||
    msg.includes("not installed") ||
    msg.includes("no wallet") ||
    msg.includes("extension") ||
    msg.includes("undefined") && msg.includes("wallet")
  ) {
    return new WalletNotFoundError();
  }

  // User rejected / declined
  if (
    msg.includes("user declined") ||
    msg.includes("user rejected") ||
    msg.includes("rejected") ||
    msg.includes("declined") ||
    msg.includes("cancelled") ||
    msg.includes("canceled") ||
    msg.includes("denied")
  ) {
    return new UserRejectedError();
  }

  // Insufficient balance / funds
  if (
    msg.includes("insufficient") ||
    msg.includes("underfunded") ||
    msg.includes("not enough") ||
    msg.includes("op_underfunded")
  ) {
    return new InsufficientBalanceError();
  }

  return err instanceof Error ? err : new Error(String(err));
}

/** Get a user-facing message from any AppError */
export function getErrorMessage(err: AppError): string {
  return err.message;
}

/** Get the error type string for UI differentiation */
export function getErrorType(
  err: AppError
): "WALLET_NOT_FOUND" | "USER_REJECTED" | "INSUFFICIENT_BALANCE" | "UNKNOWN" {
  if (err instanceof WalletNotFoundError) return "WALLET_NOT_FOUND";
  if (err instanceof UserRejectedError) return "USER_REJECTED";
  if (err instanceof InsufficientBalanceError) return "INSUFFICIENT_BALANCE";
  return "UNKNOWN";
}
