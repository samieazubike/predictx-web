"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { requestAccess, isConnected as checkFreighter } from "@stellar/freighter-api";
import {
  MOCK_CONTRACT_ID,
  STELLAR_BASE_FEE,
  XLM_USD_RATE,
} from "@/lib/constants";
import { formatAddress } from "@/lib/calculations";
import { toast } from "sonner";

export interface ConnectPayload {
  address: string;
  balance: number;
}

export interface TransactionReceipt {
  hash: string;
  ledger: number;
  fee: string;
  from: string;
  to: string;
  amount: number;
  amountXLM: number;
  timestamp: string;
}

export type StellarNetwork = "testnet" | "mainnet";

/** Discriminated status for balance lookups. */
export type BalanceStatus = "idle" | "loading" | "ok" | "error";

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  /** Last successfully fetched XLM balance. Never overwritten with 0 on a failed fetch. */
  balance: number;
  /** Indicates the result of the most-recent balance lookup. */
  balanceStatus: BalanceStatus;
  /**
   * Human-readable message when balanceStatus === "error".
   * e.g. "Account not found on mainnet — you may be on the wrong network."
   */
  balanceError: string | null;
  network: StellarNetwork;

  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
  switchNetwork: (network: StellarNetwork) => void;
  /** Manually re-fetch the balance for the current address + network. */
  refreshBalance: () => Promise<void>;
  sendTransaction: (
    amountUSD: number,
    memo: string,
  ) => Promise<TransactionReceipt>;
}

const HORIZON_URLS: Record<StellarNetwork, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

/**
 * Fetch native XLM balance from Horizon.
 *
 * Returns:
 *  - { ok: true, balance } on success
 *  - { ok: false, status, message } on any HTTP/network error so callers can
 *    distinguish a 404 (wrong network / unfunded) from a 5xx (server error).
 */
async function fetchBalance(
  publicKey: string,
  network: StellarNetwork,
): Promise<
  | { ok: true; balance: number }
  | { ok: false; status: number | null; message: string }
> {
  try {
    const response = await fetch(
      `${HORIZON_URLS[network]}/accounts/${publicKey}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          ok: false,
          status: 404,
          message:
            network === "mainnet"
              ? "Account not found on Mainnet — you may be connected to Testnet."
              : "Account not found on Testnet — this account may not be funded.",
        };
      }
      return {
        ok: false,
        status: response.status,
        message: `Horizon returned ${response.status}. Try again shortly.`,
      };
    }

    const data = await response.json();
    const native = data.balances?.find(
      (b: { asset_type: string; balance?: string }) =>
        b.asset_type === "native",
    )?.balance;

    return { ok: true, balance: parseFloat(native ?? "0") };
  } catch (err) {
    return {
      ok: false,
      status: null,
      message: "Network error — could not reach Horizon.",
    };
  }
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      isConnecting: false,
      address: "",
      balance: 0,
      balanceStatus: "idle",
      balanceError: null,
      network: "testnet" as StellarNetwork,

      connect: async () => {
        set({ isConnecting: true });

        try {
          // 1. Check if installed
          const status = await checkFreighter();
          // Freighter v2 returns an object, v1 returned a boolean. This handles both!
          if (
            !status ||
            (typeof status === "object" && !status.isConnected)
          ) {
            toast.info(
              "Freighter is not installed. Please install the browser extension.",
            );
            return;
          }

          const accessResponse = await requestAccess();

          if ((accessResponse as any).error) {
            throw new Error((accessResponse as any).error);
          }

          const publicKey =
            typeof accessResponse === "string"
              ? accessResponse
              : (accessResponse as any).address;

          if (!publicKey) {
            throw new Error("Failed to retrieve public key");
          }

          set({ balanceStatus: "loading", balanceError: null });

          const currentNetwork = get().network;
          const result = await fetchBalance(publicKey, currentNetwork);

          if (result.ok) {
            set({
              isConnected: true,
              address: publicKey,
              balance: result.balance,
              balanceStatus: "ok",
              balanceError: null,
            });
          } else {
            // Connected successfully but balance lookup failed — still mark as
            // connected; keep balance at 0 (initial) and surface the error.
            set({
              isConnected: true,
              address: publicKey,
              balanceStatus: "error",
              balanceError: result.message,
            });
            toast.warning("Wallet connected, but balance is unavailable.", {
              description: result.message,
            });
          }
        } catch (error) {
          console.error("Freighter connect error:", error);
          throw error;
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnect: () =>
        set({
          isConnected: false,
          address: "",
          balance: 0,
          isConnecting: false,
          balanceStatus: "idle",
          balanceError: null,
        }),

      switchNetwork: async (network: StellarNetwork) => {
        const { address, isConnected } = get();
        set({ network });

        if (isConnected && address) {
          set({ balanceStatus: "loading", balanceError: null });

          const result = await fetchBalance(address, network);

          if (result.ok) {
            // Only update balance on success — never overwrite with 0 on error.
            set({
              balance: result.balance,
              balanceStatus: "ok",
              balanceError: null,
            });
          } else {
            // Keep the last-known balance; surface the error instead.
            set({
              balanceStatus: "error",
              balanceError: result.message,
            });
            toast.warning("Balance unavailable on this network.", {
              description: result.message,
              action:
                network === "mainnet"
                  ? {
                      label: "Switch to Testnet",
                      onClick: () => get().switchNetwork("testnet"),
                    }
                  : undefined,
            });
          }
        }

        toast.success(`Switched to ${network}`, {
          description:
            network === "mainnet"
              ? "You are now on Stellar Mainnet"
              : "You are now on Stellar Testnet",
        });
      },

      refreshBalance: async () => {
        const { address, isConnected, network } = get();
        if (!isConnected || !address) return;

        set({ balanceStatus: "loading", balanceError: null });

        const result = await fetchBalance(address, network);

        if (result.ok) {
          set({
            balance: result.balance,
            balanceStatus: "ok",
            balanceError: null,
          });
        } else {
          // Preserve last-known balance; surface error.
          set({
            balanceStatus: "error",
            balanceError: result.message,
          });
          toast.error("Balance lookup failed", {
            description: result.message,
            action:
              network === "mainnet"
                ? {
                    label: "Switch to Testnet",
                    onClick: () => get().switchNetwork("testnet"),
                  }
                : undefined,
          });
        }
      },

      updateBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
        })),

      /**
       * Simulates a Stellar transaction. Returns a mock receipt with
       * a realistic tx hash, ledger number, stroops fee, etc.
       * 95 % chance of success, 5 % simulated failure (network congestion).
       */
      sendTransaction: async (amountUSD, memo) => {
        const state = useWallet.getState();
        if (!state.isConnected || !state.address) {
          throw new Error("Wallet not connected");
        }

        const amountXLM = amountUSD / XLM_USD_RATE;

        if (amountXLM > state.balance) {
          throw new Error("Insufficient balance");
        }

        // simulate network latency (1-2 s)
        await new Promise((r) =>
          setTimeout(r, 1000 + Math.random() * 1000),
        );

        // 5 % failure rate
        if (Math.random() < 0.05) {
          const reasons = [
            "Network congestion — try again shortly",
            "Transaction timeout — Stellar Horizon did not respond",
          ];
          throw new Error(
            reasons[Math.floor(Math.random() * reasons.length)],
          );
        }

        // build mock receipt
        const hashBytes = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0"),
        ).join("");

        const receipt: TransactionReceipt = {
          hash: hashBytes,
          ledger: 50_000_000 + Math.floor(Math.random() * 1_000_000),
          fee: `${STELLAR_BASE_FEE} stroops (${(STELLAR_BASE_FEE / 10_000_000).toFixed(7)} XLM)`,
          from: state.address,
          to: MOCK_CONTRACT_ID,
          amount: amountUSD,
          amountXLM,
          timestamp: new Date().toISOString(),
        };

        // deduct from wallet
        set((s) => ({ balance: s.balance - amountXLM }));

        return receipt;
      },
    }),
    {
      name: "wallet-storage",
      // Don't persist transient status — always start fresh on page load.
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
        balance: state.balance,
        network: state.network,
      }),
    },
  ),
);
