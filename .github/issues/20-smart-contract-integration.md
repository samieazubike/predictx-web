# Issue #20: Soroban Smart Contract Frontend Integration Layer

**Labels:** `blockchain`, `stellar`, `integration`, `priority: critical`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 6 — Integration  
**Estimate:** 8–12 hours  
**Depends on:** #02 (Types), #03 (Mock Data/State), #11 (Wallet Connection)

---

## Description

Build the integration layer that connects the React frontend to Soroban smart contracts deployed on the Stellar network. This issue bridges the gap between the mock data/state management layer (Issue #03) and real on-chain interactions — allowing a frontend developer to swap mock functions for live contract calls without restructuring the application.

**Why it matters:** The entire value proposition of PredictX depends on trustless, on-chain prediction markets. Without a clean integration layer, connecting the frontend to Soroban contracts would require rewriting hooks and components throughout the app. By designing this layer intentionally, we ensure mock → production swaps are surgical and isolated.

---

## Requirements and Context

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  React Components (pages, modals, cards)        │
│    ↕ consume hooks                              │
├─────────────────────────────────────────────────┤
│  Custom Hooks (use-wallet, use-polls, etc.)     │
│    ↕ call service functions                     │
├─────────────────────────────────────────────────┤
│  Service Layer (lib/stellar.ts, lib/contract.ts)│  ← THIS ISSUE
│    ↕ calls Stellar SDK + Freighter API          │
├─────────────────────────────────────────────────┤
│  @stellar/stellar-sdk + @stellar/freighter-api  │
│    ↕ JSON-RPC to Soroban                        │
├─────────────────────────────────────────────────┤
│  Soroban Smart Contracts (on Testnet/Mainnet)   │
└─────────────────────────────────────────────────┘
```

### File Structure

```
lib/
  stellar.ts          # Stellar SDK initialization, server connection
  contract.ts         # Smart contract interaction helpers
  soroban-types.ts    # Contract-specific type mappings
  constants.ts        # Contract addresses, network config (extend existing)
```

### `lib/stellar.ts` — Network & Server Setup

```ts
import * as StellarSdk from "@stellar/stellar-sdk";

export const NETWORK = {
	testnet: {
		networkPassphrase: StellarSdk.Networks.TESTNET,
		sorobanRpcUrl: "https://soroban-testnet.stellar.org",
		horizonUrl: "https://horizon-testnet.stellar.org",
	},
	mainnet: {
		networkPassphrase: StellarSdk.Networks.PUBLIC,
		sorobanRpcUrl: "https://soroban-rpc.mainnet.stellar.gateway.fm",
		horizonUrl: "https://horizon.stellar.org",
	},
};

// Active network — switch via env var
const activeNetwork =
	process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
		? NETWORK.mainnet
		: NETWORK.testnet;

export const sorobanServer = new StellarSdk.SorobanRpc.Server(
	activeNetwork.sorobanRpcUrl,
);

export const horizonServer = new StellarSdk.Horizon.Server(
	activeNetwork.horizonUrl,
);

export const networkPassphrase = activeNetwork.networkPassphrase;

export async function getAccountBalance(publicKey: string): Promise<string> {
	// Fetch XLM balance from Horizon
}

export async function getAccountSequence(publicKey: string): Promise<string> {
	// Fetch sequence number for transaction building
}
```

### `lib/contract.ts` — Contract Interaction Helpers

Define the contract methods the frontend expects. These correspond to the Soroban smart contract ABI:

```ts
import {sorobanServer, networkPassphrase} from "./stellar";
import {
	Contract,
	TransactionBuilder,
	xdr,
	nativeToScVal,
	scValToNative,
} from "@stellar/stellar-sdk";
import {signTransaction} from "@stellar/freighter-api";

// Contract IDs — from environment
const PREDICTION_MARKET_CONTRACT =
	process.env.NEXT_PUBLIC_CONTRACT_PREDICTION_MARKET!;
const POLL_CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_POLL!;

// ─── Read Operations (no signing required) ───

export async function getPolls(): Promise<Poll[]> {
	/* ... */
}
export async function getPollById(pollId: string): Promise<Poll> {
	/* ... */
}
export async function getMatchPolls(matchId: string): Promise<Poll[]> {
	/* ... */
}
export async function getUserStakes(publicKey: string): Promise<Stake[]> {
	/* ... */
}
export async function getPlatformStats(): Promise<PlatformStats> {
	/* ... */
}

// ─── Write Operations (require Freighter signing) ───

export async function createPoll(
	creatorPublicKey: string,
	matchId: string,
	question: string,
	options: string[],
	stakeAmount: number, // in XLM, converted to stroops internally
): Promise<TransactionResult> {
	/* ... */
}

export async function placeBet(
	userPublicKey: string,
	pollId: string,
	optionIndex: number,
	amount: number, // in XLM
): Promise<TransactionResult> {
	/* ... */
}

export async function castVote(
	userPublicKey: string,
	pollId: string,
	optionIndex: number,
): Promise<TransactionResult> {
	/* ... */
}

export async function claimWinnings(
	userPublicKey: string,
	pollId: string,
): Promise<TransactionResult> {
	/* ... */
}
```

### Transaction Building Pattern

Every write operation follows this pattern:

```ts
async function executeContractCall(
	publicKey: string,
	contractId: string,
	method: string,
	args: xdr.ScVal[],
): Promise<TransactionResult> {
	// 1. Load account from Horizon
	const account = await sorobanServer.getAccount(publicKey);

	// 2. Build transaction
	const contract = new Contract(contractId);
	const tx = new TransactionBuilder(account, {
		fee: "100", // 100 stroops base fee
		networkPassphrase,
	})
		.addOperation(contract.call(method, ...args))
		.setTimeout(30)
		.build();

	// 3. Simulate to get resource estimates
	const simulated = await sorobanServer.simulateTransaction(tx);
	if ("error" in simulated) throw new Error(simulated.error);

	// 4. Prepare transaction (adds resource fees)
	const prepared = StellarSdk.assembleTransaction(tx, simulated).build();

	// 5. Sign with Freighter
	const signedXdr = await signTransaction(prepared.toXDR(), {
		networkPassphrase,
	});

	// 6. Submit to network
	const signed = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
	const result = await sorobanServer.sendTransaction(signed);

	// 7. Poll for confirmation
	if (result.status === "PENDING") {
		return await pollTransactionStatus(result.hash);
	}

	return result;
}
```

### `lib/soroban-types.ts` — Type Mappings

Map Soroban `ScVal` types to TypeScript types used in the frontend:

```ts
import {xdr, nativeToScVal, scValToNative} from "@stellar/stellar-sdk";

// Convert frontend types → Soroban ScVal
export function pollToScVal(poll: CreatePollInput): xdr.ScVal {
	/* ... */
}
export function stakeToScVal(amount: number): xdr.ScVal {
	// Convert XLM to stroops (1 XLM = 10_000_000 stroops)
	return nativeToScVal(Math.floor(amount * 10_000_000), {type: "i128"});
}

// Convert Soroban ScVal → frontend types
export function scValToPoll(val: xdr.ScVal): Poll {
	/* ... */
}
export function scValToStake(val: xdr.ScVal): Stake {
	/* ... */
}
```

### Environment Variables

Add to `.env.local` (and `.env.example`):

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_PREDICTION_MARKET=CABC...XYZ
NEXT_PUBLIC_CONTRACT_POLL=CDEF...UVW
```

### Mock ↔ Production Toggle

The hooks layer (Issue #03) should remain unchanged. The toggle between mock and live data happens at the service level:

```ts
// lib/contract.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export async function getPolls(): Promise<Poll[]> {
	if (USE_MOCK) return mockPolls; // from mock-data.ts
	// ... real Soroban call
}
```

This ensures:

- Components never import from `lib/contract.ts` directly — they use hooks
- Hooks call service functions from `lib/contract.ts`
- Service functions check `USE_MOCK` to decide data source

### Error Handling

```ts
export class StellarError extends Error {
	constructor(
		message: string,
		public code:
			| "WALLET_NOT_FOUND"
			| "USER_REJECTED"
			| "INSUFFICIENT_BALANCE"
			| "TX_FAILED"
			| "NETWORK_ERROR",
		public details?: unknown,
	) {
		super(message);
		this.name = "StellarError";
	}
}

// Usage in hooks → mapped to toast messages (Issue #19)
```

### Dependencies to Add

```bash
pnpm add @stellar/stellar-sdk @stellar/freighter-api
```

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/soroban-integration-layer`
2. **Install Stellar SDK and Freighter API** — `pnpm add @stellar/stellar-sdk @stellar/freighter-api`
3. **Create `lib/stellar.ts`** — server setup, network config, account helpers
4. **Create `lib/contract.ts`** — all contract interaction functions with mock toggle
5. **Create `lib/soroban-types.ts`** — ScVal conversion utilities
6. **Update `lib/constants.ts`** — contract addresses, network URLs
7. **Create `.env.example`** — document all required environment variables
8. **Update `hooks/use-wallet.tsx`** — swap mock wallet logic for Freighter API
9. **Add `StellarError` class** — typed errors that map to toast messages
10. **Test with `USE_MOCK=true`** — ensure app still works with mock data

**Example commit message:**

```
feat: Soroban smart contract integration layer with mock toggle
```

---

## Acceptance Criteria

- [ ] `lib/stellar.ts` exports configured `sorobanServer`, `horizonServer`, `networkPassphrase`
- [ ] `lib/contract.ts` exports all CRUD functions: `getPolls`, `getPollById`, `createPoll`, `placeBet`, `castVote`, `claimWinnings`, `getUserStakes`, `getPlatformStats`
- [ ] `lib/soroban-types.ts` provides ScVal ↔ TypeScript conversion helpers
- [ ] Every write function follows the simulate → prepare → sign → submit pattern
- [ ] `StellarError` class with typed error codes exists
- [ ] `USE_MOCK` toggle allows seamless switch between mock and live data
- [ ] `.env.example` documents all required `NEXT_PUBLIC_*` variables
- [ ] `@stellar/stellar-sdk` and `@stellar/freighter-api` added to `package.json`
- [ ] `hooks/use-wallet.tsx` uses Freighter API for `connect()`, `disconnect()`, `getPublicKey()`
- [ ] All XLM ↔ stroops conversions are correct (1 XLM = 10,000,000 stroops)
- [ ] App runs without errors when `NEXT_PUBLIC_USE_MOCK_DATA=true`

---

## Guidelines

- **PR description must include:** `Closes #20`
- **No UI changes in this PR** — this is a service/hook layer only
- All public keys are Stellar format (`G...`, 56 characters) — NOT Ethereum `0x` addresses
- All amounts internally in stroops, displayed in XLM to users
- Use `@stellar/stellar-sdk` v12+ (Soroban-compatible)
- Use `@stellar/freighter-api` v2+ (latest)
- Do NOT hardcode contract IDs — always use environment variables
- Transaction fees: default 100 stroops base fee, let simulation adjust
- Network passphrase must come from SDK constants (`Networks.TESTNET` / `Networks.PUBLIC`)
- All contract calls must handle user rejection (Freighter cancel) gracefully
- Include JSDoc comments on all exported functions describing parameters and return types
