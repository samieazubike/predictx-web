# Issue #19: Toast Notifications, Loading & Error States

**Labels:** `ui`, `ux`, `states`, `priority: medium`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 5 — Polish  
**Estimate:** 3–5 hours  
**Depends on:** #04 (Design System), #10 (Staking), #11 (Wallet), #13 (Create Poll)

---

## Description

Implement consistent loading, empty, error, and success states across the entire application. Every interaction that has a latency or can fail needs visual feedback. Toast notifications (via Sonner) must fire for all user-facing actions described in the PRD.

**Why it matters:** Users need immediate feedback to trust a platform handling their XLM. A staked prediction that silently fails or a wallet connection that shows nothing while loading will cause users to abandon the app. Proper states communicate reliability.

---

## Requirements and Context

### Toast Notifications (Sonner)

The PRD defines specific toast messages. Implement these with the cyberpunk theme:

| Action               | Toast Type | Message                                                 |
| -------------------- | ---------- | ------------------------------------------------------- |
| Stake placed         | Success    | "🎯 Prediction Locked! {amount} XLM staked on {option}" |
| Vote cast            | Success    | "🗳️ Vote Recorded! Your verdict has been submitted"     |
| Poll created         | Success    | "🎮 Poll Created! Your prediction market is now live"   |
| Wallet connected     | Success    | "🔗 Wallet Connected! {truncatedAddress}"               |
| Wallet disconnected  | Info       | "👋 Wallet Disconnected"                                |
| Insufficient balance | Error      | "💰 Insufficient XLM balance for this stake"            |
| Wallet not found     | Error      | "🔌 No Stellar wallet detected. Install Freighter"      |
| Transaction failed   | Error      | "❌ Transaction failed. Please try again"               |
| Network error        | Error      | "📡 Network error. Check your connection"               |
| Copied to clipboard  | Info       | "📋 Address copied to clipboard"                        |

### Toast Styling

```tsx
// Cyberpunk-themed Sonner configuration
<Toaster
	theme="dark"
	position="top-right"
	toastOptions={{
		style: {
			background: "rgba(26, 31, 58, 0.95)",
			border: "1px solid rgba(0, 217, 255, 0.3)",
			color: "#e2e8f0",
			fontFamily: "Barlow, sans-serif",
			backdropFilter: "blur(12px)",
		},
		className: "predictx-toast",
	}}
/>
```

### Loading States

Every async operation needs a loading state:

| Component          | Loading Indicator                                                   |
| ------------------ | ------------------------------------------------------------------- |
| Page initial load  | Skeleton cards with pulsing glow (`animate-pulse` + `bg-[#1a1f3a]`) |
| Stake submission   | Button shows spinner, disabled, text → "Staking…"                   |
| Vote submission    | Button shows spinner, disabled, text → "Submitting…"                |
| Poll creation      | Submit button spinner, text → "Creating…"                           |
| Wallet connection  | Modal shows spinner, text → "Connecting…"                           |
| Match data loading | Skeleton cards (3 placeholder cards per row)                        |
| Poll data loading  | Skeleton card with animated gradient sweep                          |

### Skeleton Component

Create a reusable `Skeleton` component (or use shadcn/ui's):

```tsx
// components/ui/skeleton.tsx
function Skeleton({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-lg bg-[#1a1f3a]/60",
				className,
			)}
			{...props}
		/>
	);
}
```

### Empty States

| View                       | Empty State                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| Active stakes (dashboard)  | Illustration + "No active predictions yet. Start staking to see them here." + CTA button |
| Completed predictions      | "No completed predictions. Your resolved stakes will appear here."                       |
| Pending resolution         | "Nothing pending. All your predictions have been resolved."                              |
| Voting center (no polls)   | "No polls need your vote right now. Check back soon!"                                    |
| Match polls (none created) | "No predictions for this match yet. Be the first!" + Create Poll CTA                     |

### Error States

| Scenario                  | Display                                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| Page/data load failure    | Centered error card with retry button: "Something went wrong. [Retry]" |
| Wallet connection failure | Modal stays open, shows error message, retry button                    |
| Invalid stake amount      | Input border → red, helper text: "Minimum stake: 1 XLM"                |
| Form validation error     | Inline error below each invalid field                                  |

### Button State Variants

All `GamingButton` instances should support:

```tsx
interface GamingButtonProps {
	loading?: boolean; // shows spinner, disabled
	disabled?: boolean; // reduced opacity, no hover effects
	success?: boolean; // brief green flash after action
}
```

### Lock States (PRD-specific)

The PRD mentions "locked" states for predictions that have been confirmed:

- Staked prediction card shows lock icon + "Prediction Locked" badge
- Stake amount cannot be changed after submission
- Locked card has reduced interactivity (no hover glow change)

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/ui-states-toasts`
2. **Configure Sonner** — themed toaster in `app/layout.tsx`
3. **Create `Skeleton` component** if not already from shadcn/ui
4. **Add loading states** — button spinners, skeleton cards
5. **Add empty states** — each tab/view with appropriate messaging
6. **Add error states** — retry patterns, inline validation
7. **Wire toast notifications** — fire toasts from mock action handlers
8. **Add lock state** — visual treatment for confirmed predictions

**Example commit message:**

```
feat: toast notifications, skeleton loading, empty/error/lock states
```

---

## Acceptance Criteria

- [ ] Sonner toaster configured with cyberpunk theme in `layout.tsx`
- [ ] All 10 toast messages (table above) fire at appropriate action points
- [ ] Skeleton loading cards display while data "loads" (simulate with delay)
- [ ] Every async button has a loading state (spinner + disabled + text change)
- [ ] All 5 empty state views display when data is empty
- [ ] Error state with retry button displays on simulated failure
- [ ] Form validation shows inline errors (stake amount, poll fields)
- [ ] Locked prediction cards show lock icon and reduced interactivity
- [ ] No interaction leaves the user without visual feedback

---

## Guidelines

- **PR description must include:** `Closes #19`
- **GIF required:** showing at least 3 different toast messages
- Use `sonner` library (`toast.success()`, `toast.error()`, `toast.info()`)
- Keep skeleton dimensions matching the real component they replace
- Prefer cyberpunk-colored spinners (cyan `#00d9ff`) over default white
- All XLM references must use Stellar formatting (e.g. "1 XLM" not "1 ETH")
- Wallet error messages must reference Freighter/Stellar — not MetaMask/Ethereum
