"use client"

import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { useStaking } from "@/hooks/use-staking"
import { useMockData } from "@/hooks/use-mock-data"
import { formatCurrency, formatCompactCurrency } from "@/lib/calculations"

/**
 * A single settled stake, resolved against the live poll and match.
 *
 * The poll supplies the outcome and the match supplies the final score and kickoff
 * date — the stake record only knows its own side and amount. Split out so the
 * lookups happen per row rather than once for the whole list.
 */
function CompletedStakeRow({ stakeId }: { stakeId: string }) {
  const stake = useStaking((s) => s.stakes.find((x) => x.id === stakeId))
  const getPoll = useMockData((s) => s.getPoll)
  const getMatch = useMockData((s) => s.getMatch)

  const poll = stake ? getPoll(stake.pollId) : undefined
  const match = stake ? getMatch(stake.matchId) : undefined

  if (!stake) return null

  const won = stake.outcome === "won"
  // Fall back through progressively less specific sources so a row still renders
  // if a poll or match has been removed from the fixtures.
  const result = poll?.outcome ?? stake.side
  const score =
    match?.score != null ? `${match.score.home}–${match.score.away}` : null
  const date = match?.kickoff
    ? new Date(match.kickoff).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div
      className={`bg-surface border-2 clip-corner-lg p-5 transition-all ${
        won ? "border-success/30 hover:border-success/50" : "border-accent/30 hover:border-accent/50"
      }`}
      data-testid="completed-stake-row"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {won ? (
              <div className="flex items-center gap-2 px-2 py-1 bg-success/20 text-success rounded text-xs font-bold uppercase">
                <TrendingUp className="h-3 w-3" />
                WON
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 bg-accent/20 text-accent rounded text-xs font-bold uppercase">
                <TrendingDown className="h-3 w-3" />
                LOST
              </div>
            )}
            <div className="text-xs text-muted-foreground">{stake.matchName}</div>
          </div>
          <h3 className="font-bold text-foreground">{stake.question}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {date ? (
            <>
              <Calendar className="h-3 w-3" />
              {date}
            </>
          ) : (
            score ?? null
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Your Side</div>
          <div
            className={`text-sm font-bold uppercase ${stake.side === "yes" ? "text-success" : "text-accent"}`}
          >
            {stake.side}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Result</div>
          <div className="text-sm font-bold uppercase text-foreground">{result}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Stake</div>
          <div className="text-sm font-mono font-bold">{formatCurrency(stake.amount)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">P/L</div>
          <div
            className={`text-sm font-mono font-bold ${
              (stake.profit ?? 0) > 0 ? "text-success" : "text-accent"
            }`}
          >
            {/* Profit and ROI come from the settled stake record. Where they are
                absent the row shows the stake returned rather than inventing a
                zero P/L, which would read as a real loss. */}
            {stake.profit == null
              ? "—"
              : `${stake.profit > 0 ? "+" : ""}${formatCurrency(stake.profit)}`}
            {stake.roi != null && (
              <span className="ml-1">({stake.roi > 0 ? "+" : ""}
                {stake.roi.toFixed(0)}%)</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Final Score</div>
          <div className="text-sm font-mono font-bold">{score ?? "—"}</div>
        </div>
      </div>
    </div>
  )
}

export function CompletedPredictions() {
  const completedIds = useStaking((s) =>
    s.stakes.filter((x) => x.status === "completed").map((x) => x.id),
  )

  /**
   * Summary figures, each a separate selector returning a **primitive**.
   *
   * Selecting the filtered array and reducing it in `useMemo` would be wrong
   * twice over: the array is a new identity on every store read, so the memo
   * would recompute constantly, and `getState()` inside the memo is not a
   * subscription at all, so the totals would silently go stale — the exact
   * class of bug this tab is being rewired to fix. Numbers are compared by
   * value, so React re-renders only when a figure actually changes.
   */
  const totalProfit = useStaking((s) =>
    s.stakes.reduce((sum, x) => (x.status === "completed" ? sum + (x.profit ?? 0) : sum), 0),
  )
  const totalStaked = useStaking((s) =>
    s.stakes.reduce((sum, x) => (x.status === "completed" ? sum + x.amount : sum), 0),
  )
  const completedCount = useStaking(
    (s) => s.stakes.filter((x) => x.status === "completed").length,
  )
  const winCount = useStaking(
    (s) => s.stakes.filter((x) => x.status === "completed" && x.outcome === "won").length,
  )

  const winRate = completedCount > 0 ? (winCount / completedCount) * 100 : 0


  if (completedIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-20">📈</div>
        <h3 className="font-display text-xl font-black uppercase text-muted mb-2">
          No Completed Predictions
        </h3>
        <p className="text-muted-foreground">Settled predictions will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border clip-corner p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total P/L</div>
          <div
            className={`font-display text-2xl font-black ${
              totalProfit > 0
                ? "text-success text-glow-green"
                : "text-accent"
            }`}
            data-testid="completed-total-pl"
          >
            {totalProfit > 0 ? "+" : ""}
            {formatCompactCurrency(totalProfit)}
          </div>
        </div>
        <div className="bg-surface border border-border clip-corner p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Win Rate</div>
          <div
            className="font-display text-2xl font-black text-primary text-glow-cyan"
            data-testid="completed-win-rate"
          >
            {winRate.toFixed(0)}%
          </div>
        </div>
        <div className="bg-surface border border-border clip-corner p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total ROI</div>
          <div
            className={`font-display text-2xl font-black ${
              totalProfit > 0 ? "text-success" : "text-accent"
            }`}
            data-testid="completed-total-roi"
          >
            {totalStaked > 0
              ? `${((totalProfit / totalStaked) * 100).toFixed(0)}%`
              : "—"}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="space-y-3">
        {completedIds.map((id) => (
          <CompletedStakeRow key={id} stakeId={id} />
        ))}
      </div>
    </div>
  )
}
