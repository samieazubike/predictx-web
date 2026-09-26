"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Coins, CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { useWallet } from "@/hooks/use-wallet"
import { useVoting, type VoteDecision } from "@/hooks/use-voting"
import { useMockData } from "@/hooks/use-mock-data"
import { WalletConnectModal } from "./wallet-connect-modal"
import { formatCurrency } from "@/lib/calculations"

/**
 * One votable poll, with a live reward and a real vote.
 *
 * The previous version kept a local `Set` of voted poll ids and a hardcoded
 * array of four matches that do not exist in the fixtures. A "vote" here only
 * added an id to component state: nothing was persisted, no reward was paid, and
 * reloading the page restored the row. Now the vote goes through
 * `useVoting().castVote`, so it lands in the same store the rest of the app
 * reads, and the row disappears from `availablePolls()` on its own.
 */
function VotingOpportunityRow({ pollId }: { pollId: string }) {
  const { castVote, getVoteReward } = useVoting()
  const getPoll = useMockData((s) => s.getPoll)
  const getMatch = useMockData((s) => s.getMatch)
  const { isConnected } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const poll = getPoll(pollId)
  const match = poll ? getMatch(poll.matchId) : undefined
  if (!poll) return null

  // Live, so a pool that grows while the tab is open pays more.
  const reward = getVoteReward(poll.id)
  const score = match?.score != null ? `${match.score.home}–${match.score.away}` : null

  const handleVote = async (decision: VoteDecision) => {
    if (!isConnected) {
      toast.info("Please connect your wallet")
      setShowWalletModal(true)
      return
    }
    // Guard re-entry: `castVote` awaits ~800ms, and a second click in that
    // window would cast twice and credit the reward twice.
    if (submitting) return
    setSubmitting(true)

    try {
      await castVote(poll.id, decision)
      toast.success(`Vote submitted: ${decision.toUpperCase()}`, {
        description: `You've earned ${formatCurrency(reward)} for participating!`,
      })
    } catch (error) {
      toast.error("Vote not recorded", {
        description: error instanceof Error ? error.message : "Something went wrong.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="bg-surface border-2 border-border clip-corner-lg p-6 hover:border-gold transition-all"
      data-testid="voting-opportunity-row"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {poll.matchId.toUpperCase()}
              </div>
              {score && (
                <div className="text-sm font-mono font-bold text-primary">{score}</div>
              )}
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              {poll.question}
            </h3>
          </div>

          {/*
            Evidence was a hardcoded string per row. There is no evidence feed in
            the fixtures, so rather than invent one the row states what the poll
            is resolving and how the tally will be used.
          */}
          <div className="p-4 bg-background rounded border border-primary/30">
            <div className="text-xs text-gold font-bold uppercase tracking-wider mb-2">
              How this resolves
            </div>
            <p className="text-sm text-muted-foreground">
              {match
                ? `${match.homeTeam} vs ${match.awayTeam} finished ${score ?? "—"}. `
                : ""}
              Your vote is tallied with the rest of the community. Polls above{" "}
              85% consensus resolve automatically; the rest go to admin review.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-gold/20 text-gold rounded inline-block">
            <Coins className="h-4 w-4" />
            <span className="font-bold text-sm">
              Earn {formatCurrency(reward)} for voting
            </span>
          </div>
        </div>

        <div className="flex lg:flex-col gap-3 min-w-[200px]">
          <Button
            onClick={() => void handleVote("yes")}
            disabled={submitting}
            className="flex-1 bg-success hover:bg-success/90 text-background font-bold uppercase tracking-wider glow-green h-12"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            YES
          </Button>
          <Button
            onClick={() => void handleVote("no")}
            disabled={submitting}
            className="flex-1 bg-accent hover:bg-accent/90 text-background font-bold uppercase tracking-wider glow-magenta h-12"
          >
            <XCircle className="mr-2 h-5 w-5" />
            NO
          </Button>
          <Button
            onClick={() => void handleVote("unclear")}
            disabled={submitting}
            variant="outline"
            className="flex-1 border-2 border-muted hover:bg-surface font-bold uppercase tracking-wider text-xs h-12"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Unclear
          </Button>
        </div>
      </div>
      <WalletConnectModal open={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </div>
  )
}

export function VotingOpportunities() {
  // Ids rather than the array, so the list does not re-render on unrelated store
  // writes. `availablePolls()` is already derived from the store, so voting on a
  // poll removes it from this list without any local bookkeeping.
  const availableIds = useVoting((s) => s.availablePolls().map((p) => p.id))

  if (availableIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-20">⚖️</div>
        <h3 className="font-display text-xl font-black uppercase text-muted mb-2">
          Voting Arena Empty
        </h3>
        <p className="text-muted-foreground">Be The Judge!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {availableIds.map((id) => (
        <VotingOpportunityRow key={id} pollId={id} />
      ))}
    </div>
  )
}
