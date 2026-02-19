# Issue #02: TypeScript Types, Interfaces & Constants

**Labels:** `types`, `data-model`, `priority: critical`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 1 — Foundation  
**Estimate:** 3–4 hours  
**Depends on:** #01

---

## Description

Define all TypeScript interfaces, union types, and application constants that represent the core domain of PredictX. These types form the contract between components, hooks, mock data, and the future Soroban smart contract integration layer. Getting these right ensures type safety and consistent data shapes across the entire codebase.

**Why it matters:** Every feature issue downstream imports from `types/index.ts` and `lib/constants.ts`. Incorrect or missing types will cause cascading type errors and ambiguity for contributors working on parallel issues.

---

## Requirements and Context

### Key Domain Models — `types/index.ts`

> Note: This dApp runs on **Stellar**. Wallet addresses are Stellar public keys (G...), NOT Ethereum addresses (0x...). Transaction hashes follow Stellar format. The native token is **XLM**, not ETH.

#### `Team`

```typescript
interface Team {
	id: string;
	name: string; // "Chelsea"
	shortName: string; // "CHE"
	logo: string; // URL or local path
	primaryColor: string; // hex
}
```

#### `Match`

```typescript
interface Match {
	id: string;
	homeTeam: Team;
	awayTeam: Team;
	date: string; // ISO 8601
	time: string; // "15:00"
	venue: string;
	league: string; // "Premier League"
	status: MatchStatus;
	score?: {home: number; away: number};
	polls: Poll[];
}
```

#### `Poll`

```typescript
interface Poll {
	id: string;
	matchId: string;
	question: string; // "Will Palmer score a goal?"
	category: PollCategory;
	yesPool: number; // total $ staked on Yes
	noPool: number; // total $ staked on No
	totalPool: number; // yesPool + noPool
	yesPercentage: number;
	noPercentage: number;
	yesParticipants: number;
	noParticipants: number;
	lockTime: string; // ISO datetime
	status: PollStatus;
	result?: "yes" | "no" | null;
	createdBy: string; // Stellar public key
	createdAt: string;
	resolvedAt?: string;
	stakes: Stake[];
	votes: Vote[];
	recentActivity?: string; // "34 people staked Yes in last hour"
}
```

#### `Stake`

```typescript
interface Stake {
	id: string;
	pollId: string;
	matchId: string;
	userId: string; // Stellar public key
	side: "yes" | "no";
	amount: number; // USD value
	timestamp: string;
	status: StakeStatus;
	potentialWinnings?: number;
	actualWinnings?: number;
	roi?: number; // percentage
	transactionHash: string; // Stellar tx hash
}
```

#### `Vote`

```typescript
interface Vote {
	id: string;
	pollId: string;
	voterId: string; // Stellar public key
	vote: "yes" | "no" | "unclear";
	reward: number;
	timestamp: string;
	status: "cast" | "rewarded";
}
```

#### `User`

```typescript
interface User {
	id: string;
	walletAddress: string; // Stellar public key (G...)
	displayAddress: string; // Truncated: "GDKX...9F3H"
	balance: number; // USD
	balanceXLM: number; // native Stellar token
	totalWinnings: number;
	totalLosses: number;
	winRate: number;
	badges: Badge[];
	activeStakes: Stake[];
	completedPredictions: Stake[];
	votingHistory: Vote[];
	level: number;
	xp: number;
}
```

#### `Badge`

```typescript
interface Badge {
	id: string;
	name: string; // "Winning Streak", "Top Judge", "Early Predictor"
	description: string;
	icon: string;
	earnedAt: string;
	type: "achievement" | "rank" | "streak";
}
```

#### `WalletState`

```typescript
interface WalletState {
	isConnected: boolean;
	isConnecting: boolean;
	address: string | null; // Stellar public key
	displayAddress: string | null; // truncated
	balance: number; // USD
	balanceXLM: number;
	provider: WalletProvider | null;
	network: "testnet" | "mainnet" | "futurenet";
	error: string | null;
}
```

#### `Transaction`

```typescript
interface Transaction {
	id: string;
	hash: string; // Stellar transaction hash
	type: "stake" | "claim-winnings" | "vote-reward" | "create-poll";
	amount: number;
	fee: number; // Stellar base fee (in XLM)
	status: "pending" | "confirmed" | "failed";
	timestamp: string;
	description: string;
	ledger?: number; // Stellar ledger number
}
```

#### `PlatformStats`

```typescript
interface PlatformStats {
	totalValueLocked: number; // $847,293
	activePredictions: number; // 234
	communityMembers: number; // 12,847
	totalPayouts: number; // $3,200,000
}
```

#### `CreatePollForm`

```typescript
interface CreatePollForm {
	matchId: string;
	category: PollCategory;
	question: string;
	lockTime: "kickoff" | "halftime" | "60min" | "custom";
	customLockTime?: string;
}
```

#### `WinningsCalculation`

```typescript
interface WinningsCalculation {
	stakeAmount: number;
	side: "yes" | "no";
	currentYesPool: number;
	currentNoPool: number;
	estimatedWinnings: number;
	estimatedROI: number; // percentage
	platformFee: number; // 5% of winnings
	netWinnings: number;
}
```

### Union Types

```typescript
type MatchStatus = "upcoming" | "live" | "completed";
type PollCategory =
	| "player-event"
	| "team-event"
	| "score-prediction"
	| "other";
type PollStatus =
	| "active"
	| "locked"
	| "voting"
	| "admin-review"
	| "multi-sig-review"
	| "dispute"
	| "resolved";
type StakeStatus = "active" | "won" | "lost" | "pending-resolution";
type ResolutionStatus =
	| "voting"
	| "admin-review"
	| "multi-sig-review"
	| "dispute";
type TimerStatus = "safe" | "warning" | "urgent" | "critical";
type WalletProvider = "freighter" | "lobstr" | "xbull"; // Stellar wallets
```

### Constants — `lib/constants.ts`

```typescript
// Platform economics
export const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%
export const VOTER_REWARD_MIN = 0.005; // 0.5%
export const VOTER_REWARD_MAX = 0.01; // 1%

// Resolution thresholds
export const AUTO_APPROVE_THRESHOLD = 0.85; // 85% consensus
export const ADMIN_REVIEW_THRESHOLD = 0.6; // 60% consensus
export const DISPUTE_WINDOW_HOURS = 24;
export const VOTING_WINDOW_HOURS = 2;

// Staking
export const QUICK_STAKE_AMOUNTS = [50, 100, 500];
export const MIN_STAKE_AMOUNT = 1;
export const MAX_STAKE_MULTIPLIER = 1; // 100% of balance

// Stellar
export const STELLAR_NETWORK = "testnet";
export const STELLAR_BASE_FEE = 100; // stroops (0.00001 XLM)
export const XLM_USD_RATE = 0.12; // mock exchange rate
export const MOCK_CONTRACT_ID =
	"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

// UI
export const POLL_QUESTION_MAX_LENGTH = 120;
export const POLL_QUESTION_MIN_LENGTH = 10;
```

---

## Suggested Execution

1. **Create branch**

    ```bash
    git checkout -b feat/types-and-constants
    ```

2. **Create `types/index.ts`** — define all interfaces and union types, export everything

3. **Create `lib/constants.ts`** — define all constants with JSDoc comments explaining each

4. **Verify** — run `pnpm tsc --noEmit` to ensure no type errors

**Example commit message:**

```
feat: define TypeScript types, interfaces, and platform constants
```

---

## Acceptance Criteria

- [ ] All interfaces listed above exist in `types/index.ts` and export correctly
- [ ] All union types are defined and exported
- [ ] All constants are defined in `lib/constants.ts` with descriptive comments
- [ ] Wallet addresses use **Stellar public key format** (G...), NOT Ethereum (0x...)
- [ ] Native token is **XLM**, NOT ETH
- [ ] Wallet providers are `freighter | lobstr | xbull`, NOT metamask/walletconnect/coinbase
- [ ] `Transaction` uses Stellar concepts (ledger number, stroops fee)
- [ ] `pnpm tsc --noEmit` passes with zero errors
- [ ] All types are importable via `@/types` path alias

---

## Guidelines

- **PR description must include:** `Closes #2`
- Do NOT add mock data in this issue — that is Issue #03
- Every field should have a brief inline comment explaining its purpose
- Use `type` for union types, `interface` for object shapes
- Ensure types are expansive enough that future Soroban contract integration won't require breaking changes
