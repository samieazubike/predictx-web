# Issue #08: Home Page — Upcoming Matches Feed

**Labels:** `component`, `home`, `matches`, `priority: high`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 2 — Core Pages  
**Estimate:** 4–5 hours  
**Depends on:** #03, #04

---

## Description

Build the upcoming/live matches feed section on the home page. This is the primary browsing interface where users discover matches and navigate to their polls. Each match card links to the Match Detail page (`/match/[id]`).

**Why it matters:** Match discovery is step 2 of the user journey ("Browse → Explore Match → Stake"). If users can't find and scan matches quickly, they won't reach the staking flow.

---

## Requirements and Context

### Section Header — `components/home/upcoming-matches.tsx`

- Title: "UPCOMING MATCHES" — Orbitron, all caps, cyan glow
- Subtitle: "Pick a match and start predicting"
- Optional filter pills: "All", "Today", "Tomorrow", "This Week" (client-side filter)

### Match Card Design

Each of the 6 mock matches renders as a `GlowCard`:

| Element          | Details                                                 |
| ---------------- | ------------------------------------------------------- |
| **League**       | "Premier League" with league icon/badge                 |
| **Home Team**    | `TeamBadge` (hexagonal) + team name                     |
| **VS**           | Centered, glowing cyan, subtle rotation animation       |
| **Away Team**    | `TeamBadge` (hexagonal) + team name                     |
| **Date & Time**  | Formatted: "Sat, Feb 21 • 15:00 GMT", monospace time    |
| **Venue**        | Below date, smaller text                                |
| **Polls count**  | "12 Active Polls" badge with glow                       |
| **Total Pool**   | "$23,450 at stake" — gold text, monospace               |
| **Status badge** | UPCOMING (cyan), LIVE (pulsing green), COMPLETED (gray) |
| **Countdown**    | `CountdownTimer` to kickoff                             |

**Card interactions:**

- Hover: card lifts (`translateY(-4px)`), glow intensifies, holographic shift
- Click: navigates to `/match/[matchId]` via Next.js `<Link>`
- Entry animation: staggered slide-in from bottom, 100ms delay per card

### Live Match State

- Pulsing green border
- "LIVE" badge with animated green dot
- Current score shown prominently (if available)
- Timer shows match minute (e.g., "67'")

### Completed Match State

- Reduced opacity / dimmed glow (0.6 opacity on border)
- Final score displayed between teams
- "X polls awaiting resolution" notice (amber text)
- Still clickable

### Layout

- Desktop: 2 or 3 column grid
- Tablet: 2 columns
- Mobile: single column, full-width cards
- All 6 matches visible (no pagination needed for mock data)

### Empty State

- "No Upcoming Matches — Check Back Soon!"
- Minimal neon line art (football icon, floating/bobbing)
- `GamingButton` CTA: "Browse All Matches"

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/upcoming-matches`
2. **Build match card component** — reusable `MatchCard` in `components/home/`
3. **Build grid section** — title, optional filters, match cards grid
4. **Handle 3 states** — upcoming, live, completed card variants
5. **Wire to `app/page.tsx`** — render below platform stats
6. **Test all states** — verify upcoming, live (pulsing green), completed (dimmed)

**Example commit message:**

```
feat: upcoming matches feed with team badges, countdowns, and live states
```

---

## Acceptance Criteria

- [ ] All 6 mock matches render as cards in a responsive grid
- [ ] Each card shows: teams (with `TeamBadge`), date, venue, poll count, total pool, countdown
- [ ] "VS" text has cyan glow and subtle rotation
- [ ] Upcoming matches show countdown timer to kickoff
- [ ] Live match has pulsing green border and "LIVE" badge
- [ ] Completed match is dimmed with final score and "awaiting resolution" notice
- [ ] Card hover: lift + glow intensify
- [ ] Card click navigates to `/match/[matchId]`
- [ ] Cards stagger in on page load (animation)
- [ ] Responsive: 2–3 cols desktop, 2 cols tablet, 1 col mobile
- [ ] Data sourced from `useMockData().matches`

---

## Guidelines

- **PR description must include:** `Closes #8`
- **Screenshots required:** desktop grid, mobile stack, live match card, completed card
- `MatchCard` component should be reusable — it may be used on other pages
- Filter pills are optional for this issue — can be added as enhancement
- Use `<Link>` from `next/link` for navigation, NOT `router.push` on card click
