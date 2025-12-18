"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  isConnected: boolean
  address: string
  balance: number
  connect: () => void
  disconnect: () => void
  updateBalance: (amount: number) => void
}

export const useWallet = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      address: "",
      balance: 2500,
      connect: () =>
        set({
          isConnected: true,
          address: "0x742d...5e9f",
          balance: 2500,
        }),
      disconnect: () =>
        set({
          isConnected: false,
          address: "",
        }),
      updateBalance: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
        })),
    }),
    {
      name: "wallet-storage",
    },
  ),
)
