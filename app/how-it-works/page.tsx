import { HowItWorksContent } from "@/components/how-it-works-content"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-background-secondary border-b border-primary/20 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 bg-success glow-green" />
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-black uppercase text-success text-glow-green">How It Works</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Everything you need to know about PredictX prediction markets</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <HowItWorksContent />
      </div>
    </main>
  )
}
