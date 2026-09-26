"use client"

import { Clock, Users, AlertCircle } from "lucide-react"
import { useStaking } from "@/hooks/use-staking"
import { useMockData } from "@/hooks/use-mock-data"
import { formatCurrency } from "@/lib/calculations"
import { AUTO_APPROVE_THRESHOLD } from "@/lib/constants"

/**
 * A pending stake, resolved against the live poll.
 *
 * Split into its own component so the countdown subscription is per-row: ten
 * pending stakes ticking together would re-render the whole list every second,
 * and a row whose poll has been deleted renders nothing rather than throwing.
 */
function PendingStakeRow({ stakeId }: { stakeId: string }) {
  const stake = useStaking((s) => s.stakes.find((x) => x.id === stakeId))
  const getPoll = useMockData((s) => s.getPoll)

  const poll = stake ? getPoll(stake.pollId) : undefined

  if (!stake) return null

  /*
   * The badge reflects the poll's real status rather than a hardcoded per-row
   * string. Whether a *closed* window still reads as "voting" is #176's
   * concern; this tab's job is to show which stakes are awaiting resolution, so
   * it deliberately does not duplicate the window arithmetic.
   */
  const inVoting = poll?.status === "voting"

  return (
    <div
      className="bg-surface border-2 border-border clip-corner-lg p-6 hover:border-gold transition-all"
      data-testid="pending-stake-row"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {stake.matchName}
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">{stake.question}</h3>
          </div>
          <div
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${
              inVoting ? "bg-primary/20 text-primary" : "bg-gold/20 text-gold"
            }`}
            data-testid="pending-status"
          >
            {inVoting ? "Voting in Progress" : "Awaiting Resolution"}
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
          {poll && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Participants</div>
              <div className="font-mono font-bold text-lg">{poll.participants}</div>
            </div>
          )}
        </div>

        {inVoting && (
          <div className="p-4 bg-background rounded border border-primary/30 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Community Voting</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Auto-resolves above {Math.round(AUTO_APPROVE_THRESHOLD * 100)}% consensus
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Community votes are being tallied</span>
            </div>
          </div>
        )}

        {!inVoting && (
          <div className="flex gap-2 p-3 bg-gold/10 border border-gold/30 rounded">
            <AlertCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-bold text-gold mb-1">Awaiting Resolution</p>
              <p>
                {stake.resolutionNote ??
                  "This poll is no longer accepting community votes. It will resolve automatically, or move to admin review if consensus is not reached."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function PendingResolution() {
  const pendingIds = useStaking((s) =>
    s.stakes.filter((x) => x.status === "pending_resolution").map((x) => x.id),
  )

  if (pendingIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-20">⏳</div>
        <h3 className="font-display text-xl font-black uppercase text-muted mb-2">
          No Pending Resolutions
        </h3>
        <p className="text-muted-foreground">Your completed matches will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pendingIds.map((id) => (
        <PendingStakeRow key={id} stakeId={id} />
      ))}
    </div>
  )
}
