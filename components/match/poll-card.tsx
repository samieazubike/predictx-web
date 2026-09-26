"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Zap, CheckCircle2, XCircle, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StakeModal } from "@/components/stake-modal"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { useWallet } from "@/hooks/use-wallet"
import { useCountdown } from "@/hooks/use-countdown"
import { isPollTerminal, isPollResolved, isPollCancelled, getWinningSide } from "@/lib/calculations"
import type { Poll, Match, PollCategory, LockTime } from "@/lib/mock-data"

interface PollCardProps {
  poll: Poll
  match: Match
  isHottest?: boolean
  animationDelay?: number
}

const CATEGORY_STYLES: Record<PollCategory, { label: string; className: string }> = {
  player_event: {
    label: "Player",
    className: "bg-primary/20 text-primary border border-primary/40",
  },
  team_event: {
    label: "Team",
    className: "bg-success/20 text-success border border-success/40",
  },
  score_prediction: {
    label: "Score",
    className: "bg-gold/20 text-gold border border-gold/40",
  },
  other: {
    label: "Other",
    className: "bg-foreground/10 text-foreground border border-border",
  },
}

function getLockTargetISO(kickoff: string, lockTime: LockTime): string {
  const kickoffTime = new Date(kickoff).getTime()
  switch (lockTime) {
    case "kickoff":
      return kickoff
    case "halftime":
      return new Date(kickoffTime + 52 * 60 * 1000).toISOString()
    case "60min":
      return new Date(kickoffTime + 65 * 60 * 1000).toISOString()
  }
}

function TeamBadge({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-background border border-border text-[9px] font-bold font-mono text-muted-foreground shrink-0">
      {initials}
    </span>
  )
}

function CompactCountdown({
  kickoff,
  lockTime,
}: {
  kickoff: string
  lockTime: LockTime
}) {
  const targetISO = getLockTargetISO(kickoff, lockTime)
  const { days, hours, minutes, seconds, isExpired, status } = useCountdown(targetISO)

  const colorClass = {
    safe: "text-primary bg-primary/10 border-primary/30",
    warning: "text-gold bg-gold/10 border-gold/30",
    urgent: "text-accent bg-accent/10 border-accent/30 animate-pulse",
    critical: "text-accent bg-accent/20 border-accent/50 animate-pulse",
    expired: "text-muted-foreground bg-surface border-border",
  }[status]

  if (isExpired) {
    return (
      <span className={`px-2 py-1 rounded border text-xs font-mono font-bold ${colorClass}`}>
        LOCKED
      </span>
    )
  }

  const display =
    days > 0
      ? `${days}d ${hours}h`
      : hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m ${seconds}s`

  return (
    <span className={`px-2 py-1 rounded border text-xs font-mono font-bold whitespace-nowrap ${colorClass}`}>
      {display}
    </span>
  )
}

/** Renders a resolved or cancelled status pill replacing the countdown timer */
function TerminalStatusPill({ poll }: { poll: Poll }) {
  const winner = getWinningSide(poll.outcome)

  if (isPollCancelled(poll.status)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono font-bold text-muted-foreground bg-surface border-border whitespace-nowrap">
        <Ban className="h-3 w-3" />
        Cancelled
      </span>
    )
  }

  if (isPollResolved(poll.status)) {
    const isYes = winner === "yes"
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-mono font-bold whitespace-nowrap ${
          isYes
            ? "text-success bg-success/10 border-success/30"
            : "text-accent bg-accent/10 border-accent/30"
        }`}
      >
        <CheckCircle2 className="h-3 w-3" />
        {winner ? `${winner.toUpperCase()} WON` : "Resolved"}
      </span>
    )
  }

  return null
}

export function PollCard({
  poll,
  match,
  isHottest = false,
  animationDelay = 0,
}: PollCardProps) {
  const router = useRouter()
  const { isConnected } = useWallet()
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [pendingStake, setPendingStake] = useState(false)

  const total = poll.yesPool + poll.noPool
  const yesPercent = total > 0 ? Math.round((poll.yesPool / total) * 100) : 50
  const noPercent = 100 - yesPercent
  const isHighValue = total > 10_000
  const category = CATEGORY_STYLES[poll.category]
  const isTerminal = isPollTerminal(poll.status)
  const isResolved = isPollResolved(poll.status)
  const isCancelled = isPollCancelled(poll.status)
  const isActive = poll.status === "active"
  const winner = getWinningSide(poll.outcome)

  // After wallet connects from a pending stake, open the stake modal
  useEffect(() => {
    if (isConnected && pendingStake) {
      setPendingStake(false)
      setShowWalletModal(false)
      setShowStakeModal(true)
    }
  }, [isConnected, pendingStake])

  function handleStakeClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isActive) return
    if (isConnected) {
      setShowStakeModal(true)
    } else {
      setPendingStake(true)
      setShowWalletModal(true)
    }
  }

  function handleCardClick() {
    router.push(`/match/${poll.matchId}`)
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className={[
          "relative bg-surface border-2 clip-corner-lg cursor-pointer",
          "transition-all duration-300 group overflow-hidden",
          isHottest
            ? "border-gold hover:shadow-[0_0_40px_rgba(255,215,0,0.35)]"
            : isTerminal
              ? "border-border/40 opacity-80 hover:opacity-100"
              : "border-border hover:border-primary hover:shadow-[0_0_30px_rgba(0,217,255,0.2)]",
          isHighValue && !isTerminal
            ? "shadow-[inset_0_0_30px_rgba(0,217,255,0.05),0_0_0_1px_rgba(0,217,255,0.1)]"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Hottest badge */}
        {isHottest && (
          <div className="absolute top-0 right-0 z-10">
            <div className="px-3 py-1 bg-gradient-to-r from-gold to-amber-500 text-background text-xs font-bold uppercase tracking-wider clip-corner">
              HOTTEST 🔥
            </div>
          </div>
        )}

        {/* Resolved / Cancelled ribbon */}
        {isResolved && winner && (
          <div
            className={`absolute top-0 right-0 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider clip-corner ${
              winner === "yes"
                ? "bg-success/80 text-background"
                : "bg-accent/80 text-background"
            }`}
          >
            <CheckCircle2 className="inline h-3 w-3 mr-1" />
            {winner.toUpperCase()} WON
          </div>
        )}
        {isCancelled && (
          <div className="absolute top-0 right-0 z-10 px-3 py-1 text-xs font-bold uppercase tracking-wider clip-corner bg-muted-foreground/60 text-background">
            <Ban className="inline h-3 w-3 mr-1" />
            Cancelled
          </div>
        )}

        {/* Animated gold glow border for hottest */}
        {isHottest && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-amber-500/10 animate-pulse-glow opacity-60" />
          </div>
        )}

        {/* Holographic shimmer on hover (only for active polls) */}
        {!isTerminal && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
        )}

        <div className="relative p-5 space-y-4">
          {/* Match context */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <TeamBadge name={match.homeTeam} />
              <span className="text-xs font-bold text-foreground truncate">
                {match.homeTeam} vs {match.awayTeam}
              </span>
              <TeamBadge name={match.awayTeam} />
            </div>

            {/* Show terminal status pill instead of countdown for resolved/cancelled */}
            {isTerminal ? (
              <TerminalStatusPill poll={poll} />
            ) : (
              <CompactCountdown kickoff={match.kickoff} lockTime={poll.lockTime} />
            )}
          </div>

          {/* Category tag */}
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${category.className}`}
          >
            {category.label}
          </span>

          {/* Poll question */}
          <p className="font-display text-lg font-bold text-foreground leading-tight">
            {poll.question}
          </p>

          {/* Pool progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className={`font-bold ${isResolved && winner === "yes" ? "text-success" : "text-success/70"}`}>
                YES {yesPercent}% · ${poll.yesPool.toLocaleString()}
                {isResolved && winner === "yes" && " ✓"}
              </span>
              <span className={`font-bold ${isResolved && winner === "no" ? "text-accent" : "text-accent/70"}`}>
                ${poll.noPool.toLocaleString()} · {noPercent}% NO
                {isResolved && winner === "no" && " ✓"}
              </span>
            </div>
            <div className="relative h-3 bg-background-secondary rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full bg-gradient-to-r from-success to-success/70 transition-all duration-500 ${!isTerminal ? "glow-green" : ""}`}
                style={{ width: `${yesPercent}%` }}
              />
              <div
                className={`absolute right-0 top-0 h-full bg-gradient-to-l from-accent to-accent/70 transition-all duration-500 ${!isTerminal ? "glow-magenta" : ""}`}
                style={{ width: `${noPercent}%` }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{poll.participants} stakers</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {isCancelled ? "Refunded Pool" : "Total Pool"}
              </p>
              <p className={`font-mono font-bold text-sm ${isCancelled ? "text-muted-foreground" : "text-gold text-glow-gold"}`}>
                ${total.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Social proof / resolution note */}
          <p className="text-xs italic text-muted-foreground/80 leading-tight">
            {poll.recentActivity}
          </p>

          {/* Cancelled — refund notice */}
          {isCancelled && (
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-muted-foreground/20 bg-surface text-xs text-muted-foreground">
              <XCircle className="h-4 w-4 shrink-0" />
              This poll was cancelled. Stakes have been refunded.
            </div>
          )}

          {/* Action button */}
          {isActive ? (
            <Button
              onClick={handleStakeClick}
              className={[
                "w-full h-10 font-bold uppercase tracking-wider text-sm",
                "bg-primary hover:bg-primary/90 text-background",
                "glow-cyan hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]",
                "transition-all hover:scale-[1.02]",
              ].join(" ")}
            >
              {isHighValue && <Zap className="mr-1.5 h-4 w-4" />}
              Stake Now
            </Button>
          ) : isResolved ? (
            <div
              className={`w-full h-10 flex items-center justify-center gap-2 rounded font-bold uppercase tracking-wider text-sm border ${
                winner === "yes"
                  ? "text-success border-success/30 bg-success/5"
                  : "text-accent border-accent/30 bg-accent/5"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {winner ? `${winner.toUpperCase()} Won — Final` : "Resolved"}
            </div>
          ) : isCancelled ? (
            <div className="w-full h-10 flex items-center justify-center gap-2 rounded font-bold uppercase tracking-wider text-sm text-muted-foreground border border-border bg-surface/50">
              <Ban className="h-4 w-4" />
              Poll Cancelled
            </div>
          ) : (
            <div className="w-full h-10 flex items-center justify-center font-bold uppercase tracking-wider text-sm text-muted-foreground">
              Staking Closed
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <>
          <StakeModal
            poll={poll}
            matchId={match.id}
            matchName={`${match.homeTeam} vs ${match.awayTeam}`}
            initialSide="yes"
            open={showStakeModal}
            onClose={() => setShowStakeModal(false)}
          />
          <WalletConnectModal
            open={showWalletModal}
            onClose={() => {
              setShowWalletModal(false)
              if (!isConnected) setPendingStake(false)
            }}
          />
        </>
      )}
    </>
  )
}
