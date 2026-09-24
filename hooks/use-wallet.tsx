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
import { analytics } from "@/lib/analytics";

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

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  balance: number;
  network: StellarNetwork;

  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
  switchNetwork: (network: StellarNetwork) => void;
  sendTransaction: (
    amountUSD: number,
    memo: string,
  ) => Promise<TransactionReceipt>;
}

const HORIZON_URLS: Record<StellarNetwork, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

/** Fetch native XLM balance from Horizon for the given network */
async function fetchBalance(publicKey: string, network: StellarNetwork): Promise<number> {
  try {
    const response = await fetch(
      `${HORIZON_URLS[network]}/accounts/${publicKey}`
    );
    if (!response.ok) return 0;
    const data = await response.json();
    const native = data.balances.find(
      (b: any) => b.asset_type === "native"
    )?.balance;
    return parseFloat(native ?? "0");
  } catch {
    return 0;
  }
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      isConnecting: false,
      address: "",
      balance: 0,
      network: "testnet" as StellarNetwork,

      connect: async () => {
        set({ isConnecting: true });

        try {
          // 1. Check if installed
          const status = await checkFreighter();
          // Freighter v2 returns an object, v1 returned a boolean. This handles both!
          if (!status || (typeof status === 'object' && !status.isConnected)) {
            toast.info("Freighter is not installed. Please install the browser extension.");
            return;
          }

          const accessResponse = await requestAccess();
          
          if ((accessResponse as any).error) {
            throw new Error((accessResponse as any).error);
          }

          const publicKey = typeof accessResponse === "string" 
            ? accessResponse 
            : (accessResponse as any).address;

          if (!publicKey) {
            throw new Error("Failed to retrieve public key");
          }

          const currentNetwork = get().network;
          const balance = await fetchBalance(publicKey, currentNetwork);

          set({
            isConnected: true,
            address: publicKey,
            balance,
          });

          analytics.trackWalletConnect(publicKey, currentNetwork);
        } catch (error) {
          console.error("Freighter connect error:", error);
          throw error;
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnect: () => {
        analytics.trackWalletDisconnect();
        set({
          isConnected: false,
          address: "",
          balance: 0,
          isConnecting: false,
        });
      },

      switchNetwork: async (network: StellarNetwork) => {
        const { address, isConnected } = get();
        set({ network });

        // Re-fetch balance from the new network's Horizon
        if (isConnected && address) {
          const balance = await fetchBalance(address, network);
          set({ balance });
        }

        toast.success(`Switched to ${network}`, {
          description: network === "mainnet"
            ? "You are now on Stellar Mainnet"
            : "You are now on Stellar Testnet",
        });
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
    }
  )
);