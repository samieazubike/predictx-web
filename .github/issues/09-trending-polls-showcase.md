# Issue #09: Home Page — Trending Polls Showcase

**Labels:** `component`, `home`, `polls`, `priority: high`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 2 — Core Pages  
**Estimate:** 3–4 hours  
**Depends on:** #03, #04

---

## Description

Build the trending polls showcase section for the home page. This highlights the hottest predictions across all matches — sorted by total pool size and participant count — to drive engagement and funnel users into the staking flow.

**Why it matters:** Trending polls are the hook. Users who see a $12K pool with 47 stakers on "Will Palmer score?" are far more likely to engage than users who only see match listings. This section creates urgency and social proof.

---

## Requirements and Context

### Section — `components/home/trending-polls.tsx`

**Header:**

- Title: "TRENDING PREDICTIONS" or "HOT POLLS 🔥" — Orbitron, all caps
- Subtitle: "The most popular predictions right now"
- Optional: animated fire/trending icon with glow

### PollCard Component — `components/match/poll-card.tsx`

> **This component is shared** between the home page trending section and the Match Detail page (Issue #12). Build it as a reusable component.

Display the top 4–6 polls sorted by `totalPool` descending:

| Element                   | Details                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| **Match context**         | "Chelsea vs Man United" with small `TeamBadge` icons                    |
| **Poll question**         | "Will Palmer score a goal?" — bold, prominent, display font             |
| **Category tag**          | Colored pill — cyan (Player), green (Team), gold (Score), white (Other) |
| **Pool distribution bar** | `PoolProgressBar` — Yes (cyan) vs No (magenta)                          |
| **Total pool**            | "$12,450" — gold text, monospace font                                   |
| **Participant count**     | "47 stakers" with Users icon                                            |
| **Countdown**             | `CountdownTimer` (compact mode) — time until lock                       |
| **Social proof**          | "34 people staked Yes in last hour" — italic, dimmed text               |
| **"Stake Now" button**    | `GamingButton` variant `primary` — opens StakeModal (Issue #10)         |

### Visual Enhancements

- **#1 trending poll:** "HOTTEST 🔥" badge with gold glow + animated gradient border
- **High-value pools (>$10K):** `energy-shield` CSS effect
- Card hover: holographic shift, border glow intensifies, slight elevation
- Cards stagger in with slide + fade on scroll into view

### Interactions

- **"Stake Now" button:**
    - If wallet connected → opens `StakeModal` with poll pre-selected
    - If wallet NOT connected → triggers wallet connect modal first, then opens stake modal
- **Card click** (not on button): navigates to match page `/match/[matchId]`

### Layout

- Desktop: 2-column grid
- Tablet: 2 columns
- Mobile: single column stack

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/trending-polls`
2. **Build `PollCard` component** — shared, reusable (used by Issue #12 too)
3. **Build `trending-polls.tsx` section** — title + grid of top polls
4. **Wire to `app/page.tsx`** — render below upcoming matches
5. **Test stake button** — verify wallet-gated behavior

**Example commit message:**

```
feat: trending polls showcase with reusable PollCard component
```

---

## Acceptance Criteria

- [ ] 4–6 trending polls displayed, sorted by total pool size
- [ ] Each `PollCard` shows: question, match context, category tag, pool bar, countdown, participants, social proof
- [ ] `PoolProgressBar` accurately reflects Yes/No percentages with correct colors
- [ ] #1 poll has "HOTTEST" badge with gold glow
- [ ] "Stake Now" button gates on wallet connection
- [ ] Clicking card body navigates to match page
- [ ] Cards animate in on scroll
- [ ] `PollCard` is reusable — exported from `components/match/poll-card.tsx`
- [ ] Responsive: 2 cols desktop, 1 col mobile
- [ ] Data from `useMockData().trendingPolls`

---

## Guidelines

- **PR description must include:** `Closes #9`
- **Screenshots required:** trending section desktop, mobile, PollCard hover state
- `PollCard` must be built as a shared component — Issue #12 (Match Detail) will import it
- "Stake Now" triggers the `StakeModal` from Issue #10 — if #10 isn't merged yet, wire to a placeholder/noop with `console.log`
- Social proof text comes from `poll.recentActivity` field in mock data
