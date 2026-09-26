"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, type Poll } from "@/lib/mock-data";
import { useMockData } from "@/hooks/use-mock-data";
import { useStaking } from "@/hooks/use-staking";
import { VOTER_REWARD_MIN } from "@/lib/constants";

export type VoteDecision = "yes" | "no" | "unclear";

interface VotingState {
  userVotes: Record<string, VoteDecision>;
  userEarnings: number;
  availablePolls: () => Poll[];
  getVoteReward: (pollId: string) => number;
  castVote: (pollId: string, decision: VoteDecision) => Promise<void>;
  getAccuracy: () => number;
}

export const useVoting = create<VotingState>()(
  persist(
    (set, get) => ({
      userVotes: {},
      userEarnings: 0,

      availablePolls: () => {
        const { polls } = useMockData.getState();
        const { stakes } = useStaking.getState();
        const { userVotes } = get();

        // Staked poll IDs
        const stakedPollIds = new Set(stakes.map((s) => s.pollId));

        return polls.filter(
          (p) =>
            p.status === "voting" &&
            !stakedPollIds.has(p.id) &&
            !userVotes[p.id],
        );
      },

      getVoteReward: (pollId: string) => {
        const poll = useMockData.getState().getPoll(pollId);
        if (!poll) return 0;
        // VOTER_REWARD_MIN (0.5%) of total pool as reward
        return (poll.yesPool + poll.noPool) * VOTER_REWARD_MIN;
      },

      castVote: async (pollId: string, decision: VoteDecision) => {
        // Simulate network delay for the voting transaction
        await new Promise((resolve) => setTimeout(resolve, 800));

        const reward = get().getVoteReward(pollId);

        set((state) => ({
          userVotes: { ...state.userVotes, [pollId]: decision },
          userEarnings: state.userEarnings + reward,
        }));
      },

      getAccuracy: () => {
        // Mock accuracy since we don't have historical resolution mapped back to user votes perfectly yet
        const votesCast = Object.keys(get().userVotes).length;
        if (votesCast === 0) return 0;
        // Mocking a high accuracy for UI demonstration
        return 89;
      },
    }),
    { name: STORAGE_KEYS.votes },
  ),
);
