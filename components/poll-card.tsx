"use client"

import { useState } from "react"
import { Clock, Users, Info, Lock } from "lucide-react"
import { GamingButton } from "@/components/shared"
import { StakeModal } from "@/components/staking"
import type { Poll } from "@/lib/mock-data"

interface PollCardProps {
  poll: Poll & { timeLeft?: string }
  matchId: string
  matchName?: string
}

export function PollCard({ poll, matchId, matchName = "" }: PollCardProps) {
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [initialSide, setInitialSide] = useState<"yes" | "no">("yes")

  const total = poll.yesPool + poll.noPool
  const yesPercentage = total > 0 ? (poll.yesPool / total) * 100 : 50
  const noPercentage = 100 - yesPercentage

  const isActive = !poll.status || poll.status === "active"
  const isResolved = poll.status === "resolved"
  const isLocked = poll.status === "locked"
  const isVoting = poll.status === "voting"

  const openStake = (side: "yes" | "no") => {
    if (!isActive) return
    setInitialSide(side)
    setShowStakeModal(true)
  }

  return (
    <>
      <div
        className={[
          "bg-surface border-2 clip-corner-lg transition-all group relative overflow-hidden",
          isActive
            ? "border-border hover:border-primary hover:translate-y-[-2px] hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]"
            : "border-border/50",
          (isLocked || isResolved) ? "opacity-75" : "",
        ].filter(Boolean).join(" ")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        <div className="relative p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Question & Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded mb-2">
                    {poll.category.replace("_", " ")}
                  </div>
                  <h3 className="font-display text-lg md:text-xl lg:text-2xl font-bold text-foreground text-balance">{poll.question}</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded text-xs font-mono font-bold text-primary whitespace-nowrap">
                  <Clock className="h-4 w-4" />
                  {poll.timeLeft ?? poll.lockTime}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{poll.participants} stakers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span>Locks: {poll.lockTime}</span>
                </div>
              </div>

              {/* Pool Distribution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-success font-bold">YES</span>
                    <span className="text-muted-foreground mx-2">•</span>
                    <span className="text-foreground font-mono">${poll.yesPool.toLocaleString()}</span>
                    <span className="text-muted-foreground text-xs ml-2">({yesPercentage.toFixed(0)}%)</span>
                  </div>
                  <div className="text-sm text-right">
                    <span className="text-muted-foreground text-xs mr-2">({noPercentage.toFixed(0)}%)</span>
                    <span className="text-foreground font-mono">${poll.noPool.toLocaleString()}</span>
                    <span className="text-muted-foreground mx-2">•</span>
                    <span className="text-accent font-bold">NO</span>
                  </div>
                </div>

                {/* Visual progress bar */}
                <div className="relative h-4 bg-background-secondary rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-success/80 glow-green transition-all flex items-center justify-end pr-2"
                    style={{ width: `${yesPercentage}%` }}
                  >
                    {yesPercentage > 15 && (
                      <span className="text-[10px] font-bold text-background">{yesPercentage.toFixed(0)}%</span>
                    )}
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-accent to-accent/80 glow-magenta transition-all flex items-center justify-start pl-2"
                    style={{ width: `${noPercentage}%` }}
                  >
                    {noPercentage > 15 && (
                      <span className="text-[10px] font-bold text-background">{noPercentage.toFixed(0)}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stake Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:min-w-0 lg:min-w-[200px]">
              {isActive ? (
                <>
                  <GamingButton
                    variant="success"
                    size="lg"
                    onClick={() => openStake("yes")}
                    className="flex-1"
                  >
                    Stake YES →
                  </GamingButton>
                  <GamingButton
                    variant="danger"
                    size="lg"
                    onClick={() => openStake("no")}
                    className="flex-1"
                  >
                    Stake NO →
                  </GamingButton>
                </>
              ) : isLocked ? (
                <div className="flex items-center justify-center gap-2 py-4 text-accent font-bold uppercase tracking-wider text-sm">
                  <Lock className="h-4 w-4" />
                  Staking Closed
                </div>
              ) : isVoting ? (
                <div className="flex items-center justify-center gap-2 py-4 text-gold font-bold uppercase tracking-wider text-sm">
                  Awaiting Resolution
                </div>
              ) : isResolved && poll.outcome ? (
                <div
                  className={`flex items-center justify-center gap-2 py-4 font-bold uppercase tracking-wider text-sm ${
                    poll.outcome === "yes" ? "text-success" : "text-accent"
                  }`}
                >
                  {poll.outcome === "yes" ? "YES WON ✓" : "NO WON ✓"}
                </div>
              ) : (
                <GamingButton
                  variant="primary"
                  size="lg"
                  disabled
                  className="flex-1"
                >
                  Unavailable
                </GamingButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <StakeModal
        poll={poll}
        matchId={matchId}
        matchName={matchName}
        initialSide={initialSide}
        open={showStakeModal}
        onClose={() => setShowStakeModal(false)}
      />
    </>
  )
}
