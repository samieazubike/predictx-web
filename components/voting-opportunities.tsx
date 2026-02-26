"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Coins, CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectModal } from "./wallet-connect-modal"

const votingPolls = [
  {
    id: 1,
    match: "Brighton vs West Ham",
    finalScore: "2-1",
    question: "Did Brighton score first?",
    evidence: "Goal at 23' by Welbeck",
    reward: 8.5,
  },
  {
    id: 2,
    match: "Everton vs Wolves",
    finalScore: "1-1",
    question: "Was there a red card?",
    evidence: "No red cards shown",
    reward: 6.2,
  },
  {
    id: 3,
    match: "Crystal Palace vs Brentford",
    finalScore: "3-2",
    question: "Did Palace win?",
    evidence: "Final whistle: Palace 3-2 Brentford",
    reward: 9.8,
  },
  {
    id: 4,
    match: "Leicester vs Southampton",
    finalScore: "2-2",
    question: "Were there 4+ goals?",
    evidence: "Total goals: 4",
    reward: 7.5,
  },
]

export function VotingOpportunities() {
  const [votedPolls, setVotedPolls] = useState<Set<number>>(new Set())
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { isConnected } = useWallet()

  const handleVote = (pollId: number, vote: "yes" | "no" | "unclear", reward: number) => {
    if (!isConnected) {
      toast.info("Please connect your wallet")
      setShowWalletModal(true)
      return
    }
    setVotedPolls((prev) => new Set([...prev, pollId]))
    toast.success(`Vote submitted: ${vote.toUpperCase()}`, {
      description: `You've earned $${reward.toFixed(2)} for participating!`,
    })
  }

  if (votingPolls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4 opacity-20">⚖️</div>
        <h3 className="font-display text-xl font-black uppercase text-muted mb-2">Voting Arena Empty</h3>
        <p className="text-muted-foreground">Be The Judge!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {votingPolls.map((poll) => {
        const hasVoted = votedPolls.has(poll.id)

        return (
          <div
            key={poll.id}
            className="bg-surface border-2 border-border clip-corner-lg p-4 md:p-6 hover:border-gold transition-all touch-ripple"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left: Poll Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{poll.match}</div>
                    <div className="text-sm font-mono font-bold text-primary">{poll.finalScore}</div>
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">{poll.question}</h3>
                </div>

                {/* Evidence */}
                <div className="p-3 md:p-4 bg-background rounded border border-primary/30">
                  <div className="text-xs text-gold font-bold uppercase tracking-wider mb-1 md:mb-2">Evidence</div>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">{poll.evidence}</p>
                </div>

                {/* Reward */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gold/20 text-gold rounded inline-block">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold text-sm">Earn ${poll.reward.toFixed(2)} for voting</span>
                </div>

                {hasVoted && (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-bold text-sm">Thank you for judging! Reward credited.</span>
                  </div>
                )}
              </div>

              {/* Right: Voting Buttons */}
              {!hasVoted && (
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:min-w-0 lg:min-w-[200px]">
                  <Button
                    onClick={() => handleVote(poll.id, "yes", poll.reward)}
                    className="flex-1 bg-success hover:bg-success/90 text-background font-bold uppercase tracking-wider glow-green h-12"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    YES
                  </Button>
                  <Button
                    onClick={() => handleVote(poll.id, "no", poll.reward)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-background font-bold uppercase tracking-wider glow-magenta h-12"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    NO
                  </Button>
                  <Button
                    onClick={() => handleVote(poll.id, "unclear", poll.reward)}
                    variant="outline"
                    className="flex-1 border-2 border-muted hover:bg-surface font-bold uppercase tracking-wider text-xs h-12"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Unclear
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      })}
      <WalletConnectModal open={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </div>
  )
}

