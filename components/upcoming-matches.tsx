"use client"

import { Calendar, MapPin, Trophy } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

const matches = [
  {
    id: 1,
    homeTeam: "Chelsea",
    awayTeam: "Man United",
    date: "Dec 18, 2025",
    time: "19:45",
    venue: "Stamford Bridge",
    league: "Premier League",
    polls: 5,
    totalPool: 15200,
  },
  {
    id: 2,
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    date: "Dec 18, 2025",
    time: "17:30",
    venue: "Emirates Stadium",
    league: "Premier League",
    polls: 4,
    totalPool: 12800,
  },
  {
    id: 3,
    homeTeam: "Man City",
    awayTeam: "Tottenham",
    date: "Dec 19, 2025",
    time: "20:00",
    venue: "Etihad Stadium",
    league: "Premier League",
    polls: 6,
    totalPool: 18500,
  },
  {
    id: 4,
    homeTeam: "Newcastle",
    awayTeam: "Aston Villa",
    date: "Dec 20, 2025",
    time: "15:00",
    venue: "St James' Park",
    league: "Premier League",
    polls: 3,
    totalPool: 8700,
  },
  {
    id: 5,
    homeTeam: "Brighton",
    awayTeam: "West Ham",
    date: "Dec 21, 2025",
    time: "14:00",
    venue: "Amex Stadium",
    league: "Premier League",
    polls: 4,
    totalPool: 6900,
  },
  {
    id: 6,
    homeTeam: "Everton",
    awayTeam: "Wolves",
    date: "Dec 21, 2025",
    time: "16:30",
    venue: "Goodison Park",
    league: "Premier League",
    polls: 3,
    totalPool: 5400,
  },
]

export function UpcomingMatches() {
  return (
    <div id="matches" className="bg-background-secondary py-16 border-t border-primary/20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-success glow-green" />
          <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-success text-glow-green">Upcoming Matches</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-surface border border-border clip-corner-lg hover:border-primary transition-all group relative overflow-hidden touch-ripple"
            >
              {/* Holographic shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

              <div className="relative p-4 md:p-6 space-y-4">
                {/* League badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 bg-background rounded clip-corner">
                    <Trophy className="h-4 w-4 text-gold" />
                    <span className="text-xs font-bold text-gold uppercase tracking-wider">{match.league}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    ID: #{match.id.toString().padStart(4, "0")}
                  </div>
                </div>

                {/* Match teams */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1 min-w-0 text-center">
                    <div className="text-sm sm:text-lg md:text-2xl font-display font-black text-foreground uppercase truncate">{match.homeTeam}</div>
                  </div>
                  <div className="px-2 sm:px-4 md:px-6 shrink-0">
                    <div className="text-xl sm:text-2xl md:text-4xl font-display font-black text-muted-foreground">VS</div>
                  </div>
                  <div className="flex-1 min-w-0 text-center">
                    <div className="text-sm sm:text-lg md:text-2xl font-display font-black text-foreground uppercase truncate">{match.awayTeam}</div>
                  </div>
                </div>

                {/* Match details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{match.date}</span>
                    <span className="font-mono font-bold text-primary">{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground truncate">{match.venue}</span>
                  </div>
                </div>

                {/* Polls info */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Available Polls</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg md:text-2xl font-display font-black text-primary">{match.polls}</span>
                      <span className="text-sm text-muted-foreground">predictions</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Pool</div>
                    <div className="text-lg md:text-2xl font-display font-black text-gold text-glow-gold">
                      ${match.totalPool.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-background font-bold uppercase tracking-wider glow-cyan h-12 group/btn"
                >
                  <Link href={`/match/${match.id}`}>
                    View All Polls
                    <div className="ml-2 transform group-hover/btn:translate-x-1 transition-transform">→</div>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
