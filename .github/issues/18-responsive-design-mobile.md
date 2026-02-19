# Issue #18: Responsive Design & Mobile Optimization

**Labels:** `ui`, `responsive`, `mobile`, `priority: high`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 5 — Polish  
**Estimate:** 4–6 hours  
**Depends on:** All page issues (#05–#16)

---

## Description

Audit and optimize every page and component for responsive behavior across mobile (320px–767px), tablet (768px–1023px), and desktop (1024px+). This includes touch feedback, swipe gestures, fullscreen modals on mobile, bottom navigation, large touch targets, and mobile-specific layouts.

**Why it matters:** Web3 users increasingly interact from mobile devices. A dApp that looks great on desktop but is unusable on mobile loses a significant portion of its potential users. The PRD explicitly calls out mobile-specific features (bottom nav, fullscreen modals, touch feedback).

---

## Requirements and Context

### Breakpoints

| Name    | Range          | Tailwind               |
| ------- | -------------- | ---------------------- |
| Mobile  | 320px – 767px  | Default (mobile-first) |
| Tablet  | 768px – 1023px | `md:`                  |
| Desktop | 1024px+        | `lg:` / `xl:`          |

### Page-Level Responsive Audit

**All pages must be tested at:** 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px, 1440px, 1920px

#### Home Page (`/`)

- [ ] Hero: stacks vertically, smaller typography, stats in 2×2 grid
- [ ] Platform stats: 2×2 grid on mobile
- [ ] Upcoming matches: single column cards
- [ ] Trending polls: single column cards

#### Match Detail (`/match/[id]`)

- [ ] Match header: stacks vertically, team names below badges
- [ ] Filter tabs: horizontally scrollable if overflow
- [ ] Poll cards: single column
- [ ] Sort dropdown: full-width on mobile

#### Dashboard (`/dashboard`)

- [ ] Tabs: horizontally scrollable if overflow
- [ ] Stake cards: single column
- [ ] Summary stats: 2×2 grid or vertical stack
- [ ] Sort/filter controls: dropdown, not inline pills

#### Voting (`/voting`)

- [ ] Voting cards: full-width, single column
- [ ] Evidence section: collapsed by default on mobile
- [ ] Vote buttons: full-width, stacked or side-by-side

#### How It Works (`/how-it-works`)

- [ ] Steps: vertical timeline only (no horizontal)
- [ ] Concept cards: single column
- [ ] FAQ: full-width accordion

### Component-Level Responsive

- [ ] **`GlowCard`**: maintains padding and glow at all sizes
- [ ] **`PoolProgressBar`**: labels stack above/below bar on mobile (not inline)
- [ ] **`CountdownTimer`**: compact mode on mobile (no labels, just numbers)
- [ ] **`GamingButton`**: full-width option (`w-full`) for mobile contexts
- [ ] **`GamingTabs`**: horizontally scrollable with snap points when tabs overflow
- [ ] **`GamingInput`**: full-width, larger touch target (48px+ height)
- [ ] **`TeamBadge`**: smaller size on mobile

### Mobile-Specific Features

- [ ] **Touch feedback:** ripple effect on tap (CSS `::after` radial gradient expanding)
- [ ] **Large touch targets:** all interactive elements ≥ 44×44px per WCAG guidelines
- [ ] **Fullscreen modals:** `StakeModal` and `CreatePollModal` take full viewport on mobile
- [ ] **Bottom navigation bar:** visible on mobile, hidden on desktop (Issue #05 — verify)
- [ ] **Haptic feedback indicators:** visual pulse/flash on tap to compensate for no haptic API
- [ ] **Swipeable content:** horizontal scroll with snap for match cards on mobile (optional)
- [ ] **No hover-only UI:** everything accessible via tap (no hover-only tooltips)

### Typography Scaling

- [ ] Hero title: `text-4xl md:text-5xl lg:text-7xl`
- [ ] Section titles: `text-2xl md:text-3xl lg:text-4xl`
- [ ] Card titles: `text-lg md:text-xl`
- [ ] Body text: `text-sm md:text-base`
- [ ] Stat numbers: `text-2xl md:text-3xl lg:text-4xl`

### Safe Areas

- [ ] Respect `env(safe-area-inset-bottom)` for bottom nav on notched phones
- [ ] No content hidden behind fixed header/bottom nav (scroll padding)

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/responsive-mobile`
2. **Audit each page** at 375px, 768px, 1440px in Chrome DevTools
3. **Fix layout issues** — grids, stacking, overflow, font sizes
4. **Add touch feedback** — ripple effects, large targets
5. **Ensure modals are fullscreen** on mobile
6. **Verify bottom nav** — correct behavior, safe areas
7. **Test typography scale** — all text readable at 375px without horizontal scroll

**Example commit message:**

```
feat: responsive design — mobile layouts, touch feedback, fullscreen modals
```

---

## Acceptance Criteria

- [ ] All pages render without horizontal overflow at 320px viewport width
- [ ] No text is unreadable on mobile (minimum 14px effective font size)
- [ ] All interactive elements ≥ 44×44px tap targets on mobile
- [ ] Modals go fullscreen on mobile (< 768px)
- [ ] Bottom nav visible on mobile, hidden on desktop
- [ ] Touch feedback (ripple) on interactive elements
- [ ] Match cards stack to single column on mobile
- [ ] Stat grids become 2×2 on mobile
- [ ] Tab bars horizontally scroll when overflowing
- [ ] No hover-only interactions (all accessible via tap)
- [ ] Safe area insets respected on notched devices
- [ ] Typography scales appropriately across all breakpoints

---

## Guidelines

- **PR description must include:** `Closes #18`
- **Screenshots required:** every page at 375px and 1440px (mobile/desktop side-by-side)
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) — NOT media queries in CSS
- Test with Chrome DevTools Device Toolbar — NOT just resizing browser window
- Don't remove desktop effects — add mobile-specific overrides
- See PRD "Mobile Responsive" section for full mobile requirements
