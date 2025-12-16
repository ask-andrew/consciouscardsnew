# Conscious Cards: Product Requirements Document

## Executive Summary

Conscious Cards is a daily practice tool that combines consciousness-based journaling prompts with actionable steps to deepen self-awareness and intentional living. The web experience serves as both a standalone digital practice and a preview/complement to future physical products (card decks, notebooks).

**Core Purpose:** Inspire daily journaling and reflection through consciousness-based prompts paired with concrete actions.

**Inspiration:** Conscious Leadership, The Big Leap, Mindfulness, The Book of Alchemy, The Artist's Way, Flow

---

## Product Vision

### Primary User Journey
1. User visits site seeking daily inspiration for journaling
2. Draws a "Card of the Day" (or selects from library)
3. Reads concept, journal prompt, and two actionable steps
4. Takes prompt offline to journal in their own notebook/app
5. Commits to completing one or both actions during their day
6. Returns next day for new inspiration

### Success Metrics
- Daily active users (DAU)
- Card draw frequency (engagement)
- Return rate (7-day and 30-day)
- Time spent with each card
- Cards marked as "favorite"
- Email capture for physical product launch

---

## Core Features

### 1. Card of the Day
**Purpose:** Primary entry point, removes decision fatigue

**Behavior:**
- Auto-selects one card daily at midnight user's local time
- Beautiful reveal animation on first visit each day
- "Draw New Card" button if user wants different inspiration
- Shows which card is queued for tomorrow (builds anticipation)

**WOW Component: Card Reveal Animation**
```
Progressive disclosure with delight:
1. Shimmering card back appears (3D tilt on hover)
2. Card flips to reveal concept name + imagery
3. Brief moment to absorb (2 seconds)
4. Journal prompt fades in from below
5. "Show Actions" button pulses gently
6. Actions reveal with subtle slide-up
```

---

### 2. Card Display & Progressive Disclosure
**Purpose:** Prevent overwhelm, encourage contemplation

**Layout Structure:**
```
[Full-screen card experience]

STATE 1: Concept + Imagery
- Large, centered card
- Concept name (e.g., "Courage")
- Primary imagery fills card
- Subtle ambient animation (particles, glow)

STATE 2: + Journal Prompt (click to reveal)
- Prompt slides in below imagery
- Card remains visible above
- "Reflect on this" moment before actions

STATE 3: + Actions (click to reveal)
- Two action cards appear side-by-side
- Action 1: Internal/Reflective (marked with 🧘 icon)
- Action 2: External/Relational (marked with 🌍 icon)
- Each action has a subtle checkbox for "I'll do this"
```

**WOW Component: Layered Reveal**
- Each layer has unique transition (flip, fade, slide)
- Micro-interactions respond to scroll/hover
- Subtle sound design (optional, user toggleable)
- Glassmorphism effects for depth

---

### 3. Card Library / Archive
**Purpose:** Browse all 70 concepts, find resonant themes

**View Options:**
- **Grid View:** Thumbnail cards with concept name + mini imagery
- **List View:** Concept name + one-line summary
- **Theme View:** Grouped by category (Self, Relationships, Growth, Flow)

**Filters:**
- All Cards
- Favorites
- Recently Drawn
- By Theme/Category

**WOW Component: Interactive Grid**
- Cards float/hover with parallax effect
- Filter transitions use morphing animations
- Search with instant visual results
- "Feeling lucky" button draws random card

---

### 4. Favorites & Personal Tracking
**Purpose:** Let users mark resonant cards, show engagement

**Features:**
- Heart icon to favorite any card (persists locally)
- "My Favorites" collection view
- Simple visual: "You've drawn 23 cards this month"
- Streak counter: "7 day streak 🔥"
- Calendar heatmap showing engagement history

**Storage:** Browser local storage + optional account (future)

**WOW Component: Constellation View**
- Favorite cards appear as "stars" in a constellation
- Lines connect related concepts
- Clicking a star zooms to that card
- Visualizes your practice journey

---

### 5. Daily Commitment Interface
**Purpose:** Bridge between inspiration and action

**Features:**
- Checkbox on each action: "I'll do this today"
- Checking creates satisfying animation (sparkle, check ripple)
- Gentle reminder notification (if user opts in)
- End of day: "How'd it go?" simple reflection (optional)

**NOTE:** No text input required - this is prompt only
- Optional: "Tap to reflect" opens user's preferred notes app
- Optional: "Share" creates beautiful image with prompt for social

**WOW Component: Action Commitment**
- Checking box triggers beautiful particle effect
- Card slightly glows when commitment made
- Tomorrow's card shows: "Yesterday you committed to..."
- Gentle accountability without pressure

---

### 6. Theme Journeys (Curated Sequences)
**Purpose:** Guided multi-day exploration of related concepts

**Pre-built Journeys:**
- "Building Self-Trust" (7 days)
- "Conscious Leadership" (10 days) 
- "Creative Unblocking" (14 days)
- "Mindful Relationships" (7 days)
- "Shadow Work" (7 days)
- "Flow State" (5 days)

**Experience:**
- User selects a journey
- Card of the Day follows journey sequence
- Progress bar shows day X of Y
- Completion celebration animation
- Journey map shows path through concepts

**WOW Component: Journey Map**
- Visual path through landscape
- Each card is a waypoint with custom icon
- Completed cards glow, future cards are mysterious
- Can jump ahead or revisit past journey cards
- Shareable journey completion badge

---

### 7. Settings & Personalization
**Purpose:** Tailor experience to individual preferences

**Options:**
- **Card Imagery:** Toggle between Imagery Idea 1 or 2
- **Theme:** Light mode / Dark mode / Auto
- **Sounds:** On / Off
- **Notifications:** Daily reminder time (opt-in)
- **Start of Day:** When your "day" begins (for Card of the Day reset)
- **Hide Concepts:** Remove cards that don't resonate

**WOW Component: Theme Transitions**
- Smooth animated transitions between modes
- Dark mode has ethereal, cosmic feel
- Light mode is warm and grounded
- Each mode has unique ambient particles

---

## WOW Technical Components

### 1. 3D Card Interactions
**Implementation:** Three.js or CSS 3D transforms
- Cards respond to mouse/touch with realistic 3D tilt
- Parallax depth between imagery layers
- Holographic shimmer effect on edges
- Smooth spring physics for natural movement

### 2. Generative Background
**Implementation:** Canvas/WebGL shader
- Subtle, ever-changing abstract background
- Responds to card theme (warm colors for Joy, cool for Stillness)
- Particle systems that feel alive but not distracting
- Performance-optimized (60fps on mobile)

### 3. Micro-animations Library
**Implementation:** Framer Motion or GSAP
- Satisfying check animations
- Smooth page transitions
- Stagger effects for action reveals
- Spring-based motion (feels natural, not robotic)

### 4. Progressive Web App (PWA)
**Implementation:** Service workers + manifest
- Install to home screen
- Works offline (cards cached locally)
- Push notifications for daily card (opt-in)
- Fast, app-like experience

### 5. Smart Shuffle Algorithm
**Implementation:** Custom JS logic
- Weighted randomization (recently seen cards less likely)
- Thematic clustering (related cards appear in waves)
- User learning (favorite themes appear more often)
- Never repeat same card within 14 days

### 6. Share Card as Image
**Implementation:** html2canvas or Puppeteer
- Generate beautiful image of card + prompt
- User's name/date optional
- Optimized for Instagram/Pinterest dimensions
- Multiple aesthetic templates
- Download or direct share

### 7. Haptic Feedback
**Implementation:** Vibration API (mobile)
- Subtle vibration on card flip
- Satisfying buzz on action check
- Different patterns for different interactions
- Respects system settings

---

## Information Architecture

```
HOME
├── Card of the Day (primary landing)
│   ├── Progressive reveal (concept → prompt → actions)
│   ├── Favorite this card
│   ├── Draw new card
│   └── Tomorrow's preview
│
├── Library
│   ├── All Cards (grid/list view)
│   ├── My Favorites
│   ├── Recently Drawn
│   └── By Theme
│
├── Journeys
│   ├── Browse Journeys
│   ├── Active Journey (if enrolled)
│   └── Journey Progress
│
├── My Practice
│   ├── Streak & Stats
│   ├── Constellation View
│   ├── Calendar Heatmap
│   └── Commitment History
│
└── Settings
    ├── Preferences
    ├── Notifications
    └── About / Contact
```

---

## User Experience Flow

### First-Time User
1. **Landing:** Beautiful hero section with animated preview card
2. **Value Prop:** "Daily prompts for conscious living"
3. **CTA:** "Draw Your First Card"
4. **Onboarding:** Brief 3-step tutorial (skippable)
   - "This is your Card of the Day"
   - "Read, reflect, act"
   - "Return tomorrow for new inspiration"
5. **First Card:** Draws random card from "starter set" (accessible concepts)
6. **Invitation:** "Return tomorrow for your next card, or explore the library"

### Returning User
1. **Landing:** New Card of the Day ready
2. **Welcome Back:** "Day 12 of your practice" or "7-day streak! 🔥"
3. **Immediate Access:** Card reveals with minimal friction
4. **Quick Actions:** Favorite, commit to actions, draw new
5. **Secondary:** Stats/library one click away

---

## Mobile-First Design Principles

### Touch Interactions
- Swipe left/right to cycle through progressive states
- Long-press card for quick actions (favorite, share)
- Pull-to-refresh for new card draw
- Pinch to see full card library
- Double-tap to favorite

### Performance
- Lazy load imagery
- Optimize for 3G connections
- Minimal bundle size (<200KB initial)
- Instant perceived performance

### Layout
- Full-screen card experience on mobile
- Bottom sheet for actions (native feel)
- Sticky header with minimal chrome
- Gesture-based navigation

---

## Visual Design Direction

### Color Psychology
Each card theme has subtle color influence:
- **Courage/Strength:** Warm reds, oranges
- **Peace/Stillness:** Cool blues, purples  
- **Growth/Evolution:** Fresh greens
- **Joy/Play:** Bright yellows, pinks
- **Shadow Work:** Deep purples, teals

### Typography
- **Headers:** Bold, inspiring (consider: Fraunces, Cirka)
- **Body:** Highly readable (consider: Inter, System fonts)
- **Prompts:** Slightly larger, inviting
- **Actions:** Clear, actionable tone

### Imagery Style
- Consistent illustrative style across all 70 cards
- Two options per concept (user chooses preferred)
- Whimsical but not childish
- Culturally inclusive representation
- Abstract enough to be universal

### Motion Design
- Easing: Smooth, spring-based (not linear)
- Duration: Fast enough to feel snappy (200-400ms)
- Purpose: Every animation serves comprehension
- Accessibility: Respect `prefers-reduced-motion`

---

## Technical Stack Recommendations

### Core
- **Framework:** React + Next.js (SSG for performance)
- **Styling:** Tailwind + Framer Motion
- **3D/Canvas:** Three.js for hero effects
- **State:** Zustand (lightweight) or Context
- **Storage:** LocalStorage + IndexedDB (future: Supabase)

### Optional Enhancements
- **CMS:** Sanity or Contentful (for card content management)
- **Analytics:** Plausible or Fathom (privacy-focused)
- **Email:** Resend or ConvertKit (for waitlist/launch)
- **Payments:** Stripe (for future physical products)

---

## Future Product Roadmap

### Phase 1: MVP Web Experience (Current)
- 70 consciousness cards
- Card of the Day
- Library browsing
- Local favorites/tracking
- Basic share functionality

### Phase 2: Enhanced Digital (3-6 months)
- User accounts (optional)
- Curated Journeys
- Community stats (anonymous)
- Enhanced sharing
- Email reminders

### Phase 3: Physical Products (6-12 months)
- **Card Deck:** 70 cards in premium packaging
- **Companion Notebook:** Structured pages per card
- **Bundle:** Deck + Notebook + digital access
- Web serves as preview and complement

### Phase 4: Community & Content (12+ months)
- Guided audio reflections per card
- Community sharing (opt-in)
- Facilitator resources (for coaches, therapists)
- Expansion packs (new card themes)

---

## Success Criteria & KPIs

### Engagement
- 70%+ of users draw card on return visit
- 40%+ commit to at least one action
- 3+ days average session per week
- 25%+ of cards are favorited

### Retention  
- 50%+ return within 7 days
- 30%+ return within 30 days
- 10%+ daily active users (of total users)

### Product Validation
- 500+ email signups for physical product waitlist
- 5000+ total cards drawn (within first 3 months)
- Sub-3 second load time
- 90+ Lighthouse score

### Qualitative
- User testimonials about practice impact
- Social shares with authentic enthusiasm
- Requests for specific features/journeys
- Organic word-of-mouth growth

---

## Risks & Mitigations

### Risk: Users don't return daily
**Mitigation:** 
- Optional push notifications
- Journey commitments (multi-day)
- Streak gamification (light touch)
- Email digest (weekly inspiration)

### Risk: Content feels repetitive
**Mitigation:**
- 70 cards is enough variety for 10 weeks
- Smart shuffle prevents repeats
- Thematic variety (not all "zen")
- Journeys create narrative structure

### Risk: Physical products cannibalize digital
**Mitigation:**
- Digital is free forever
- Physical adds value (tactile, gift-able, no screen)
- Bundle pricing encourages both
- Different use cases (digital: daily; physical: workshops, gifts)

### Risk: Performance issues on older devices
**Mitigation:**
- Progressive enhancement
- Feature detection (3D only on capable devices)
- Lightweight fallbacks
- Aggressive optimization

---

## Launch Strategy

### Soft Launch (Friends & Family)
- 50 beta users
- Gather feedback on core experience
- Test technical performance
- Refine copy and prompts

### Public Launch
- **Pre-launch:** Build waitlist with teaser site
- **Launch Day:** 
  - Product Hunt submission
  - Social media campaign (organic)
  - Personal network sharing
  - Email to waitlist
- **Post-launch:**
  - User testimonials
  - Content marketing (blog on consciousness)
  - Partnerships (coaches, mindfulness communities)

### Marketing Hooks
- "Daily inspiration for your journaling practice"
- "70 consciousness prompts to deepen self-awareness"
- "Free digital tool, future physical products"
- "From the practices of conscious leadership and Flow"

---

## Open Questions for Team

1. **Monetization:** Keep digital free forever, or freemium model?
2. **Social Features:** Anonymous community ("47 people drew Courage today") or fully private?
3. **Audio:** Guided reflections voiced or text-only?
4. **Customization:** Let users edit prompts/actions for themselves?
5. **API:** Allow other apps to integrate Conscious Cards?
6. **Localization:** Multi-language support priority?

---

## Appendix: Card Content Structure

Each of 70 cards contains:

```yaml
concept: "Courage"
journal_prompt: "What would you do if you weren't afraid..."
action_1_type: "internal"
action_1: "Identify one small fear you can face today..."
action_2_type: "external"  
action_2: "Speak up for yourself or someone else..."
imagery_1: "A tiny, brave bird launching itself..."
imagery_2: "A person stepping onto a rainbow tightrope..."
theme: "Growth"
related_concepts: ["Vulnerability", "Trust", "Daring"]
```

Total: 70 concepts × 6 fields = 420 pieces of content

---

## Contact & Collaboration

**Project Owner:** Andrew Ledet
**Developer Partner:** Antigravity
**Timeline:** MVP in 1 week
**Budget:** $30

**Next Steps:**
1. Review and approve PRD
2. Technical architecture planning
3. Design system creation
4. Sprint 1: Core card experience
5. Sprint 2: Library and favorites
6. Sprint 3: Journeys and polish
7. Beta testing
8. Launch! 🚀