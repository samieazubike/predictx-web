"use client"

import { TrendingUp, Users, Clock } from "lucide-react"
import { Button } from "./ui/button"

const trendingPolls = [
  {
    id: 1,
    match: "Chelsea vs Man United",
    question: "Will Palmer score a goal?",
    yesPool: 7000,
    noPool: 3000,
    participants: 67,
    timeLeft: "2h 34m",
    urgent: false,
  },
  {
    id: 2,
    match: "Arsenal vs Liverpool",
    question: "Will Salah be subbed out?",
    yesPool: 2500,
    noPool: 4200,
    participants: 43,
    timeLeft: "45m",
    urgent: true,
  },
  {
    id: 3,
    match: "Man City vs Tottenham",
    question: "Will Haaland score 2+ goals?",
    yesPool: 8500,
    noPool: 6300,
    participants: 92,
    timeLeft: "5h 12m",
    urgent: false,
  },
]

export function TrendingPolls() {
  return (
    <div className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary glow-cyan" />
            <h2 className="font-display text-3xl font-black uppercase text-primary text-glow-cyan">Trending Polls</h2>
          </div>
          <TrendingUp className="h-6 w-6 text-success animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPolls.map((poll) => {
            const total = poll.yesPool + poll.noPool
            const yesPercentage = (poll.yesPool / total) * 100
            const noPercentage = (poll.noPool / total) * 100

            return (
              <div
                key={poll.id}
                className="bg-surface border-2 border-border clip-corner-lg p-6 hover:border-primary transition-all group relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative space-y-4">
                  {/* Match header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Premier League</div>
                      <div className="font-bold text-foreground">{poll.match}</div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-bold ${poll.urgent ? "bg-accent/20 text-accent animate-pulse" : "bg-primary/20 text-primary"}`}
                    >
                      <Clock className="h-3 w-3" />
                      {poll.timeLeft}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="py-3 px-4 bg-background rounded clip-corner">
                    <p className="font-bold text-lg text-balance">{poll.question}</p>
                  </div>

                  {/* Pool distribution */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-success font-bold">YES ${poll.yesPool.toLocaleString()}</span>
                      <span className="text-accent font-bold">NO ${poll.noPool.toLocaleString()}</span>
                    </div>

                    {/* Visual progress bar */}
                    <div className="relative h-3 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-success/80 glow-green transition-all"
                        style={{ width: `${yesPercentage}%` }}
                      />
                      <div
                        className="absolute right-0 top-0 h-full bg-gradient-to-l from-accent to-accent/80 glow-magenta transition-all"
                        style={{ width: `${noPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{yesPercentage.toFixed(0)}% Yes</span>
                      <span>{noPercentage.toFixed(0)}% No</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{poll.participants} stakers</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-background font-bold uppercase text-xs glow-cyan h-8"
                    >
                      Stake Now
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
