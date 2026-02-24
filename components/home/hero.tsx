"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield,
  Activity,
  Users,
  Trophy,
} from "lucide-react";
import {
  GamingButton,
  GlowCard,
  AnimatedCounter,
  BackgroundEffects,
} from "@/components/shared";
import { cn } from "@/lib/utils";

const TAGLINE_WORDS = ["Predict.", "Stake.", "Win."];
const STAGGER_MS = 200;
const CYAN_GLOW = "#00d9ff";

const HERO_STATS = [
  {
    label: "Total Value Locked",
    value: 847293,
    prefix: "$",
    format: "number" as const,
    icon: Shield,
  },
  {
    label: "Active Predictions",
    value: 234,
    prefix: "",
    format: "number" as const,
    icon: Activity,
  },
  {
    label: "Community Members",
    value: 12847,
    prefix: "",
    format: "number" as const,
    icon: Users,
  },
  {
    label: "Total Payouts",
    value: 3200000,
    prefix: "$",
    format: "compact" as const,
    icon: Trophy,
  },
] as const;

function scrollToMatches() {
  document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const router = useRouter();
  const [statsReady, setStatsReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setStatsReady(true);
    });
    return () => cancelAnimationFrame(t);
  }, []);

  const staggerDelay = reduceMotion ? 0 : STAGGER_MS / 1000;
  const contentDelay = (ms: number) => (reduceMotion ? 0 : ms / 1000);

  return (
    <section
      className={cn(
        "relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden md:min-h-[80vh]"
      )}
      aria-label="Hero"
    >
      <BackgroundEffects className="z-0" />

      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(5, 7, 20, 0.6) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        {/* Tagline — staggered slide up + fade, electric cyan glow, optional glitch */}
        <h1
          className={cn(
            "font-display text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
            "hero-tagline"
          )}
          style={{
            textShadow: `0 0 20px ${CYAN_GLOW}, 0 0 40px ${CYAN_GLOW}80, 0 0 60px ${CYAN_GLOW}40`,
          }}
        >
          {TAGLINE_WORDS.map((word, i) => (
            <motion.span
              key={word}
              className="hero-tagline-word inline-block"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: i * staggerDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                textShadow: `0 0 20px ${CYAN_GLOW}, 0 0 40px ${CYAN_GLOW}80`,
              }}
            >
              {word}
              {i < TAGLINE_WORDS.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle — Barlow, font-light, text-white/70 */}
        <motion.p
          className="font-body mt-6 max-w-2xl text-base font-light leading-relaxed text-white/70 sm:text-lg md:mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: contentDelay(300), ease: "easeOut" }}
        >
          The community-driven football prediction market on Stellar. Create
          polls, stake crypto on match events, and earn rewards for accurate
          predictions.
        </motion.p>

        {/* CTAs — delay 500ms */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: contentDelay(500), ease: "easeOut" }}
        >
          <GamingButton
            variant="primary"
            size="lg"
            onClick={scrollToMatches}
            className="hero-cta-primary min-w-[200px]"
          >
            Explore Matches
          </GamingButton>
          <GamingButton
            variant="ghost"
            size="lg"
            onClick={() => router.push("/how-it-works")}
            className="min-w-[200px]"
          >
            How It Works
          </GamingButton>
        </motion.div>

        {/* Hero Stats Bar — delay 700ms, 2×2 grid on mobile, row on desktop */}
        <motion.div
          className="mt-12 w-full max-w-4xl sm:mt-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: contentDelay(700), ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-0">
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col items-center justify-center",
                  index > 0 && "md:border-l md:border-white/10"
                )}
              >
                <GlowCard
                  variant={stat.label === "Total Payouts" ? "gold" : "default"}
                  animated={false}
                  className="w-full border border-white/10 bg-[#0f1424]/90 py-4 md:py-5 md:px-4"
                >
                  <div className="flex flex-col items-center gap-1">
                    <stat.icon
                      className="h-5 w-5 text-[var(--accent-cyan)] md:h-6 md:w-6"
                      aria-hidden
                    />
                    <span className="font-mono text-lg font-semibold tabular-nums text-white md:text-xl">
                      <AnimatedCounter
                        value={statsReady ? stat.value : 0}
                        prefix={stat.prefix}
                        format={stat.format}
                        duration={1.2}
                        className="text-inherit"
                      />
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                      {stat.label}
                    </span>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
