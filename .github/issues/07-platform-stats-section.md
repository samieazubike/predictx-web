# Issue #07: Home Page — Platform Stats Dashboard Section

**Labels:** `component`, `home`, `ui`, `priority: high`  
**Complexity:** Trivial (100 points)  
**Milestone:** Sprint 2 — Core Pages  
**Estimate:** 2–3 hours  
**Depends on:** #03, #04

---

## Description

Build a dedicated platform statistics section for the home page that showcases PredictX's key metrics with animated counters and the gaming visual style. While the hero includes a compact stats bar, this section provides a more prominent, full-width treatment further down the page.

**Why it matters:** Platform stats build trust and social proof for new users. Seeing "$847K locked" and "12K+ members" signals that the platform is active and worth engaging with.

---

## Requirements and Context

### Component: `components/home/platform-stats.tsx`

**Section header:**

- Title: "PLATFORM STATS" or "BY THE NUMBERS" — display font (Orbitron), all caps, cyan glow
- Subtitle: "Real-time platform activity" — body font, dimmed

**4 stat cards in a row:**

| Stat               | Value    | Icon (Lucide) | Card Treatment                              |
| ------------------ | -------- | ------------- | ------------------------------------------- |
| Total Value Locked | $847,293 | `Shield`      | `energy-shield` effect (highest importance) |
| Active Predictions | 234      | `Activity`    | standard `GlowCard`                         |
| Community Members  | 12,847   | `Users`       | standard `GlowCard`                         |
| Total Payouts      | $3.2M    | `Trophy`      | gold variant `GlowCard`                     |

**Per card:**

- `GlowCard` with scan-line overlay
- `GlowIcon` at top with inner glow
- Stat label in body font, `text-white/60`
- Stat value in large monospace font — uses `AnimatedCounter` with slot-machine roll-up
- Glowing pulse effect when counter finishes
- Staggered entry animation (left to right, 100ms stagger per card)

**Scroll trigger:**

- Counter animation starts when section scrolls into viewport (Intersection Observer or Framer Motion `whileInView`)
- Counters should only animate once (not re-trigger on scroll up/down)

### Layout

- Desktop: 4 equal columns
- Tablet: 2×2 grid
- Mobile: 2×2 grid

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/platform-stats`
2. **Build `platform-stats.tsx`** — section with title + 4 stat cards
3. **Wire `AnimatedCounter`** with `whileInView` trigger
4. **Render in `app/page.tsx`** below hero section
5. **Test responsive** at 375px, 768px, 1440px

**Example commit message:**

```
feat: platform stats section with scroll-triggered animated counters
```

---

## Acceptance Criteria

- [ ] 4 stat cards render with correct values from mock data
- [ ] Counters animate (roll-up) only when section enters viewport
- [ ] Counters animate once, not on every intersection
- [ ] Cards stagger in from left to right
- [ ] "Total Value Locked" card has energy-shield effect
- [ ] "Total Payouts" card uses gold variant
- [ ] Responsive: 4 columns desktop, 2×2 mobile/tablet
- [ ] Monospace font used for all numbers

---

## Guidelines

- **PR description must include:** `Closes #7`
- Pull data from `useMockData().platformStats` — do NOT hardcode values
- This section is distinct from the hero stats bar — it's a full-width treatment
- Keep animations performant — use `will-change` sparingly
