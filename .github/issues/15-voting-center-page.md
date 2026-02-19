# Issue #15: Voting Center Page & Voting Interface

**Labels:** `page`, `voting`, `resolution`, `priority: high`  
**Complexity:** High (200 points)  
**Milestone:** Sprint 4 — Dashboard & Voting  
**Estimate:** 5–7 hours  
**Depends on:** #02, #03, #04, #11

---

## Description

Build the Voting Center page (`/voting`) — the dedicated interface where users vote on poll outcomes they didn't participate in and earn rewards. This page powers the community-driven oracle/resolution system, showing match context, evidence, community vote tallies, and providing a full voting flow with confirmation and reward feedback.

**Why it matters:** The resolution system is what makes PredictX fair and decentralized. Without active voters, polls can't resolve, and stakers can't receive winnings. The voting center needs to incentivize participation through clear reward displays and a satisfying voting experience.

---

## Requirements and Context

### Route

`app/voting/page.tsx`

### Wallet Required Gate

Same as Dashboard (Issue #14) — show connect prompt if wallet not connected.

---

### Page Header

- Title: "VOTING CENTER" or "RESOLUTION ARENA" — Orbitron, all caps, cyan glow
- Subtitle: "Vote on poll outcomes and earn rewards. Only available for polls you didn't stake on."
- Stats bar:
    - Available polls: "4 polls need your vote"
    - Total rewards available: "Earn up to $58.50" (gold)
    - Your voting accuracy: "89% accuracy" (if history exists)

---

### Voting Cards — `components/voting/voting-card.tsx`

**4 mock polls awaiting resolution:**

Each voting card is a full-detail `GlowCard`:

| Section                  | Content                                                        |
| ------------------------ | -------------------------------------------------------------- |
| **Match Context**        | Teams + final score (e.g., "Brighton 2 — 1 West Ham")          |
| **Key Events**           | Brief timeline: "⚽ 23' Mitoma, ⚽ 55' Kudus, ⚽ 78' Ferguson" |
| **Poll Question**        | "Did Palmer score a goal?" — large, display font               |
| **Category tag**         | Colored pill                                                   |
| **Evidence Section**     | See below                                                      |
| **Community Vote Tally** | See below                                                      |
| **Your Vote Buttons**    | Three buttons: YES / NO / UNCLEAR                              |
| **Reward Amount**        | "Vote to earn $12.50" — gold, prominent                        |
| **Voting Deadline**      | `CountdownTimer` — "1h 34m remaining"                          |

---

### Evidence Section — `components/voting/evidence-section.tsx`

Helps voters make informed decisions:

- **Match Highlights:** "View match highlights" link (mock, opens placeholder)
- **Official Stats:** "View official stats on Premier League" (mock external link)
- **Key Event Timeline:** bulleted list of relevant match events
- **Info icon** with tooltip: "Review the evidence before voting to earn maximum rewards"
- Section styled with `GlowCard` nested panel, slightly lighter background
- Expandable/collapsible on click

---

### Community Vote Tally — `components/voting/vote-tally.tsx`

Shows current voting progress:

- `PoolProgressBar` adapted for votes (not money):
    - YES: cyan bar with percentage + count
    - NO: magenta bar with percentage + count
    - UNCLEAR: gray segment (if applicable)
- Total votes cast: "42 votes so far"
- Consensus indicator:
    - > 85%: "Strong consensus ✅" (green)
    - 60–85%: "Moderate — admin review likely" (yellow)
    - <60%: "Split — multi-sig review required" (red)

---

### Vote Buttons

Three large buttons (using `GamingButton` or `ToggleSwitch` variant):

| Button  | Color    | Meaning                    |
| ------- | -------- | -------------------------- |
| YES     | Cyan     | "The event DID happen"     |
| NO      | Magenta  | "The event did NOT happen" |
| UNCLEAR | Gray/dim | "Cannot determine outcome" |

- Large touch targets (56px+ height)
- Glow on hover
- Selected state: full glow, scale up slightly

---

### Vote Confirmation Flow

After selecting a vote:

1. **Confirmation popup** (mini modal):
    - "Confirm Your Vote"
    - "You are voting: **YES** on 'Did Palmer score a goal?'"
    - "This action cannot be undone"
    - "Confirm" (`GamingButton` primary) and "Cancel" (ghost)

2. **Processing:** Brief loading (0.5–1 second)

3. **Success:**
    - "Thank you for judging!" message with gavel/scales icon
    - Reward confirmation: "You earned **$12.50** for this vote!"
    - XP animation (if gamification): "+25 XP"
    - `AchievementToast`: "Vote Cast — $12.50 earned"
    - Card updates: user's vote shown, buttons disabled, "Voted ✅" badge
    - Vote tally updates with user's vote included
    - Reward added to wallet balance

4. **After all polls voted:** "You've voted on all available polls! Check back after more matches complete."

---

### Voting Rewards Explanation

Small info panel or expandable section:

- "How Voting Works":
    1. Vote within the 2-hour window after match ends
    2. Earn 0.5–1% of the poll's pool as reward
    3. If >85% consensus → auto-approved
    4. If 60–85% → admin reviews with evidence
    5. If <60% → multi-sig verification required
    6. 24-hour dispute window after resolution

---

### Layout

- Desktop: voting cards in single-column (wide) or 2-column grid
- Cards should be spacious — evidence sections need room
- Mobile: single column, expandable evidence sections

### Empty State

- "No Polls Awaiting Your Vote — Check Back After Matches End!"
- Scales of justice neon illustration (floating/bobbing)
- Info text: "You can only vote on polls you didn't stake on"

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/voting-center`
2. **Build page layout** — header with stats, wallet gate
3. **Build `VotingCard` component** — full detail view with all sections
4. **Build `EvidenceSection`** — expandable evidence panel
5. **Build `VoteTally`** — adapted progress bar for votes + consensus indicator
6. **Build vote buttons** — with selection state
7. **Build confirmation flow** — popup → processing → success with reward
8. **Build empty state** — illustration + message
9. **Wire to `useVoting` hook** — available polls, castVote, rewards

**Example commit message:**

```
feat: voting center — vote cards, evidence, tally, confirmation, and rewards
```

---

## Acceptance Criteria

- [ ] Voting page renders at `/voting`
- [ ] Wallet gate shows if not connected
- [ ] Header shows available polls count, total rewards, and accuracy
- [ ] 4 voting cards with match context, question, evidence, tally, buttons, reward
- [ ] Evidence section is expandable with mock data (highlights, stats, events)
- [ ] Community vote tally shows YES/NO/UNCLEAR percentages with consensus indicator
- [ ] Three vote buttons: YES (cyan), NO (magenta), UNCLEAR (gray)
- [ ] Confirmation popup appears before finalizing vote
- [ ] Success: "Thank you for judging!" + reward amount + achievement toast
- [ ] Card marks as "Voted" with disabled buttons after vote cast
- [ ] Wallet balance increases by reward amount
- [ ] Voting deadline countdown works correctly
- [ ] Resolution process explanation is visible (how voting works)
- [ ] Empty state renders when all polls voted or none available
- [ ] Responsive for mobile

---

## Guidelines

- **PR description must include:** `Closes #15`
- **Screenshots/GIFs required:** voting card, evidence expanded, vote cast flow, success state, empty state
- User can ONLY vote on polls they did NOT stake on — filter by `useVoting().availablePolls`
- Evidence data is mocked — include realistic-looking event timelines
- The voting window is 2 hours after match ends — show this in the countdown
- Reward amounts come from `useVoting().getVoteReward(pollId)`
