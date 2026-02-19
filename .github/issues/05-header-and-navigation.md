# Issue #05: Header, Navigation & Mobile Bottom Bar

**Labels:** `component`, `navigation`, `layout`, `priority: high`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 2 — Core Layout  
**Estimate:** 4–5 hours  
**Depends on:** #01, #04, #11

---

## Description

Build the main header/navigation with gaming HUD styling, including desktop navigation, mobile hamburger menu, and a mobile-only bottom navigation bar. The header also houses the Stellar wallet connect button and serves as the persistent navigation shell across all pages.

**Why it matters:** The header is rendered in the root layout and visible on every page. It establishes the HUD aesthetic, provides primary navigation, and is the entry point for wallet connection — the most critical action for a dApp.

---

## Requirements and Context

### Desktop Header (`components/layout/header.tsx`)

- **Position:** fixed/sticky at top, full-width, `z-50`
- **Background:** semi-transparent dark (`bg-background-deep/80`) with `backdrop-blur-md`
- **Corner bracket decorations** (HUD style) — CSS `::before`/`::after` pseudo-elements
- **Logo:** "PredictX" in Orbitron font, electric cyan glow (`text-shadow`)
- **Navigation links:**
  | Label | Route |
  |---|---|
  | Home | `/` |
  | Dashboard | `/dashboard` |
  | Voting | `/voting` |
  | How It Works | `/how-it-works` |
- **Active link:** glowing cyan underline indicator (animated slide to active position)
- **Hover:** glow increases, slight scale
- **Wallet Button** (top right):
    - Disconnected: "Connect Wallet" with pulsing glow border
    - Connected: truncated Stellar address (`GDKX...9F3H`) + XLM balance shown like game currency
    - Clicking connected wallet opens dropdown (Issue #11)
- **Notification badge** on Voting link: shows count of available voting opportunities, pulses

### Mobile Header (< 768px)

- Logo "PredictX" (smaller)
- Hamburger icon (right side) with animated open/close transition (3 bars → X)
- Full-screen overlay menu on open:
    - Dark background with hexagonal pattern
    - Large navigation links (touch-friendly, 48px+ tap targets)
    - Wallet button prominently displayed
    - Slide-in from right with spring animation
    - Close on link tap, overlay tap, or X button

### Mobile Bottom Navigation Bar

- Fixed at bottom of viewport, only visible on mobile (< 768px)
- 5 tabs with Lucide icons:
  | Icon | Label | Route |
  |---|---|---|
  | Home icon | Home | `/` |
  | Trophy icon | Matches | scroll to matches or `/` |
  | LayoutDashboard icon | Dashboard | `/dashboard` |
  | Vote icon | Voting | `/voting` |
  | Wallet icon | Wallet | trigger connect modal or show dropdown |
- Active tab: icon has cyan glow, label text visible
- Inactive: dimmed, label hidden or smaller
- Gaming-style with subtle glow border on top edge
- Smooth scale animation on tap

### Connected Wallet Dropdown

- Triggered by clicking the connected wallet button
- **Contents:**
    - Full Stellar address (copyable — click-to-copy with toast "Address copied!")
    - Balance: `20,833 XLM` + `≈ $2,500.00`
    - "Dashboard" → `/dashboard`
    - "Transaction History" → `/dashboard?tab=completed`
    - "Disconnect" — magenta/danger styled
- Gaming card aesthetic: glow border, dark background
- Animate: scale from top-right + fade
- Close on outside click or Escape key

---

## Suggested Execution

1. **Create branch**

    ```bash
    git checkout -b feat/header-navigation
    ```

2. **Build desktop `Header` component** — logo, nav links, wallet button slot

3. **Add active route detection** — use Next.js `usePathname()` to highlight current route

4. **Build mobile hamburger menu** — overlay with slide-in animation

5. **Build mobile bottom navigation bar** — fixed bar with icons + glow

6. **Build wallet dropdown** — connected state menu with copy, balance, disconnect

7. **Integrate into `app/layout.tsx`** — render `<Header />` above `{children}`

**Example commit message:**

```
feat: header, desktop nav, mobile menu, and bottom navigation bar
```

---

## Acceptance Criteria

- [ ] Header is fixed at top, visible on all pages, renders in root layout
- [ ] Logo renders "PredictX" in display font with cyan glow
- [ ] Active route has glowing underline indicator
- [ ] Wallet button shows "Connect Wallet" when disconnected (pulsing border)
- [ ] Wallet button shows truncated Stellar address + XLM balance when connected
- [ ] Wallet dropdown shows full address, balance, navigation, disconnect
- [ ] Click-to-copy address shows toast notification
- [ ] Mobile hamburger opens full-screen overlay menu
- [ ] Mobile bottom nav bar is visible only on screens < 768px
- [ ] Bottom nav active tab has glow effect
- [ ] All navigation links route correctly
- [ ] Header does not cover page content (appropriate padding/margin on body)
- [ ] Voting link has notification badge with count

---

## Guidelines

- **PR description must include:** `Closes #5`
- **Screenshots required:** desktop header, mobile header (open/closed), mobile bottom nav, wallet dropdown
- Wallet address format is **Stellar** (G... public key), NOT Ethereum (0x...)
- Wallet connect button triggers modal from Issue #11 — use a prop callback or event
- Balance displayed in XLM (with USD equivalent), NOT ETH
- Use `usePathname()` from `next/navigation` for active detection — NOT `window.location`
