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
}

export const useMockData = create<MockDataState>()(
	persist(
		(set, get) => ({
			matches: MATCHES,
			polls: POLLS,
			platformStats: PLATFORM_STATS,

			getMatch: (id) => get().matches.find((m) => m.id === id),

			getPolls: (matchId) =>
				get().polls.filter((p) => p.matchId === matchId),

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
									yesPool:
										side === "yes" ? p.yesPool + amount : p.yesPool,
									noPool: side === "no" ? p.noPool + amount : p.noPool,
									participants: p.participants + 1,
								},
					),
				})),
		}),
		{ name: STORAGE_KEYS.pools },
	),
);
