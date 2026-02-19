# Issue #16: How It Works Page & FAQ

**Labels:** `page`, `content`, `onboarding`, `priority: medium`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 5 — Supporting Pages  
**Estimate:** 3–4 hours  
**Depends on:** #01, #04

---

## Description

Build the "How It Works" page (`/how-it-works`) — a visual, step-by-step guide explaining PredictX's pool mechanics, staking flow, resolution/oracle system, and frequently asked questions. This page is linked from the hero section and navigation, serving as the primary onboarding resource for new users.

**Why it matters:** Prediction markets on Stellar can be intimidating for new users. This page reduces friction by explaining exactly how pools work, how winnings are calculated, and how the community resolution system ensures fairness.

---

## Requirements and Context

### Route

`app/how-it-works/page.tsx`

---

### Section 1: Page Hero

- Title: "HOW IT WORKS" — Orbitron, large, cyan glow
- Subtitle: "From prediction to payout — everything you need to know"
- Brief animation or illustration (neon crystal ball or prediction market visual)

---

### Section 2: Step-by-Step Visual Guide

Numbered vertical timeline or horizontal stepper with icons and animations:

| Step | Title             | Description                                                                       | Icon              |
| ---- | ----------------- | --------------------------------------------------------------------------------- | ----------------- |
| 1    | Browse Matches    | "Explore upcoming Premier League matches and see what predictions are available." | Calendar/Football |
| 2    | Pick a Prediction | "Choose a poll like 'Will Palmer score?' and decide if you think YES or NO."      | Target            |
| 3    | Stake Your Crypto | "Enter your stake amount in XLM. The more you stake, the more you can win."       | Coins             |
| 4    | Watch the Match   | "Sit back and watch. Your prediction locks at kickoff (or the set lock time)."    | Eye/TV            |
| 5    | Community Votes   | "After the match, non-participants vote on the outcome within a 2-hour window."   | Vote/Scales       |
| 6    | Collect Winnings  | "If you predicted correctly, your share of the pool is paid out automatically!"   | Trophy            |

- Each step: `GlowCard` with icon (large, glowing), title (display font), description (body font)
- Steps appear with staggered scroll-triggered animation (slide in from alternating sides)
- Connected by a vertical neon line or path between steps

---

### Section 3: Pool Mechanics Explained

**"How the Pool System Works"** — illustrated example:

Visual walkthrough using the PRD example:

1. "Poll: Will Palmer score a goal?"
2. Visual: two pool buckets — YES ($7,000) and NO ($3,000)
    - Show visual representation with `PoolProgressBar` (animated fill)
3. "Total Pool: $10,000"
4. "Palmer scores! YES wins!"
5. "Platform takes 5% fee = $500"
6. "YES stakers split $9,500 proportionally"
7. Example calculation in a `GlowCard`:
    - "You staked $700 (10% of YES pool)"
    - "Your share: $9,500 × 10% = $950"
    - "Your profit: $950 - $700 = **$250**"
    - "ROI: **+35.7%**"

- Use `AnimatedCounter` for the numbers
- Color-coded: green for returns, gold for platform fee

---

### Section 4: Resolution System Diagram

**"How Outcomes Are Verified"** — 5-stage visual:

| Phase                | Trigger              | Description                                           | Duration  |
| -------------------- | -------------------- | ----------------------------------------------------- | --------- |
| 1. Match Ends        | Automatic            | Polls enter resolution phase                          | —         |
| 2. Community Voting  | 2-hour window        | Non-participants vote on outcomes, earn 0.5–1% reward | 2 hours   |
| 3a. Auto-Approve     | >85% consensus       | Result confirmed automatically                        | Instant   |
| 3b. Admin Review     | 60–85% consensus     | Admins verify with video evidence                     | ~24 hours |
| 3c. Multi-sig Review | <60% consensus       | 3 admins must agree                                   | ~48 hours |
| 4. Dispute Window    | After resolution     | Anyone can challenge with evidence                    | 24 hours  |
| 5. Payout            | After dispute window | Winners receive pool share                            | Automatic |

- Flow diagram or vertical timeline with branching paths
- Color-coded stages: green (auto), yellow (admin), red (multi-sig)
- Each stage in a `GlowCard`
- Icons for each stage with `GlowIcon`

---

### Section 5: Key Concepts

Grid of concept cards (2–3 columns):

| Concept               | Explanation                                                                           |
| --------------------- | ------------------------------------------------------------------------------------- |
| Time Locks            | "Polls lock at specific times to prevent staking after seeing lineups or events."     |
| Proportional Winnings | "Win more if you staked more. Your share = (your stake / winning pool) × total pool." |
| Platform Fee          | "5% fee on winnings only. You never pay fees on losses."                              |
| Voter Rewards         | "Vote on outcomes you didn't stake on and earn 0.5–1% of the pool."                   |
| Dispute Mechanism     | "24-hour window to challenge results with evidence."                                  |
| Stellar Network       | "All transactions happen on the Stellar blockchain — fast, cheap, and transparent."   |

- Each card: `GlowCard` with title + short description
- Icon per concept

---

### Section 6: FAQ Accordion

Expandable FAQ items with gaming styling:

| Question                       | Answer                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| "What happens if I lose?"      | "You lose your staked amount. No additional fees are charged on losses."                                  |
| "How are winnings calculated?" | "Winners split the entire pool (minus 5% fee) proportionally to their stake."                             |
| "Can I cancel a stake?"        | "No. Once confirmed on-chain, stakes are final and cannot be reversed."                                   |
| "How do I earn from voting?"   | "Vote on polls you didn't stake on. Earn 0.5–1% of the pool as a reward for accurate votes."              |
| "What wallet do I need?"       | "Any Stellar-compatible wallet: Freighter (recommended), Lobstr, or xBull."                               |
| "What token is used?"          | "XLM (Stellar Lumens) — the native token of the Stellar network."                                         |
| "Is it safe?"                  | "The pool mechanics run on Soroban smart contracts on Stellar, providing transparency and security."      |
| "When do I get paid?"          | "After the dispute window closes (24h after resolution), winnings are automatically paid to your wallet." |

- Click to expand with smooth height animation
- Glow border on expanded item
- Plus/minus icon that rotates on toggle

---

### CTA Section at Bottom

- "Ready to Make Your First Prediction?"
- `GamingButton` `primary` `lg`: "Explore Matches" → home
- `GamingButton` `ghost` `lg`: "Connect Wallet" → trigger wallet modal

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/how-it-works`
2. **Build page layout** — hero, 5 content sections, CTA
3. **Build step-by-step timeline** — 6 steps with icons and staggered animation
4. **Build pool mechanics example** — visual walkthrough with animated numbers
5. **Build resolution diagram** — branching flow with color coding
6. **Build key concepts grid** — 6 concept cards
7. **Build FAQ accordion** — 8 expandable items
8. **Add scroll animations** — sections appear on scroll

**Example commit message:**

```
feat: how it works page — step guide, pool mechanics, resolution diagram, FAQ
```

---

## Acceptance Criteria

- [ ] Page renders at `/how-it-works`
- [ ] 6-step visual guide with icons, descriptions, and staggered scroll animation
- [ ] Pool mechanics section with walkthrough example and animated numbers
- [ ] Resolution system diagram showing all 5 phases including branching paths
- [ ] Key concepts grid with 6 cards including "Stellar Network" concept
- [ ] FAQ section with 8 questions, expandable accordion with smooth animation
- [ ] FAQ mentions **Stellar, XLM, Freighter, Soroban** — NOT Ethereum/MetaMask
- [ ] Bottom CTA: "Explore Matches" and "Connect Wallet" buttons
- [ ] All sections use gaming visual style (GlowCards, GlowIcons, etc.)
- [ ] Scroll-triggered animations for section entries
- [ ] Responsive: readable and well-laid-out on mobile

---

## Guidelines

- **PR description must include:** `Closes #16`
- **Screenshots required:** full page (desktop scroll capture), mobile, expanded FAQ item
- All content references the **Stellar ecosystem** (XLM, Soroban, Freighter)
- Calculator example numbers must be mathematically correct (verify the 5% fee math)
- This page uses NO mock data hooks — all content is static/hardcoded
- Keep animations smooth but not overwhelming — this is a reading-heavy page
