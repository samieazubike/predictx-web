import { Hero } from "@/components/hero"
import { PlatformStats } from "@/components/platform-stats"
import { TrendingPolls } from "@/components/home/trending-polls"
import { UpcomingMatches } from "@/components/upcoming-matches"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PlatformStats />
      <TrendingPolls />
      <UpcomingMatches />
    </main>
  )
}
