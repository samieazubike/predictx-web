"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MATCHES,
  POLLS,
  PLATFORM_STATS,
  STORAGE_KEYS,
  type Match,
  type Poll,
  type PlatformStats,
} from "@/lib/mock-data";

interface MockDataState {
  matches: Match[];
  polls: Poll[];
  platformStats: PlatformStats;
  getMatch: (id: string) => Match | undefined;
  getPolls: (matchId: string) => Poll[];
  getPoll: (pollId: string) => Poll | undefined;
  trendingPolls: () => Poll[];
  updatePollPool: (pollId: string, side: "yes" | "no", amount: number) => void;
  addPoll: (poll: Poll) => void;
}

export const useMockData = create<MockDataState>()(
  persist(
    (set, get) => ({
      matches: MATCHES,
      polls: POLLS,
      platformStats: PLATFORM_STATS,

      getMatch: (id) => get().matches.find((m) => m.id === id),

      getPolls: (matchId) => get().polls.filter((p) => p.matchId === matchId),

      getPoll: (pollId) => get().polls.find((p) => p.id === pollId),

      trendingPolls: () =>
        [...get().polls]
          .filter((p) => p.status === "active")
          .sort((a, b) => b.yesPool + b.noPool - (a.yesPool + a.noPool))
          .slice(0, 6),

      updatePollPool: (pollId, side, amount) =>
        set((s) => {
          const poll = s.polls.find((p) => p.id === pollId);

          if (!poll) {
            // Surfaced in development so numeric/legacy poll IDs from the old
            // hardcoded polls-list are caught immediately instead of silently
            // leaving every pool frozen.
            if (process.env.NODE_ENV !== "production") {
              console.warn(
                `[updatePollPool] Poll not found: "${pollId}". ` +
                  `No pool was updated. Available IDs: ${s.polls.map((p) => p.id).join(", ")}`,
              );
            }
            return s; // leave state unchanged — no silent no-op
          }

          return {
            polls: s.polls.map((p) =>
              p.id !== pollId
                ? p
                : {
                    ...p,
                    yesPool: side === "yes" ? p.yesPool + amount : p.yesPool,
                    noPool: side === "no" ? p.noPool + amount : p.noPool,
                    participants: p.participants + 1,
                  },
            ),
          };
        }),

      /** Prepend a newly-created poll so it appears immediately in all views. */
      addPoll: (poll) => set((s) => ({ polls: [poll, ...s.polls] })),
    }),
    { name: STORAGE_KEYS.pools },
  ),
);
