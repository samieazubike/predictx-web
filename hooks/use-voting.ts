"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	MOCK_VOTING_OPPORTUNITIES,
	STORAGE_KEYS,
	type VotingOpportunity,
} from "@/lib/mock-data";
import { useWallet } from "@/hooks/use-wallet";

export type VoteChoice = "yes" | "no";

export interface VoteRecord {
	pollId: string;
	matchName: string;
	question: string;
	vote: VoteChoice;
	reward: number;
	timestamp: string;
}

interface VotingState {
	availablePolls: VotingOpportunity[];
	votingHistory: VoteRecord[];
	hasVoted: (pollId: string) => boolean;
	getVoteReward: (pollId: string) => number;
	castVote: (pollId: string, vote: VoteChoice) => Promise<VoteRecord>;
}

export const useVoting = create<VotingState>()(
	persist(
		(set, get) => ({
			availablePolls: MOCK_VOTING_OPPORTUNITIES,
			votingHistory: [],

			hasVoted: (pollId) =>
				get().votingHistory.some((v) => v.pollId === pollId),

			getVoteReward: (pollId) =>
				get().availablePolls.find((p) => p.pollId === pollId)?.reward ?? 0,

			castVote: async (pollId, vote) => {
				const opp = get().availablePolls.find((p) => p.pollId === pollId);
				if (!opp) throw new Error("Poll not found");
				if (get().hasVoted(pollId))
					throw new Error("Already voted on this poll");

				await new Promise((r) => setTimeout(r, 800));

				const record: VoteRecord = {
					pollId,
					matchName: opp.matchName,
					question: opp.question,
					vote,
					reward: opp.reward,
					timestamp: new Date().toISOString(),
				};

				// Credit reward to wallet
				useWallet.getState().updateBalance(opp.reward);

				set((s) => ({
					votingHistory: [...s.votingHistory, record],
					availablePolls: s.availablePolls.filter(
						(p) => p.pollId !== pollId,
					),
				}));

				return record;
			},
		}),
		{ name: STORAGE_KEYS.votes },
	),
);
