# Issue #01: Project Setup, Theming & Configuration

**Labels:** `setup`, `infrastructure`, `priority: critical`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 1 — Foundation  
**Estimate:** 4–5 hours

---

## Description

Establish the foundational project configuration for the PredictX dApp — a Web3 football prediction market on the **Stellar ecosystem**. This issue sets up all dependencies, the cyberpunk/gaming color palette, custom fonts, Tailwind theme extensions, folder structure, and the base root layout. Every subsequent issue depends on this foundation being solid.

**Why it matters:** Without a correctly configured project with consistent theming, fonts, and folder conventions, all downstream feature work will be blocked or inconsistent. This issue removes ambiguity for every contributor that follows.

---

## Requirements and Context

### Dependencies to Install

- **Tailwind CSS** — all styling (verify PostCSS pipeline works)
- **Lucide React** — icon library
- **Recharts** — pie charts for pool distribution, bar charts for stats
- **Sonner** — toast notification system
- **Framer Motion** — advanced animations (entry, exit, layout transitions)
- **shadcn/ui** — base components (Button, Dialog, Dropdown, Input, Progress, Tabs)
- **@stellar/freighter-api** — Stellar Freighter wallet SDK (do NOT install ethers.js/wagmi — this is Stellar, not EVM)

### Font Configuration

| Use Case         | Font                                                                      | Tailwind Utility |
| ---------------- | ------------------------------------------------------------------------- | ---------------- |
| Headers / Titles | **Orbitron** (or Rajdhani / Saira Condensed) — bold, all-caps, aggressive | `font-display`   |
| Body Text        | **Barlow** (or Rajdhani Regular) — clean geometric sans-serif             | `font-body`      |
| Numbers / Stats  | **JetBrains Mono** (or Roboto Mono) — digital/tech feel                   | `font-mono`      |

- Import via `next/font/google` in `app/layout.tsx`
- Apply as CSS variables on `<body>` and expose via Tailwind `fontFamily` config

### Tailwind Theme Extension (`tailwind.config.ts`)

**Custom colors:**

```
background-deep: #0a0e27
background-surface: #1a1f3a
accent-cyan: #00d9ff
accent-green: #39ff14
accent-magenta: #ff006e
accent-gold: #ffd700
```

**Custom box-shadow utilities:**

```
shadow-cyan-glow: 0 0 15px rgba(0, 217, 255, 0.5)
shadow-green-glow: 0 0 15px rgba(57, 255, 20, 0.5)
shadow-magenta-glow: 0 0 15px rgba(255, 0, 110, 0.5)
shadow-gold-glow: 0 0 15px rgba(255, 215, 0, 0.5)
```

**Custom animation keyframes:** `pulse-glow`, `scan-line`, `shimmer`, `float`, `shake`

### Folder Structure

```
app/
  layout.tsx          ← root layout (fonts, providers, bg gradient)
  page.tsx            ← Home / Discovery
  dashboard/page.tsx  ← My Predictions
  match/[id]/page.tsx ← Match Detail
  voting/page.tsx     ← Voting Center
  how-it-works/page.tsx
components/
  ui/                 ← shadcn primitives
  layout/             ← Header, Footer, Navigation
  home/               ← Hero, TrendingPolls, UpcomingMatches, PlatformStats
  match/              ← MatchHeader, PollCard, PollsList
  staking/            ← StakeModal, WinningsCalculator, PoolDistribution
  poll/               ← CreatePollModal, PollPreview
  dashboard/          ← DashboardTabs, ActiveStakes, PendingResolution, VotingOpportunities, CompletedPredictions
  voting/             ← VotingCard, EvidenceSection, VoteTally
  wallet/             ← WalletButton, WalletConnectModal
  shared/             ← CountdownTimer, AnimatedCounter, GlowCard, BadgeComponent, BackgroundEffects
hooks/
  use-wallet.ts
  use-mock-data.ts
  use-countdown.ts
  use-staking.ts
  use-voting.ts
lib/
  utils.ts
  mock-data.ts
  constants.ts
  calculations.ts
  stellar.ts          ← Stellar SDK helpers / contract interaction layer
types/
  index.ts
```

### Root Layout (`app/layout.tsx`)

- Apply all 3 fonts as CSS variables on `<html>`/`<body>`
- Deep dark gradient background (`#0a0e27 → #1a1f3a`) via CSS
- Sonner `<Toaster>` provider (dark theme, bottom-right)
- Dark mode as the **only** theme — no light mode toggle
- `<Header />` component placeholder rendered in layout

### Global CSS (`app/globals.css`)

- CSS custom properties for all theme colors
- Base reset / scrollbar styling (dark themed, thin)
- Selection color (cyan highlight)
- Animated starfield/particle background keyframes
- Scan-line overlay utility class
- Glow text-shadow utility classes

---

## Suggested Execution

1. **Fork the repo and create a branch**

    ```bash
    git checkout -b setup/project-foundation
    ```

2. **Install dependencies**

    ```bash
    pnpm add lucide-react recharts sonner framer-motion @stellar/freighter-api
    pnpm dlx shadcn@latest init   # then add: button dialog dropdown-menu input progress tabs
    ```

3. **Configure fonts** — add `next/font/google` imports in `layout.tsx`, expose as CSS vars

4. **Extend Tailwind config** — add colors, shadows, animations, font families

5. **Create folder structure** — add all directories with placeholder `index.ts` barrel files where appropriate

6. **Build root layout** — fonts, providers, gradient background, `<Toaster />`

7. **Set up `globals.css`** — custom properties, scrollbar, selection, background animations

8. **Verify** — `pnpm dev` runs without errors, fonts render, colors apply, toast fires on a test button

**Example commit message:**

```
feat: project foundation — deps, fonts, tailwind theme, folder structure
```

---

## Acceptance Criteria

- [ ] All dependencies install and project runs with `pnpm dev` without errors
- [ ] 3 fonts load (display, body, mono) and apply correctly via Tailwind utilities
- [ ] Custom colors, shadows, and animation keyframes available in Tailwind
- [ ] Folder structure matches specification above
- [ ] Root layout renders dark gradient background, font variables, toast provider
- [ ] `globals.css` includes custom properties, dark scrollbar, selection color
- [ ] `@stellar/freighter-api` is installed (NOT ethers.js or wagmi)
- [ ] No light mode — dark theme is hardcoded

---

## Guidelines

- **PR description must include:** `Closes #1`
- **Screenshots required:** terminal showing `pnpm dev` success, browser showing dark gradient + fonts
- Ensure no unused dependencies are installed
- Do NOT add real Stellar network configuration yet — that is handled in Issue #20
- This is a **Stellar dApp**, not EVM — any Ethereum-specific tooling is incorrect
