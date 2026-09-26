import { Hero } from "@/components/hero"
import { PlatformStats } from "@/components/platform-stats"
import { TrendingPolls, UpcomingMatches } from "@/components/home"

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
