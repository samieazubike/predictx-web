"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_STAKES, STORAGE_KEYS, type Stake } from "@/lib/mock-data";
import {
	calculatePotentialWinnings,
	type WinningsCalculation,
} from "@/lib/calculations";
import { useMockData } from "@/hooks/use-mock-data";
import { useWallet } from "@/hooks/use-wallet";

interface StakingState {
	stakes: Stake[];
	activeStakes: () => Stake[];
	pendingStakes: () => Stake[];
	completedStakes: () => Stake[];
	placeStake: (
		pollId: string,
		matchId: string,
		matchName: string,
		question: string,
		side: "yes" | "no",
		amount: number,
	) => Promise<Stake>;
	calculateWinnings: (
		amount: number,
		side: "yes" | "no",
		yesPool: number,
		noPool: number,
	) => WinningsCalculation;
}

export const useStaking = create<StakingState>()(
	persist(
		(set, get) => ({
			stakes: MOCK_STAKES,

			activeStakes: () => get().stakes.filter((s) => s.status === "active"),
			pendingStakes: () =>
				get().stakes.filter((s) => s.status === "pending_resolution"),
			completedStakes: () =>
				get().stakes.filter((s) => s.status === "completed"),

			placeStake: async (
				pollId,
				matchId,
				matchName,
				question,
				side,
				amount,
			) => {
				const receipt = await useWallet
					.getState()
					.sendTransaction(
						amount,
						`Staked $${amount} on "${question}" – ${side.toUpperCase()}`,
					);

				useMockData.getState().updatePollPool(pollId, side, amount);

				const stake: Stake = {
					id: `stake-${receipt.hash.slice(0, 8)}`,
					pollId,
					matchId,
					matchName,
					question,
					side,
					amount,
					status: "active",
				};

				set((s) => ({ stakes: [...s.stakes, stake] }));
				return stake;
			},

			calculateWinnings: (amount, side, yesPool, noPool) =>
				calculatePotentialWinnings(amount, side, yesPool, noPool),
		}),
		{ name: STORAGE_KEYS.stakes },
	),
);
