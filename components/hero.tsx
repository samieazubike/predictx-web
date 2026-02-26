"use client"

import { ArrowRight, Zap } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background-secondary to-background">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32 lg:px-8">
        <div className="text-center">
          {/* Energy badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-surface/50 backdrop-blur-sm animate-pulse-glow">
            <Zap className="h-4 w-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-gold uppercase tracking-wider">Live Prediction Markets</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-6">
            <span className="text-glow-cyan text-primary">Predict.</span>{" "}
            <span className="text-glow-green text-success">Stake.</span>{" "}
            <span className="text-glow-gold text-gold">Win.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10">
            Community-driven football prediction markets powered by blockchain. Stake on match events, vote on outcomes,
            and earn proportional rewards from the pool.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-background font-bold uppercase tracking-wider glow-cyan group h-14 px-8 transition-all hover:scale-105"
            >
              <Link href="#matches" className="flex items-center gap-2">
                Explore Markets
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary/50 hover:border-primary hover:bg-surface font-bold uppercase tracking-wider h-14 px-8 bg-transparent"
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>

          {/* Live stats ticker */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 text-center">
            <div className="px-4">
              <div className="text-2xl md:text-3xl font-display font-black text-primary text-glow-cyan counter">234</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Active Polls</div>
            </div>
            <div className="px-4">
              <div className="text-2xl md:text-3xl font-display font-black text-success text-glow-green counter">$847K</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Locked</div>
            </div>
            <div className="px-4">
              <div className="text-2xl md:text-3xl font-display font-black text-gold text-glow-gold counter">12.8K</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Community</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
