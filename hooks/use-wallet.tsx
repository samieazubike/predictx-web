"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  requestAccess,
  isConnected as checkFreighter,
  getNetworkDetails,
} from "@stellar/freighter-api";
import { XLM_USD_RATE } from "@/lib/constants";
import { fetchXLMBalance, NETWORK_PASSPHRASES, type StellarNetwork } from "@/lib/stellar";
import { toast } from "sonner";

// ── Error types ───────────────────────────────────────────────────────────

export type WalletErrorCode =
  | "NOT_INSTALLED"
  | "USER_DENIED"
  | "WRONG_NETWORK"
  | "UNKNOWN";

export class WalletError extends Error {
  constructor(
    public readonly code: WalletErrorCode,
    message: string
  ) {
    super(message);
    this.name = "WalletError";
  }
}

// ── Types ─────────────────────────────────────────────────────────────────

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

export type { StellarNetwork };

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  balance: number;          // XLM balance (live from Horizon)
  network: StellarNetwork;
  /** True when the Freighter wallet's active network ≠ the app's selected network */
  networkMismatch: boolean;
  /** Human-readable passphrase of the wallet's active network (from Freighter) */
  walletNetworkPassphrase: string;

  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
  switchNetwork: (network: StellarNetwork) => void;
  refreshBalance: () => Promise<void>;
  sendTransaction: (
    amountUSD: number,
    memo: string
  ) => Promise<TransactionReceipt>;
}

// ── Store ─────────────────────────────────────────────────────────────────

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      isConnecting: false,
      address: "",
      balance: 0,
      network: "testnet" as StellarNetwork,
      networkMismatch: false,
      walletNetworkPassphrase: "",

      // ── connect ──────────────────────────────────────────────────────────
      connect: async () => {
        set({ isConnecting: true });

        try {
          // 1. Check if Freighter is installed
          const status = await checkFreighter();
          const installed =
            typeof status === "boolean"
              ? status
              : typeof status === "object" && status !== null && "isConnected" in status
              ? true // extension present even if no account yet
              : false;

          if (!installed) {
            throw new WalletError(
              "NOT_INSTALLED",
              "Freighter is not installed. Please add the browser extension and try again."
            );
          }

          // 2. Request permission / public key
          const accessResponse = await requestAccess();

          if ((accessResponse as any)?.error) {
            const errMsg: string = (accessResponse as any).error;
            if (
              errMsg.toLowerCase().includes("denied") ||
              errMsg.toLowerCase().includes("rejected")
            ) {
              throw new WalletError("USER_DENIED", "Connection request was denied.");
            }
            throw new WalletError("UNKNOWN", errMsg);
          }

          const publicKey =
            typeof accessResponse === "string"
              ? accessResponse
              : (accessResponse as any)?.address ?? "";

          if (!publicKey) {
            throw new WalletError("UNKNOWN", "Failed to retrieve public key from Freighter.");
          }

          // 3. Read which network Freighter is currently on
          let walletPassphrase = "";
          try {
            const netDetails = await getNetworkDetails();
            walletPassphrase =
              typeof netDetails === "object" && netDetails !== null
                ? (netDetails as any).networkPassphrase ?? ""
                : "";
          } catch {
            // getNetworkDetails may not exist on all Freighter versions — ignore
          }

          const appNetwork = get().network;
          const appPassphrase = NETWORK_PASSPHRASES[appNetwork];
          const mismatch =
            walletPassphrase !== "" && walletPassphrase !== appPassphrase;

          // 4. Fetch live balance
          const balance = await fetchXLMBalance(publicKey, appNetwork);

          set({
            isConnected: true,
            address: publicKey,
            balance,
            networkMismatch: mismatch,
            walletNetworkPassphrase: walletPassphrase,
          });

          if (mismatch) {
            toast.warning("Network mismatch detected", {
              description: `Your Freighter wallet is on a different network than the app (${appNetwork}). Please switch networks in Freighter.`,
              duration: 8000,
            });
          }
        } catch (error) {
          if (error instanceof WalletError) {
            if (error.code === "NOT_INSTALLED") {
              toast.info("Freighter not installed", {
                description: error.message,
              });
            } else if (error.code === "USER_DENIED") {
              toast.error("Connection denied", {
                description: error.message,
              });
            } else {
              toast.error("Wallet connection failed", {
                description: error.message,
              });
            }
            // Re-throw so the modal can render the failure state
            throw error;
          }
          const msg =
            error instanceof Error ? error.message : "Unknown wallet error";
          toast.error("Wallet connection failed", { description: msg });
          throw new WalletError("UNKNOWN", msg);
        } finally {
          set({ isConnecting: false });
        }
      },

      // ── disconnect ────────────────────────────────────────────────────────
      disconnect: () =>
        set({
          isConnected: false,
          isConnecting: false,
          address: "",
          balance: 0,
          networkMismatch: false,
          walletNetworkPassphrase: "",
        }),

      // ── switchNetwork ─────────────────────────────────────────────────────
      switchNetwork: async (network: StellarNetwork) => {
        const { address, isConnected, walletNetworkPassphrase } = get();
        set({ network });

        // Re-check mismatch with the new app network
        const newPassphrase = NETWORK_PASSPHRASES[network];
        const mismatch =
          walletNetworkPassphrase !== "" &&
          walletNetworkPassphrase !== newPassphrase;

        set({ networkMismatch: mismatch });

        // Re-fetch balance from the new network
        if (isConnected && address) {
          const balance = await fetchXLMBalance(address, network);
          set({ balance });
        }

        toast.success(`Switched to ${network}`, {
          description:
            network === "mainnet"
              ? "You are now on Stellar Mainnet"
              : "You are now on Stellar Testnet",
        });
      },

      // ── refreshBalance ────────────────────────────────────────────────────
      refreshBalance: async () => {
        const { address, network, isConnected } = get();
        if (!isConnected || !address) return;
        const balance = await fetchXLMBalance(address, network);
        set({ balance });
      },

      // ── updateBalance (optimistic local adjustment) ────────────────────────
      updateBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
        })),

      // ── sendTransaction ───────────────────────────────────────────────────
      /**
       * Simulates a Stellar transaction for mock/SIMULATION_MODE operation.
       * Real contract calls go through lib/stellar.ts → stakeOnPoll().
       */
      sendTransaction: async (amountUSD, memo) => {
        const state = useWallet.getState();
        if (!state.isConnected || !state.address) {
          throw new WalletError("UNKNOWN", "Wallet not connected");
        }

        const amountXLM = amountUSD / XLM_USD_RATE;

        if (amountXLM > state.balance) {
          throw new WalletError("UNKNOWN", "Insufficient balance");
        }

        // Simulated latency
        await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

        // 5 % failure rate
        if (Math.random() < 0.05) {
          const reasons = [
            "Network congestion — try again shortly",
            "Transaction timeout — Stellar Horizon did not respond",
          ];
          throw new WalletError(
            "UNKNOWN",
            reasons[Math.floor(Math.random() * reasons.length)]
          );
        }

        const hashBytes = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0")
        ).join("");

        const receipt: TransactionReceipt = {
          hash: hashBytes,
          ledger: 50_000_000 + Math.floor(Math.random() * 1_000_000),
          fee: `100 stroops (0.0000100 XLM)`,
          from: state.address,
          to: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
          amount: amountUSD,
          amountXLM,
          timestamp: new Date().toISOString(),
        };

        // Optimistic balance deduction
        set((s) => ({ balance: s.balance - amountXLM }));

        return receipt;
      },
    }),
    {
      name: "wallet-storage",
    }
  )
);
