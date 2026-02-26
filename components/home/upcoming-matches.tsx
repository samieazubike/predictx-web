"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MatchCard } from "./match-card";
import { useMockData } from "@/hooks/use-mock-data";
import { GamingButton } from "@/components/shared/gaming-button";

export function UpcomingMatches() {
    const shouldReduceMotion = useReducedMotion();
    const matches = useMockData((state) => state.matches);
    const getPolls = useMockData((state) => state.getPolls);

    if (!matches || matches.length === 0) {
        return (
            <div id="matches" className="bg-background-secondary py-16 border-t border-primary/20">
                <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                    {/* Neon line art empty state */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 mb-6 rounded-full border-2 border-[var(--accent-cyan)] shadow-[0_0_20px_rgba(0,217,255,0.4)] flex items-center justify-center opacity-80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 12l2.5-2.5" />
                            <path d="M12 12l-2.5-2.5" />
                            <path d="M12 12l2.5 2.5" />
                            <path d="M12 12l-2.5 2.5" />
                            <path d="M12 2l2.5 2.5" />
                            <path d="M12 22l-2.5-2.5" />
                            <path d="M22 12l-2.5-2.5" />
                            <path d="M2 12l2.5 2.5" />
                        </svg>
                    </motion.div>
                    <h3 className="text-2xl font-display font-black uppercase text-foreground mb-2 shadow-text">
                        No Upcoming Matches
                    </h3>
                    <p className="text-muted-foreground mb-8">
                        Check back soon! New prediction markets are added regularly.
                    </p>
                    <GamingButton variant="primary">
                        Browse All Markets
                    </GamingButton>
                </div>
            </div>
        );
    }

    return (
        <div id="matches" className="bg-background-secondary py-16 border-t border-primary/20">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <motion.div
                        className="flex flex-col gap-2"
                        {...(shouldReduceMotion ? {} : {
                            initial: { opacity: 0, x: -20 },
                            whileInView: { opacity: 1, x: 0 },
                            viewport: { once: true },
                            transition: { duration: 0.4 },
                        })}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-[var(--accent-cyan)] shadow-[0_0_10px_rgba(0,217,255,0.8)]" />
                            <h2 className="font-display text-3xl font-black uppercase text-[var(--accent-cyan)] text-glow-cyan">
                                Upcoming Matches
                            </h2>
                        </div>
                        <p className="text-muted-foreground text-sm pl-4">
                            Pick a match and start predicting
                        </p>
                    </motion.div>

                    {/* Optional Filter Pills (Static mock for now, as requested) */}
                    <motion.div
                        className="flex flex-wrap gap-2"
                        {...(shouldReduceMotion ? {} : {
                            initial: { opacity: 0, x: 20 },
                            whileInView: { opacity: 1, x: 0 },
                            viewport: { once: true },
                            transition: { duration: 0.4, delay: 0.1 },
                        })}
                    >
                        {["All", "Live", "Today", "This Week"].map((filter, i) => (
                            <button
                                key={filter}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${i === 0
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-surface border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {matches.map((match, index) => {
                        const matchPolls = getPolls(match.id);
                        const totalPool = matchPolls.reduce((acc, p) => acc + p.yesPool + p.noPool, 0);

                        return (
                            <MatchCard
                                key={match.id}
                                match={match}
                                pollsCount={matchPolls.length}
                                totalPool={totalPool}
                                index={index}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
