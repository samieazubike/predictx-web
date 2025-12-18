"use client"

import { useState } from "react"
import { Clock, Users, Info } from "lucide-react"
import { Button } from "./ui/button"
import { StakeModal } from "./stake-modal"

interface PollCardProps {
  poll: any
  matchId: string
}

export function PollCard({ poll, matchId }: PollCardProps) {
  const [showStakeModal, setShowStakeModal] = useState(false)
  const total = poll.yesPool + poll.noPool
  const yesPercentage = (poll.yesPool / total) * 100
  const noPercentage = (poll.noPool / total) * 100

  return (
    <>
      <div className="bg-surface border-2 border-border clip-corner-lg hover:border-primary transition-all group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Question & Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded mb-2">
                    {poll.category}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground text-balance">{poll.question}</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded text-xs font-mono font-bold text-primary whitespace-nowrap">
                  <Clock className="h-4 w-4" />
                  {poll.timeLeft}
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
            <div className="flex lg:flex-col gap-3 min-w-[200px]">
              <Button
                onClick={() => setShowStakeModal(true)}
                className="flex-1 bg-success hover:bg-success/90 text-background font-bold uppercase tracking-wider glow-green h-14 group/btn"
              >
                <span className="mr-2">Stake YES</span>
                <span className="text-lg transform group-hover/btn:scale-110 transition-transform">→</span>
              </Button>
              <Button
                onClick={() => setShowStakeModal(true)}
                className="flex-1 bg-accent hover:bg-accent/90 text-background font-bold uppercase tracking-wider glow-magenta h-14 group/btn"
              >
                <span className="mr-2">Stake NO</span>
                <span className="text-lg transform group-hover/btn:scale-110 transition-transform">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <StakeModal poll={poll} open={showStakeModal} onClose={() => setShowStakeModal(false)} />
    </>
  )
}
