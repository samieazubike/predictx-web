"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { requestAccess, isConnected as checkFreighter } from "@stellar/freighter-api";

export interface ConnectPayload {
  address: string;
  balance: number;
}

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  balance: number;

  connect: () => Promise<void>;
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

      connect: async () => {
        set({ isConnecting: true });

        try {
          // 1. Check if installed
          const status = await checkFreighter();
          // Freighter v2 returns an object, v1 returned a boolean. This handles both!
          if (!status || (typeof status === 'object' && !status.isConnected)) {
            alert("Freighter is not installed. Please install the browser extension.");
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
          
          const response = await fetch(
            `https://horizon.stellar.org/accounts/${publicKey}`
          );
          
          if (!response.ok) {
            set({
              isConnected: true,
              address: publicKey,
              balance: 0,
            });
            return;
          }

          const data = await response.json();
          const nativeBalance = data.balances.find(
            (b: any) => b.asset_type === "native"
          )?.balance;

          set({
            isConnected: true,
            address: publicKey,
            balance: parseFloat(nativeBalance ?? "0"),
          });
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