"use client"

import { useState } from "react"
import { PollCard } from "./poll-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import type { Poll } from "@/lib/mock-data"

interface PollsListProps {
  matchId: string
}

const pollsData: (Poll & { timeLeft: string })[] = [
  {
    id: "1",
    matchId: "1",
    category: "player_event",
    question: "Will Palmer score a goal?",
    yesPool: 7000,
    noPool: 3000,
    participants: 67,
    status: "active",
    timeLeft: "2h 34m",
    lockTime: "kickoff",
    recentActivity: "2 min ago",
  },
  {
    id: "2",
    matchId: "1",
    category: "player_event",
    question: "Will Rashford be subbed out?",
    yesPool: 2100,
    noPool: 3200,
    participants: 38,
    status: "active",
    timeLeft: "2h 34m",
    lockTime: "60min",
    recentActivity: "5 min ago",
  },
  {
    id: "3",
    matchId: "1",
    category: "team_event",
    question: "Will Chelsea win by 2+ goals?",
    yesPool: 1800,
    noPool: 2400,
    participants: 29,
    status: "active",
    timeLeft: "2h 34m",
    lockTime: "kickoff",
    recentActivity: "8 min ago",
  },
  {
    id: "4",
    matchId: "1",
    category: "score_prediction",
    question: "Will there be 3+ goals total?",
    yesPool: 4200,
    noPool: 1900,
    participants: 52,
    status: "active",
    timeLeft: "2h 34m",
    lockTime: "kickoff",
    recentActivity: "1 min ago",
  },
  {
    id: "5",
    matchId: "1",
    category: "player_event",
    question: "Will Bruno Fernandes get a yellow card?",
    yesPool: 1500,
    noPool: 1700,
    participants: 24,
    status: "active",
    timeLeft: "2h 34m",
    lockTime: "halftime",
    recentActivity: "12 min ago",
  },
]

export function PollsList({ matchId }: PollsListProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = ["all", "player_event", "team_event", "score_prediction"]

  const filteredPolls = activeCategory === "all" ? pollsData : pollsData.filter((p) => p.category === activeCategory)

  return (
    <div>
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <TabsList className="bg-surface border border-border mb-6 w-max md:w-auto">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-xs tracking-wider shrink-0 whitespace-nowrap min-h-[44px]"
              >
                {cat === "all" ? "All Polls" : cat.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="space-y-4">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} matchId={matchId} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
