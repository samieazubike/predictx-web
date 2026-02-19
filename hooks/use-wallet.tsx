"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ConnectPayload {
  address: string
  balance: number
}

interface WalletState {

  isConnected: boolean

  address: string

  balance: number

  connect: (payload: ConnectPayload) => void

  disconnect: () => void

  updateBalance: (amount: number) => void

}

export const useWallet = create<WalletState>()(

  persist(

    (set) => ({

      isConnected: false,

      address: "",

      balance: 0,

      connect: ({ address, balance }) =>

        set({

          isConnected: true,

          address,

          balance,

        }),

      disconnect: () =>

        set({

          isConnected: false,

          address: "",

          balance: 0,

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
