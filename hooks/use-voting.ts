"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, type Poll } from "@/lib/mock-data";
import { useMockData } from "@/hooks/use-mock-data";
import { useStaking } from "@/hooks/use-staking";
import { useWallet } from "@/hooks/use-wallet";

export type VoteDecision = "yes" | "no" | "unclear";

/**
 * Votes are stored as a nested map:  { [walletAddress]: { [pollId]: decision } }
 * This means switching wallets never leaks one user's vote history to another.
 */
interface VotingState {
  allVotes: Record<string, Record<string, VoteDecision>>;
  userEarnings: number;

  /** Votes cast by the currently-connected wallet. */
  userVotes: () => Record<string, VoteDecision>;

  availablePolls: () => Poll[];
  getVoteReward: (pollId: string) => number;
  castVote: (pollId: string, decision: VoteDecision) => Promise<void>;
  getAccuracy: () => number;

  /** Remove all votes stored for a given wallet address (called on disconnect). */
  clearWalletVotes: (address: string) => void;
}

export const useVoting = create<VotingState>()(
  persist(
    (set, get) => ({
      allVotes: {},
      userEarnings: 0,

      userVotes: () => {
        const address = useWallet.getState().address;
        if (!address) return {};
        return get().allVotes[address] ?? {};
      },

      availablePolls: () => {
        const { polls } = useMockData.getState();
        const { stakes } = useStaking.getState();
        const address = useWallet.getState().address;
        if (!address) return [];

        // Only count stakes from the current wallet
        const stakedPollIds = new Set(
          stakes.filter((s) => s.wallet === address).map((s) => s.pollId),
        );

        const myVotes = get().allVotes[address] ?? {};

        return polls.filter(
          (p) =>
            p.status === "voting" &&
            !stakedPollIds.has(p.id) &&
            !myVotes[p.id],
        );
      },

      getVoteReward: (pollId: string) => {
        const poll = useMockData.getState().getPoll(pollId);
        if (!poll) return 0;
        // 0.5% of total pool as reward
        return (poll.yesPool + poll.noPool) * 0.005;
      },

      castVote: async (pollId: string, decision: VoteDecision) => {
        const address = useWallet.getState().address;
        if (!address) return;

        // Simulate network delay for the voting transaction
        await new Promise((resolve) => setTimeout(resolve, 800));

        const reward = get().getVoteReward(pollId);

        set((state) => ({
          allVotes: {
            ...state.allVotes,
            [address]: {
              ...(state.allVotes[address] ?? {}),
              [pollId]: decision,
            },
          },
          userEarnings: state.userEarnings + reward,
        }));
      },

      getAccuracy: () => {
        const address = useWallet.getState().address;
        if (!address) return 0;
        const votesCast = Object.keys(get().allVotes[address] ?? {}).length;
        if (votesCast === 0) return 0;
        // Mocking a high accuracy for UI demonstration
        return 89;
      },

      clearWalletVotes: (address: string) =>
        set((state) => {
          const updated = { ...state.allVotes };
          delete updated[address];
          return { allVotes: updated };
        }),
    }),
    { name: STORAGE_KEYS.votes },
  ),
);
