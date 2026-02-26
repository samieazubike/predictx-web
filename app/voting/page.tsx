import { VotingOpportunities } from "@/components/voting-opportunities"

export default function VotingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-background-secondary border-b border-primary/20 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 bg-gold glow-gold" />
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-black uppercase text-gold text-glow-gold">Voting Center</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
            Vote on poll outcomes you didn't participate in and earn rewards
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <VotingOpportunities />
      </div>
    </main>
  )
}
