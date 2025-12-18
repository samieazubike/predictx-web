"use client"

import { useState } from "react"
import { PollCard } from "./poll-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface PollsListProps {
  matchId: string
}

const pollsData = [
  {
    id: 1,
    category: "Player Events",
    question: "Will Palmer score a goal?",
    yesPool: 7000,
    noPool: 3000,
    participants: 67,
    timeLeft: "2h 34m",
    lockTime: "At Kickoff",
  },
  {
    id: 2,
    category: "Player Events",
    question: "Will Rashford be subbed out?",
    yesPool: 2100,
    noPool: 3200,
    participants: 38,
    timeLeft: "2h 34m",
    lockTime: "At 60 min",
  },
  {
    id: 3,
    category: "Team Events",
    question: "Will Chelsea win by 2+ goals?",
    yesPool: 1800,
    noPool: 2400,
    participants: 29,
    timeLeft: "2h 34m",
    lockTime: "At Kickoff",
  },
  {
    id: 4,
    category: "Score Predictions",
    question: "Will there be 3+ goals total?",
    yesPool: 4200,
    noPool: 1900,
    participants: 52,
    timeLeft: "2h 34m",
    lockTime: "At Kickoff",
  },
  {
    id: 5,
    category: "Player Events",
    question: "Will Bruno Fernandes get a yellow card?",
    yesPool: 1500,
    noPool: 1700,
    participants: 24,
    timeLeft: "2h 34m",
    lockTime: "At Full Time",
  },
]

export function PollsList({ matchId }: PollsListProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = ["all", "Player Events", "Team Events", "Score Predictions"]

  const filteredPolls = activeCategory === "all" ? pollsData : pollsData.filter((p) => p.category === activeCategory)

  return (
    <div>
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-surface border border-border mb-6">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold uppercase text-xs tracking-wider"
            >
              {cat === "all" ? "All Polls" : cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-4">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} matchId={matchId} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
