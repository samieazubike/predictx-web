"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, type Poll } from "@/lib/mock-data";
import { useMockData } from "@/hooks/use-mock-data";
import { useStaking } from "@/hooks/use-staking";

export type VoteDecision = "yes" | "no" | "unclear";

export interface VoteTally {
  yes: number;
  no: number;
  unclear: number;
  total: number;
}

interface VotingState {
  userVotes: Record<string, VoteDecision>;
  userEarnings: number;
  communityVotes: Record<string, VoteDecision[]>; // Track all simulated community votes
  availablePolls: () => Poll[];
  getVoteReward: (pollId: string) => number;
  getTally: (pollId: string) => VoteTally;
  castVote: (pollId: string, decision: VoteDecision) => Promise<void>;
  getAccuracy: () => number;
  initializeMockVotes: () => void;
}

// Pre-seeded mock community votes for each poll (for initial load)
const MOCK_COMMUNITY_VOTES: Record<string, VoteDecision[]> = {
  "m6-p1": ["yes", "yes", "yes", "yes", "yes", "yes", "no", "no", "unclear"], // Everton win - lean yes
  "m6-p2": ["yes", "no", "yes", "no", "yes", "no", "yes", "unclear"], // Over 2.5 goals - mixed
  "m6-p3": ["no", "no", "no", "no", "no", "yes", "no", "unclear"], // Red card - mostly no
  "m6-p4": ["yes", "yes", "yes", "no", "no", "no", "unclear"], // Both teams score - slight lean yes
  "m6-p5": ["no", "no", "yes", "no", "unclear", "no", "yes"], // VAR review - lean no
  "m5-p1": ["yes", "yes", "yes", "yes", "yes", "no", "unclear"], // Brighton win - mostly yes
  "m5-p2": ["yes", "yes", "no", "yes", "no", "no", "unclear"], // Over 2.5 goals - mixed
  "m5-p3": ["yes", "no", "yes", "yes", "no", "no", "unclear"], // VAR review - mixed
  "m5-p4": ["no", "no", "yes", "no", "unclear", "no"], // Both score - mostly no
};

export const useVoting = create<VotingState>()(
  persist(
    (set, get) => ({
      userVotes: {},
      userEarnings: 0,
      communityVotes: MOCK_COMMUNITY_VOTES,

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
        // 0.5% of total pool as reward
        return (poll.yesPool + poll.noPool) * 0.005;
      },

      getTally: (pollId: string) => {
        const { communityVotes, userVotes } = get();
        const allVotes = [...(communityVotes[pollId] || [])];
        
        // Add user's vote if they voted on this poll
        if (userVotes[pollId]) {
          allVotes.push(userVotes[pollId]);
        }

        const tally = {
          yes: allVotes.filter((v) => v === "yes").length,
          no: allVotes.filter((v) => v === "no").length,
          unclear: allVotes.filter((v) => v === "unclear").length,
          total: allVotes.length,
        };

        return tally;
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

      initializeMockVotes: () => {
        // This is called during store initialization to ensure mock votes are loaded
        set((state) => ({
          communityVotes: { ...MOCK_COMMUNITY_VOTES, ...state.communityVotes },
        }));
      },
    }),
    { name: STORAGE_KEYS.votes },
  ),
);
