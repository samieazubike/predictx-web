# Issue #13: Create Poll Modal (Multi-Step)

**Labels:** `component`, `poll-creation`, `core-feature`, `priority: high`  
**Complexity:** Medium (150 points)  
**Milestone:** Sprint 3 — Core Features  
**Estimate:** 4–5 hours  
**Depends on:** #02, #03, #04, #11

---

## Description

Build the multi-step Create Poll modal where users create new prediction questions for upcoming matches. The flow guides users through match selection, category choice, question writing, lock time configuration, and a live preview before submitting (with simulated Stellar transaction).

**Why it matters:** Community-created polls are the supply side of the prediction market. Without user-generated polls, the platform depends entirely on admin-created content. This modal empowers users to drive engagement.

---

## Requirements and Context

### Modal Container — `components/poll/create-poll-modal.tsx`

- **Trigger:** "Create Poll" / "Create Prediction" button (on Match page, home, or FAB)
- Slide in from bottom or center with scale animation
- Dark overlay with hexagonal pattern
- Corner decorations and animated border
- **Step indicator:** progress bar showing Step 1 → 2 → 3 → 4 with labels
- "Back" and "Next" navigation between steps
- Close button (X) and overlay click to dismiss
- Fullscreen on mobile

---

### Step 1: Select Match

- Title: "SELECT A MATCH" — display font
- Scrollable list or dropdown of **upcoming matches only**
- Each match option shows:
    - Mini `TeamBadge` icons: Chelsea vs Man United
    - Date and time
    - Venue
- Gaming-styled dropdown with `GlowCard` options
- Selected match: highlighted with cyan glow + checkmark
- If opened from Match page, match should be **pre-selected**
- Must select match to proceed

---

### Step 2: Choose Poll Category

- Title: "CHOOSE CATEGORY" — display font
- 4 category cards:

| Category         | Icon     | Description                            | Example Questions                      |
| ---------------- | -------- | -------------------------------------- | -------------------------------------- |
| Player Event     | `User`   | "Will a specific player do something?" | Score, assist, yellow card, subbed     |
| Team Event       | `Shield` | "Will a team achieve something?"       | Win, clean sheet, penalty, score first |
| Score Prediction | `Hash`   | "Predict goals or score"               | Over 2.5, win by 2+, both teams score  |
| Other            | `Star`   | "Any other match prediction"           | VAR review, red card, extra time       |

- Each card: `GlowCard` with icon, title, description, 2–3 example questions
- Selected: full glow, elevated, checkmark badge
- Unselected: dimmed, outline

---

### Step 3: Write Poll Question

- Title: "WRITE YOUR QUESTION" — display font
- **Text input:** `GamingInput` (textarea or single-line)
    - Placeholder: "e.g., Will Palmer score a goal?"
    - Character limit: 120 characters
    - Character counter: "42/120"
    - Validation: minimum 10 characters
    - Glowing border on focus
- **Template suggestions** (based on selected category):
    - 3–4 clickable suggestions that auto-fill the input
    - E.g., Player Event: "Will [Player] score?", "Will [Player] get a card?"
- **Guidelines text:** "Ask a clear Yes/No question about a specific match event"

---

### Step 4: Set Lock Time

- Title: "SET LOCK TIME" — display font
- Description: "When should staking close for this poll?"
- Radio/card options:

| Option         | Description                           | Badge         |
| -------------- | ------------------------------------- | ------------- |
| At kickoff     | Default, staking stops at match start | "Recommended" |
| At halftime    | Staking open during first half        | —             |
| At 60th minute | Extended staking window               | —             |
| Custom time    | User selects specific datetime        | —             |

- Custom: shows datetime picker (constrained to before match end)
- Show exact lock datetime based on selection
- Explanation: "Staking closes at this time to prevent late predictions"

---

### Live Preview Panel

Visible during Steps 3 and 4 (side panel on desktop, collapsible on mobile):

- Rendered as a `PollCard` showing exactly how the poll will appear
- Real-time updates as user types question
- Match info, category tag, question text
- Empty pool bars ($0 / $0)
- Lock time displayed
- "Your Poll" badge
- Matches the exact styling from Issue #09's `PollCard`

---

### Create Poll Submission (on Step 4)

- `GamingButton` variant `gold`: "CREATE POLL"
- **Requires wallet connection** — if disconnected, show "Connect Wallet" button
- **Fee notice:** "Creating a poll costs approximately 0.001 XLM in network fees"

**On click:**

1. Loading state (spinning hexagon on button)
2. Simulated Stellar transaction confirmation (same as Issue #10)
3. 1–2 second processing delay
4. **Success:**
    - Particle explosion animation
    - "POLL CREATED!" success message
    - Show created poll card preview
    - Toast: "Your prediction has been created!"
    - Modal closes
    - New poll appears in match's poll list (update mock data state)
5. **Failure:**
    - Error message with retry option
    - Magenta error toast

---

### Validation Summary

| Step   | Required           | Validation                        |
| ------ | ------------------ | --------------------------------- |
| 1      | Match selected     | Cannot be empty                   |
| 2      | Category selected  | Cannot be empty                   |
| 3      | Question written   | 10–120 characters                 |
| 4      | Lock time selected | Cannot be empty                   |
| Submit | Wallet connected   | Auto-trigger connect modal if not |

---

## Suggested Execution

1. **Create branch:** `git checkout -b feat/create-poll-modal`
2. **Build modal container** — step indicator, back/next nav, close logic
3. **Build Step 1** — match selection dropdown
4. **Build Step 2** — category card selection
5. **Build Step 3** — question input with validation + templates
6. **Build Step 4** — lock time radio options
7. **Build live preview** — render `PollCard` with form data
8. **Build submission flow** — wallet check, Stellar tx simulation, success/failure
9. **Wire state update** — add new poll to `useMockData` state

**Example commit message:**

```
feat: multi-step create poll modal with live preview and Stellar tx
```

---

## Acceptance Criteria

- [ ] Modal has 4 clear steps with progress indicator
- [ ] Step 1: match selection from upcoming matches, pre-selects if opened from match page
- [ ] Step 2: 4 category cards with icons, descriptions, examples
- [ ] Step 3: question input with 120-char limit, counter, 10-char minimum, template suggestions
- [ ] Step 4: 4 lock time options including custom datetime
- [ ] Live preview updates in real-time as user fills form
- [ ] "Back" and "Next" navigation works, form state preserved
- [ ] Submission requires wallet connection (auto-trigger connect modal if needed)
- [ ] Stellar transaction simulation on submit (not Ethereum)
- [ ] Fee notice references XLM/stroops, NOT gas/gwei
- [ ] Success: poll added to mock data, visible on match page
- [ ] Failure: error handling with retry
- [ ] Fullscreen on mobile, side preview on desktop
- [ ] All validation rules enforced per step

---

## Guidelines

- **PR description must include:** `Closes #13`
- **GIFs required:** full 4-step flow recording
- Form state should be preserved when navigating back between steps
- Template suggestions should be contextual to the selected category
- Use `useMockData` mutator to add new poll to state
- Filter match dropdown to upcoming matches only (not completed/live)
