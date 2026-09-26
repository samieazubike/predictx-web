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
  /** Number of polls created by the current user (incremented on each addPoll call). */
  userCreatedPollCount: number;
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
      userCreatedPollCount: 0,

      getMatch: (id) => get().matches.find((m) => m.id === id),

      getPolls: (matchId) => get().polls.filter((p) => p.matchId === matchId),

      getPoll: (pollId) => get().polls.find((p) => p.id === pollId),

      trendingPolls: () =>
        [...get().polls]
          .filter((p) => p.status === "active")
          .sort((a, b) => b.yesPool + b.noPool - (a.yesPool + a.noPool))
          .slice(0, 6),

      updatePollPool: (pollId, side, amount) =>
        set((s) => ({
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
        })),

      /** Prepend a newly-created poll so it appears immediately in all views. */
      addPoll: (poll) =>
        set((s) => ({
          polls: [poll, ...s.polls],
          userCreatedPollCount: s.userCreatedPollCount + 1,
        })),
    }),
    { name: STORAGE_KEYS.pools },
  ),
);
