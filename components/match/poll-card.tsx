"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StakeModal } from "@/components/stake-modal"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { useWallet } from "@/hooks/use-wallet"
import { useCountdown } from "@/hooks/use-countdown"
import type { Poll, Match, PollCategory, LockTime } from "@/lib/mock-data"
import { getLockTargetISO, isPollLocked } from "@/lib/calculations"

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
  const yesPercent = Math.round((poll.yesPool / total) * 100)
  const noPercent = 100 - yesPercent
  const isHighValue = total > 10_000
  const category = CATEGORY_STYLES[poll.category]

  /**
   * Lock state, derived from the clock rather than from `poll.status`.
   *
   * Nothing in the codebase transitions `poll.status` when a lock time
   * passes, so a status check alone let an expired poll keep its live CTA.
   * Ticking every second also means the card flips to Locked the moment the
   * countdown reaches zero, with no interaction required.
   */
  const lockTargetISO = getLockTargetISO(match.kickoff, poll.lockTime)
  const { isExpired } = useCountdown(lockTargetISO)
  const locked = isExpired || isPollLocked(poll, match)

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
    // Belt-and-braces with the button's own `disabled`: a programmatic click
    // or a keyboard activation racing the countdown must not slip through.
    if (locked) return
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
            : "border-border hover:border-primary hover:shadow-[0_0_30px_rgba(0,217,255,0.2)]",
          isHighValue
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

        {/* Animated gold glow border for hottest */}
        {isHottest && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-amber-500/10 animate-pulse-glow opacity-60" />
          </div>
        )}

        {/* Holographic shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/8 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

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
            <CompactCountdown kickoff={match.kickoff} lockTime={poll.lockTime} />
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
              <span className="text-success font-bold">
                YES {yesPercent}% · ${poll.yesPool.toLocaleString()}
              </span>
              <span className="text-accent font-bold">
                ${poll.noPool.toLocaleString()} · {noPercent}% NO
              </span>
            </div>
            <div className="relative h-3 bg-background-secondary rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-success/70 glow-green transition-all duration-500"
                style={{ width: `${yesPercent}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-accent to-accent/70 glow-magenta transition-all duration-500"
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
                Total Pool
              </p>
              <p className="font-mono font-bold text-gold text-glow-gold text-sm">
                ${total.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Social proof */}
          <p className="text-xs italic text-muted-foreground/80 leading-tight">
            {poll.recentActivity}
          </p>

          {/* Stake Now button — disabled once the poll has locked */}
          <Button
            onClick={handleStakeClick}
            disabled={locked}
            aria-disabled={locked}
            className={[
              "w-full h-10 font-bold uppercase tracking-wider text-sm",
              "bg-primary hover:bg:bg-primary/90 text-background",
              "glow-cyan hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]",
              "transition-all hover:scale-[1.02]",
              // The hover treatments above would otherwise still animate on a
              // disabled button, which reads as "clickable but broken".
              locked && "opacity-50 cursor-not-allowed hover:bg-primary hover:scale-100 hover:shadow-none",
            ].join(" ")}
          >
            {locked ? (
              "Locked"
            ) : (
              <>
                {isHighValue && <Zap className="mr-1.5 h-4 w-4" />}
                Stake Now
              </>
            )}
          </Button>
        </div>
      </div>

      <StakeModal
        poll={poll}
        matchId={poll.matchId}
        matchName={`${match.homeTeam} vs ${match.awayTeam}`}
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
  )
}
