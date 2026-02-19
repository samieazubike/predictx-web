# Issue #06: Home Page — Hero Section

**Labels:** `page`, `home`, `ui`, `priority: high`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 2 — Core Pages  
**Estimate:** 3–4 hours  
**Depends on:** #01, #03, #04

---

## Description

Build the hero section — the first thing users see when they land on PredictX. It must immediately communicate the platform's value proposition ("Predict. Stake. Win."), explain the concept in 2–3 sentences, and drive users toward exploring matches. The visual treatment must establish the cyberpunk/gaming aesthetic from the very first viewport.

**Why it matters:** The hero section determines whether a new user engages with the dApp or bounces. It's the gateway to the entire product and sets the tone for the brand.

---

## Requirements and Context

### Hero Content — `components/home/hero.tsx`

**Tagline: "Predict. Stake. Win."**

- Large display font (Orbitron), all caps
- Each word enters with staggered animation (slide up + fade in, 200ms stagger)
- Electric cyan glow via `text-shadow` with `#00d9ff`
- Optional: subtle glitch effect on initial load (CSS `@keyframes` flicker)

**Subtitle (2–3 sentences):**

- "The community-driven football prediction market on Stellar. Create polls, stake crypto on match events, and earn rewards for accurate predictions."
- Body font (Barlow), lighter weight (`font-light`), `text-white/70`

**Primary CTA:** "Explore Matches"

- `GamingButton` variant `primary`, size `lg`
- Pulsing glow animation to draw attention
- Scrolls to upcoming matches section on home page (smooth scroll) or links to matches

**Secondary CTA:** "How It Works"

- `GamingButton` variant `ghost`, size `lg`
- Links to `/how-it-works`

### Hero Stats Bar

Horizontal row of 4 platform stats rendered **below** the hero text:

| Stat               | Value    | Icon           |
| ------------------ | -------- | -------------- |
| Total Value Locked | $847,293 | Shield/Lock    |
| Active Predictions | 234      | Activity/Pulse |
| Community Members  | 12,847   | Users          |
| Total Payouts      | $3.2M    | Trophy         |

- Each uses `AnimatedCounter` (slot machine roll-up animation on page load)
- Monospace font for numbers
- Semi-transparent `GlowCard` background with subtle glow border
- Dividers between stats (desktop) or 2×2 grid (mobile)

### Visual Effects

- `BackgroundEffects` component renders behind hero content (starfield/particles)
- Vignette effect (darkened corners) via CSS radial gradient overlay
- Content fades in with staggered delays: title (0ms) → subtitle (300ms) → CTAs (500ms) → stats (700ms)

### Responsive Behavior

- **Desktop:** hero takes ~80vh, centered content, stats in single row
- **Tablet:** slightly reduced font sizes, maintains horizontal layout
- **Mobile:** full-width stack, smaller typography, stats in 2×2 grid, hero ~60vh

---

## Suggested Execution

1. **Create branch**

    ```bash
    git checkout -b feat/hero-section
    ```

2. **Build `components/home/hero.tsx`** — tagline, subtitle, CTAs

3. **Add staggered entry animations** — use Framer Motion `motion.div` with `delay`

4. **Add stats bar** — 4 stat items using `AnimatedCounter` and `GlowCard`

5. **Wire to `app/page.tsx`** — render as first section

6. **Test responsive** — verify mobile (375px), tablet (768px), desktop (1440px)

**Example commit message:**

```
feat: hero section with animated tagline, stats bar, and CTAs
```

---

## Acceptance Criteria

- [ ] Tagline "Predict. Stake. Win." renders in Orbitron font with cyan glow
- [ ] Each word animates in with staggered delay
- [ ] Subtitle mentions "Stellar" ecosystem (not Ethereum)
- [ ] "Explore Matches" button scrolls to matches section or navigates
- [ ] "How It Works" button links to `/how-it-works`
- [ ] 4 platform stats display with animated counters on page load
- [ ] Background effects (particles/starfield) render behind content
- [ ] Vignette effect is visible
- [ ] Responsive: stacks on mobile, horizontal on desktop
- [ ] Stats pull from `useMockData().platformStats`
- [ ] No layout shift during animation entry

---

## Guidelines

- **PR description must include:** `Closes #6`
- **Screenshots/gifs required:** desktop hero, mobile hero, animation recording
- Reference "Stellar" in the subtitle copy — this is a Stellar dApp
- Do NOT render wallet-specific content in the hero — that's the header's job
- Keep background effects lightweight — test on low-end devices
