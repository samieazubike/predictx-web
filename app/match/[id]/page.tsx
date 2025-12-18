import { MatchHeader } from "@/components/match-header"
import { PollsList } from "@/components/polls-list"
import { CreatePollButton } from "@/components/create-poll-button"

export default function MatchPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <MatchHeader matchId={params.id} />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-black uppercase text-primary text-glow-cyan mb-2">
              Active Prediction Markets
            </h2>
            <p className="text-muted-foreground">Choose a poll and stake on the outcome you believe will happen</p>
          </div>
          <CreatePollButton matchId={params.id} />
        </div>
        <PollsList matchId={params.id} />
      </div>
    </main>
  )
}
