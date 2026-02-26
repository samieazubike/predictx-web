import { Zap, Users, Trophy, Shield, Target, Coins } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Browse Matches",
    description: "Explore upcoming football matches and view all available prediction polls for each game.",
    icon: Target,
    color: "text-primary",
    glow: "glow-cyan",
  },
  {
    number: "02",
    title: "Choose Your Prediction",
    description: "Select a poll that interests you. See real-time pool distributions showing how others are betting.",
    icon: Zap,
    color: "text-success",
    glow: "glow-green",
  },
  {
    number: "03",
    title: "Stake Your Crypto",
    description: "Pick YES or NO, enter your stake amount, and see your potential winnings calculated live.",
    icon: Coins,
    color: "text-gold",
    glow: "glow-gold",
  },
  {
    number: "04",
    title: "Wait for Resolution",
    description: "After the match, the community votes on outcomes. Earn rewards by participating as a judge.",
    icon: Users,
    color: "text-accent",
    glow: "glow-magenta",
  },
  {
    number: "05",
    title: "Claim Your Winnings",
    description:
      "If your prediction was correct, you earn a proportional share of the total pool minus 5% platform fee.",
    icon: Trophy,
    color: "text-gold",
    glow: "glow-gold",
  },
]

const features = [
  {
    title: "Pool-Based System",
    description:
      "All stakes go into a shared pool. Winners split the entire pool proportionally based on their contribution.",
    icon: Trophy,
  },
  {
    title: "Community Resolution",
    description: "Non-participants vote on outcomes within a 2-hour window. Voters earn 0.5-1% of the pool as reward.",
    icon: Users,
  },
  {
    title: "Time-Locked Polls",
    description: "Polls lock at specific times (kickoff, halftime, etc.) to prevent betting after events occur.",
    icon: Shield,
  },
  {
    title: "Transparent Blockchain",
    description:
      "All transactions recorded on-chain. See exactly where your stake goes and how winnings are calculated.",
    icon: Zap,
  },
]

const example = {
  poll: "Will Palmer score a goal?",
  yesPool: 7000,
  noPool: 3000,
  yourStake: 700,
  totalPool: 10000,
  platformFee: 500,
  winningsPool: 9500,
  yourPayout: 950,
  profit: 250,
}

export function HowItWorksContent() {
  return (
    <div className="space-y-16">
      {/* Steps Section */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-foreground mb-8 text-center">
          Get Started in 5 Steps
        </h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col md:flex-row gap-6 bg-surface border-2 border-border clip-corner-lg p-6 hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div
                  className={`w-16 h-16 rounded-full bg-background border-2 border-${step.color} flex items-center justify-center ${step.glow}`}
                >
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <div className="text-4xl font-display font-black text-muted opacity-20">{step.number}</div>
              </div>
              <div className="flex-1">
                <h3 className={`font-display text-xl md:text-2xl font-bold ${step.color} mb-2`}>{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Example Calculation */}
      <section className="bg-gradient-to-br from-surface via-background-secondary to-surface border-2 border-primary/30 clip-corner-lg p-8">
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-primary text-glow-cyan mb-8 text-center">
          Example Calculation
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <div className="text-xl font-bold mb-2">Match: Chelsea vs Man United</div>
            <div className="text-2xl font-display font-black text-foreground">"{example.poll}"</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-success/20 border border-success rounded">
              <div className="text-xs text-success font-bold uppercase mb-1">YES Pool</div>
              <div className="text-2xl font-mono font-black text-success">${example.yesPool.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Your stake: ${example.yourStake}</div>
            </div>
            <div className="p-4 bg-accent/20 border border-accent rounded">
              <div className="text-xs text-accent font-bold uppercase mb-1">NO Pool</div>
              <div className="text-2xl font-mono font-black text-accent">${example.noPool.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-3 p-6 bg-background rounded border border-border">
            <div className="flex justify-between text-lg">
              <span className="text-muted-foreground">Total Pool:</span>
              <span className="font-mono font-bold">${example.totalPool.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee (5%):</span>
              <span className="font-mono text-accent">-${example.platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Winnings Pool:</span>
              <span className="font-mono font-bold">${example.winningsPool.toLocaleString()}</span>
            </div>
            <div className="h-px bg-border my-3" />
            <div className="text-sm text-muted-foreground mb-2">
              Palmer scores! YES wins. You staked ${example.yourStake} (10% of YES pool)
            </div>
            <div className="flex justify-between text-xl">
              <span className="font-bold text-gold">Your Payout:</span>
              <span className="font-mono font-black text-gold text-glow-gold">
                ${example.yourPayout.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-bold text-success">Net Profit:</span>
              <span className="font-mono font-black text-success">+${example.profit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-foreground mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-surface border border-border clip-corner p-6 hover:border-primary transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resolution Process */}
      <section className="bg-surface border-2 border-border clip-corner-lg p-8">
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-gold text-glow-gold mb-8 text-center">
          Resolution Process
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 font-bold text-background text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-2">Community Voting (2-hour window)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                After match ends, users who didn't participate vote on the outcome. Voters earn 0.5-1% of pool as
                reward.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0 font-bold text-background text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-2">Automatic Resolution (Above 85% consensus)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If voting reaches over 85% consensus, the result is automatically approved and payouts are processed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0 font-bold text-background text-sm">
              3
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-2">Admin Review (60-85% consensus)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Moderately contentious results require admin verification with video evidence before finalization.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 font-bold text-background text-sm">
              4
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-2">Multi-sig Review (Below 60% consensus)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Highly contentious results require 3-admin multi-signature verification with comprehensive evidence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 font-bold text-background text-sm">
              5
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg mb-2">Dispute Window (24 hours)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                After resolution, there's a 24-hour challenge period where users can dispute with evidence before
                payouts are final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl font-black uppercase text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "Can I withdraw my stake before the poll locks?",
              a: "No, stakes are final once placed. Make sure you're confident in your prediction before confirming.",
            },
            {
              q: "What happens if I vote incorrectly as a judge?",
              a: "There's no penalty for incorrect votes, but consistent bad-faith voting may result in reduced voting privileges.",
            },
            {
              q: "How quickly are winnings paid out?",
              a: "Payouts are processed immediately after the 24-hour dispute window closes, assuming no active disputes.",
            },
            {
              q: "Can I stake on both YES and NO?",
              a: "No, you can only stake on one side per poll to maintain fair pool mechanics.",
            },
            {
              q: "What if a match is cancelled?",
              a: "All stakes are returned in full with no fees if a match is officially cancelled before completion.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-surface border border-border clip-corner p-4 md:p-6 touch-ripple">
              <h3 className="font-bold text-base md:text-lg text-primary mb-2">{faq.q}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
