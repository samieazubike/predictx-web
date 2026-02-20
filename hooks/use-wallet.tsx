"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConnectPayload {
  address: string;
  balance: number;
}

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  balance: number;

  connect: (payload: ConnectPayload) => Promise<void>;
  disconnect: () => void;
  updateBalance: (amount: number) => void;
}

export const useWallet = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      isConnecting: false,
      address: "",
      balance: 0,

      connect: async ({ address, balance }) => {
        set({ isConnecting: true });

        // simulate connection delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        set({
          isConnected: true,
          address,
          balance,
          isConnecting: false,
        });
      },

      disconnect: () =>
        set({
          isConnected: false,
          address: "",
          balance: 0,
          isConnecting: false,
        }),

      updateBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
        })),
    }),
    {
      name: "wallet-storage",
    }
  )
);