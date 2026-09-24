/**
 * Stellar SDK helpers and contract interaction layer.
 *
 * All Soroban contract calls go through this module. Set
 * SIMULATION_MODE = true (or the env var NEXT_PUBLIC_SIMULATION_MODE = "true")
 * to run against mock data without a live contract.
 */

import { MOCK_CONTRACT_ID, XLM_USD_RATE } from "@/lib/constants";

// ── Simulation flag ────────────────────────────────────────────────────────
/**
 * When true the app runs entirely against mock data — no real contract calls
 * or Freighter signing steps happen. Flip to false (or set the env var to
 * "false") once a live contract is deployed.
 */
export const SIMULATION_MODE: boolean =
  process.env.NEXT_PUBLIC_SIMULATION_MODE !== "false";

// ── Network configuration ──────────────────────────────────────────────────
export type StellarNetwork = "testnet" | "mainnet";

export const NETWORK_PASSPHRASES: Record<StellarNetwork, string> = {
  testnet: "Test SDF Network ; September 2015",
  mainnet: "Public Global Stellar Network ; September 2015",
};

export const HORIZON_URLS: Record<StellarNetwork, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

export const SOROBAN_RPC_URLS: Record<StellarNetwork, string> = {
  testnet: "https://soroban-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org", // placeholder until mainnet Soroban RPC is set
};

// ── Horizon balance fetch ──────────────────────────────────────────────────
/**
 * Fetch the native XLM balance of a Stellar account from Horizon.
 * Returns 0 on any error (account not found, network unreachable, etc.).
 */
export async function fetchXLMBalance(
  publicKey: string,
  network: StellarNetwork
): Promise<number> {
  try {
    const response = await fetch(
      `${HORIZON_URLS[network]}/accounts/${publicKey}`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    const native = (data.balances as Array<{ asset_type: string; balance: string }>).find(
      (b) => b.asset_type === "native"
    )?.balance;
    return parseFloat(native ?? "0");
  } catch {
    return 0;
  }
}

// ── Contract client (thin wrapper, no SDK dependency yet) ──────────────────
/**
 * Lightweight contract client wrapping PredictionMarket Soroban calls.
 *
 * In SIMULATION_MODE every method returns mock data immediately.
 * Outside simulation mode the methods build and submit real transactions
 * via Freighter (`@stellar/freighter-api` `signTransaction`) and the
 * Soroban RPC `sendTransaction` endpoint.
 *
 * NOTE: Full XDR construction requires `@stellar/stellar-sdk` which is not
 * yet installed. The non-simulation paths below show the intended integration
 * shape and will throw in the meantime — set SIMULATION_MODE = true for all
 * non-mock environments until the SDK is wired in.
 */

export interface PoolInfo {
  pollId: string;
  yesPool: number;   // USD display value (converted from stroops)
  noPool: number;
  participants: number;
  status: "active" | "locked" | "voting" | "resolved" | "cancelled";
  outcome?: "yes" | "no" | null;
  resolvedAt?: string;
}

export interface StakeParams {
  pollId: string;
  side: "yes" | "no";
  amountUSD: number;
  walletAddress: string;
  network: StellarNetwork;
}

export interface StakeResult {
  txHash: string;
  ledger: number;
  fee: string;
}

/**
 * Read pool info for a single poll from the contract.
 * In SIMULATION_MODE returns a mock object.
 */
export async function getPoolInfo(
  pollId: string,
  network: StellarNetwork
): Promise<PoolInfo | null> {
  if (SIMULATION_MODE) {
    // Mock: return null so callers fall back to Zustand store
    return null;
  }

  // Non-simulation: Soroban view call via RPC (requires @stellar/stellar-sdk)
  throw new Error(
    "Soroban RPC calls require @stellar/stellar-sdk — set SIMULATION_MODE=true"
  );
}

/**
 * Check whether a given wallet has already staked on a poll.
 * In SIMULATION_MODE always returns false.
 */
export async function hasUserStaked(
  pollId: string,
  walletAddress: string,
  network: StellarNetwork
): Promise<boolean> {
  if (SIMULATION_MODE) return false;

  throw new Error(
    "Soroban RPC calls require @stellar/stellar-sdk — set SIMULATION_MODE=true"
  );
}

/**
 * Submit a `stake` transaction to the PredictionMarket contract.
 *
 * In SIMULATION_MODE:
 *   - Simulates a 1-2 s network delay.
 *   - Returns a mock receipt with a random tx hash.
 *   - 5 % chance of simulated failure.
 *
 * Outside SIMULATION_MODE:
 *   - Builds the Soroban invocation XDR.
 *   - Signs via Freighter `signTransaction`.
 *   - Submits to the RPC `sendTransaction` endpoint.
 *   - Polls `getTransactionStatus` until confirmed or failed.
 */
export async function stakeOnPoll(params: StakeParams): Promise<StakeResult> {
  if (SIMULATION_MODE) {
    // Simulated latency
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

    // 5 % simulated failure
    if (Math.random() < 0.05) {
      throw new Error("Network congestion — try again shortly");
    }

    const hashBytes = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0")
    ).join("");

    return {
      txHash: hashBytes,
      ledger: 50_000_000 + Math.floor(Math.random() * 1_000_000),
      fee: `100 stroops (0.0000100 XLM)`,
    };
  }

  // Non-simulation path (requires @stellar/stellar-sdk + Freighter)
  throw new Error(
    "On-chain staking requires @stellar/stellar-sdk — set SIMULATION_MODE=true"
  );
}

/**
 * Fetch platform-wide stats from the contract.
 * In SIMULATION_MODE returns null so callers use the mock store.
 */
export async function getPlatformStats(
  network: StellarNetwork
): Promise<{ totalValueLocked: number; activePredictions: number; totalPayouts: number } | null> {
  if (SIMULATION_MODE) return null;

  throw new Error(
    "Soroban RPC calls require @stellar/stellar-sdk — set SIMULATION_MODE=true"
  );
}

// ── Utility exports ────────────────────────────────────────────────────────
export { MOCK_CONTRACT_ID };
