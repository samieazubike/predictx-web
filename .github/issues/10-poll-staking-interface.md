# Issue #10: Poll Staking Interface (Modal/Slide-in)

**Labels:** `component`, `staking`, `core-feature`, `priority: critical`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 3 — Core Features  
**Estimate:** 6–8 hours  
**Depends on:** #02, #03, #04, #11

---

## Description

Build the Poll Staking Interface — the core transactional UI of PredictX. This modal/slide-in panel is where users choose a side (Yes/No), enter a stake amount, see real-time potential winnings, and confirm a simulated Stellar transaction. This is the money moment of the entire dApp.

**Why it matters:** This is the primary revenue-generating interaction. Every aspect must inspire confidence: clear calculation display, transparent fee disclosure, smooth transaction simulation, and satisfying success/failure feedback.

---

## Requirements and Context

### Modal Container — `components/staking/stake-modal.tsx`

**Trigger:** "Stake Now" button on `PollCard` (Issues #09, #12)

**Appearance:**

- Slide in from right edge with motion blur effect (Framer Motion `AnimatePresence`)
- Dark overlay behind with hexagonal pattern (CSS background-image)
- Corner decorations (triangles, scanning line accents)
- Animated border that "draws" itself in on open (CSS `stroke-dashoffset` or Framer Motion)
- Close: overlay click, Escape key, X button
- Fullscreen on mobile (< 768px)

---

### Section 1: Poll Question Header

- Poll question: "Will Palmer score a goal?" — display font, prominent
- Match context: "Chelsea vs Man United" with mini `TeamBadge` icons
- Category tag: "Player Event" — colored pill
- Countdown: `CountdownTimer` — "Locks in 2h 34m"
- Participants: "47 stakers" with Users icon

---

### Section 2: Side Selection (Yes / No)

- Two large toggle buttons side by side
- **"YES" button:** cyan themed, shows current Yes pool (e.g., "$7,000")
- **"NO" button:** magenta themed, shows current No pool (e.g., "$3,000")
- Selected side: full glow, elevated, animated border
- Unselected: dimmed, outline only
- Pool percentages displayed: "70% YES • 30% NO"
- Electric arc effect on toggle between sides (brief spark animation)

---

### Section 3: Stake Amount Input

- **Wallet balance display:** "Balance: 20,833 XLM (≈$2,500)" with wallet icon
- **Amount input:** `GamingInput` with `$` prefix
    - Glowing border on focus
    - Numeric validation: min $1, max = wallet balance
- **Quick amount buttons:** $50 | $100 | $500 | Max
    - Each is a pill button, `GamingButton` `ghost` variant
    - "Max" fills with entire balance
    - Click feedback (scale pulse)
- **Optional slider:** range slider synced with input
- **Validation states:**
    - Over balance → red glow + shake + error message: "Insufficient balance"
    - Zero/negative → error
    - Poll locked → disabled state
    - > 50% of balance → yellow warning: "This is more than half your balance"

---

### Section 4: Real-Time Winnings Calculator

Updates live as user types amount or toggles side:

| Field              | Value            | Style                 |
| ------------------ | ---------------- | --------------------- |
| Your Stake         | $200.00          | White, standard       |
| Current Pool Ratio | 70% Yes / 30% No | Dimmed                |
| Estimated Winnings | $285.71          | Green, large, glowing |
| Estimated ROI      | +42.9%           | Green badge           |
| Platform Fee (5%)  | -$4.29           | Small, dimmed         |
| Net Profit         | $81.42           | Gold, highlighted     |

- Numbers animate briefly when recalculated (pulse/roll)
- **Risk/Reward indicator:**
    - Green indicator: user is on majority side (likely win, lower payout)
    - Gold/red indicator: user is on minority side (riskier, higher payout)
- Tooltip (ℹ️) explaining the formula: "Winners split the losing pool proportionally. Platform takes 5% fee from winnings."

---

### Section 5: Pool Distribution Preview

- Mini pie chart (Recharts `PieChart`) showing Yes/No split
- Updates in real-time as user enters amount (shows pool AFTER their stake added)
- Cyan = Yes, Magenta = No
- User's contribution segment highlighted differently (lighter shade)
- Smooth animation on chart update

---

### Section 6: Platform Fee Notice

- "5% platform fee is applied to winnings only" — small text with ℹ️ icon
- Tooltip: "You only pay fees when you win. If you lose, you pay nothing extra."

---

### Section 7: Confirm Stake Button

- `GamingButton` `primary`, `lg`: **"CONFIRM STAKE — $200"**
- Requires wallet connected (if not → show "Connect Wallet" button instead)
- Disabled if: no amount, amount > balance, poll locked, amount ≤ 0

---

### Transaction Simulation Flow

**Step 1 — Wallet Confirmation Popup:**

- Mock Stellar wallet confirmation overlay:
    - "Confirm Transaction" header
    - From: user's Stellar address (truncated)
    - To: PredictX Contract (`CDLZ...CYSC`)
    - Amount: stake in XLM equivalent
    - Network Fee: ~0.00001 XLM (100 stroops)
    - "Confirm" and "Reject" buttons
- If "Reject" → close popup, show toast "Transaction cancelled"

**Step 2 — Processing:**

- Rotating hexagon with particle trail (loading animation)
- Progress bar with animated energy flow
- "Processing transaction on Stellar..." text with subtle glitch effect
- 1–2 second simulated delay

**Step 3a — Success (95% chance):**

- Screen flash with cyan/green overlay
- Particle explosion from confirm button
- "STAKE PLACED!" text with victory animation
- Transaction details:
    - Hash: truncated Stellar tx hash (copyable)
    - Ledger: mock ledger number
    - "View on StellarExpert" mock link
- Auto-close after 3 seconds (or manual)
- Toast: "Successfully staked $200 on 'Will Palmer score?'"
- **State updates:** poll pools update, participant count increments, wallet balance decreases, stake appears in dashboard active stakes

**Step 3b — Failure (5% chance):**

- Red flash + shake animation
- "Transaction Failed" message
- Reason: "Network congestion" or "Transaction timeout"
- "Try Again" button
- Error toast (magenta)

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/stake-modal`
2. **Build modal shell** — slide-in container with overlay, close logic, animations
3. **Build side selection** — Yes/No toggle with pool amounts
4. **Build amount input** — with quick buttons, validation, balance display
5. **Build winnings calculator** — wire to `calculatePotentialWinnings()` from `lib/calculations.ts`
6. **Build pie chart** — Recharts `PieChart` with real-time pool preview
7. **Build transaction flow** — confirmation popup → processing → success/failure
8. **Wire state updates** — update pools, wallet, stakes on successful transaction

**Example commit message:**

```
feat: stake modal — side selection, amount input, live calculator, and Stellar tx simulation
```

---

## Acceptance Criteria

- [ ] Modal slides in from right with animated border and overlay
- [ ] Yes/No toggle updates pool display and recalculates winnings in real-time
- [ ] Amount input validates against wallet balance
- [ ] Quick amount buttons ($50, $100, $500, Max) work correctly
- [ ] Winnings calculator shows: estimated winnings, ROI, platform fee, net profit
- [ ] All calculator values update live as amount changes
- [ ] Pie chart reflects updated pool distribution with user's contribution
- [ ] Risk/reward indicator shows correct assessment (majority vs minority side)
- [ ] "Confirm Stake" triggers Stellar-style transaction simulation
- [ ] Success: particle animation, tx hash display, toast notification, state updates
- [ ] Failure: shake, error message, retry button
- [ ] Wallet balance decreases on successful stake
- [ ] Poll pools update with new stake amount
- [ ] Disabled states work: no amount, over balance, locked poll
- [ ] Fullscreen on mobile
- [ ] Transaction references **Stellar** (ledger, StellarExpert, stroops fee) — NOT Ethereum

---

## Guidelines

- **PR description must include:** `Closes #10`
- **Screenshots/GIFs required:** modal open, side toggle, calculator updating, success animation, failure state
- Use `useStaking` hook for calculation, `useWallet` for wallet check and transaction
- All financial math uses `lib/calculations.ts` — do NOT duplicate formulas
- Ensure keyboard accessibility: Tab through fields, Enter to confirm, Escape to close
- Stellar transaction fee is ~0.00001 XLM (100 stroops), NOT Ethereum gas
