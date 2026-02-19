# Issue #12: Match Detail Page

**Labels:** `page`, `match`, `polls`, `priority: critical`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 3 — Core Features  
**Estimate:** 6–8 hours  
**Depends on:** #03, #04, #08, #09

---

## Description

Build the Match Detail page (`/match/[id]`). This is the hub for all prediction activity around a specific match. Users see match details, browse all polls organized by category, view pool distributions, and access the staking interface. This page is where the user journey transitions from "browsing" to "taking action."

**Why it matters:** Match Detail is the convergence point — it aggregates 4–5 polls per match, shows pool distributions, and provides the "Stake Now" gateway. It's the most content-dense page in the app and the biggest driver of staking conversions.

---

## Requirements and Context

### Route

`app/match/[id]/page.tsx` — dynamic route with match ID parameter

---

### Match Header — `components/match/match-header.tsx`

Full-width `GlowCard`:

| Element          | Details                                                   |
| ---------------- | --------------------------------------------------------- |
| **League**       | "Premier League" with shield icon                         |
| **Home Team**    | Large `TeamBadge` (hexagonal) + team name (Orbitron font) |
| **VS**           | Centered, glowing cyan, subtle rotation animation         |
| **Away Team**    | Large `TeamBadge` (hexagonal) + team name                 |
| **Score**        | Large monospace numbers between teams (if live/completed) |
| **Date & Time**  | "Saturday, Feb 21, 2026 • 15:00 GMT"                      |
| **Venue**        | "Stamford Bridge, London"                                 |
| **Status badge** | UPCOMING (cyan), LIVE (pulsing green), COMPLETED (gray)   |
| **Countdown**    | Large `CountdownTimer` to kickoff (if upcoming)           |
| **Match minute** | "67'" with pulsing indicator (if live)                    |

- Animated entry: slide down + fade
- Background: subtle gradient with team colors blended

---

### Match Stats Bar

Row of match-level aggregate stats:

| Stat               | Example            | Format               |
| ------------------ | ------------------ | -------------------- |
| Total Polls        | "15 Active Polls"  | Number + label       |
| Total Pool         | "$45,230 at stake" | Gold text, monospace |
| Total Participants | "312 stakers"      | Number + label       |

- `AnimatedCounter` for each
- `GlowCard` with scan-line overlay

---

### Poll Category Filters

Horizontal filter tabs/pills:

| Filter            | Icon         | Description                 |
| ----------------- | ------------ | --------------------------- |
| All Polls         | `LayoutGrid` | Default, show all           |
| Player Events     | `User`       | Player-specific predictions |
| Team Events       | `Shield`     | Team-level predictions      |
| Score Predictions | `Hash`       | Score/goals predictions     |
| Other             | `Star`       | Miscellaneous               |

- `GamingTabs` component
- Count badge per tab showing number of polls in that category
- Smooth content transition when switching (fade/slide)
- Client-side filtering (no route change)

---

### Poll Cards Grid — `components/match/polls-list.tsx`

Uses the shared `PollCard` from Issue #09 for each poll.

**Each poll card shows:**

- Question: bold, display font
- Category tag: colored pill
- Pool distribution: `PoolProgressBar` (Yes cyan, No magenta)
- Participant counts: "32 Yes • 15 No"
- Countdown to lock: `CountdownTimer` compact
- Social proof: "34 people staked Yes in last hour"
- "Stake Now" button → opens `StakeModal` (Issue #10)

**Poll status variants:**

| Status   | Visual                                                                  |
| -------- | ----------------------------------------------------------------------- |
| Active   | Green dot + "Open", full interactivity                                  |
| Locked   | Red dot + "LOCKED", dimmed, button disabled with lock icon              |
| Voting   | Yellow dot + "Awaiting Resolution", voting timer shown                  |
| Resolved | Checkmark + "YES WON" (green) or "NO WON" (magenta), final distribution |

- Card hover: holographic shift, glow intensifies, `translateY(-2px)`
- Staggered entry animation on load (100ms delay per card)

---

### Sort & Order

Dropdown or toggle group:
| Option | Behavior |
|---|---|
| Highest Pool (default) | Sort by `totalPool` descending |
| Most Participants | Sort by total participants descending |
| Closing Soon | Sort by `lockTime` ascending |
| Newest | Sort by `createdAt` descending |

- Gaming-styled dropdown (`GlowCard` styled)
- Client-side sorting

---

### Create Poll CTA

- Prominent button or floating action button: "CREATE A PREDICTION"
- `GamingButton` variant `gold`
- Opens `CreatePollModal` (Issue #13) with match pre-selected
- Positioned above or below the poll grid

---

### Layout

- Desktop: 2 or 3 column grid for poll cards
- Tablet: 2 columns
- Mobile: single column, full-width cards

### Edge Cases

- **Invalid match ID:** render 404-style state with "Match not found" message and link back to home
- **No polls for category:** "No predictions in this category yet" + CTA "Create the first prediction!"
- **All polls locked (match started):** banner: "Match has started — staking is closed for most polls"

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/match-detail-page`
2. **Build `MatchHeader` component** — teams, score, countdown, status
3. **Build match stats bar** — 3 aggregate stats
4. **Build category filter tabs** — using `GamingTabs`
5. **Build `PollsList` component** — grid of `PollCard` items with filtering + sorting
6. **Build sort dropdown** — gaming-styled select
7. **Add Create Poll CTA** — button wired to `CreatePollModal`
8. **Handle edge cases** — invalid ID, empty category, all-locked
9. **Wire to `app/match/[id]/page.tsx`** — fetch match by ID from `useMockData`

**Example commit message:**

```
feat: match detail page — header, poll grid, category filters, sorting
```

---

## Acceptance Criteria

- [ ] Route `/match/[id]` renders correct match data
- [ ] Match header shows teams with `TeamBadge`, date, venue, countdown, status badge
- [ ] Stats bar shows total polls, pool, and participants with animated counters
- [ ] Category filters work (All, Player Events, Team Events, Score, Other)
- [ ] Poll cards render using shared `PollCard` component from Issue #09
- [ ] All 4 poll statuses display correctly: active, locked, voting, resolved
- [ ] "Stake Now" opens `StakeModal` with correct poll pre-loaded
- [ ] Sort works: highest pool, most participants, closing soon, newest
- [ ] "Create Prediction" button opens `CreatePollModal` with match pre-selected
- [ ] Invalid match ID shows 404/error state
- [ ] Empty category shows "no predictions" empty state
- [ ] Responsive: 2–3 cols desktop, 1 col mobile
- [ ] Staggered card entry animation on page load

---

## Guidelines

- **PR description must include:** `Closes #12`
- **Screenshots required:** full page desktop, mobile, locked poll, resolved poll, empty state
- Reuse `PollCard` from Issue #09 — do NOT duplicate
- Data from `useMockData().getMatch(id)` and `useMockData().getPolls(matchId)`
- Filtering and sorting are client-side only
- Use Next.js `params` for dynamic route (App Router pattern)
