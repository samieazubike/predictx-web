"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	MOCK_USER,
	XLM_RATE,
	STORAGE_KEYS,
	type WalletProvider,
} from "@/lib/mock-data";

const STELLAR_FEE_XLM = 0.00001; // 100 stroops

export interface TxReceipt {
	hash: string;
	amount: number;
	amountXLM: number;
	description: string;
	timestamp: string;
}

interface WalletState {
	isConnected: boolean;
	isConnecting: boolean;
	address: string;
	displayAddress: string;
	balance: number; // USD
	balanceXLM: number;
	network: string;
	provider: WalletProvider | null;
	connect: (provider: WalletProvider) => Promise<void>;
	disconnect: () => void;
	sendTransaction: (amount: number, description: string) => Promise<TxReceipt>;
	updateBalance: (amountUSD: number) => void;
}

export const useWallet = create<WalletState>()(
	persist(
		(set, get) => ({
			isConnected: false,
			isConnecting: false,
			address: "",
			displayAddress: "",
			balance: MOCK_USER.balanceUSD,
			balanceXLM: MOCK_USER.balanceXLM,
			network: "Stellar Mainnet",
			provider: null,

			connect: async (provider) => {
				set({ isConnecting: true });
				// Simulate 1–2 s connection delay
				await new Promise((r) =>
					setTimeout(r, 1_000 + Math.random() * 1_000),
				);

				// 95 % success rate
				if (Math.random() < 0.05) {
					set({ isConnecting: false });
					throw new Error(
						`${provider} connection failed. Please try again.`,
					);
				}

				set({
					isConnecting: false,
					isConnected: true,
					provider,
					address: MOCK_USER.address,
					displayAddress: MOCK_USER.displayAddress,
					balance: MOCK_USER.balanceUSD,
					balanceXLM: MOCK_USER.balanceXLM,
					network: "Stellar Mainnet",
				});
			},

			disconnect: () => {
				set({
					isConnected: false,
					isConnecting: false,
					address: "",
					displayAddress: "",
					provider: null,
				});
				if (typeof window !== "undefined")
					localStorage.removeItem(STORAGE_KEYS.wallet);
			},

			sendTransaction: async (amount: number, description: string) => {
				const { balance } = get();
				if (amount > balance) throw new Error("Insufficient balance");

				// Simulate 1–2 s tx delay
				await new Promise((r) =>
					setTimeout(r, 1_000 + Math.random() * 1_000),
				);

				// 5 % random failure
				if (Math.random() < 0.05)
					throw new Error("Transaction failed. Please try again.");

				const hash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
					.map((b) => b.toString(16).padStart(2, "0"))
					.join("");

				const amountXLM = amount / XLM_RATE;

				set((s) => ({
					balance: s.balance - amount,
					balanceXLM: s.balanceXLM - amountXLM - STELLAR_FEE_XLM,
				}));

				return {
					hash,
					amount,
					amountXLM,
					description,
					timestamp: new Date().toISOString(),
				};
			},

			updateBalance: (amountUSD: number) =>
				set((s) => ({
					balance: s.balance + amountUSD,
					balanceXLM: s.balanceXLM + amountUSD / XLM_RATE,
				})),
		}),
		{ name: STORAGE_KEYS.wallet },
	),
);
