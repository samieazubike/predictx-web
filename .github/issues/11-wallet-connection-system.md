# Issue #11: Wallet Connection System (Stellar / Freighter)

**Labels:** `component`, `wallet`, `stellar`, `priority: critical`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 3 — Core Features  
**Estimate:** 5–6 hours  
**Depends on:** #02, #03, #04

---

## Description

Build the complete wallet connection system for the **Stellar blockchain**. This includes the connect modal offering Stellar wallet options (Freighter, Lobstr, xBull), connected state display, mock wallet simulation, transaction signing, and all wallet-related UI states. This replaces the traditional EVM wallet flow with Stellar-native equivalents.

**Why it matters:** Every transactional action in the dApp (staking, voting, poll creation) requires a connected wallet. This is the gateway to all revenue-generating features.

---

## Requirements and Context

> **IMPORTANT:** This is a **Stellar dApp**. All wallet references must use Stellar concepts:
>
> - Wallet providers: **Freighter**, **Lobstr**, **xBull** (NOT MetaMask, WalletConnect, Coinbase Wallet)
> - Addresses: Stellar public keys starting with `G` (NOT 0x...)
> - Native token: **XLM** (NOT ETH)
> - Transaction fees: **stroops** (100 stroops = 0.00001 XLM) (NOT gas/gwei)
> - Block explorer: **StellarExpert** or **Stellar.Expert** (NOT Etherscan)
> - Network: **Testnet** / **Mainnet** / **Futurenet** (NOT Goerli/Sepolia)

---

### Wallet Connect Button — `components/wallet/wallet-button.tsx`

**Disconnected state:**

- "Connect Wallet" text with wallet icon
- `GamingButton` with pulsing cyan glow border
- Position: header top-right

**Connected state:**

- Truncated Stellar address: `GDKX...9F3H`
- Balance: `20,833 XLM` displayed like game currency
- Small colored circle identicon (derived from address)
- On click: opens dropdown

**Connecting state:**

- Pulsing animation on button
- "Connecting..." text with spinner

---

### Wallet Connect Modal — `components/wallet/wallet-connect-modal.tsx`

Triggered when user clicks "Connect Wallet" button:

- Modal overlay with hexagonal pattern background
- Title: "CONNECT YOUR WALLET" — Orbitron, all caps
- Subtitle: "Choose your Stellar wallet"

**3 wallet options as clickable cards:**

| Provider      | Icon/Color          | Badge          | Description                         |
| ------------- | ------------------- | -------------- | ----------------------------------- |
| **Freighter** | Stellar-blue accent | "Recommended"  | "Official Stellar wallet extension" |
| **Lobstr**    | Teal accent         | "Mobile & Web" | "Popular Stellar wallet"            |
| **xBull**     | Purple accent       | "Advanced"     | "Full-featured Stellar wallet"      |

**Each option card:**

- `GlowCard` with provider branding
- Hover: glow intensifies, slight scale
- Provider logo + name + description

**On wallet selection:**

1. Card highlights with success glow
2. "Connecting to Freighter..." loading state with spinner
3. 1–2 second simulated delay
4. Success (95%): modal closes, wallet state updates, toast: "Wallet connected — GDKX...9F3H"
5. Failure (5%): "Connection failed — please try again" with retry option

**Close:** X button, overlay click, Escape key

---

### Connected Wallet Dropdown — `components/wallet/wallet-dropdown.tsx`

Triggered by clicking connected wallet button in header:

- `GlowCard` styled dropdown
- Contents:
    - **Full Stellar address:** (copyable — click-to-copy with toast "Address copied!")
    - **Network badge:** "Testnet" or "Mainnet"
    - **Balance section:**
        - `20,833 XLM`
        - `≈ $2,500.00`
        - Small Stellar/XLM icon
    - **Menu items** with Lucide icons:
        - "Dashboard" → `/dashboard`
        - "Transaction History" → `/dashboard?tab=completed`
        - "View on StellarExpert" → mock external link
        - "Disconnect" → disconnects wallet, styled in magenta/danger
- Animate: scale from top-right + fade in
- Close: outside click, Escape key

---

### Mock Wallet Simulation (via `useWallet` hook from Issue #03)

**Connection simulation:**

- 1–2 second delay imitating provider popup
- 95% success, 5% failure
- On success: set state with mock Stellar address + XLM balance
- On failure: error toast, allow retry

**Transaction simulation (`sendTransaction`):**

- Show Stellar-style confirmation popup:
    - "Sign Transaction" header
    - Network: Stellar Testnet
    - Source: user's Stellar address
    - Destination: PredictX contract address
    - Amount: XLM equivalent of stake
    - Fee: 100 stroops (0.00001 XLM)
    - "Sign" and "Reject" buttons
- On sign: 1–2 second processing, return mock receipt:
    ```typescript
    {
      hash: "a1b2c3d4...64-hex-chars",
      ledger: 12345678,
      fee: "100", // stroops
      status: "confirmed",
      timestamp: "2026-02-19T..."
    }
    ```
- 5% random failure for realism

**Balance tracking:**

- Initial: $2,500 / 20,833 XLM (at $0.12/XLM)
- Decreases on stake
- Increases on claim
- Persisted in localStorage

**Disconnect:**

- Clear wallet state + localStorage
- Toast: "Wallet disconnected"

---

### Wallet-Gated Actions

Any action requiring a wallet (staking, voting, creating polls) should check `useWallet().isConnected`:

- If NOT connected → show toast "Please connect your wallet" AND auto-open WalletConnectModal
- If connected → proceed with action

---

### Mock Transaction History

Pre-populated 5–8 historical transactions:

| Type             | Amount    | Status    |
| ---------------- | --------- | --------- |
| Stake placed     | -$200     | confirmed |
| Stake placed     | -$500     | confirmed |
| Winnings claimed | +$298     | confirmed |
| Vote reward      | +$12      | confirmed |
| Poll created     | -$2 (fee) | confirmed |
| Stake placed     | -$150     | confirmed |
| Winnings claimed | +$437     | confirmed |
| Vote reward      | +$18      | confirmed |

Each with: Stellar tx hash, ledger number, timestamp, 100 stroops fee.

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/wallet-system`
2. **Build `WalletConnectModal`** — 3 Stellar provider options, connection flow
3. **Build `WalletButton`** — connected/disconnected/connecting states
4. **Build `WalletDropdown`** — address, balance, menu, disconnect
5. **Wire to header** — integrate wallet button into `Header` component
6. **Implement wallet-gating** — auto-trigger modal when unauthenticated action attempted
7. **Generate mock transaction history** — realistic Stellar transactions

**Example commit message:**

```
feat: Stellar wallet connection — Freighter/Lobstr/xBull, tx simulation, dropdown
```

---

## Acceptance Criteria

- [ ] Wallet connect modal offers **Freighter, Lobstr, xBull** — NOT MetaMask/WalletConnect/Coinbase
- [ ] Connected state shows **Stellar public key** (G...) — NOT Ethereum address (0x...)
- [ ] Balance displayed in **XLM** with USD equivalent — NOT ETH
- [ ] Transaction fees shown as **stroops** (0.00001 XLM) — NOT gas/gwei
- [ ] Explorer links reference **StellarExpert** — NOT Etherscan
- [ ] Network shows **Testnet/Mainnet** — NOT Goerli/Sepolia
- [ ] Connection simulates 1–2s delay with 95% success rate
- [ ] Transaction simulation shows Stellar-style confirmation popup
- [ ] Copy address shows toast notification
- [ ] Disconnect clears state and localStorage
- [ ] Wallet-gated actions auto-open connect modal when not connected
- [ ] Mock transaction history has 5–8 realistic Stellar transactions
- [ ] State persists across page reloads via localStorage

---

## Guidelines

- **PR description must include:** `Closes #11`
- **Screenshots/GIFs required:** connect modal, connected dropdown, transaction confirmation popup, disconnect flow
- This is a **MOCK** wallet — no real `@stellar/freighter-api` calls yet. That will be wired in Issue #20
- Structure the code so that swapping mock functions for real Freighter API calls is straightforward
- Wallet provider icons can be placeholder SVGs or Lucide icons if official logos are unavailable
