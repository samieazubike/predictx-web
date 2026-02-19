# Issue #03: Mock Data, Calculation Utilities & State Management Hooks

**Labels:** `data`, `hooks`, `state-management`, `priority: critical`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 1 — Foundation  
**Estimate:** 6–8 hours  
**Depends on:** #02

---

## Description

Create comprehensive mock data, calculation utilities, and all custom React hooks that power the dApp prototype. This includes 6 Premier League matches with 4–5 polls each, realistic user data, a full wallet simulation layer for the **Stellar ecosystem**, staking/voting logic, countdown timers, and localStorage persistence.

Every interactive feature in the app depends on these hooks and data. This is the "brain" of the prototype.

**Why it matters:** Without realistic mock data and working hooks, no page or component can demonstrate the user journey described in the PRD. This issue unblocks all feature work (Issues #06–#16).

---

## Requirements and Context

### Mock Match Data — `lib/mock-data.ts`

**6 Premier League matches** (dates relative to current date, spread over next 5 days):

| #   | Match                        | Venue            | Status                      |
| --- | ---------------------------- | ---------------- | --------------------------- |
| 1   | Chelsea vs Manchester United | Stamford Bridge  | upcoming                    |
| 2   | Arsenal vs Liverpool         | Emirates Stadium | upcoming                    |
| 3   | Manchester City vs Tottenham | Etihad Stadium   | upcoming                    |
| 4   | Newcastle vs Aston Villa     | St. James' Park  | upcoming                    |
| 5   | Brighton vs West Ham         | Amex Stadium     | live (demo)                 |
| 6   | Everton vs Wolves            | Goodison Park    | completed (resolution demo) |

### Mock Poll Data — 4–5 per match

Use **realistic questions** across all categories:

**Player Events:** "Will Palmer score a goal?", "Will Rashford be subbed out?", "Will Saka get an assist?", "Will Haaland receive a yellow card?"

**Team Events:** "Will Chelsea win?", "Will there be a penalty?", "Will Arsenal keep a clean sheet?", "Will the first goal be scored before 20 min?"

**Score Predictions:** "Will Chelsea win by 2+ goals?", "Will total goals be over 2.5?", "Will both teams score?"

**Other:** "Will there be a VAR review?", "Will there be a red card?"

**Data shape requirements per poll:**

- Pool sizes: $500 to $15,000 total
- Participants: 20–80 per poll
- Pool ratios: mix of 50/50, 70/30, 90/10 splits
- Statuses: active, locked, voting, resolved (mix)
- Lock times: kickoff, halftime, 60min
- `recentActivity` strings: "34 people staked Yes in last hour", "Pool grew $2,000 in 30min"

### Mock User Data

**Default user (simulated logged-in state):**

- Wallet address: `GDKXJNLE2YQFPQZ5TK3VZRKPTMJ4OLR3QB7IU6FSCZ6KQF7H4V29F3H` (Stellar public key)
- Display address: `GDKX...9F3H`
- Balance: $2,500 / ~20,833 XLM (at mock rate $0.12/XLM)

**3 active stakes:**

1. $200 on "Will Palmer score?" → Yes, Chelsea vs Man Utd
2. $500 on "Will Arsenal keep a clean sheet?" → No, Arsenal vs Liverpool
3. $150 on "Will total goals be over 2.5?" → Yes, Man City vs Tottenham

**2 pending resolution stakes** (match ended, awaiting resolution):

- Status indicators: "Voting in progress", "Admin review"

**4 voting opportunities** (polls user didn't participate in):

- Reward amounts: $8–$25 each
- Match context and evidence data included

**6 completed predictions** (4 wins, 2 losses):

- Wins: profits of $50, $120, $187, $350
- Losses: $100, $300
- Include ROI percentages

**Badges earned:** "Early Predictor", "3-Win Streak"

### Mock Platform Stats

- Total Value Locked: $847,293
- Active Predictions: 234
- Community Members: 12,847
- Total Payouts: $3,200,000

### Mock Transactions

- Generate realistic Stellar transaction hashes (64 hex characters)
- Stellar base fee: 100 stroops = 0.00001 XLM
- 5–8 historical transactions (stakes, claims, vote rewards, poll creation)

---

### Calculation Utilities — `lib/calculations.ts`

```typescript
calculatePotentialWinnings(stakeAmount, side, yesPool, noPool): WinningsCalculation
// Formula:
// newPool = yesPool + noPool + stakeAmount
// If user wins: (userStake / winningSidePool) × totalPool
// Platform fee: 5% of gross winnings
// Net = gross - fee
// Profit = net - originalStake
// ROI = (profit / originalStake) × 100

calculatePoolPercentages(yesPool, noPool): { yes: number; no: number }

formatCurrency(amount: number): string          // "$1,234.56"
formatCompactCurrency(amount: number): string   // "$3.2M"
formatAddress(address: string): string           // "GDKX...9F3H"
formatXLM(amount: number): string               // "20,833 XLM"
```

---

### Custom Hooks

#### `useWallet` — `hooks/use-wallet.ts`

- `connect(provider: WalletProvider)` — 1–2s simulated delay, 95% success rate
- `disconnect()` — clears state + localStorage
- `sendTransaction(amount, description)` — simulates Stellar tx, 1–2s delay, returns mock receipt
- State: `isConnected`, `isConnecting`, `address`, `displayAddress`, `balance`, `balanceXLM`, `network`
- Persist connection in localStorage
- **Stellar-specific:** provider options are Freighter, Lobstr, xBull (NOT MetaMask)

#### `useMockData` — `hooks/use-mock-data.ts`

- `matches` — all 6 matches
- `getMatch(id)` — single match
- `getPolls(matchId)` — polls for a match
- `getPoll(pollId)` — single poll
- `trendingPolls` — top 4–6 by pool size
- `platformStats` — stats object
- `updatePollPool(pollId, side, amount)` — mutate pool when user stakes

#### `useStaking` — `hooks/use-staking.ts`

- `placeStake(pollId, side, amount)` — places stake, updates pool, returns receipt
- `calculateWinnings(amount, side, yesPool, noPool)` — returns `WinningsCalculation`
- `activeStakes`, `pendingStakes`, `completedStakes` — user's categorized stakes

#### `useVoting` — `hooks/use-voting.ts`

- `castVote(pollId, vote)` — casts vote, awards reward
- `availablePolls` — polls eligible for user to vote on
- `votingHistory` — past votes
- `getVoteReward(pollId)` — calculate reward amount

#### `useCountdown` — `hooks/use-countdown.ts`

- Input: target ISO datetime
- Output: `{ days, hours, minutes, seconds, isExpired, status: TimerStatus }`
- Status logic: safe (>1h), warning (15–60min), urgent (5–15min), critical (<5min)
- Updates every second via `setInterval`
- Cleans up interval on unmount

### Data Persistence

- localStorage keys: `predictx_wallet`, `predictx_stakes`, `predictx_votes`, `predictx_pools`
- Fallback to in-memory state if localStorage unavailable
- `resetAllData()` function for demo reset

---

## Suggested Execution

1. **Create branch**

    ```bash
    git checkout -b feat/mock-data-hooks
    ```

2. **Build `lib/calculations.ts`** — pure functions first (easy to unit-test mentally)

3. **Build `lib/mock-data.ts`** — all matches, polls, user data, platform stats, transactions

4. **Build hooks in order:** `useCountdown` → `useWallet` → `useMockData` → `useStaking` → `useVoting`

5. **Test manually** — create a test page that renders hook outputs to verify data flows

**Example commit message:**

```
feat: mock data, calculation utils, and state management hooks
```

---

## Acceptance Criteria

- [ ] 6 matches with 4–5 polls each (24–30 polls total) with realistic data
- [ ] All pool sizes between $500–$15,000, participants between 20–80
- [ ] Mock user has $2,500 balance, 3 active stakes, 2 pending, 4 voting opps, 6 completed
- [ ] `calculatePotentialWinnings` correctly applies 5% platform fee and returns accurate ROI
- [ ] `useWallet` simulates Stellar wallet connection (Freighter/Lobstr/xBull) — NOT MetaMask
- [ ] `useCountdown` fires every second, returns correct `TimerStatus` based on remaining time
- [ ] All hooks use proper React patterns (cleanup on unmount, stable references)
- [ ] localStorage persistence works across page reloads
- [ ] `resetAllData()` clears all persisted state
- [ ] Wallet addresses are Stellar public keys (G...), transaction hashes are Stellar format
- [ ] No hardcoded past dates — all dates computed relative to `new Date()`
- [ ] `pnpm tsc --noEmit` passes

---

## Guidelines

- **PR description must include:** `Closes #3`
- Use real Premier League team names, player names, and venues
- Transaction simulation should have **realistic delays** (1–2 seconds) and a **5% random failure rate**
- Mock exchange rate: 1 XLM ≈ $0.12 (or any reasonable fixed rate for Stellar)
- Stellar base fee is 100 stroops (0.00001 XLM) — NOT Ethereum gas fees
- All monetary values in USD unless explicitly labeled as XLM
- Do NOT import from component files — this layer is data-only
