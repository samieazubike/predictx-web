"use client"

import { useMemo } from "react"
import { Clock } from "lucide-react"
import { Progress } from "./ui/progress"
import { useStaking } from "@/hooks/use-staking"
import { useMockData } from "@/hooks/use-mock-data"
import { useCountdown } from "@/hooks/use-countdown"
import {
  calculatePotentialWinnings,
  formatCurrency,
  getLockTargetISO,
  msUntilLock,
} from "@/lib/calculations"

/**
 * Renders a duration as the compact `2d 4h` / `3h 12m` / `45s` form used
 * throughout the app.
 *
 * Derived from `msUntilLock` — the same helper the lock logic itself uses — so
 * the time shown here and the moment the poll actually locks cannot disagree.
 * The old implementation printed a hardcoded string per row, which is why it
 * could show a poll as open long after it had closed.
 */
function formatRemaining(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "Locked"
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

/** A single row, split out so it can hold its own countdown subscription. */
function ActiveStakeRow({ stakeId }: { stakeId: string }) {
  // Select the one stake by id rather than subscribing to the whole array, so a
  // stake placed elsewhere does not re-render every other row.
  const stake = useStaking((s) => s.stakes.find((x) => x.id === stakeId))
  const getPoll = useMockData((s) => s.getPoll)
  const getMatch = useMockData((s) => s.getMatch)

  const poll = stake ? getPoll(stake.pollId) : undefined
  const match = stake ? getMatch(stake.matchId) : undefined

  const lockTargetISO = poll && match ? getLockTargetISO(match.kickoff, poll.lockTime) : null
  // Subscribing unconditionally keeps the hook order stable; a missing target
  // simply parks the countdown at expired.
  const { isExpired } = useCountdown(lockTargetISO ?? new Date(0).toISOString())

  const view = useMemo(() => {
    if (!stake) return null

    // Pool figures come from the live poll, not from the stake record. The
    // stake only records the amount and side; the pools move as other people
    // bet, and a dashboard that froze them at stake time would be wrong within
    // seconds.
    const yesPool = poll?.yesPool ?? 0
    const noPool = poll?.noPool ?? 0

    const winnings = calculatePotentialWinnings(stake.amount, stake.side, yesPool, noPool)

    return {
      yesPool,
      noPool,
      yesPercentage: yesPool + noPool > 0 ? (yesPool / (yesPool + noPool)) * 100 : 50,
      potentialWinnings: winnings.netWinnings,
      roi: winnings.roi,
      msRemaining: poll && match ? msUntilLock(poll, match) : 0,
      hasLockInfo: Boolean(poll && match),
    }
  }, [stake, poll, match])

  if (!stake || !view) return null

  return (
    <div
      className="bg-surface border-2 border-border clip-corner-lg p-6 hover:border-primary transition-all"
      data-testid="active-stake-row"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {stake.matchName}
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">{stake.question}</h3>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 bg-background rounded text-xs font-mono font-bold whitespace-nowrap ${
                isExpired ? "text-muted-foreground" : "text-primary"
              }`}
            >
              <Clock className="h-4 w-4" />
              {view.hasLockInfo ? formatRemaining(view.msRemaining) : "—"}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Your Side</div>
              <div
                className={`inline-block px-3 py-1 rounded font-bold text-sm uppercase ${
                  stake.side === "yes" ? "bg-success/20 text-success" : "bg-accent/20 text-accent"
                }`}
              >
                {stake.side}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Your Stake</div>
              <div className="font-mono font-bold text-lg">{formatCurrency(stake.amount)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Potential Win</div>
              <div className="font-mono font-bold text-lg text-gold">
                {formatCurrency(view.potentialWinnings)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Potential ROI</div>
              <div
                className={`font-mono font-bold text-lg ${
                  view.roi > 0 ? "text-success" : "text-accent"
                }`}
              >
                {view.roi > 0 ? "+" : ""}
                {view.roi.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-success font-bold">
                YES {formatCurrency(view.yesPool)}
              </span>
              <span className="text-accent font-bold">NO {formatCurrency(view.noPool)}</span>
            </div>
            <Progress value={view.yesPercentage} className="h-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActiveStakes() {
  // The selector returns a filtered array on every store read, so subscribe to
  // the id list rather than the array: a stable projection means the parent
  // does not re-render for unrelated stake changes elsewhere in the store.
  const activeIds = useStaking((s) => s.stakes.filter((x) => x.status === "active").map((x) => x.id))

  if (activeIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-20">📊</div>
        <h3 className="font-display text-xl font-black uppercase text-muted mb-2">No Active Stakes Yet</h3>
        <p className="text-muted-foreground">Jump Into The Action!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activeIds.map((id) => (
        <ActiveStakeRow key={id} stakeId={id} />
      ))}
    </div>
  )
}
