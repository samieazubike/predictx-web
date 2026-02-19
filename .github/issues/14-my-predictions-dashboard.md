# Issue #14: My Predictions Dashboard Page

**Labels:** `page`, `dashboard`, `core-feature`, `priority: critical`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 4 — Dashboard & Voting  
**Estimate:** 7–9 hours  
**Depends on:** #02, #03, #04, #11

---

## Description

Build the My Predictions Dashboard page (`/dashboard`) — the user's command center for tracking all activity: active stakes, pending resolutions, voting opportunities, and completed prediction history. This page also displays user stats, badges/gamification, and financial summary.

**Why it matters:** The dashboard is where users return after staking. It directly influences retention — users who can't easily track their stakes, see pending outcomes, or review their history will disengage. It also houses the voting opportunities feed, which drives the oracle resolution system.

---

## Requirements and Context

### Route

`app/dashboard/page.tsx`

### Wallet Required Gate

If wallet not connected:

- Full-page message: "Connect your wallet to view your predictions"
- Large `GamingButton`: "Connect Wallet" (cyan, pulsing)
- Animated wallet icon (floating/bobbing)
- Triggers `WalletConnectModal` on click

---

### Dashboard Header

`GlowCard` with HUD corner decorations:

| Element        | Value                             | Style                            |
| -------------- | --------------------------------- | -------------------------------- |
| Title          | "COMMAND CENTER"                  | Orbitron, all caps               |
| Wallet address | `GDKX...9F3H`                     | Monospace, copyable              |
| Total balance  | `20,833 XLM (≈$2,500)`            | Gold, large                      |
| Win rate       | "65% Win Rate"                    | Green badge                      |
| Total profit   | "+$847" or "-$123"                | Green (profit) or magenta (loss) |
| Badges row     | "Early Predictor", "3-Win Streak" | Small `BadgeComponent` icons     |

---

### Navigation Tabs — `GamingTabs`

4 tabs with count badges and glowing active indicator:

| Tab                  | Badge | Description                        |
| -------------------- | ----- | ---------------------------------- |
| Active Stakes        | (3)   | Polls staked on, not yet resolved  |
| Pending Resolution   | (2)   | Match ended, awaiting voting/admin |
| Voting Opportunities | (4)   | Polls user can vote on for rewards |
| Completed            | (6)   | Historical with outcomes           |

- Smooth sliding indicator between tabs
- Tab state persisted in URL: `/dashboard?tab=active` | `pending` | `voting` | `completed`
- Default: Active Stakes

---

### Tab 1: Active Stakes

**3 mock active stakes** as `GlowCard` items:

| Field              | Example                                       |
| ------------------ | --------------------------------------------- |
| Match              | "Chelsea vs Man United" with mini `TeamBadge` |
| Question           | "Will Palmer score?"                          |
| Your side          | "YES" badge (cyan) or "NO" badge (magenta)    |
| Your stake         | "$200" — monospace, prominent                 |
| Current pool       | `PoolProgressBar` showing live distribution   |
| Potential winnings | "$298" — green, calculated from current pool  |
| Time remaining     | `CountdownTimer` to match/lock time           |
| Status             | "Active" — green dot indicator                |

- Ordered by closest lock time first
- Click navigates to match page

**Empty state:** "No Active Plays Yet — Jump Into The Action!"

- Neon line art illustration (gaming controller or crystal ball)
- CTA: "Explore Matches" → home page

---

### Tab 2: Pending Resolution

**2 mock pending stakes:**

| Field               | Example                                           |
| ------------------- | ------------------------------------------------- |
| Match               | Teams + final score                               |
| Question            | "Will Palmer score?"                              |
| Your stake and side | "$200 on YES"                                     |
| Resolution status   | Status indicator (see below)                      |
| Vote tally          | "78% Yes • 22% No — 42 votes cast" (if in voting) |
| Estimated outcome   | Based on voting trend                             |

**Status indicators:**
| Status | Badge Color | Label |
|---|---|---|
| Voting in Progress | Yellow/amber | Timer "1h 23m remaining" |
| Admin Review | Orange | "Under review by admin team" |
| Multi-sig Review | Blue | "3-admin verification in progress" |
| Dispute Period | Red | "24h dispute window — 18h remaining" |

- Progress bar showing resolution stage progression

**Empty state:** "Nothing Pending — All Clear!" — green checkmark animation

---

### Tab 3: Voting Opportunities

**4 mock voting opportunities** (polls user did NOT participate in):

| Field              | Example                                     |
| ------------------ | ------------------------------------------- |
| Match context      | Teams + final score                         |
| Question           | "Did Palmer score?"                         |
| Evidence preview   | "Match highlights and stats available" link |
| Reward amount      | "Earn $12.50 for voting" — gold, prominent  |
| Quick vote buttons | YES / NO / UNCLEAR — large buttons          |
| Voting deadline    | `CountdownTimer`                            |
| Current tally      | "34 votes — 82% Yes"                        |

- Reward amounts: $8–$25 range
- Cards highlighted with gold border
- **Quick vote flow:** clicking YES/NO shows brief confirmation popup → "Are you sure? Vote: YES" → Confirm → toast "Vote cast! You earned $12.50" with reward animation
- Click card body for full voting interface (Issue #15)

**Empty state:** "Voting Arena Empty — Be The Judge!"

- Judge gavel neon illustration

---

### Tab 4: Completed Predictions

**6 mock completed predictions** (4 wins, 2 losses):

| Field         | Example (Win)              | Example (Loss)                   |
| ------------- | -------------------------- | -------------------------------- |
| Match         | Teams + final score        | Teams + final score              |
| Question      | "Will Palmer score?"       | "Will Arsenal keep clean sheet?" |
| Your side     | YES (cyan)                 | NO (magenta)                     |
| Your stake    | $200                       | $300                             |
| Outcome badge | ✅ WIN (neon green, shine) | ❌ LOSS (magenta)                |
| Amount        | "+$187" (green, glowing)   | "-$300" (magenta)                |
| ROI           | "+93.5%" (green badge)     | "-100%" (magenta badge)          |
| Date resolved | "2 days ago"               | "5 days ago"                     |
| Tx hash       | `a1b2...c3d4` (truncated)  | `e5f6...g7h8`                    |

**Summary statistics at top of tab:**
| Metric | Value |
|---|---|
| Total predictions | 6 |
| Wins / Losses | 4W / 2L |
| Win rate | 66.7% |
| Total profit/loss | +$447 |
| Best win | +$350 |
| Worst loss | -$300 |

**Sort options:** Latest, Highest Win, Biggest Loss  
**Filter:** All, Wins Only, Losses Only

**Empty state:** "History Locked — Make Your First Prediction!"

- Locked chest neon illustration
- CTA: "Start Predicting" → home

---

### Gamification Elements

**Badges section** in dashboard header or sidebar:

- Earned badges displayed with glow using `BadgeComponent`
- "Winning Streak" (3+ consecutive wins)
- "Early Predictor" (staked within first 5 min of poll)
- "Top Judge" (voted on 10+ polls accurately)
- Unearned badges shown as locked (dimmed, padlock overlay)

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/dashboard`
2. **Build wallet gate** — full-page connect prompt if not connected
3. **Build dashboard header** — summary stats, badges, address
4. **Build `GamingTabs` for 4 tabs** — wired to URL query params
5. **Build Active Stakes tab** — cards ordered by lock time
6. **Build Pending Resolution tab** — status indicators, progress bars
7. **Build Voting Opportunities tab** — quick vote flow, rewards
8. **Build Completed tab** — win/loss cards, summary stats, sort/filter
9. **Build empty states** for all 4 tabs
10. **Wire data** from `useStaking` and `useVoting` hooks

**Example commit message:**

```
feat: predictions dashboard — 4 tabs, active stakes, voting, completed history
```

---

## Acceptance Criteria

- [ ] Wallet gate shows "Connect Wallet" if not connected
- [ ] Dashboard header shows address, balance (XLM), win rate, profit, badges
- [ ] 4 tabs with count badges and smooth active indicator
- [ ] Tab state persisted in URL query param
- [ ] Active Stakes: 3 cards with match, question, side, stake, pool, countdown
- [ ] Pending Resolution: 2 cards with resolution status indicators and timers
- [ ] Voting Opportunities: 4 cards with reward amounts and quick vote buttons
- [ ] Quick vote triggers confirmation popup → toast with reward
- [ ] Completed: 6 cards (4 wins, 2 losses) with outcomes, amounts, ROI
- [ ] Completed summary stats accurate: 4W/2L, 66.7% win rate, +$447 profit
- [ ] Sort and filter work on Completed tab
- [ ] All 4 empty states render with correct messages and CTAs
- [ ] Badges render with correct earned/locked states
- [ ] Responsive: readable on mobile
- [ ] All addresses are Stellar format (G...)

---

## Guidelines

- **PR description must include:** `Closes #14`
- **Screenshots required:** each tab (non-empty + empty state), dashboard header, mobile view
- Use `useStaking` for stakes data, `useVoting` for voting data, `useWallet` for connection
- Tab navigation: use `useSearchParams()` from `next/navigation`
- Win/loss amounts and ROI should be pre-calculated in mock data, but verify with `lib/calculations.ts` formulas
