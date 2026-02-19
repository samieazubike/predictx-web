# Issue #17: Animations, Transitions & Special Effects

**Labels:** `ui`, `animations`, `polish`, `priority: medium`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 5 — Polish  
**Estimate:** 6–8 hours  
**Depends on:** #04, and all page issues (#06–#16)

---

## Description

Implement the full set of gaming-grade animations, transitions, and special effects described in the PRD across all pages and components. This includes page transitions, entry animations, success/failure effects, particle systems, glitch effects, and micro-interactions that give the dApp its **Cyberpunk 2077 × Apex Legends** feel.

**Why it matters:** The PRD explicitly calls for a gaming aesthetic where "constant subtle motion" and a "premium/expensive feel" are core to the brand. Without these effects, PredictX looks like a generic dark-themed app. These animations are what make the experience "addictive to interact with."

---

## Requirements and Context

### Page Transitions

- [ ] Route changes have smooth fade or slide transitions (Framer Motion `AnimatePresence` in layout)
- [ ] Outgoing page fades out (200ms), incoming page fades in (300ms)
- [ ] Optional: slight scale animation (0.98 → 1.0) on enter

### Entry Animations (per component)

- [ ] **Cards:** slide in with trail effect + stagger delays (100ms per card)
- [ ] **Hero text:** staggered word-by-word entry (slide up + fade)
- [ ] **Stats:** count-up animation triggered by scroll (Intersection Observer / `whileInView`)
- [ ] **Modals:** slide in from edge with motion blur effect (Framer Motion spring)
- [ ] **Dropdowns:** scale from origin point + fade

### Button Interactions

- [ ] **Hover:** scale(1.05) + glow intensity increase + subtle rotate(1deg)
- [ ] **Click/Active:** quick scale(0.95) + shockwave ripple effect (CSS radial-gradient expanding)
- [ ] **Shine effect:** linear gradient sweep across button on hover (CSS animation)
- [ ] Apply to all `GamingButton` instances

### Transaction & Loading Effects

- [ ] **Rotating hexagon loader** with particle trail (for transaction processing)
- [ ] **Progress bar** with animated energy flow (gradient that moves along bar)
- [ ] **Glitch effect** during processing state (CSS `clip-path` randomization or text flicker)
- [ ] Apply to: StakeModal processing, vote processing, poll creation

### Success State Effects

- [ ] **Screen flash:** brief cyan/green color overlay (200ms fade in/out)
- [ ] **Particle explosion:** burst of small circles from center/button (CSS or canvas)
- [ ] **Trophy/coin rain:** falling coin particles for big wins (optional, lightweight)
- [ ] **Victory text animation:** text scales up from 0 with spring physics + glow pulse
- [ ] Apply to: successful stake, successful vote, poll creation success

### Failure State Effects

- [ ] **Screen shake:** CSS `transform: translate()` oscillation for 300ms
- [ ] **Red flash:** brief magenta overlay (150ms)
- [ ] **Shake on element:** error inputs shake horizontally (3 oscillations)
- [ ] Apply to: transaction failure, validation errors, balance insufficient

### Counter & Number Animations

- [ ] Numbers **flip/roll** like slot machines when changing (digit-by-digit roll)
- [ ] **Glowing pulse** when values finish changing
- [ ] **Shake effect** on large number changes (>20% delta)
- [ ] Apply to: `AnimatedCounter`, pool amounts in StakeModal, stats

### Background Effects

- [ ] **Animated starfield / particle system** — subtle floating dots (CSS or lightweight canvas)
- [ ] **Floating geometric shapes** — hexagons, triangles fading in/out in background
- [ ] **Gradient mesh** — subtle color shift over time (CSS `background-position` animation)
- [ ] Performance: use `requestAnimationFrame`, limit particles, respect `prefers-reduced-motion`

### Micro-Interactions

- [ ] **Copy to clipboard:** brief checkmark icon replace + fade back
- [ ] **Tab switch:** glowing indicator slides smoothly between tabs (Framer Motion layout animation)
- [ ] **Tooltip hover:** fade in with slight Y offset (200ms)
- [ ] **Countdown tick:** subtle pulse on second change (scale 1.0 → 1.02 → 1.0)
- [ ] **Pool bar update:** smooth width transition when pool changes (300ms ease-out)
- [ ] **Toggle switch:** electric arc spark on toggle (brief cyan flash between states)

### HUD & Achievement Effects

- [ ] **Notification badge:** pulse animation (infinite, subtle)
- [ ] **Achievement toast:** slides in from right with trail effect, auto-dismisses
- [ ] **XP bar fill:** animated progress fill with glow at leading edge

### Sound Design Visual Cues (no actual audio)

- [ ] Buttons look **pressable** — clear depth with hover/active states
- [ ] Success feels **rewarding** — multiple combined effects (flash + particles + text)
- [ ] Errors feel **rejected** — harsh, quick effects (shake + red flash)
- [ ] Loading feels **active** — continuous motion (spinning + flowing + glitch)

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/animations-effects`
2. **Start with global page transitions** — `AnimatePresence` in layout
3. **Add button interactions** to `GamingButton` — hover, active, shine sweep
4. **Add entry animations** to cards/sections (Framer Motion `whileInView` + stagger)
5. **Build loading effects** — hexagon spinner, progress bar, glitch
6. **Build success/failure effects** — particle burst, screen flash, shake
7. **Enhance `BackgroundEffects`** — starfield, geometric shapes, gradient mesh
8. **Add micro-interactions** — copy, tab slide, tooltip, countdown tick
9. **Performance audit** — test on low-end device, add `prefers-reduced-motion` fallbacks

**Example commit message:**

```
feat: gaming animations — page transitions, particles, success effects, micro-interactions
```

---

## Acceptance Criteria

- [ ] Page transitions work smoothly between all routes
- [ ] Card entry animations stagger correctly on all pages
- [ ] `GamingButton` has hover scale + glow, click ripple, and shine sweep
- [ ] Transaction loading shows hexagon spinner + progress bar + glitch text
- [ ] Success states show screen flash + particle explosion + victory text
- [ ] Failure states show shake + red flash
- [ ] Counter animations roll digits on value change
- [ ] Background starfield/particles render without impacting scroll performance
- [ ] Tab indicators slide smoothly between tabs
- [ ] All animations respect `prefers-reduced-motion` (disable or reduce)
- [ ] No jank or dropped frames at 60fps on desktop (test in DevTools Performance tab)
- [ ] No hydration mismatches from animation state

---

## Guidelines

- **PR description must include:** `Closes #17`
- **GIFs required:** 5+ recordings showing key animations (buttons, success, failure, page transition, background)
- Prefer CSS animations for simple effects (performance), Framer Motion for complex physics
- Keep particle counts low (<50 on screen at once)
- Use `will-change` sparingly — only on actively animating elements
- Test on Chrome DevTools Performance panel — aim for no long frames during animations
- Do NOT add actual audio files — this is visual-only
