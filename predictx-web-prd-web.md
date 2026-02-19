## **Frontend Generation Prompt**

**OVERVIEW & CONTEXT:**

I need you to create a Web3-based football prediction market application. This is NOT a traditional betting app \- it's a community-driven prediction platform where users stake cryptocurrency on specific match events and outcomes.

**HOW THE APP WORKS:**

**Core Concept:** Users create and participate in prediction polls about specific football match events (e.g., "Will Palmer score?", "Will Rashford be subbed out?", "Will Chelsea win by 2+ goals?"). Each poll has two opposing sides (Yes/No), and users stake crypto on the side they believe will happen.

**Pool-Based System:**

* All stakes on "Yes" go into one pool, all "No" stakes into another  
* Multiple users can stake on either side with varying amounts  
* The total pool \= Yes stakes \+ No stakes  
* When the event is resolved, winners split the entire pool proportionally to their stake  
* Platform takes 5% fee from the winning pool

**Example Flow:**

1. Match: Chelsea vs Man United  
2. User creates poll: "Will Palmer score a goal?"  
3. Users stake: $7,000 on "Yes", $3,000 on "No" (Total pool: $10,000)  
4. Match happens, Palmer scores  
5. Platform takes 5% fee \= $500  
6. "Yes" stakers split $9,500 proportionally:  
   * If you staked $700 (10% of Yes pool), you get $950  
   * Your profit: $250 ($950 \- $700 initial stake)

**Resolution System (Oracle):** After a match ends, polls are resolved through a hybrid system:

1. **Community Voting (2-hour window)**: Users who DIDN'T participate in that specific poll can vote on the outcome  
2. **Voter Incentive**: Voters earn 0.5-1% of pool as reward for participating  
3. **Automatic Resolution**: If \>85% consensus, result is auto-approved  
4. **Admin Review**: If 60-85% consensus, admin verifies with evidence  
5. **Multi-sig Review**: If \<60% (contentious), requires 3-admin verification  
6. **Dispute Window**: 24-hour challenge period after resolution

**Key Mechanics:**

*Time Locks:*

* Polls lock at specific times (usually match kickoff or event time)  
* No stakes accepted after lock time  
* Prevents people from staking after seeing lineups/events

*Participant Roles:*

* **Stakers**: Users who put money on predictions  
* **Poll Creators**: Users who create new prediction questions  
* **Voters/Judges**: Non-participants who vote on outcomes (earn rewards)  
* **Admins**: Verify contentious results with evidence

*Stake Distribution:*

* Proportional to your contribution to winning side  
* If you stake more, you win more (but also risk more)  
* Real-time calculator shows potential winnings based on current pool ratio

*User Benefits:*

* More engaging than traditional betting (granular predictions)  
* Transparent (blockchain-based)  
* Community-driven (users create polls)  
* Fair resolution (voting \+ admin verification)

**App Sections Needed:**

1. **Home/Discovery**: Browse matches, trending polls, platform stats  
2. **Match Detail**: View all polls for a specific match, see pool distributions  
3. **Staking Interface**: Choose side, enter amount, see potential winnings, confirm transaction  
4. **Poll Creation**: Users can create new prediction questions for upcoming matches  
5. **My Dashboard**: Track active stakes, pending votes, completed predictions, winnings  
6. **Voting Center**: Vote on poll outcomes you didn't participate in (earn rewards)  
7. **Wallet Integration**: Connect crypto wallet, view balance, transaction history

---

**Now for the Technical Specifications:**

**Core Features:**

1. **Home Page**

   * Hero section with tagline: "Predict. Stake. Win."  
   * Platform explanation (brief, 2-3 sentences)  
   * Live/Upcoming matches feed  
   * Trending polls showcase (highest pools, most participants)  
   * Platform stats dashboard: Total value locked, Active predictions, Community members, Total payouts  
2. **Match Page**

   * Match details card (teams, date, time, venue, league)  
   * All active polls for this match organized by category (Player Events, Team Events, Score Predictions)  
   * Each poll card shows:  
     * Question (e.g., "Will Palmer be subbed out?")  
     * Two sides (Yes/No) with current stake amounts  
     * Pool distribution percentage bar (visual representation)  
     * Time until poll locks (countdown timer)  
     * Number of participants on each side  
     * "Stake Now" button with hover effect  
3. **Poll Staking Interface (Modal/Slide-in)**

   * Poll question header  
   * Choose side (Yes/No) \- large toggle buttons  
   * Stake amount input with:  
     * Current wallet balance display  
     * Quick amount buttons ($50, $100, $500, Max)  
   * Real-time potential winnings calculator showing:  
     * Your stake amount  
     * Current pool ratio  
     * Estimated winnings if you win  
     * Estimated ROI percentage  
   * Pool distribution preview (mini pie chart)  
   * Platform fee notice (5% on winnings)  
   * "Confirm Stake" button (triggers wallet transaction)  
   * Transaction loading state with spinner  
4. **Create Poll Modal**

   * Step 1: Select match from dropdown  
   * Step 2: Choose poll category (Player Event, Team Event, Score, Other)  
   * Step 3: Write poll question (with character limit)  
   * Step 4: Set lock time (dropdown: At kickoff, At halftime, At 60min, Custom)  
   * Preview card showing how poll will appear  
   * "Create Poll" button (small gas fee notice)  
5. **My Predictions Dashboard**

   * Navigation tabs: Active Stakes | Pending Resolution | Voting Opportunities | Completed  
   * **Active Stakes Tab**: Shows polls you've staked on that haven't resolved  
     * Each card: Match, question, your stake, your side, current pool status, time remaining  
   * **Pending Resolution Tab**: Matches ended, waiting for voting/admin verification  
     * Status indicator (Voting in progress, Admin review, Dispute period)  
   * **Voting Opportunities Tab**: Polls you can vote on (didn't participate)  
     * Vote reward amount shown  
     * Quick vote buttons  
   * **Completed Tab**: Historical predictions with outcomes  
     * Win/Loss badge  
     * Amount won/lost  
     * ROI percentage  
6. **Voting Interface**

   * Available polls that need resolution  
   * Each poll shows:  
     * Match context (score, key events)  
     * Poll question  
     * Evidence section (embedded video clips, official stats links)  
     * Community vote tally so far  
     * Your vote buttons (Yes/No/Unclear)  
     * Reward amount for voting  
   * Confirmation modal after voting  
   * "Thank you for judging" message with reward confirmation  
7. **Wallet Connection**

   * "Connect Wallet" button (top right, prominent)  
   * On click: Modal with wallet options (MetaMask, WalletConnect, Coinbase Wallet)  
   * Connected state shows:  
     * Truncated address (0x742d...5e9f)  
     * Balance (ETH and USD equivalent)  
     * Dropdown menu: View Profile, Transaction History, Disconnect  
8. **How It Works Page** (optional but recommended)

   * Step-by-step visual guide  
   * Explanation of pool mechanics with example  
   * Resolution process diagram  
   * FAQ section

**Design Requirements (Gaming UI Style):**

**Color Scheme:**

* **Background**: Deep dark gradient (\#0a0e27 to \#1a1f3a) with subtle animated particles/stars  
* **Accent Colors**:  
  * Electric cyan (\#00d9ff) for primary actions and highlights  
  * Neon green (\#39ff14) for wins/success  
  * Hot magenta (\#ff006e) for losses/warnings  
  * Gold (\#ffd700) for rewards and premiums  
* **Glow Effects**: Heavy use of neon glow on buttons, cards, and interactive elements  
* **Energy**: Pulsing borders and animated gradients on active elements

**Typography:**

* **Headers/Titles**: Bold, aggressive display fonts (like Orbitron, Rajdhani, or Saira Condensed) \- all caps for impact  
* **Body Text**: Clean geometric sans-serif (like Rajdhani Regular, Barlow) \- easier to read but still gaming feel  
* **Numbers/Stats**: Monospace font (like Roboto Mono, JetBrains Mono) \- gives that digital/tech feel  
* **Special Text**: Italic futuristic fonts for emphasis  
* **Mix it up**: Don't use same font everywhere \- headers should POP, body should be readable

**Card Design:**

* **Futuristic Panels**: Angular corners (clipped corners), hexagonal shapes  
* **Layered Depth**: Multiple border layers with different opacities  
* **Glowing Borders**: Animated neon borders (cyan/green that pulse)  
* **Holographic Effect**: Subtle gradient overlays that shift on hover  
* **Grid Patterns**: Tech grid backgrounds inside cards  
* **Scan Lines**: Subtle horizontal scan line animation for that cyberpunk feel

**Animations:**

* **Entry Animations**: Cards slide in with trail effects, stagger delays  
* **Button Interactions**:  
  * Hover: Scale up \+ intense glow \+ subtle rotation  
  * Click: Quick scale down \+ shockwave ripple effect  
  * Shine effect sweeping across on hover  
* **Transaction Loading**:  
  * Rotating hexagon/circle with particle trails  
  * Progress bar with animated energy flow  
  * Glitch effect during processing  
* **Success States**:  
  * Screen flash with color overlay  
  * Particle explosion from center  
  * Trophy/coin rain animation  
  * Victory sound effect trigger point (even if silent)  
* **Counter Animations**:  
  * Numbers flip/roll like slot machines  
  * Glowing pulse when values change  
  * Shake effect for big numbers

**Visual Elements:**

* **Background**:  
  * Animated starfield or particle system  
  * Subtle football field pattern with neon grid lines  
  * Floating geometric shapes in background  
  * Gradient mesh that responds to mouse movement  
* **Icons**:  
  * Outlined style with inner glow  
  * Animated on hover (rotate, pulse, float)  
  * Custom football-themed but futuristic (holographic ball, energy shield badges)  
* **Progress Bars**:  
  * Thick bars with inner glow  
  * Animated fill with gradient flow  
  * Segments/ticks for measurement  
  * Spark effect at the fill edge  
* **Timers**:  
  * Digital countdown style with LED/segment display aesthetic  
  * Color shift: Cyan (safe) → Yellow (warning) → Red (urgent) → Pulsing red (critical)  
  * Add "\!" icon when urgent  
* **Team Badges**:  
  * Hexagonal frames with glowing borders  
  * Subtle animation (float, pulse)  
  * Holographic shine effect

**UI Components Gaming Style:**

* **Buttons**:  
  * Angular/beveled edges  
  * Multiple border layers  
  * Inner glow \+ outer glow  
  * Animated background gradient  
  * Text with letter-spacing and text-shadow  
* **Input Fields**:  
  * Glowing borders that intensify on focus  
  * Placeholder text with typing cursor animation  
  * Numeric inputs with \+/- buttons that have click feedback  
* **Modals/Popups**:  
  * Slide in from edge with motion blur  
  * Dark overlay with hexagonal pattern  
  * Corner decorations (triangles, lines)  
  * Animated border that "draws" itself in  
* **Tabs**:  
  * Active tab has glowing underline/overline  
  * Hover state shows preview glow  
  * Smooth slide indicator between tabs  
* **Toggle Switches**:  
  * Chunky with satisfying snap animation  
  * Glow color changes with state  
  * Electric arc effect on toggle

**HUD Elements (Heads-Up Display):**

* **Top Bar**: Wallet info in gaming HUD style  
  * Semi-transparent with corner brackets  
  * Stats displayed like game currency  
  * Notification badges with pulse  
* **Side Panels**: Stats and info in military/tech style panels  
* **Mini-Map Style**: Overview of active polls in corner  
* **Achievement Popups**: Toast notifications styled like game achievements with icon \+ title \+ XP-style animation

**Mobile Responsive:**

* **Touch Feedback**: Ripple effects on tap, haptic feedback indicators  
* **Swipe Gestures**: Visual arrows/guides for swipeable content  
* **Bottom Nav Bar**: Gaming-style tab bar with icons \+ glow on active  
* **Fullscreen Modals**: Take over screen with fade background  
* **Large Touch Targets**: Buttons sized for thumbs with satisfying press animation

**Empty States:**

* **Illustration Style**: Minimal line art with neon glow  
* **Animated Characters**: Subtle floating/bobbing mascot or icon  
* **Call-to-Action**: Big glowing button with pulse animation  
* **Messages**: Short, punchy text with gaming lingo  
  * "No Active Plays Yet \- Jump Into The Action\!"  
  * "Voting Arena Empty \- Be The Judge\!"  
  * "History Locked \- Make Your First Prediction\!"

**Special Effects:**

* **Screen Shake**: On big wins or important actions  
* **Vignette**: Darkened corners for focus  
* **Light Rays**: Emanating from important elements  
* **Particle Trails**: Following cursor/touch  
* **Glitch Effects**: Occasional on state transitions (subtle)  
* **Energy Shields**: Around high-value pools  
* **Rank Badges**: Military-style stripes or stars for user levels

**Sound Design Cues** (visual indicators even if no sound):

* Buttons should look "clickable" and responsive  
* Success animations should feel "rewarding"  
* Errors should feel "rejected" with shake/flash  
* Loading should feel "active" not passive

**Overall Vibe:** Think **Cyberpunk 2077** meets **Apex Legends** meets **Crypto Trading Platform**

* High contrast  
* Lots of glow  
* Sharp angles  
* Constant subtle motion  
* Premium/expensive feel  
* Addictive to interact with


**Technical Requirements:**

* React with hooks (useState, useEffect, custom hooks)  
* Tailwind CSS for all styling  
* Lucide React for icons  
* Recharts for visualizations (pool distribution pie charts, stats)  
* Mock wallet connection simulation:  
  * Simulate MetaMask popup  
  * Mock transaction delays (1-2 seconds with loading state)  
  * Mock success/failure states  
  * Show gas fees (simulated)  
* LocalStorage or in-memory state for user data persistence  
* Mock blockchain transaction receipts  
* Toast notifications for all actions (success, error, info)

**Mock Data to Include:**

* 6 upcoming Premier League matches (next 5 days)  
* 4-5 polls per match with realistic questions  
* Varying pool sizes ($500 to $15,000 total)  
* Stake amounts: $50-$5,000 range per user  
* 20-80 participants per poll  
* User's mock wallet: $2,500 balance  
* User's mock prediction history:  
  * 3 active stakes (different matches)  
  * 2 pending resolution (waiting for votes)  
  * 4 voting opportunities available  
  * 6 completed predictions (mix of wins/losses)  
* Platform stats:  
  * Total Value Locked: $847,293  
  * Active Predictions: 234  
  * Community Members: 12,847  
  * Total Payouts: $3.2M

**User Journey to Demonstrate:**

1. **Landing**: User arrives, sees hero section \+ trending polls  
2. **Browse**: Scrolls through upcoming matches  
3. **Explore Match**: Clicks on Chelsea vs Man United, sees all polls  
4. **View Poll Details**: Clicks "Will Palmer score?", sees pool distribution (67% Yes, 33% No)  
5. **Calculate**: Enters $200 stake on "Yes", calculator shows potential $298 return  
6. **Connect Wallet**: Clicks confirm, wallet connect modal appears  
7. **Simulate Transaction**: Shows MetaMask-style popup, 2-second loading, success animation  
8. **Dashboard**: Navigates to "My Predictions", sees new active stake  
9. **Vote**: Goes to voting tab, sees poll from different match  
10. **View Evidence**: Clicks poll, sees match highlights and stats  
11. **Cast Vote**: Votes "Yes", confirmation shows $12 voting reward  
12. **View Completed**: Checks completed predictions, sees previous win with \+$187 profit

**Important Features to Highlight:**

* **Real-time Pool Updates**: As user enters stake amount, pool distribution updates live  
* **Risk/Reward Visual**: Color-coded indicators (green for likely win, red for underdog)  
* **Countdown Timers**: Multiple places (poll locks, voting windows, dispute periods)  
* **Social Proof**: "34 people staked Yes in last hour" type messages  
* **Transparency**: Show exact calculation of winnings, platform fee breakdown  
* **Gamification**: Badges for "Winning Streak", "Top Judge", "Early Predictor"  
* **Responsive Tables**: Transaction history, voting history with sort/filter  
* **Share Feature**: Share interesting polls on social media

**States to Handle:**

* Loading states (fetching matches, submitting transactions)  
* Empty states (no active predictions, no voting opportunities)  
* Error states (transaction failed, insufficient balance)  
* Success states (stake placed, vote cast, winnings claimed)  
* Locked states (poll closed, voting ended)

**Interactive Elements:**

* Hover effects on all cards and buttons  
* Toggle switches for Yes/No selection  
* Slider for stake amounts (with manual input option)  
* Expandable sections for poll details  
* Modal overlays for staking and creating polls  
* Dropdown menus for filters and sorting  
* Tabs for dashboard navigation

Please create a fully functional, production-ready prototype that looks and feels like a real Web3 dApp. Focus on smooth interactions, clear information hierarchy, and an engaging user experience that makes prediction markets accessible and exciting.

