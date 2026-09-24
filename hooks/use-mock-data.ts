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

/**
 * Merge freshly-computed MATCHES timestamps into persisted state.
 *
 * MATCHES is evaluated at module-load time (every page load), so its `kickoff`
 * values are always relative to *now*.  Persisted state may have stale ISO
 * strings from a previous session.  We overwrite only the time-sensitive
 * `kickoff` and `status` fields while preserving any pool mutations the user
 * made in-session (e.g. `score` updates from live matches — those stay).
 */
function refreshMatchTimestamps(persisted: Match[]): Match[] {
  const freshById = new Map(MATCHES.map((m) => [m.id, m]));
  return persisted.map((m) => {
    const fresh = freshById.get(m.id);
    if (!fresh) return m;
    return { ...m, kickoff: fresh.kickoff, status: fresh.status };
  });
}

export const useMockData = create<MockDataState>()(
  persist(
    (set, get) => ({
      // Seed initial state from the always-fresh source constants.
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
      addPoll: (poll) => set((s) => ({ polls: [poll, ...s.polls] })),
    }),
    {
      name: STORAGE_KEYS.pools,
      /**
       * After zustand rehydrates from localStorage, refresh any timestamps that
       * are relative to "now" so a returning user never sees frozen dates.
       * Poll statuses (active/locked/voting/resolved) are driven by match
       * status, so we re-seed those from the fresh constants too — only
       * preserving pool-size mutations the user accumulated.
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Refresh match kickoff/status fields from freshly-computed constants.
        state.matches = refreshMatchTimestamps(state.matches);

        // Re-seed polls: keep pool-size & participant mutations but take fresh
        // status from the source dataset so lock/voting progression is correct.
        const freshById = new Map(POLLS.map((p) => [p.id, p]));
        state.polls = state.polls.map((p) => {
          const fresh = freshById.get(p.id);
          if (!fresh) return p; // user-created poll — keep as-is
          return { ...p, status: fresh.status };
        });
      },
    },
  ),
);
