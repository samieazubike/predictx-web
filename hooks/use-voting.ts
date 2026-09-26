"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, type Poll } from "@/lib/mock-data";
import { useMockData } from "@/hooks/use-mock-data";
import { useStaking } from "@/hooks/use-staking";
import { isVotingOpen } from "@/lib/calculations";

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
        const { polls, getMatch } = useMockData.getState();
        const { stakes } = useStaking.getState();
        const { userVotes } = get();

        // Staked poll IDs
        const stakedPollIds = new Set(stakes.map((s) => s.pollId));

        return polls.filter(
          (p) =>
            p.status === "voting" &&
            !stakedPollIds.has(p.id) &&
            !userVotes[p.id] &&
            // Exclude polls whose voting window has already closed. Without this
            // a completed match's polls stayed votable indefinitely — the
            // countdown beside the buttons read 00:00:00 while the vote still
            // succeeded and was paid out.
            isVotingOpen(p, getMatch(p.matchId)),
        );
      },


      getVoteReward: (pollId: string) => {
        const poll = useMockData.getState().getPoll(pollId);
        if (!poll) return 0;
        // 0.5% of total pool as reward
        return (poll.yesPool + poll.noPool) * 0.005;
      },

      castVote: async (pollId: string, decision: VoteDecision) => {
        /**
         * Re-checked at write time, not just at render time.
         *
         * This is the only check that cannot be bypassed: the card can be stale,
         * `availablePolls()` can be called by a component that rendered before
         * the deadline, and `poll.status` never transitions on its own. If the
         * window closed between opening the card and confirming, the vote must
         * not be recorded — and the reward must not be paid.
         */
        const { getPoll, getMatch } = useMockData.getState();
        const poll = getPoll(pollId);
        if (!poll) throw new Error("Poll not found");
        if (!isVotingOpen(poll, getMatch(poll.matchId))) {
          throw new Error("Voting has closed for this poll");
        }

        // Simulate network delay for the voting transaction
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Re-check after the await. The deadline can pass during those 800ms,
        // and this is the last point before the write lands.
        if (!isVotingOpen(poll, getMatch(poll.matchId))) {
          throw new Error("Voting has closed for this poll");
        }

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
